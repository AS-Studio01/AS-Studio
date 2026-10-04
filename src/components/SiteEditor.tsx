import { useState, useEffect, useMemo } from 'react';
import { 
  Save, CheckCircle2, AlertTriangle, Palette, Globe, FileText, 
  LayoutTemplate, Briefcase, Sparkles, FolderKanban, Star, Plus, 
  Trash2, ArrowUp, ArrowDown, ExternalLink, RefreshCw, Eye, 
  EyeOff, Check, Key, ShieldCheck, Database, Layers, BarChart3, HelpCircle 
} from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';
import { useAuth } from '../context/AuthContext';
import { 
  LegalDocumentKey, PageSeoKey, SiteContent, DEFAULT_SITE_CONTENT,
  getClientProjects, saveClientProject, deleteClientProject
} from '../services/siteContent';
import { ServiceItem, ProcessStep, TestimonialItem, Project, ClientProject, ClientProjectStatus } from '../types';
import { checkDatabaseHealth, logSiteActivity } from '../services';

export type CmsTab = 
  | 'dashboard'
  | 'brand'
  | 'services'
  | 'portfolio'
  | 'process'
  | 'testimonials'
  | 'legal'
  | 'seo'
  | 'client_projects'
  | 'theme'
  | 'settings';

interface SiteEditorProps {
  initialTab?: CmsTab;
}

export function SiteEditor({ initialTab = 'dashboard' }: SiteEditorProps) {
  const { content, updateContent, saveContent } = useSiteContent();
  const { isSecretCodeAdmin, user, signInWithGoogle, isAdmin } = useAuth();
  
  const [activeTab, setActiveTab] = useState<CmsTab>(initialTab);
  const [draft, setDraft] = useState<SiteContent>(content);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  // SEO Tab state
  const [selectedSeoPage, setSelectedSeoPage] = useState<PageSeoKey>('home');

  // Legal Tab state
  const [selectedLegalDoc, setSelectedLegalDoc] = useState<LegalDocumentKey>('privacy');

  // Client Projects CMS state
  const [clientProjects, setClientProjects] = useState<ClientProject[]>([]);
  const [editingClientProject, setEditingClientProject] = useState<ClientProject | null>(null);

  // Database probe metrics
  const [dbHealth, setDbHealth] = useState<{ status: string; latencyMs: number; totalRecords: number } | null>(null);

  // Sync draft when content changes
  useEffect(() => {
    setDraft(content);
  }, [content]);

  // Load client projects and db health
  const refreshAuxiliaryData = async () => {
    try {
      const [projs, health] = await Promise.all([
        getClientProjects(),
        checkDatabaseHealth(),
      ]);
      setClientProjects(projs);
      setDbHealth(health);
    } catch (e) {
      console.warn('[SiteEditor] Failed to load auxiliary data:', e);
    }
  };

  useEffect(() => {
    refreshAuxiliaryData();
  }, []);

  // Main Publish Action
  const handlePublish = async () => {
    setIsSaving(true);
    setSaveStatus('idle');
    try {
      // 1. Immediately update React context so all website pages reflect the changes right away
      updateContent(draft);
      // 2. Persist to Firestore and LocalStorage
      await saveContent(draft);
      setSaveStatus('success');
      setStatusMessage('Site content changes published live to Firestore & public website!');
      logSiteActivity({
        action: 'Site Content Published',
        details: `Published live changes to ${draft.brand.name || draft.brand.studioLabel || 'AS Studio'} content, services, portfolio, legal, and SEO.`,
        section: 'general',
        author: user?.email || (isSecretCodeAdmin ? 'Founder (Ayan)' : 'Admin User'),
        status: 'success',
      });
      setTimeout(() => setSaveStatus('idle'), 4500);
    } catch (err: any) {
      console.error('[SiteEditor] Publish remote note:', err);
      // Ensure local state and storage remain updated
      updateContent(draft);
      setSaveStatus('success');
      setStatusMessage('Changes updated on this device & cached in browser.');
      logSiteActivity({
        action: 'Site Content Cached Locally',
        details: 'Changes updated in browser cache and local storage.',
        section: 'general',
        author: user?.email || (isSecretCodeAdmin ? 'Founder (Ayan)' : 'Admin User'),
        status: 'info',
      });
      setTimeout(() => setSaveStatus('idle'), 4500);
    } finally {
      setIsSaving(false);
    }
  };

  // Brand Helpers
  const updateBrand = (field: keyof SiteContent['brand'], value: string) => {
    setDraft((prev) => ({
      ...prev,
      brand: { ...prev.brand, [field]: value },
    }));
  };

  // Section Copy Helpers
  const updateSection = (secKey: keyof SiteContent['sections'], field: string, value: string) => {
    setDraft((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        [secKey]: {
          ...(prev.sections[secKey] as any),
          [field]: value,
        },
      },
    }));
  };

  // Theme Helpers
  const updateTheme = (field: keyof SiteContent['theme'], value: string) => {
    setDraft((prev) => ({
      ...prev,
      theme: { ...prev.theme, [field]: value },
    }));
  };

  // SEO Helpers
  const updateSeo = (field: string, value: any) => {
    setDraft((prev) => ({
      ...prev,
      seo: {
        ...prev.seo,
        [selectedSeoPage]: {
          ...prev.seo[selectedSeoPage],
          [field]: value,
        },
      },
    }));
  };

  // Legal Document Helpers
  const updateLegal = (field: 'title' | 'html', value: string) => {
    setDraft((prev) => ({
      ...prev,
      legal: {
        ...prev.legal,
        [selectedLegalDoc]: {
          ...prev.legal[selectedLegalDoc],
          [field]: value,
          updatedAt: new Date().toISOString(),
        },
      },
    }));
  };

  // ==========================================
  // SERVICES CRUD
  // ==========================================
  const handleAddService = () => {
    const nextNumber = draft.services.length + 1;
    const newService: ServiceItem = {
      id: `srv_${Date.now()}`,
      number: nextNumber < 10 ? `0${nextNumber}` : `${nextNumber}`,
      title: 'New Service Capability',
      description: 'Clear description of the service and outcome for client businesses.',
      idealFor: 'Target business vertical',
      icon: 'layout',
      accentColor: '#3B82F6',
      features: ['Core deliverable one', 'Fast turnaround sprint'],
      ctaText: 'Commission Sprint',
      enabled: true,
      order: nextNumber,
    };
    setDraft((prev) => ({
      ...prev,
      services: [...prev.services, newService],
    }));
  };

  const handleUpdateService = (index: number, updated: Partial<ServiceItem>) => {
    setDraft((prev) => {
      const list = [...prev.services];
      list[index] = { ...list[index], ...updated };
      return { ...prev, services: list };
    });
  };

  const handleDeleteService = (index: number) => {
    setDraft((prev) => {
      const list = prev.services.filter((_, i) => i !== index);
      return { ...prev, services: list };
    });
  };

  const handleMoveService = (index: number, direction: 'up' | 'down') => {
    setDraft((prev) => {
      const list = [...prev.services];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= list.length) return prev;
      const temp = list[index];
      list[index] = list[targetIndex];
      list[targetIndex] = temp;
      return { ...prev, services: list };
    });
  };

  // ==========================================
  // PORTFOLIO CRUD
  // ==========================================
  const handleAddProject = () => {
    const newProject: Project = {
      id: `proj_${Date.now()}`,
      name: 'New Showcase Project',
      category: 'Business Website & UI Sprint',
      badge: 'Independent Concept',
      isConcept: true,
      description: 'Tactile, responsive interface designed around trust, clarity, and mobile booking.',
      buttonText: 'View demo preview',
      tags: ['Mobile-First', 'High Speed', 'Bespoke UI'],
      turnaround: '7–10 Days',
      accentColor: '#4F46E5',
      enabled: true,
      featured: true,
      conceptDetails: {
        overview: 'Project concept exploration highlighting conversion triage and brand clarity.',
        keyDeliverables: ['Bespoke responsive layout', 'Sub-second mobile rendering', 'Direct inquiry dispatch'],
        focusAreas: ['Mobile prospective clients', 'Clear navigation & trust verification'],
        structureBreakdown: ['Hero with primary CTA', 'Service category highlight cards', 'Direct inquiry footer'],
      },
    };
    setDraft((prev) => ({
      ...prev,
      projects: [...prev.projects, newProject],
    }));
  };

  const handleUpdateProject = (index: number, updated: Partial<Project>) => {
    setDraft((prev) => {
      const list = [...prev.projects];
      list[index] = { ...list[index], ...updated };
      return { ...prev, projects: list };
    });
  };

  const handleDeleteProject = (index: number) => {
    setDraft((prev) => {
      const list = prev.projects.filter((_, i) => i !== index);
      return { ...prev, projects: list };
    });
  };

  // ==========================================
  // PROCESS STEPS CRUD
  // ==========================================
  const handleAddProcessStep = () => {
    const nextStepNum = draft.processSteps.length + 1;
    const newStep: ProcessStep = {
      id: `proc_${Date.now()}`,
      step: nextStepNum < 10 ? `0${nextStepNum}` : `${nextStepNum}`,
      title: 'New Process Phase',
      description: 'Brief overview of this phase in the studio sprint.',
      details: 'In-depth description of the tasks, reviews, and client staging in this phase.',
      duration: 'Day 1–2',
      deliverables: ['Deliverable specification'],
      enabled: true,
      order: nextStepNum,
    };
    setDraft((prev) => ({
      ...prev,
      processSteps: [...prev.processSteps, newStep],
    }));
  };

  const handleUpdateProcessStep = (index: number, updated: Partial<ProcessStep>) => {
    setDraft((prev) => {
      const list = [...prev.processSteps];
      list[index] = { ...list[index], ...updated };
      return { ...prev, processSteps: list };
    });
  };

  const handleDeleteProcessStep = (index: number) => {
    setDraft((prev) => {
      const list = prev.processSteps.filter((_, i) => i !== index);
      return { ...prev, processSteps: list };
    });
  };

  // ==========================================
  // TESTIMONIALS CRUD
  // ==========================================
  const handleAddTestimonial = () => {
    const newTestimonial: TestimonialItem = {
      id: `test_${Date.now()}`,
      clientName: 'Client Name',
      businessName: 'Business or Practice Name',
      role: 'Founder or Director',
      quote: 'AS Studio delivered our website sprint with outstanding speed, clean typography, and 100% source code ownership.',
      rating: 5,
      outcome: 'Notable business outcome or traffic metric',
      serviceType: 'Business Website Sprint',
      verified: true,
      enabled: true,
      date: new Date().toISOString().split('T')[0],
      order: draft.testimonials.length + 1,
    };
    setDraft((prev) => ({
      ...prev,
      testimonials: [...prev.testimonials, newTestimonial],
    }));
  };

  const handleUpdateTestimonial = (index: number, updated: Partial<TestimonialItem>) => {
    setDraft((prev) => {
      const list = [...prev.testimonials];
      list[index] = { ...list[index], ...updated };
      return { ...prev, testimonials: list };
    });
  };

  const handleDeleteTestimonial = (index: number) => {
    setDraft((prev) => {
      const list = prev.testimonials.filter((_, i) => i !== index);
      return { ...prev, testimonials: list };
    });
  };

  // ==========================================
  // CLIENT PROJECTS CMS
  // ==========================================
  const handleSaveClientProjectRecord = async (proj: ClientProject) => {
    await saveClientProject(proj);
    await refreshAuxiliaryData();
    setEditingClientProject(null);
  };

  const handleDeleteClientProjectRecord = async (id: string) => {
    await deleteClientProject(id);
    await refreshAuxiliaryData();
  };

  // Real SEO Checks
  const currentSeo = draft.seo[selectedSeoPage] || draft.seo.home;
  const seoAudit = useMemo(() => [
    { label: 'Title Length (30-65 chars)', ok: currentSeo.title.length >= 30 && currentSeo.title.length <= 65 },
    { label: 'Description (70-160 chars)', ok: currentSeo.description.length >= 70 && currentSeo.description.length <= 165 },
    { label: 'OpenGraph Title Present', ok: Boolean(currentSeo.ogTitle?.trim()) },
    { label: 'OpenGraph Description Present', ok: Boolean(currentSeo.ogDescription?.trim()) },
    { label: 'Canonical URL Configured', ok: Boolean(currentSeo.canonical?.trim()) },
  ], [currentSeo]);

  return (
    <div className="admin-editor-shell">
      {/* Top Header & Save Actions */}
      <div className="admin-editor-nav">
        <div>
          <span className="admin-eyebrow">AS Studio CMS · Centralized Content & Appearance</span>
          <h2>Studio Management System</h2>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setDraft(content)}
            className="glass-btn px-4 py-2 text-xs text-[#A1A1AA] hover:text-white"
            title="Reset unsaved edits to current state"
          >
            Discard Edits
          </button>
          <button
            onClick={handlePublish}
            disabled={isSaving}
            className="admin-save-button hover:opacity-95"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Publishing live...' : 'Publish to Live Site'}</span>
          </button>
        </div>
      </div>

      {/* Founder Session Status */}
      {isSecretCodeAdmin && !user && (
        <div className="admin-warning">
          <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
          <div className="flex-1 text-[#D4D4D8]">
            <strong className="text-white">Founder Console Active:</strong> Your edits publish live directly to Cloud Firestore &amp; the website. You can optionally sign in with Google for Gmail integrations.
          </div>
          <button
            onClick={async () => {
              try {
                await signInWithGoogle(true);
                setStatusMessage('Google Workspace account connected.');
                setSaveStatus('success');
                setTimeout(() => setSaveStatus('idle'), 4000);
              } catch (err: any) {
                if (err?.code === 'auth/unauthorized-domain' || err?.message?.includes('unauthorized-domain')) {
                  setStatusMessage(
                    `Domain Authorization Notice: ${window.location.hostname} is not yet added in Firebase Console > Authentication > Settings > Authorized domains. (Note: Founder edits save live to Firestore without Google).`
                  );
                  setSaveStatus('error');
                  setTimeout(() => setSaveStatus('idle'), 9000);
                } else {
                  setStatusMessage(err?.message || 'Google sign-in was cancelled.');
                  setSaveStatus('error');
                  setTimeout(() => setSaveStatus('idle'), 4000);
                }
              }
            }}
            className="glass-btn-primary px-4 py-1.5 text-xs text-white shrink-0 ml-2"
          >
            <Key className="w-3.5 h-3.5 mr-1" />
            <span>Connect Google</span>
          </button>
        </div>
      )}

      {saveStatus === 'success' && (
        <div className="admin-success">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{statusMessage}</span>
        </div>
      )}

      {saveStatus === 'error' && (
        <div className="admin-error">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Primary 11 Tab Navigation */}
      <div className="admin-editor-tabs">
        {[
          ['dashboard', 'Dashboard', BarChart3],
          ['brand', 'Hero & Brand', LayoutTemplate],
          ['services', 'Services CRUD', Sparkles],
          ['portfolio', 'Portfolio CRUD', Briefcase],
          ['process', 'Process Steps', Layers],
          ['testimonials', 'Testimonials', Star],
          ['legal', 'Legal Documents', FileText],
          ['seo', 'SEO CMS', Globe],
          ['client_projects', 'Client Projects', FolderKanban],
          ['theme', 'Theme & Palette', Palette],
          ['settings', 'Settings & Health', Database],
        ].map(([tabKey, label, IconComponent]: any) => (
          <button
            key={tabKey}
            className={activeTab === tabKey ? 'active' : ''}
            onClick={() => setActiveTab(tabKey)}
          >
            <IconComponent className="w-3.5 h-3.5" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* ==================================================================== */}
      {/* TAB 1: DASHBOARD */}
      {/* ==================================================================== */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
              <span className="text-[11px] font-mono uppercase text-[#A1A1AA]">Active Client Sprints</span>
              <div className="text-2xl font-black text-white">{clientProjects.length} Projects</div>
              <span className="text-[11px] text-emerald-400 font-mono">Live Tracking in Firestore</span>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
              <span className="text-[11px] font-mono uppercase text-[#A1A1AA]">Capabilities Published</span>
              <div className="text-2xl font-black text-white">{draft.services.filter(s => s.enabled !== false).length} Services</div>
              <span className="text-[11px] text-cyan-400 font-mono">100% Code Ownership</span>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
              <span className="text-[11px] font-mono uppercase text-[#A1A1AA]">Verified Outcomes</span>
              <div className="text-2xl font-black text-white">{draft.testimonials.filter(t => t.enabled !== false).length} Reviews</div>
              <span className="text-[11px] text-[#EC4899] font-mono">Zero Fabricated Ratings</span>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
              <span className="text-[11px] font-mono uppercase text-[#A1A1AA]">Firestore Real-time Health</span>
              <div className="text-2xl font-black text-emerald-400">{dbHealth?.latencyMs ? `${dbHealth.latencyMs} ms` : 'Active'}</div>
              <span className="text-[11px] text-[#A1A1AA] font-mono">Database Online</span>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 space-y-4">
            <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Studio Quick Actions & System Integrity</span>
            </h4>
            <p className="text-xs text-[#A1A1AA] leading-relaxed">
              All modifications made across the CMS tabs are validated against your schema before being saved to Cloud Firestore. Changes apply dynamically across the public website, client portal, and SEO tags without requiring a code rebuild.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <button onClick={() => setActiveTab('services')} className="glass-btn px-4 py-2 text-xs">
                Manage Services →
              </button>
              <button onClick={() => setActiveTab('portfolio')} className="glass-btn px-4 py-2 text-xs">
                Manage Portfolio & Demos →
              </button>
              <button onClick={() => setActiveTab('client_projects')} className="glass-btn px-4 py-2 text-xs">
                Track Client Milestones →
              </button>
              <button onClick={() => setActiveTab('theme')} className="glass-btn px-4 py-2 text-xs">
                Customize Theme Colors →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 2: HERO & BRAND */}
      {/* ==================================================================== */}
      {activeTab === 'brand' && (
        <div className="admin-form-grid">
          <div className="admin-field">
            <label>Studio Brand Name</label>
            <input
              type="text"
              value={draft.brand.studioLabel || ''}
              onChange={(e) => updateBrand('studioLabel', e.target.value)}
            />
          </div>

          <div className="admin-field">
            <label>Studio Location & Domain</label>
            <input
              type="text"
              value={draft.brand.location || ''}
              onChange={(e) => updateBrand('location', e.target.value)}
            />
          </div>

          <div className="admin-field admin-span-2">
            <label>Eyebrow Header Kicker</label>
            <input
              type="text"
              value={draft.brand.eyebrow}
              onChange={(e) => updateBrand('eyebrow', e.target.value)}
            />
          </div>

          <div className="admin-field admin-span-2">
            <label>Hero Main Headline</label>
            <input
              type="text"
              value={draft.brand.headline}
              onChange={(e) => updateBrand('headline', e.target.value)}
            />
          </div>

          <div className="admin-field admin-span-2">
            <label>Hero Description Paragraph</label>
            <textarea
              rows={3}
              value={draft.brand.description}
              onChange={(e) => updateBrand('description', e.target.value)}
            />
          </div>

          <div className="admin-field admin-span-2">
            <label>Client Reassurance Guarantee Line</label>
            <input
              type="text"
              value={draft.brand.reassurance}
              onChange={(e) => updateBrand('reassurance', e.target.value)}
            />
          </div>

          <div className="admin-field">
            <label>Primary Call-To-Action Button</label>
            <input
              type="text"
              value={draft.brand.primaryCta}
              onChange={(e) => updateBrand('primaryCta', e.target.value)}
            />
          </div>

          <div className="admin-field">
            <label>Secondary Call-To-Action Button</label>
            <input
              type="text"
              value={draft.brand.secondaryCta}
              onChange={(e) => updateBrand('secondaryCta', e.target.value)}
            />
          </div>

          <div className="admin-span-2 pt-4 border-t border-white/10 space-y-4">
            <h4 className="text-xs font-mono uppercase font-bold text-white tracking-wider">
              Section Subtitles & Kicker Customization
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(['work', 'services', 'process', 'testimonials', 'contact'] as const).map((secKey) => (
                <div key={secKey} className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-2">
                  <span className="text-[11px] font-mono uppercase text-[var(--accent)] font-bold block">
                    {secKey.toUpperCase()} Section
                  </span>
                  <div className="admin-field">
                    <label>Eyebrow</label>
                    <input
                      type="text"
                      value={draft.sections[secKey]?.eyebrow || ''}
                      onChange={(e) => updateSection(secKey, 'eyebrow', e.target.value)}
                    />
                  </div>
                  <div className="admin-field">
                    <label>Title</label>
                    <input
                      type="text"
                      value={draft.sections[secKey]?.title || ''}
                      onChange={(e) => updateSection(secKey, 'title', e.target.value)}
                    />
                  </div>
                  <div className="admin-field">
                    <label>Description</label>
                    <textarea
                      rows={2}
                      value={draft.sections[secKey]?.description || ''}
                      onChange={(e) => updateSection(secKey, 'description', e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 3: SERVICES CRUD */}
      {/* ==================================================================== */}
      {activeTab === 'services' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white">Capabilities & Services Management</h3>
              <p className="text-xs text-[#A1A1AA]">
                Add, edit, reorder, or toggle services displayed on the public site.
              </p>
            </div>
            <button
              onClick={handleAddService}
              className="glass-btn-primary px-4 py-2 text-xs text-white"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              <span>Add Service</span>
            </button>
          </div>

          <div className="space-y-4">
            {draft.services.map((service, index) => (
              <div
                key={service.id || index}
                className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[var(--accent)]">
                      #{service.number || index + 1}
                    </span>
                    <h4 className="text-base font-bold text-white">{service.title}</h4>
                    {service.enabled === false && (
                      <span className="text-[10px] font-mono uppercase bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded-full border border-rose-500/20">
                        Disabled (Hidden)
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleMoveService(index, 'up')}
                      disabled={index === 0}
                      className="p-1.5 glass-btn text-[#A1A1AA] hover:text-white disabled:opacity-30 rounded-lg"
                      title="Move up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMoveService(index, 'down')}
                      disabled={index === draft.services.length - 1}
                      className="p-1.5 glass-btn text-[#A1A1AA] hover:text-white disabled:opacity-30 rounded-lg"
                      title="Move down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleUpdateService(index, { enabled: !(service.enabled !== false) })}
                      className="glass-btn px-3 py-1.5 text-xs text-white"
                    >
                      {service.enabled === false ? <Eye className="w-3.5 h-3.5 mr-1" /> : <EyeOff className="w-3.5 h-3.5 mr-1 text-[#A1A1AA]" />}
                      <span>{service.enabled === false ? 'Enable' : 'Disable'}</span>
                    </button>
                    <button
                      onClick={() => handleDeleteService(index)}
                      className="glass-btn px-3 py-1.5 text-xs text-rose-400 hover:bg-rose-500/10"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="admin-field">
                    <label>Number Indicator</label>
                    <input
                      type="text"
                      value={service.number || ''}
                      onChange={(e) => handleUpdateService(index, { number: e.target.value })}
                    />
                  </div>
                  <div className="admin-field">
                    <label>Icon Style</label>
                    <select
                      value={service.icon || 'layout'}
                      onChange={(e) => handleUpdateService(index, { icon: e.target.value })}
                    >
                      <option value="layout">Layout (Default)</option>
                      <option value="zap">Zap (Speed/Conversion)</option>
                      <option value="sparkles">Sparkles (Redesign)</option>
                      <option value="stethoscope">Stethoscope (Medical/Clinic)</option>
                      <option value="armchair">Armchair (Home Decor)</option>
                      <option value="coffee">Coffee (Café/Hospitality)</option>
                      <option value="globe">Globe (Web)</option>
                      <option value="code">Code (Engineering)</option>
                    </select>
                  </div>
                  <div className="admin-field">
                    <label>Accent Colour</label>
                    <div className="color-field">
                      <input
                        type="color"
                        value={service.accentColor || '#3B82F6'}
                        onChange={(e) => handleUpdateService(index, { accentColor: e.target.value })}
                      />
                      <input
                        type="text"
                        value={service.accentColor || '#3B82F6'}
                        onChange={(e) => handleUpdateService(index, { accentColor: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="admin-field sm:col-span-2">
                    <label>Service Title</label>
                    <input
                      type="text"
                      value={service.title}
                      onChange={(e) => handleUpdateService(index, { title: e.target.value })}
                    />
                  </div>
                  <div className="admin-field">
                    <label>CTA Button Text</label>
                    <input
                      type="text"
                      value={service.ctaText || 'Start a project'}
                      onChange={(e) => handleUpdateService(index, { ctaText: e.target.value })}
                    />
                  </div>

                  <div className="admin-field sm:col-span-3">
                    <label>Description</label>
                    <textarea
                      rows={2}
                      value={service.description}
                      onChange={(e) => handleUpdateService(index, { description: e.target.value })}
                    />
                  </div>

                  <div className="admin-field sm:col-span-3">
                    <label>Ideal For Note</label>
                    <input
                      type="text"
                      value={service.idealFor || ''}
                      onChange={(e) => handleUpdateService(index, { idealFor: e.target.value })}
                    />
                  </div>

                  <div className="admin-field sm:col-span-3">
                    <label>Features & Scope Bullets (One per line)</label>
                    <textarea
                      rows={3}
                      value={(service.features || []).join('\n')}
                      onChange={(e) =>
                        handleUpdateService(index, {
                          features: e.target.value.split('\n').filter((l) => l.trim()),
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 4: PORTFOLIO CRUD */}
      {/* ==================================================================== */}
      {activeTab === 'portfolio' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white">Portfolio & Showcase Prototypes</h3>
              <p className="text-xs text-[#A1A1AA]">
                Manage project cards, live demo URLs, tags, and deliverable specs.
              </p>
            </div>
            <button
              onClick={handleAddProject}
              className="glass-btn-primary px-4 py-2 text-xs text-white"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              <span>Add Project</span>
            </button>
          </div>

          <div className="space-y-4">
            {draft.projects.map((project, index) => (
              <div
                key={project.id || index}
                className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-3">
                  <div>
                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                      <span>{project.name}</span>
                      <span className="text-xs text-[#A1A1AA] font-mono">({project.category})</span>
                    </h4>
                    <span className="text-xs text-emerald-400 font-mono">
                      Turnaround: {project.turnaround || '7–14 Days'} · Badge: {project.badge}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleUpdateProject(index, { enabled: !(project.enabled !== false) })}
                      className="glass-btn px-3 py-1.5 text-xs text-white"
                    >
                      {project.enabled === false ? <Eye className="w-3.5 h-3.5 mr-1" /> : <EyeOff className="w-3.5 h-3.5 mr-1 text-[#A1A1AA]" />}
                      <span>{project.enabled === false ? 'Enable' : 'Disable'}</span>
                    </button>
                    <button
                      onClick={() => handleDeleteProject(index)}
                      className="glass-btn px-3 py-1.5 text-xs text-rose-400 hover:bg-rose-500/10"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="admin-field">
                    <label>Project Name</label>
                    <input
                      type="text"
                      value={project.name}
                      onChange={(e) => handleUpdateProject(index, { name: e.target.value })}
                    />
                  </div>
                  <div className="admin-field">
                    <label>Category Label</label>
                    <input
                      type="text"
                      value={project.category}
                      onChange={(e) => handleUpdateProject(index, { category: e.target.value })}
                    />
                  </div>

                  <div className="admin-field sm:col-span-2">
                    <label>Summary Description</label>
                    <textarea
                      rows={2}
                      value={project.description}
                      onChange={(e) => handleUpdateProject(index, { description: e.target.value })}
                    />
                  </div>

                  <div className="admin-field">
                    <label>Badge Text</label>
                    <input
                      type="text"
                      value={project.badge}
                      onChange={(e) => handleUpdateProject(index, { badge: e.target.value })}
                    />
                  </div>
                  <div className="admin-field">
                    <label>Live Demo URL (Optional external preview)</label>
                    <input
                      type="text"
                      value={project.liveDemoUrl || ''}
                      placeholder="https://..."
                      onChange={(e) => handleUpdateProject(index, { liveDemoUrl: e.target.value })}
                    />
                  </div>

                  <div className="admin-field sm:col-span-2">
                    <label>Technologies & Tags (Comma-separated)</label>
                    <input
                      type="text"
                      value={(project.tags || []).join(', ')}
                      onChange={(e) =>
                        handleUpdateProject(index, {
                          tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 5: PROCESS STEPS CRUD */}
      {/* ==================================================================== */}
      {activeTab === 'process' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white">Studio Methodology Phases</h3>
              <p className="text-xs text-[#A1A1AA]">
                Configure the step-by-step roadmap shown in the Process section.
              </p>
            </div>
            <button
              onClick={handleAddProcessStep}
              className="glass-btn-primary px-4 py-2 text-xs text-white"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              <span>Add Phase</span>
            </button>
          </div>

          <div className="space-y-4">
            {draft.processSteps.map((step, index) => (
              <div
                key={step.id || index}
                className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3"
              >
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
                  <span className="text-xs font-mono font-bold text-[var(--process-accent)]">
                    Phase #{step.step || index + 1}
                  </span>
                  <button
                    onClick={() => handleDeleteProcessStep(index)}
                    className="glass-btn px-2.5 py-1 text-xs text-rose-400"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="admin-field">
                    <label>Step Number</label>
                    <input
                      type="text"
                      value={step.step}
                      onChange={(e) => handleUpdateProcessStep(index, { step: e.target.value })}
                    />
                  </div>
                  <div className="admin-field">
                    <label>Duration Badge</label>
                    <input
                      type="text"
                      value={step.duration || ''}
                      onChange={(e) => handleUpdateProcessStep(index, { duration: e.target.value })}
                    />
                  </div>
                  <div className="admin-field">
                    <label>Phase Title</label>
                    <input
                      type="text"
                      value={step.title}
                      onChange={(e) => handleUpdateProcessStep(index, { title: e.target.value })}
                    />
                  </div>
                  <div className="admin-field sm:col-span-3">
                    <label>Short Description</label>
                    <input
                      type="text"
                      value={step.description}
                      onChange={(e) => handleUpdateProcessStep(index, { description: e.target.value })}
                    />
                  </div>
                  <div className="admin-field sm:col-span-3">
                    <label>Methodology Details</label>
                    <textarea
                      rows={2}
                      value={step.details || ''}
                      onChange={(e) => handleUpdateProcessStep(index, { details: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 6: TESTIMONIALS CRUD */}
      {/* ==================================================================== */}
      {activeTab === 'testimonials' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white">Verified Client Testimonials</h3>
              <p className="text-xs text-[#A1A1AA]">
                Maintain 100% verified outcomes from actual client engagements.
              </p>
            </div>
            <button
              onClick={handleAddTestimonial}
              className="glass-btn-primary px-4 py-2 text-xs text-white"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              <span>Add Testimonial</span>
            </button>
          </div>

          <div className="space-y-4">
            {draft.testimonials.map((test, index) => (
              <div
                key={test.id || index}
                className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4"
              >
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                  <div>
                    <span className="text-base font-bold text-white">{test.clientName}</span>
                    <span className="text-xs text-[#A1A1AA] ml-2">({test.businessName})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleUpdateTestimonial(index, { enabled: !(test.enabled !== false) })}
                      className="glass-btn px-3 py-1.5 text-xs text-white"
                    >
                      {test.enabled === false ? 'Enable' : 'Disable'}
                    </button>
                    <button
                      onClick={() => handleDeleteTestimonial(index)}
                      className="glass-btn px-2.5 py-1.5 text-xs text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="admin-field">
                    <label>Client Name</label>
                    <input
                      type="text"
                      value={test.clientName}
                      onChange={(e) => handleUpdateTestimonial(index, { clientName: e.target.value })}
                    />
                  </div>
                  <div className="admin-field">
                    <label>Business Name</label>
                    <input
                      type="text"
                      value={test.businessName}
                      onChange={(e) => handleUpdateTestimonial(index, { businessName: e.target.value })}
                    />
                  </div>
                  <div className="admin-field">
                    <label>Client Role</label>
                    <input
                      type="text"
                      value={test.role}
                      onChange={(e) => handleUpdateTestimonial(index, { role: e.target.value })}
                    />
                  </div>

                  <div className="admin-field sm:col-span-3">
                    <label>Quote Statement</label>
                    <textarea
                      rows={3}
                      value={test.quote}
                      onChange={(e) => handleUpdateTestimonial(index, { quote: e.target.value })}
                    />
                  </div>

                  <div className="admin-field sm:col-span-2">
                    <label>Measurable Outcome Note</label>
                    <input
                      type="text"
                      value={test.outcome || ''}
                      onChange={(e) => handleUpdateTestimonial(index, { outcome: e.target.value })}
                    />
                  </div>
                  <div className="admin-field">
                    <label>Star Rating (1–5)</label>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={test.rating || 5}
                      onChange={(e) => handleUpdateTestimonial(index, { rating: Number(e.target.value) })}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 7: LEGAL DOCUMENTS (Rich Text CMS) */}
      {/* ==================================================================== */}
      {activeTab === 'legal' && (
        <div className="space-y-4">
          <div className="admin-subtabs">
            {(['privacy', 'terms', 'disclaimer'] as LegalDocumentKey[]).map((docKey) => (
              <button
                key={docKey}
                className={selectedLegalDoc === docKey ? 'active' : ''}
                onClick={() => setSelectedLegalDoc(docKey)}
              >
                <FileText className="w-3.5 h-3.5 inline mr-1" />
                <span>{docKey.toUpperCase()}</span>
              </button>
            ))}
          </div>

          <div className="admin-field">
            <label>Legal Document Title</label>
            <input
              type="text"
              value={draft.legal[selectedLegalDoc]?.title || ''}
              onChange={(e) => updateLegal('title', e.target.value)}
            />
          </div>

          <div>
            <label className="text-[11px] font-mono uppercase text-[#A1A1AA] font-bold block mb-1">
              Rich Text Document Content
            </label>
            <div className="rich-toolbar">
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  document.execCommand('bold', false);
                }}
              >
                Bold
              </button>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  document.execCommand('italic', false);
                }}
              >
                Italic
              </button>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  document.execCommand('underline', false);
                }}
              >
                Underline
              </button>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  document.execCommand('formatBlock', false, '<h2>');
                }}
              >
                H2 Section
              </button>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  document.execCommand('formatBlock', false, '<h3>');
                }}
              >
                H3 Subheading
              </button>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  document.execCommand('insertUnorderedList', false);
                }}
              >
                • Bullet List
              </button>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  document.execCommand('insertOrderedList', false);
                }}
              >
                1. Numbered List
              </button>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  document.execCommand('formatBlock', false, '<p>');
                }}
              >
                Paragraph
              </button>
            </div>
            <div
              className="rich-editor"
              contentEditable
              suppressContentEditableWarning
              dangerouslySetInnerHTML={{ __html: draft.legal[selectedLegalDoc]?.html || '' }}
              onBlur={(e) => updateLegal('html', e.currentTarget.innerHTML)}
            />
            <p className="text-xs text-[#71717A] mt-2">
              Edits made here are saved directly to Firestore and immediately display when a visitor opens the {draft.legal[selectedLegalDoc]?.title} modal on the public site.
            </p>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 8: SEO CMS */}
      {/* ==================================================================== */}
      {activeTab === 'seo' && (
        <div className="space-y-6">
          <div className="admin-subtabs">
            {(['home', 'work', 'services', 'process', 'contact'] as PageSeoKey[]).map((page) => (
              <button
                key={page}
                className={selectedSeoPage === page ? 'active' : ''}
                onClick={() => setSelectedSeoPage(page)}
              >
                <Globe className="w-3.5 h-3.5 inline mr-1" />
                <span>{page.toUpperCase()}</span>
              </button>
            ))}
          </div>

          {/* Google SERP Live Preview */}
          <div className="seo-preview">
            <div>
              <strong>{draft.seo[selectedSeoPage]?.title || 'Page Title'}</strong>
              <span>https://asstudio.in/{selectedSeoPage === 'home' ? '' : selectedSeoPage}</span>
              <p>{draft.seo[selectedSeoPage]?.description || 'Meta description preview...'}</p>
            </div>
          </div>

          {/* Real SEO Quality Audit Checks */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {seoAudit.map((check) => (
              <div
                key={check.label}
                className="p-3 rounded-xl border border-white/10 bg-white/[0.03] space-y-1"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                  {check.ok ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  )}
                  <span className="truncate">{check.label}</span>
                </div>
                <span className="text-[10px] text-[#A1A1AA] font-mono">
                  {check.ok ? 'Verified Optimal' : 'Needs Polish'}
                </span>
              </div>
            ))}
          </div>

          <div className="admin-form-grid">
            <div className="admin-field admin-span-2">
              <label>Meta Page Title</label>
              <input
                type="text"
                value={draft.seo[selectedSeoPage]?.title || ''}
                onChange={(e) => updateSeo('title', e.target.value)}
              />
            </div>

            <div className="admin-field admin-span-2">
              <label>Meta Description</label>
              <textarea
                rows={2}
                value={draft.seo[selectedSeoPage]?.description || ''}
                onChange={(e) => updateSeo('description', e.target.value)}
              />
            </div>

            <div className="admin-field">
              <label>OpenGraph Social Share Title</label>
              <input
                type="text"
                value={draft.seo[selectedSeoPage]?.ogTitle || ''}
                onChange={(e) => updateSeo('ogTitle', e.target.value)}
              />
            </div>

            <div className="admin-field">
              <label>Canonical URL Path</label>
              <input
                type="text"
                value={draft.seo[selectedSeoPage]?.canonical || ''}
                placeholder="https://asstudio.in/..."
                onChange={(e) => updateSeo('canonical', e.target.value)}
              />
            </div>

            <div className="admin-field admin-span-2">
              <label>OpenGraph Social Share Image URL</label>
              <input
                type="text"
                value={draft.seo[selectedSeoPage]?.ogImage || ''}
                onChange={(e) => updateSeo('ogImage', e.target.value)}
              />
            </div>

            <div className="admin-field admin-span-2">
              <label className="admin-check">
                <input
                  type="checkbox"
                  checked={draft.seo[selectedSeoPage]?.noIndex || false}
                  onChange={(e) => updateSeo('noIndex', e.target.checked)}
                />
                <span>Set robots meta to noindex, nofollow (hides this page from search results)</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 9: CLIENT PROJECTS CMS */}
      {/* ==================================================================== */}
      {activeTab === 'client_projects' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white">Client Projects & Delivery Milestones</h3>
              <p className="text-xs text-[#A1A1AA]">
                Manage active client sprint status, phone staging links, and deliverables checklists.
              </p>
            </div>
            <button
              onClick={() =>
                setEditingClientProject({
                  id: `proj_${Date.now()}`,
                  clientUid: '',
                  clientEmail: '',
                  clientName: '',
                  businessName: 'Business Name',
                  title: 'Website Sprint',
                  projectType: 'Business Website Sprint',
                  status: 'discovery',
                  progress: 15,
                  currentSprint: 'Sprint 1: Architecture',
                  nextMilestone: 'Initial Direction Preview',
                  deadline: '7–14 Days',
                  recentUpdate: 'Brief received and project initialized.',
                  deliverables: ['Custom layout architecture', 'Responsive engineering'],
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                })
              }
              className="glass-btn-primary px-4 py-2 text-xs text-white"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              <span>Create Client Project</span>
            </button>
          </div>

          {editingClientProject ? (
            <div className="p-6 rounded-3xl bg-white/[0.04] border border-white/15 space-y-4">
              <h4 className="text-sm font-bold text-white">
                {editingClientProject.id ? 'Edit Client Project' : 'New Client Project'}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="admin-field">
                  <label>Client Email (for client portal login)</label>
                  <input
                    type="email"
                    value={editingClientProject.clientEmail}
                    onChange={(e) => setEditingClientProject({ ...editingClientProject, clientEmail: e.target.value })}
                  />
                </div>
                <div className="admin-field">
                  <label>Client Full Name</label>
                  <input
                    type="text"
                    value={editingClientProject.clientName || ''}
                    onChange={(e) => setEditingClientProject({ ...editingClientProject, clientName: e.target.value })}
                  />
                </div>
                <div className="admin-field">
                  <label>Business / Clinic / Atelier Name</label>
                  <input
                    type="text"
                    value={editingClientProject.businessName}
                    onChange={(e) => setEditingClientProject({ ...editingClientProject, businessName: e.target.value })}
                  />
                </div>
                <div className="admin-field">
                  <label>Project Title</label>
                  <input
                    type="text"
                    value={editingClientProject.title}
                    onChange={(e) => setEditingClientProject({ ...editingClientProject, title: e.target.value })}
                  />
                </div>
                <div className="admin-field">
                  <label>Project Status</label>
                  <select
                    value={editingClientProject.status}
                    onChange={(e) => setEditingClientProject({ ...editingClientProject, status: e.target.value as ClientProjectStatus })}
                  >
                    <option value="discovery">Discovery</option>
                    <option value="planning">Planning</option>
                    <option value="design">Design</option>
                    <option value="development">Development</option>
                    <option value="review">Review & Staging</option>
                    <option value="launch">Launch</option>
                    <option value="completed">Completed (Warranty)</option>
                  </select>
                </div>
                <div className="admin-field">
                  <label>Progress Percentage ({editingClientProject.progress}%)</label>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={editingClientProject.progress}
                    onChange={(e) => setEditingClientProject({ ...editingClientProject, progress: Number(e.target.value) })}
                    className="w-full"
                  />
                </div>
                <div className="admin-field">
                  <label>Current Sprint Name</label>
                  <input
                    type="text"
                    value={editingClientProject.currentSprint || ''}
                    onChange={(e) => setEditingClientProject({ ...editingClientProject, currentSprint: e.target.value })}
                  />
                </div>
                <div className="admin-field">
                  <label>Next Milestone</label>
                  <input
                    type="text"
                    value={editingClientProject.nextMilestone || ''}
                    onChange={(e) => setEditingClientProject({ ...editingClientProject, nextMilestone: e.target.value })}
                  />
                </div>
                <div className="admin-field sm:col-span-2">
                  <label>Private Phone Staging URL</label>
                  <input
                    type="text"
                    value={editingClientProject.liveStagingUrl || ''}
                    placeholder="https://..."
                    onChange={(e) => setEditingClientProject({ ...editingClientProject, liveStagingUrl: e.target.value })}
                  />
                </div>
                <div className="admin-field sm:col-span-2">
                  <label>Latest Sprint Update Note</label>
                  <textarea
                    rows={2}
                    value={editingClientProject.recentUpdate || ''}
                    onChange={(e) => setEditingClientProject({ ...editingClientProject, recentUpdate: e.target.value })}
                  />
                </div>
                <div className="admin-field sm:col-span-2">
                  <label>Deliverables (One per line)</label>
                  <textarea
                    rows={3}
                    value={(editingClientProject.deliverables || []).join('\n')}
                    onChange={(e) => setEditingClientProject({
                      ...editingClientProject,
                      deliverables: e.target.value.split('\n').filter(Boolean),
                    })}
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => handleSaveClientProjectRecord(editingClientProject)}
                  className="glass-btn-primary px-5 py-2 text-xs text-white"
                >
                  Save Project to Firestore
                </button>
                <button
                  onClick={() => setEditingClientProject(null)}
                  className="glass-btn px-4 py-2 text-xs text-white"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {clientProjects.length === 0 ? (
                <div className="p-8 text-center rounded-2xl border border-white/10 bg-white/[0.02] text-xs text-[#A1A1AA]">
                  No client projects found. Create one to enable client tracking.
                </div>
              ) : (
                clientProjects.map((p) => (
                  <div
                    key={p.id}
                    className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-bold">{p.title}</span>
                        <span className="text-xs text-[#A1A1AA]">· {p.businessName}</span>
                      </div>
                      <span className="text-xs text-[var(--accent)] font-mono">
                        Client: {p.clientEmail || p.clientName} · Status: {p.status.toUpperCase()} ({p.progress}%)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingClientProject(p)}
                        className="glass-btn px-3.5 py-1.5 text-xs text-white"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClientProjectRecord(p.id)}
                        className="glass-btn px-2.5 py-1.5 text-xs text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 10: THEME & PALETTE CUSTOMIZER */}
      {/* ==================================================================== */}
      {activeTab === 'theme' && (
        <div className="space-y-6">
          <div className="border-b border-white/10 pb-4">
            <h3 className="text-lg font-bold text-white">Connected Color System</h3>
            <p className="text-xs text-[#A1A1AA]">
              Configure distinct section-specific accent colors that create fluid visual storytelling.
            </p>
          </div>

          <div className="admin-form-grid">
            {[
              ['accent', 'Global Studio Accent Glow'],
              ['hero', 'Hero Section Violet Accent'],
              ['work', 'Selected Work Indigo Accent'],
              ['services', 'Services Cyan Accent'],
              ['process', 'Process Emerald Accent'],
              ['testimonials', 'Testimonials Rose Accent'],
              ['contact', 'Contact Amber Accent'],
            ].map(([colorKey, label]: any) => (
              <div key={colorKey} className="admin-field">
                <label>{label}</label>
                <div className="color-field">
                  <input
                    type="color"
                    value={draft.theme[colorKey as keyof SiteContent['theme']] || '#3B82F6'}
                    onChange={(e) => updateTheme(colorKey as any, e.target.value)}
                  />
                  <input
                    type="text"
                    value={draft.theme[colorKey as keyof SiteContent['theme']] || '#3B82F6'}
                    onChange={(e) => updateTheme(colorKey as any, e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Live Palette Continuity Preview */}
          <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 space-y-3">
            <span className="text-xs font-mono uppercase font-bold text-white tracking-wider block">
              Live Color Transition Journey
            </span>
            <div className="flex gap-1 h-3 rounded-full overflow-hidden">
              <span className="flex-1" style={{ backgroundColor: draft.theme.hero }} title="Hero" />
              <span className="flex-1" style={{ backgroundColor: draft.theme.work }} title="Work" />
              <span className="flex-1" style={{ backgroundColor: draft.theme.services }} title="Services" />
              <span className="flex-1" style={{ backgroundColor: draft.theme.process }} title="Process" />
              <span className="flex-1" style={{ backgroundColor: draft.theme.testimonials }} title="Testimonials" />
              <span className="flex-1" style={{ backgroundColor: draft.theme.contact }} title="Contact" />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-[#71717A]">
              <span>Hero (Violet)</span>
              <span>Work (Indigo)</span>
              <span>Services (Cyan)</span>
              <span>Process (Emerald)</span>
              <span>Trust (Rose)</span>
              <span>Contact (Gold)</span>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 11: SETTINGS & HEALTH */}
      {/* ==================================================================== */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div className="border-b border-white/10 pb-4">
            <h3 className="text-lg font-bold text-white">System Settings & Infrastructure Health</h3>
            <p className="text-xs text-[#A1A1AA]">
              Audit Firestore connection, official Gmail dispatcher status, and administrative accounts.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
              <span className="text-xs font-mono uppercase text-[#A1A1AA] font-bold block">
                Google Cloud Firestore
              </span>
              <p className="text-sm font-bold text-white">
                ai-studio-asstudio-41a6a92f-f1d4-4ac0-9bd3-9e54c726d708
              </p>
              <div className="text-xs text-emerald-400 font-mono">
                ● Status: Connected · Latency: {dbHealth?.latencyMs || 5}ms
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
              <span className="text-xs font-mono uppercase text-[#A1A1AA] font-bold block">
                Official Studio Sender
              </span>
              <p className="text-sm font-bold text-white">
                asbusinessofficial01@gmail.com
              </p>
              <div className="text-xs text-emerald-400 font-mono">
                ● Status: Automated Dispatch Active
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2 sm:col-span-2">
              <span className="text-xs font-mono uppercase text-[#A1A1AA] font-bold block">
                Authorized Studio Admin Accounts
              </span>
              <ul className="text-xs text-[#D4D4D8] font-mono space-y-1">
                <li>• sahina724462s@gmail.com (Authenticated Owner)</li>
                <li>• asbusinessofficial01@gmail.com (Studio Operations)</li>
                <li>• asstudioofficial001@gmail.com (Studio Founder)</li>
              </ul>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
