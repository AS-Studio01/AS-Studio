import { useEffect, useMemo, useState } from 'react';
import { Check, Save, Search, FileText, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DEFAULT_SEO, SeoPageKey, SeoSettings, LegalDocument, DEFAULT_LEGAL, saveSeoSettings, getLegalDocument, saveLegalDocument, ClientProject, getAllClientProjects, saveClientProject } from '../services/siteContent';

export function AdminContentTools({ notify }: { notify: (message: string) => void }) {
  const { isAdmin } = useAuth();
  const [section, setSection] = useState<'seo'|'legal'|'projects'>('seo');
  const [seo, setSeo] = useState<Record<SeoPageKey, SeoSettings>>(DEFAULT_SEO);
  const [seoPage, setSeoPage] = useState<SeoPageKey>('home');
  const [legal, setLegal] = useState<Record<LegalDocument['id'], LegalDocument>>(DEFAULT_LEGAL);
  const [legalType, setLegalType] = useState<LegalDocument['id']>('privacy');
  const [projects, setProjects] = useState<ClientProject[]>([]);
  const [editing, setEditing] = useState<ClientProject | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isAdmin) return;
    Promise.all((Object.keys(DEFAULT_SEO) as SeoPageKey[]).map(async p => [p, await import('../services/siteContent').then(m => m.getSeoSettings(p))] as const))
      .then(rows => setSeo(Object.fromEntries(rows) as Record<SeoPageKey, SeoSettings>));
    Promise.all((Object.keys(DEFAULT_LEGAL) as LegalDocument['id'][]).map(async id => [id, await getLegalDocument(id)] as const))
      .then(rows => setLegal(Object.fromEntries(rows) as Record<LegalDocument['id'], LegalDocument>));
    getAllClientProjects().then(setProjects).catch(() => {});
  }, [isAdmin]);

  const currentSeo = seo[seoPage];
  const seoChecks = useMemo(() => [
    ['Title', currentSeo.title.length >= 30 && currentSeo.title.length <= 65],
    ['Description', currentSeo.description.length >= 70 && currentSeo.description.length <= 170],
    ['OpenGraph title', currentSeo.ogTitle.length > 0],
    ['OpenGraph description', currentSeo.ogDescription.length > 0],
    ['Canonical', currentSeo.canonical.length > 0],
  ], [currentSeo]);

  const updateSeo = (key: keyof SeoSettings, value: string | boolean) =>
    setSeo(prev => ({ ...prev, [seoPage]: { ...prev[seoPage], [key]: value } }));

  const saveSeo = async () => { setSaving(true); try { await saveSeoSettings(seoPage, currentSeo); notify('SEO settings saved.'); } finally { setSaving(false); } };
  const saveLegal = async () => { setSaving(true); try { await saveLegalDocument(legal[legalType]); notify('Legal document saved and is live immediately.'); } finally { setSaving(false); } };
  const createProject = () => setEditing({ id: `project_${Date.now()}`, clientUid: '', clientEmail: '', businessName: '', title: 'Website Sprint', phase: 'Planning', status: 'planning', progress: 10, summary: '', nextMilestone: '', updatedAt: new Date().toISOString() });

  const saveProject = async () => { if (!editing) return; setSaving(true); try { await saveClientProject(editing); setProjects(await getAllClientProjects()); setEditing(null); notify('Client project saved.'); } finally { setSaving(false); } };

  if (!isAdmin) return null;

  return <div className="space-y-4">
    <div className="flex gap-2 overflow-x-auto pb-1">
      {[
        ['seo','SEO Analytics'], ['legal','Legal Documents'], ['projects','Client Projects']
      ].map(([id,label]) => <button key={id} onClick={() => setSection(id as any)} className={`pill-btn whitespace-nowrap text-xs ${section===id?'pill-btn-active':''}`}>{label}</button>)}
    </div>

    {section === 'seo' && <div className="grid lg:grid-cols-[180px_1fr] gap-4">
      <div className="glass-panel p-2 space-y-1">
        {(Object.keys(DEFAULT_SEO) as SeoPageKey[]).map(p => <button key={p} onClick={() => setSeoPage(p)} className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold capitalize ${seoPage===p?'bg-blue-500/15 text-blue-300':'text-zinc-400 hover:text-white hover:bg-white/5'}`}>{p}</button>)}
      </div>
      <div className="glass-panel p-5 space-y-4">
        <div className="flex items-center justify-between gap-3"><div><p className="eyebrow">Search visibility</p><h3 className="text-lg font-black text-white">SEO Analytics · {seoPage}</h3></div><button onClick={saveSeo} disabled={saving} className="pill-btn pill-btn-primary"><Save className="w-3.5 h-3.5"/>Save</button></div>
        <div className="grid sm:grid-cols-2 gap-3">{[
          ['title','Meta title'],['description','Meta description'],['ogTitle','OpenGraph title'],['ogDescription','OpenGraph description'],['ogImage','OpenGraph image URL'],['canonical','Canonical path']
        ].map(([key,label]) => <label key={key} className="text-xs text-zinc-400">{label}<input value={(currentSeo as any)[key]} onChange={e=>updateSeo(key as keyof SeoSettings,e.target.value)} className="admin-input" /></label>)}</div>
        <label className="flex items-center gap-2 text-xs text-zinc-300"><input type="checkbox" checked={currentSeo.noIndex} onChange={e=>updateSeo('noIndex',e.target.checked)}/> Hide this page from search indexes</label>
        <div className="grid sm:grid-cols-5 gap-2">{seoChecks.map(([label,ok])=><div key={label} className="rounded-xl border border-white/10 p-3 bg-white/[.03]"><div className="flex items-center gap-1 text-xs font-bold text-white">{ok?<Check className="w-3 h-3 text-emerald-400"/>:<Search className="w-3 h-3 text-amber-400" />}{label}</div><span className="text-[10px] text-zinc-500">{ok?'Ready':'Needs attention'}</span></div>)}</div>
        <div className="rounded-2xl border border-blue-400/10 bg-blue-400/[.04] p-4"><p className="eyebrow">Search preview</p><div className="mt-2 text-blue-300 text-base">{currentSeo.title || 'Page title'}</div><div className="text-xs text-emerald-400 mt-1">{window.location.origin}{currentSeo.canonical}</div><p className="text-xs text-zinc-400 mt-1">{currentSeo.description}</p></div>
      </div>
    </div>}

    {section === 'legal' && <div className="glass-panel p-5 space-y-4">
      <div className="flex items-center justify-between gap-3"><div><p className="eyebrow">Live content</p><h3 className="text-lg font-black text-white">Legal Documents</h3></div><button onClick={saveLegal} disabled={saving} className="pill-btn pill-btn-primary"><Save className="w-3.5 h-3.5"/>Publish</button></div>
      <div className="flex gap-2">{(['privacy','terms','disclaimer'] as const).map(id=><button key={id} onClick={()=>setLegalType(id)} className={`pill-btn text-xs ${legalType===id?'pill-btn-active':''}`}>{legal[id].title}</button>)}</div>
      <input className="admin-input" value={legal[legalType].title} onChange={e=>setLegal(v=>({...v,[legalType]:{...v[legalType],title:e.target.value}}))}/>
      <div className="flex flex-wrap gap-1 border border-white/10 rounded-t-2xl p-2 bg-white/[.03]">
        {[
          ['bold','Bold'],['italic','Italic'],['insertUnorderedList','• List'],['formatBlock','H2']
        ].map(([cmd,label])=><button type="button" key={cmd} onClick={()=>document.execCommand(cmd, false, cmd==='formatBlock'?'h2':undefined)} className="pill-btn text-xs">{label}</button>)}
      </div>
      <div contentEditable suppressContentEditableWarning onInput={e=>setLegal(v=>({...v,[legalType]:{...v[legalType],contentHtml:e.currentTarget.innerHTML}}))} dangerouslySetInnerHTML={{__html:legal[legalType].contentHtml}} className="legal-editor min-h-[300px] rounded-b-2xl border border-t-0 border-white/10 p-5 outline-none text-sm leading-7 text-zinc-300"/>
    </div>}

    {section === 'projects' && <div className="glass-panel p-5 space-y-4">
      <div className="flex items-center justify-between"><div><p className="eyebrow">Delivery tracking</p><h3 className="text-lg font-black text-white">Client Projects</h3></div><button onClick={createProject} className="pill-btn pill-btn-primary"><Plus className="w-3.5 h-3.5"/>New project</button></div>
      {editing ? <div className="grid sm:grid-cols-2 gap-3">
        {(['clientUid','clientEmail','businessName','title','phase','summary','nextMilestone'] as const).map(key=><label key={key} className="text-xs text-zinc-400 capitalize">{key.replace(/[A-Z]/g,' $&')}<input className="admin-input" value={editing[key]} onChange={e=>setEditing({...editing,[key]:e.target.value})}/></label>)}
        <label className="text-xs text-zinc-400">Progress<input type="range" min="0" max="100" value={editing.progress} onChange={e=>setEditing({...editing,progress:Number(e.target.value)})} className="w-full"/></label>
        <label className="text-xs text-zinc-400">Status<select className="admin-input" value={editing.status} onChange={e=>setEditing({...editing,status:e.target.value as ClientProject['status']})}>{['planning','design','development','review','launched'].map(x=><option key={x}>{x}</option>)}</select></label>
        <div className="sm:col-span-2 flex gap-2"><button onClick={saveProject} className="pill-btn pill-btn-primary">Save project</button><button onClick={()=>setEditing(null)} className="pill-btn">Cancel</button></div>
      </div> : <div className="space-y-2">{projects.length===0?<p className="text-sm text-zinc-500">No client projects yet.</p>:projects.map(p=><div key={p.id} className="flex items-center justify-between gap-3 p-4 rounded-2xl border border-white/10 bg-white/[.03]"><div><p className="font-bold text-white">{p.title} · {p.businessName}</p><p className="text-xs text-zinc-500">{p.clientEmail || p.clientUid} · {p.progress}% · {p.status}</p></div><button onClick={()=>setEditing(p)} className="pill-btn text-xs">Edit</button></div>)}</div>}
    </div>}
  </div>;
}
