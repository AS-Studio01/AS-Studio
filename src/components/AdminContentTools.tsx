import { useEffect, useMemo, useState } from 'react';
import { Check, Save, Search, Plus, AlertTriangle, Palette, FileText, LayoutTemplate, FolderKanban } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  DEFAULT_SEO, SeoPageKey, SeoSettings, LegalDocument, DEFAULT_LEGAL,
  saveSeoSettings, getSeoSettings, getLegalDocument, saveLegalDocument,
  ClientProject, getAllClientProjects, saveClientProject,
  DEFAULT_SITE_CONTENT, SiteContent, getSiteContent, saveSiteContent,
} from '../services/siteContent';

export function AdminContentTools({ notify }: { notify: (message: string) => void }) {
  const { isAdmin, isSecretCodeAdmin, user, signInWithGoogle } = useAuth();
  const [section, setSection] = useState<'site'|'seo'|'legal'|'projects'>('site');
  const [site, setSite] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
  const [seo, setSeo] = useState<Record<SeoPageKey, SeoSettings>>(DEFAULT_SEO);
  const [seoPage, setSeoPage] = useState<SeoPageKey>('home');
  const [legal, setLegal] = useState<Record<LegalDocument['id'], LegalDocument>>(DEFAULT_LEGAL);
  const [legalType, setLegalType] = useState<LegalDocument['id']>('privacy');
  const [projects, setProjects] = useState<ClientProject[]>([]);
  const [editing, setEditing] = useState<ClientProject | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAdmin) return;
    Promise.all([
      getSiteContent().then(setSite),
      Promise.all((Object.keys(DEFAULT_SEO) as SeoPageKey[]).map(async p => [p, await getSeoSettings(p)] as const)).then(rows => setSeo(Object.fromEntries(rows) as Record<SeoPageKey, SeoSettings>)),
      Promise.all((Object.keys(DEFAULT_LEGAL) as LegalDocument['id'][]).map(async id => [id, await getLegalDocument(id)] as const)).then(rows => setLegal(Object.fromEntries(rows) as Record<LegalDocument['id'], LegalDocument>)),
      getAllClientProjects().then(setProjects).catch(() => {}),
    ]);
  }, [isAdmin]);

  const runSave = async (fn: () => Promise<void>, success: string) => {
    setSaving(true); setError('');
    try { await fn(); notify(success); }
    catch (e: any) { const msg = e?.code === 'permission-denied' ? 'Firebase denied this write. Sign in with an authorized admin Google account before publishing.' : (e?.message || 'Could not save changes.'); setError(msg); }
    finally { setSaving(false); }
  };

  const currentSeo = seo[seoPage];
  const seoChecks = useMemo(() => [
    ['Title', currentSeo.title.length >= 30 && currentSeo.title.length <= 65],
    ['Description', currentSeo.description.length >= 70 && currentSeo.description.length <= 170],
    ['OpenGraph title', currentSeo.ogTitle.length > 0],
    ['OpenGraph description', currentSeo.ogDescription.length > 0],
    ['Canonical', currentSeo.canonical.length > 0],
  ], [currentSeo]);
  const updateSeo = (key: keyof SeoSettings, value: string | boolean) => setSeo(prev => ({ ...prev, [seoPage]: { ...prev[seoPage], [key]: value } }));
  const updateTheme = (key: keyof SiteContent['theme'], value: string) => setSite(prev => ({ ...prev, theme: { ...prev.theme, [key]: value } }));

  if (!isAdmin) return null;

  const siteFields: [keyof SiteContent, string][] = [
    ['studioLabel','Studio name'], ['studioLocation','Location / availability'], ['heroEyebrow','Hero eyebrow'],
    ['heroTitle','Hero headline'], ['heroDescription','Hero description'], ['primaryCta','Primary CTA'],
    ['secondaryCta','Secondary CTA'], ['reassurance','Reassurance line'],
  ];

  return <div className="space-y-4">
    {isSecretCodeAdmin && !user && <div className="rounded-2xl border border-amber-400/20 bg-amber-400/[.06] p-4 text-xs text-amber-200 flex gap-2"><AlertTriangle className="w-4 h-4 shrink-0"/><span className="flex-1">You are viewing the console through the founder passphrase. Firebase publishing requires an authorized Google admin account because browser-only passphrases cannot grant Firestore write permission.</span><button onClick={signInWithGoogle} className="pill-btn pill-btn-primary shrink-0">Verify Google admin</button></div>}
    {error && <div className="rounded-2xl border border-rose-400/20 bg-rose-400/[.06] p-4 text-xs text-rose-200 flex gap-2"><AlertTriangle className="w-4 h-4 shrink-0"/><span>{error}</span></div>}

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
      {[['site','Site Editor',LayoutTemplate],['seo','SEO Analytics',Search],['legal','Legal Documents',FileText],['projects','Client Projects',FolderKanban]].map(([id,label,Icon]) => <button key={id as string} onClick={() => setSection(id as any)} className={`pill-btn justify-center text-xs ${section===id?'pill-btn-active':''}`}><Icon className="w-3.5 h-3.5"/>{label as string}</button>)}
    </div>

    {section === 'site' && <div className="grid xl:grid-cols-[1fr_320px] gap-4">
      <div className="glass-panel p-5 space-y-5">
        <div className="flex items-center justify-between"><div><p className="eyebrow">Live website content</p><h3 className="text-xl font-black text-white">Site Editor</h3><p className="text-xs text-zinc-500 mt-1">Changes here feed the public site.</p></div><button disabled={saving} onClick={() => runSave(() => saveSiteContent(site), 'Site content published.')} className="pill-btn pill-btn-primary"><Save className="w-3.5 h-3.5"/>{saving?'Saving…':'Publish'}</button></div>
        <div className="grid sm:grid-cols-2 gap-3">
          {siteFields.map(([key,label]) => <label key={key} className={`text-xs text-zinc-400 ${key==='heroTitle'||key==='heroDescription'||key==='reassurance' ? 'sm:col-span-2' : ''}`}>{label}<textarea rows={key==='heroTitle'||key==='heroDescription'||key==='reassurance'?3:1} value={String(site[key])} onChange={e=>setSite(v=>({...v,[key]:e.target.value}))} className="admin-input resize-y"/></label>)}
        </div>
        <div className="grid sm:grid-cols-2 gap-3 pt-3 border-t border-white/10">
          {(['work','services','process','contact'] as const).map(key => <label key={key} className="text-xs text-zinc-400">{key[0].toUpperCase()+key.slice(1)} section label<input className="admin-input" value={site.sectionLabels[key]} onChange={e=>setSite(v=>({...v,sectionLabels:{...v.sectionLabels,[key]:e.target.value}}))}/></label>)}
        </div>
      </div>
      <div className="glass-panel p-5 space-y-4">
        <div><p className="eyebrow flex items-center gap-1"><Palette className="w-3 h-3"/> Visual system</p><h3 className="text-lg font-black text-white">Section colours</h3><p className="text-xs text-zinc-500 mt-1">Use a connected palette, not random colours.</p></div>
        {(['accent','work','services','process','contact'] as const).map(key => <label key={key} className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[.03] p-3 text-xs text-zinc-300"><span className="capitalize">{key} accent</span><span className="flex items-center gap-2"><input type="color" value={site.theme[key]} onChange={e=>updateTheme(key,e.target.value)} className="w-8 h-8 rounded-lg border-0 bg-transparent"/><input value={site.theme[key]} onChange={e=>updateTheme(key,e.target.value)} className="admin-input !w-28 !py-1.5 font-mono"/></span></label>)}
        <div className="rounded-2xl p-4 border border-white/10" style={{background:`linear-gradient(135deg,${site.theme.work}22,${site.theme.services}22,${site.theme.process}22)`}}><p className="text-xs text-zinc-300">Preview: Work → Services → Process → Contact</p><div className="flex gap-1 mt-3"><span className="h-1 flex-1 rounded-full" style={{background:site.theme.work}}/><span className="h-1 flex-1 rounded-full" style={{background:site.theme.services}}/><span className="h-1 flex-1 rounded-full" style={{background:site.theme.process}}/><span className="h-1 flex-1 rounded-full" style={{background:site.theme.contact}}/></div></div>
      </div>
    </div>}

    {section === 'seo' && <div className="grid lg:grid-cols-[180px_1fr] gap-4"><div className="glass-panel p-2 space-y-1">{(Object.keys(DEFAULT_SEO) as SeoPageKey[]).map(p=><button key={p} onClick={()=>setSeoPage(p)} className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold capitalize ${seoPage===p?'bg-blue-500/15 text-blue-300':'text-zinc-400 hover:text-white hover:bg-white/5'}`}>{p}</button>)}</div><div className="glass-panel p-5 space-y-4"><div className="flex items-center justify-between"><div><p className="eyebrow">Search visibility</p><h3 className="text-lg font-black text-white">SEO Analytics · {seoPage}</h3></div><button disabled={saving} onClick={()=>runSave(()=>saveSeoSettings(seoPage,currentSeo),'SEO settings saved.')} className="pill-btn pill-btn-primary"><Save className="w-3.5 h-3.5"/>Save</button></div><div className="grid sm:grid-cols-2 gap-3">{[['title','Meta title'],['description','Meta description'],['ogTitle','OpenGraph title'],['ogDescription','OpenGraph description'],['ogImage','OpenGraph image URL'],['canonical','Canonical path']].map(([key,label])=><label key={key} className="text-xs text-zinc-400">{label}<input value={(currentSeo as any)[key]} onChange={e=>updateSeo(key as keyof SeoSettings,e.target.value)} className="admin-input"/></label>)}</div><label className="flex items-center gap-2 text-xs text-zinc-300"><input type="checkbox" checked={currentSeo.noIndex} onChange={e=>updateSeo('noIndex',e.target.checked)}/> Hide this page from search indexes</label><div className="grid sm:grid-cols-5 gap-2">{seoChecks.map(([label,ok])=><div key={label} className="rounded-xl border border-white/10 p-3 bg-white/[.03]"><div className="flex items-center gap-1 text-xs font-bold text-white">{ok?<Check className="w-3 h-3 text-emerald-400"/>:<Search className="w-3 h-3 text-amber-400"/>}{label}</div><span className="text-[10px] text-zinc-500">{ok?'Ready':'Needs attention'}</span></div>)}</div></div></div>}

    {section === 'legal' && <div className="glass-panel p-5 space-y-4"><div className="flex items-center justify-between"><div><p className="eyebrow">Live public documents</p><h3 className="text-lg font-black text-white">Privacy · Terms · Disclaimer</h3><p className="text-xs text-zinc-500 mt-1">Edit the actual document shown to visitors.</p></div><button disabled={saving} onClick={()=>runSave(()=>saveLegalDocument(legal[legalType]),'Legal document published live.')} className="pill-btn pill-btn-primary"><Save className="w-3.5 h-3.5"/>{saving?'Publishing…':'Publish'}</button></div><div className="flex gap-2 overflow-x-auto">{(['privacy','terms','disclaimer'] as const).map(id=><button key={id} onClick={()=>setLegalType(id)} className={`pill-btn text-xs whitespace-nowrap ${legalType===id?'pill-btn-active':''}`}>{legal[id].title}</button>)}</div><input className="admin-input" value={legal[legalType].title} onChange={e=>setLegal(v=>({...v,[legalType]:{...v[legalType],title:e.target.value}}))}/><div className="flex flex-wrap gap-1 border border-white/10 rounded-t-2xl p-2 bg-white/[.03]">{[['bold','Bold'],['italic','Italic'],['insertUnorderedList','• List'],['formatBlock','H2']].map(([cmd,label])=><button type="button" key={cmd} onMouseDown={e=>e.preventDefault()} onClick={()=>document.execCommand(cmd,false,cmd==='formatBlock'?'h2':undefined)} className="pill-btn text-xs">{label}</button>)}</div><div contentEditable suppressContentEditableWarning dangerouslySetInnerHTML={{__html:legal[legalType].contentHtml}} onInput={e=>setLegal(v=>({...v,[legalType]:{...v[legalType],contentHtml:e.currentTarget.innerHTML}}))} className="legal-editor min-h-[420px] rounded-b-2xl border border-t-0 border-white/10 p-5 outline-none text-sm leading-7 text-zinc-300"/></div>}

    {section === 'projects' && <div className="glass-panel p-5 space-y-4"><div className="flex items-center justify-between"><div><p className="eyebrow">Delivery tracking</p><h3 className="text-lg font-black text-white">Client Projects</h3></div><button onClick={()=>setEditing({id:`project_${Date.now()}`,clientUid:'',clientEmail:'',businessName:'',title:'Website Sprint',phase:'Planning',status:'planning',progress:10,summary:'',nextMilestone:'',updatedAt:new Date().toISOString()})} className="pill-btn pill-btn-primary"><Plus className="w-3.5 h-3.5"/>New project</button></div>{editing?<div className="grid sm:grid-cols-2 gap-3">{(['clientUid','clientEmail','businessName','title','phase','summary','nextMilestone'] as const).map(key=><label key={key} className="text-xs text-zinc-400 capitalize">{key.replace(/[A-Z]/g,' $&')}<input className="admin-input" value={editing[key]} onChange={e=>setEditing({...editing,[key]:e.target.value})}/></label>)}<label className="text-xs text-zinc-400">Progress<input type="range" min="0" max="100" value={editing.progress} onChange={e=>setEditing({...editing,progress:Number(e.target.value)})} className="w-full"/></label><label className="text-xs text-zinc-400">Status<select className="admin-input" value={editing.status} onChange={e=>setEditing({...editing,status:e.target.value as ClientProject['status']})}>{['planning','design','development','review','launched'].map(x=><option key={x}>{x}</option>)}</select></label><div className="sm:col-span-2 flex gap-2"><button onClick={()=>runSave(async()=>{await saveClientProject(editing);setProjects(await getAllClientProjects());setEditing(null)},'Client project saved.')} className="pill-btn pill-btn-primary">Save project</button><button onClick={()=>setEditing(null)} className="pill-btn">Cancel</button></div></div>:<div className="space-y-2">{projects.length===0?<p className="text-sm text-zinc-500">No client projects yet.</p>:projects.map(p=><div key={p.id} className="flex items-center justify-between gap-3 p-4 rounded-2xl border border-white/10 bg-white/[.03]"><div><p className="font-bold text-white">{p.title} · {p.businessName}</p><p className="text-xs text-zinc-500">{p.clientEmail||p.clientUid} · {p.progress}% · {p.status}</p></div><button onClick={()=>setEditing(p)} className="pill-btn text-xs">Edit</button></div>)}</div>}</div>}
  </div>;
}
