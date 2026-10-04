/**
 * CLIENT PORTAL & SPRINT DELIVERY HUB
 * ==============================================================================
 * Ultra-modern, luxury dark aesthetic client portal for AS Studio.
 * Conforms to the Studio Design Constitution: zero static pills, clean typographic
 * hierarchy, refined obsidian glass surfaces, and ZERO admin panel leaks.
 * 
 * Features:
 * - Real-time client sprint progress & milestone tracking
 * - 4-Phase delivery roadmap (Discovery, Architecture & Design, Staging, Handover)
 * - Scope deliverables checklist with live staging phone preview links
 * - Real Google Authentication (now active on authorized domain as-studio-delta.vercel.app)
 * - Non-blocking Client & Guest access with direct email filtering
 * - Strict security: zero admin passkeys or founder codes leaked to public clients
 * ==============================================================================
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, User, Mail,
  ExternalLink, RefreshCw,
  Search, FolderKanban, Check, Smartphone,
  Send, ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { 
  getProjectInquiries, ProjectInquiryRecord 
} from '../services';
import { 
  getClientProjects, saveClientProject 
} from '../services/siteContent';
import { ClientProject, ClientProjectStatus } from '../types';

interface ClientPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToContact?: () => void;
  onOpenAdminPanel?: () => void;
  onNavigateToTrack?: () => void;
}

const STATUS_DETAILS: Record<ClientProjectStatus, { label: string; color: string; step: number }> = {
  discovery: { label: 'Discovery & Scope', color: '#60A5FA', step: 1 },
  planning: { label: 'Architecture & Planning', color: '#818CF8', step: 1 },
  design: { label: 'UX & Visual Design', color: '#C084FC', step: 2 },
  development: { label: 'Code & Interactive Build', color: '#38BDF8', step: 3 },
  review: { label: 'Client Staging & Review', color: '#FCD34D', step: 3 },
  launch: { label: 'Final Launch Prep', color: '#34D399', step: 4 },
  completed: { label: 'Completed (Warranty Active)', color: '#10B981', step: 4 },
};

const SPRINT_STAGES = [
  { step: 1, name: 'Discovery & Scope' },
  { step: 2, name: 'Design & Prototype' },
  { step: 3, name: 'Staging & Review' },
  { step: 4, name: 'Handover & Launch' },
];

export function ClientPortalModal({ 
  isOpen, 
  onClose, 
  onNavigateToContact, 
  onOpenAdminPanel,
  onNavigateToTrack
}: ClientPortalModalProps) {
  const { 
    user, 
    isAdmin, 
    loginWithEmail,
    signInWithGoogle, 
    signOut, 
    loading: authLoading 
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'projects' | 'inquiries'>('projects');
  const [clientProjects, setClientProjects] = useState<ClientProject[]>([]);
  const [inquiries, setInquiries] = useState<ProjectInquiryRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [clientEmailFilter, setClientEmailFilter] = useState('');
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);
  
  // Client Authentication Drawer (Clean & Safe)
  const [showAuthDrawer, setShowAuthDrawer] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [errorToast, setErrorToast] = useState<string | null>(null);

  const refreshData = async () => {
    try {
      setLoading(true);
      setErrorToast(null);
      const effectiveEmail = user?.email || (clientEmailFilter.trim() || undefined);
      const [inqs, projs] = await Promise.all([
        getProjectInquiries(),
        getClientProjects(effectiveEmail, user?.uid || undefined),
      ]);
      setInquiries(inqs);
      setClientProjects(projs);
    } catch (e: any) {
      console.warn('[ClientPortal] Refresh note:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      refreshData();
    }
  }, [isOpen, user, isAdmin, clientEmailFilter]);

  const handleClientEmailSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) {
      setAuthError('Please enter your email or project code.');
      return;
    }
    setAuthError(null);
    loginWithEmail(emailInput.trim(), nameInput.trim() || undefined, true);
    setShowAuthDrawer(false);
    setEmailInput('');
    setNameInput('');
    refreshData();
  };

  const handleGoogleSignIn = async () => {
    setErrorToast(null);
    setAuthError(null);
    try {
      await signInWithGoogle(true);
      setShowAuthDrawer(false);
      await refreshData();
    } catch (err: any) {
      console.warn('[ClientPortal] Google Auth note:', err);
      const msg = err?.message || 'Google sign-in was cancelled.';
      setErrorToast(msg);
      setTimeout(() => setErrorToast(null), 5000);
    }
  };

  const handleUpdateProjectStatus = async (project: ClientProject, newStatus: ClientProjectStatus) => {
    setStatusUpdatingId(project.id);
    try {
      const updated: ClientProject = {
        ...project,
        status: newStatus,
        progress: newStatus === 'completed' ? 100 : newStatus === 'launch' ? 95 : newStatus === 'review' ? 85 : newStatus === 'development' ? 65 : newStatus === 'design' ? 45 : 20,
        updatedAt: new Date().toISOString(),
      };
      await saveClientProject(updated);
      setClientProjects((prev) => prev.map((p) => (p.id === project.id ? updated : p)));
    } catch (err: any) {
      console.error('[ClientPortal] Update project status failed:', err);
    } finally {
      setStatusUpdatingId(null);
    }
  };

  const filteredProjects = clientProjects.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.businessName.toLowerCase().includes(q) ||
      p.projectType.toLowerCase().includes(q) ||
      (p.clientName && p.clientName.toLowerCase().includes(q)) ||
      (p.clientEmail && p.clientEmail.toLowerCase().includes(q))
    );
  });

  const filteredInquiries = inquiries.filter((inq) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      inq.clientName.toLowerCase().includes(q) ||
      inq.businessName.toLowerCase().includes(q) ||
      inq.contactChannel.toLowerCase().includes(q) ||
      inq.scopeSummary.toLowerCase().includes(q)
    );
  });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8">
        {/* Dark Obsidian Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#070709]/85 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 12 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-4xl max-h-[92vh] sm:max-h-[88vh] bg-[#0E0E13] border border-white/[0.08] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-[#E4E4E7]"
        >
          {/* Top Brand & Title Bar */}
          <div className="px-6 py-4 border-b border-white/[0.08] bg-[#121218] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#2563EB]/15 border border-[#3B82F6]/30 flex items-center justify-center text-[#60A5FA]">
                <FolderKanban className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold tracking-tight text-white">
                    Client Sprint &amp; Delivery Hub
                  </h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Live Sync Active" />
                </div>
                <p className="text-xs text-[#71717A]">
                  Direct visibility into active sprints, phone staging previews, and milestone deliverables.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={refreshData}
                disabled={loading}
                className="p-2 text-[#71717A] hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                title="Refresh projects"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>

              <button
                onClick={onClose}
                className="p-2 text-[#71717A] hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                aria-label="Close portal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Subheader: Tabs & Non-Blocking Access Bar */}
          <div className="px-6 py-2.5 border-b border-white/[0.06] bg-[#0A0A0E] flex flex-wrap items-center justify-between gap-3">
            {/* Tab Switcher */}
            <div className="flex items-center gap-1 p-1 bg-white/[0.04] border border-white/[0.06] rounded-lg">
              <button
                onClick={() => setActiveTab('projects')}
                className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  activeTab === 'projects'
                    ? 'bg-white/15 text-white font-semibold shadow-sm'
                    : 'text-[#A1A1AA] hover:text-white'
                }`}
              >
                Active Sprints ({clientProjects.length})
              </button>
              <button
                onClick={() => setActiveTab('inquiries')}
                className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  activeTab === 'inquiries'
                    ? 'bg-white/15 text-white font-semibold shadow-sm'
                    : 'text-[#A1A1AA] hover:text-white'
                }`}
              >
                Submitted Briefs ({inquiries.length})
              </button>
            </div>

            {/* Session & Sign In (Zero Leaked Admin Keys) */}
            <div className="flex items-center gap-2 text-xs">
              {user ? (
                <div className="flex items-center gap-2 bg-white/[0.04] px-3 py-1.5 rounded-lg border border-white/10 text-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-white font-medium truncate max-w-[150px]">
                    {user.displayName || user.email}
                  </span>
                  {isAdmin && (
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-300 border border-rose-500/25">
                      Founder
                    </span>
                  )}
                  <button
                    onClick={signOut}
                    className="text-[#71717A] hover:text-rose-400 ml-1 font-mono text-[11px]"
                  >
                    Sign out
                  </button>
                </div>
              ) : isAdmin ? (
                <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 text-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-emerald-300 font-semibold">Client Workspace</span>
                  <button
                    onClick={signOut}
                    className="text-[#71717A] hover:text-rose-400 ml-1 font-mono text-[11px]"
                  >
                    Lock
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleGoogleSignIn}
                    disabled={authLoading}
                    className="px-3.5 py-1.5 bg-white hover:bg-slate-100 text-black text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 shadow-sm"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                    <span>Sign in with Google</span>
                  </button>

                  <button
                    onClick={() => setShowAuthDrawer(!showAuthDrawer)}
                    className="px-3 py-1.5 text-xs text-[#A1A1AA] hover:text-white border border-white/10 hover:border-white/20 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Email Login</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Client Email Login Drawer (Clean, Zero Leaks) */}
          {showAuthDrawer && !user && !isAdmin && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-6 py-3.5 bg-[#14141C] border-b border-white/10 space-y-2.5 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white">Client Access via Email:</span>
                <button onClick={() => setShowAuthDrawer(false)} className="text-[#71717A] hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleClientEmailSignIn} className="flex flex-wrap items-center gap-2.5">
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Enter your client email..."
                  className="flex-1 min-w-[200px] px-3 py-1.5 bg-[#0A0A0D] border border-white/15 rounded-lg text-white text-xs placeholder:text-[#52525B] focus:outline-none focus:border-[#3B82F6]"
                />
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Your name (optional)..."
                  className="w-[150px] px-3 py-1.5 bg-[#0A0A0D] border border-white/15 rounded-lg text-white text-xs placeholder:text-[#52525B] focus:outline-none focus:border-[#3B82F6]"
                />
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <span>Access Sprints</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>

              {authError && (
                <span className="text-rose-400 text-[11px] font-mono block">{authError}</span>
              )}
            </motion.div>
          )}

          {/* Search & Direct Client Filter Bar */}
          <div className="px-6 py-2.5 bg-[#0C0C10] border-b border-white/[0.04] flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-3.5 h-3.5 text-[#71717A] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search active sprints, business names, or deliverables..."
                className="w-full pl-9 pr-4 py-1.5 bg-[#08080A] border border-white/10 rounded-lg text-xs text-white placeholder:text-[#52525B] focus:border-[#3B82F6] focus:outline-none transition-colors"
              />
            </div>

            {/* Client Email Filter */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[#71717A] hidden sm:inline">Filter Email:</span>
              <div className="relative">
                <input
                  type="email"
                  value={clientEmailFilter}
                  onChange={(e) => setClientEmailFilter(e.target.value)}
                  placeholder="Filter by client email..."
                  className="pl-3 pr-7 py-1.5 bg-[#08080A] border border-white/10 rounded-lg text-xs text-white placeholder:text-[#52525B] focus:border-[#3B82F6] focus:outline-none w-[170px] sm:w-[200px]"
                />
                {clientEmailFilter && (
                  <button
                    onClick={() => setClientEmailFilter('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-[#71717A] hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* General Error Toast */}
          {errorToast && (
            <div className="mx-6 mt-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-lg text-xs flex items-center justify-between">
              <span>{errorToast}</span>
              <button onClick={() => setErrorToast(null)} className="text-rose-400 hover:text-rose-300 font-mono text-[11px]">
                Dismiss
              </button>
            </div>
          )}

          {/* Modal Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">

            {/* TAB 1: SPRINT TRACKING & DELIVERY */}
            {activeTab === 'projects' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
                  <div>
                    <h4 className="text-sm font-bold text-white tracking-wide">
                      Active Sprint Handover Pipelines
                    </h4>
                    <p className="text-xs text-[#71717A]">
                      Live milestone progress, staging reviews, and transparent code handover for AS Studio clients.
                    </p>
                  </div>
                  {isAdmin && onOpenAdminPanel && (
                    <button
                      onClick={onOpenAdminPanel}
                      className="px-3 py-1.5 text-xs text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-lg transition-colors self-start font-mono"
                    >
                      Open Founder CMS →
                    </button>
                  )}
                </div>

                {filteredProjects.length === 0 ? (
                  <div className="p-10 text-center rounded-xl border border-white/[0.08] bg-white/[0.02] space-y-3">
                    <FolderKanban className="w-8 h-8 text-[#52525B] mx-auto" />
                    <h5 className="text-sm font-semibold text-white">No Matching Sprints Found</h5>
                    <p className="text-xs text-[#71717A] max-w-sm mx-auto">
                      {clientEmailFilter 
                        ? `No projects found associated with "${clientEmailFilter}". Clear the filter to view all studio sprints.`
                        : 'All verified client sprints and concept deliverables will be shown here.'}
                    </p>
                    {clientEmailFilter && (
                      <button
                        onClick={() => setClientEmailFilter('')}
                        className="px-3.5 py-1.5 bg-white/10 hover:bg-white/15 text-white text-xs rounded-lg transition-colors"
                      >
                        Clear Email Filter
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-5">
                    {filteredProjects.map((project) => {
                      const statusKey = project.status as ClientProjectStatus;
                      const statusInfo = STATUS_DETAILS[statusKey] || STATUS_DETAILS.discovery;
                      
                      return (
                        <div
                          key={project.id}
                          className="p-5 sm:p-6 bg-[#121218] border border-white/[0.08] rounded-xl hover:border-white/15 transition-all space-y-5"
                        >
                          {/* Project Header */}
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-white/[0.06] pb-4">
                            <div className="space-y-1">
                              <h5 className="text-base font-bold text-white tracking-tight">
                                {project.title}
                              </h5>
                              <div className="flex flex-wrap items-center gap-2 text-xs text-[#71717A]">
                                <span className="text-[#D4D4D8] font-medium">{project.businessName}</span>
                                <span aria-hidden="true">·</span>
                                <span>{project.projectType}</span>
                                <span aria-hidden="true">·</span>
                                <span className="text-emerald-400 font-mono text-[11px]">{project.timeline || '10 Days Handover'}</span>
                              </div>
                            </div>

                            {/* Status Indicator & Admin Action */}
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2 text-xs font-mono bg-black/40 px-3 py-1.5 rounded-lg border border-white/[0.06]">
                                <span 
                                  className="w-2 h-2 rounded-full" 
                                  style={{ backgroundColor: statusInfo.color }}
                                />
                                <span className="font-semibold text-white uppercase tracking-wider text-[11px]">
                                  {statusInfo.label}
                                </span>
                                <span className="text-[#52525B]" aria-hidden="true">·</span>
                                <span className="text-emerald-400 font-bold">{project.progress}%</span>
                              </div>

                              {/* Admin Inline Status Selector */}
                              {isAdmin && (
                                <select
                                  disabled={statusUpdatingId === project.id}
                                  value={project.status}
                                  onChange={(e) => handleUpdateProjectStatus(project, e.target.value as ClientProjectStatus)}
                                  className="text-[11px] bg-[#0A0A0D] border border-white/20 rounded-md px-2 py-1 text-white outline-none cursor-pointer"
                                >
                                  {(['discovery', 'planning', 'design', 'development', 'review', 'launch', 'completed'] as ClientProjectStatus[]).map((st) => (
                                    <option key={st} value={st}>
                                      Set: {STATUS_DETAILS[st].label}
                                    </option>
                                  ))}
                                </select>
                              )}
                            </div>
                          </div>

                          {/* Linear Milestone Progress Bar */}
                          <div className="space-y-2">
                            <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-[#2563EB] to-emerald-400 transition-all duration-500"
                                style={{ width: `${project.progress}%` }}
                              />
                            </div>

                            {/* 4-Step Pipeline Indicators */}
                            <div className="grid grid-cols-4 gap-2 pt-1 text-[11px]">
                              {SPRINT_STAGES.map((st) => {
                                const isPassed = statusInfo.step > st.step;
                                const isCurrent = statusInfo.step === st.step;
                                return (
                                  <div key={st.step} className="flex flex-col">
                                    <span className={`font-mono text-[10px] uppercase ${isCurrent ? 'text-white font-bold' : isPassed ? 'text-emerald-400' : 'text-[#52525B]'}`}>
                                      Step {st.step}
                                    </span>
                                    <span className={`truncate text-xs ${isCurrent ? 'text-[#60A5FA] font-medium' : isPassed ? 'text-[#D4D4D8]' : 'text-[#71717A]'}`}>
                                      {st.name}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Milestone Information Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                            <div className="p-3 rounded-lg bg-black/40 border border-white/[0.04]">
                              <span className="text-[10px] font-mono uppercase text-[#71717A] block">Active Sprint Focus</span>
                              <span className="text-xs font-semibold text-white block mt-0.5">
                                {project.currentSprint || 'Phase 1: Architecture'}
                              </span>
                            </div>

                            <div className="p-3 rounded-lg bg-black/40 border border-white/[0.04]">
                              <span className="text-[10px] font-mono uppercase text-[#71717A] block">Next Deliverable</span>
                              <span className="text-xs font-semibold text-emerald-400 block mt-0.5">
                                {project.nextMilestone || 'Live Phone Staging'}
                              </span>
                            </div>

                            <div className="p-3 rounded-lg bg-black/40 border border-white/[0.04]">
                              <span className="text-[10px] font-mono uppercase text-[#71717A] block">Target Handover</span>
                              <span className="text-xs font-semibold text-white block mt-0.5">
                                {project.deadline || '7–14 Business Days'}
                              </span>
                            </div>
                          </div>

                          {/* Recent Status Note */}
                          {project.recentUpdate && (
                            <div className="p-3 bg-black/30 border-l-2 border-[#3B82F6] rounded-r-lg text-xs text-[#D4D4D8] space-y-0.5">
                              <span className="text-[10px] uppercase font-mono text-[#60A5FA] font-semibold block">
                                Studio Progress Note
                              </span>
                              <p className="leading-relaxed">{project.recentUpdate}</p>
                            </div>
                          )}

                          {/* Deliverables Checklist */}
                          {project.deliverables && project.deliverables.length > 0 && (
                            <div className="space-y-2 pt-2 border-t border-white/[0.06]">
                              <span className="text-xs font-semibold text-white tracking-wide block">
                                Deliverables Scope Checklist
                              </span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#A1A1AA]">
                                {project.deliverables.map((del: string, dIdx: number) => (
                                  <div key={dIdx} className="flex items-start gap-2">
                                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                    <span>{del}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Footer Actions: Live Mobile Staging Demo */}
                          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/[0.06]">
                            <span className="text-[11px] text-[#71717A] font-mono">
                              Project files and access provided at handover
                            </span>

                            {project.liveStagingUrl && (
                              <a
                                href={project.liveStagingUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3.5 py-1.5 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                              >
                                <Smartphone className="w-3.5 h-3.5 text-[#60A5FA]" />
                                <span>Preview Live Phone Staging</span>
                                <ExternalLink className="w-3 h-3 text-[#71717A]" />
                              </a>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: SUBMITTED BRIEFS & INQUIRIES */}
            {activeTab === 'inquiries' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
                  <div>
                    <h4 className="text-sm font-bold text-white tracking-wide">
                      Project Inquiries &amp; Consultations
                    </h4>
                    <p className="text-xs text-[#71717A]">
                      Status updates for briefs submitted via contact form or direct communication channels.
                    </p>
                  </div>
                  {onNavigateToContact && (
                    <button
                      onClick={() => {
                        onClose();
                        onNavigateToContact();
                      }}
                      className="px-3 py-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 self-start"
                    >
                      <Send className="w-3 h-3" />
                      <span>Submit New Brief</span>
                    </button>
                  )}
                </div>

                {filteredInquiries.length === 0 ? (
                  <div className="p-10 text-center rounded-xl border border-white/[0.08] bg-white/[0.02] space-y-3">
                    <Mail className="w-8 h-8 text-[#52525B] mx-auto" />
                    <h5 className="text-sm font-semibold text-white">No Inquiries Found</h5>
                    <p className="text-xs text-[#71717A] max-w-sm mx-auto">
                      Submit a project brief through our contact form to begin your free scope consultation.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredInquiries.map((inq) => (
                      <div
                        key={inq.id}
                        className="p-4 bg-[#121218] border border-white/[0.08] rounded-xl hover:border-white/15 transition-all space-y-2.5"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-white">{inq.clientName}</span>
                            <span className="text-xs text-[#71717A]">· {inq.businessName}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs font-mono">
                            <span className="w-2 h-2 rounded-full bg-emerald-400" />
                            <span className="text-white uppercase tracking-wider text-[11px] font-semibold">
                              {inq.status}
                            </span>
                            <span className="text-[#52525B]">·</span>
                            <span className="text-[#71717A]">{new Date(inq.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>

                        <p className="text-xs text-[#D4D4D8] leading-relaxed">
                          {inq.scopeSummary}
                        </p>

                        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/[0.06] text-xs text-[#71717A]">
                          <span>Contact: <strong className="text-white font-mono">{inq.contactChannel}</strong></span>
                          <span>Budget: <strong className="text-[#60A5FA] font-mono">{inq.targetBudget || 'Flexible'}</strong></span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Modal Footer */}
          <div className="px-6 py-3 border-t border-white/[0.08] bg-[#0A0A0E] flex flex-wrap items-center justify-between gap-3 text-xs text-[#71717A]">
            <span className="font-mono text-[11px]">
              AS Studio · Independent Design Studio · Free Turnaround Estimates
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-3.5 py-1.5 text-xs text-[#A1A1AA] hover:text-white transition-colors"
              >
                Close
              </button>
              {onNavigateToContact && (
                <button
                  onClick={() => {
                    onClose();
                    onNavigateToContact();
                  }}
                  className="px-4 py-1.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-lg transition-colors"
                >
                  Start Project Brief
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
