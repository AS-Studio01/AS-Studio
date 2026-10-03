/**
 * CLIENT & INQUIRIES PORTAL
 * ==============================================================================
 * Powered by real Firebase Authentication (useAuth) and Cloud Firestore.
 * Allows clients to track submitted project briefs and view live sprint milestones.
 * ==============================================================================
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, User, Mail, Database, ShieldCheck, CheckCircle2, 
  Clock, LogOut, Key, ArrowRight, ExternalLink, RefreshCw,
  Send, Sparkles, Filter, Trash2, Lock, FolderKanban, Check, Smartphone,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { 
  getProjectInquiries, ProjectInquiryRecord, checkDatabaseHealth, 
  verifyGmailServiceStatus, deleteProjectInquiry, updateInquiryStatus 
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
}

const STATUS_CONFIG: Record<ClientProjectStatus, { label: string; color: string; bg: string }> = {
  discovery: { label: 'Discovery', color: '#60A5FA', bg: 'rgba(96, 165, 250, 0.15)' },
  planning: { label: 'Planning', color: '#818CF8', bg: 'rgba(129, 140, 248, 0.15)' },
  design: { label: 'Design', color: '#C084FC', bg: 'rgba(192, 132, 252, 0.15)' },
  development: { label: 'Development', color: '#38BDF8', bg: 'rgba(56, 189, 248, 0.15)' },
  review: { label: 'Client Review & Staging', color: '#FCD34D', bg: 'rgba(252, 211, 77, 0.15)' },
  launch: { label: 'Launch', color: '#34D399', bg: 'rgba(52, 211, 153, 0.15)' },
  completed: { label: 'Completed (Warranty Active)', color: '#10B981', bg: 'rgba(16, 185, 129, 0.15)' },
};

export function ClientPortalModal({ 
  isOpen, 
  onClose, 
  onNavigateToContact, 
  onOpenAdminPanel 
}: ClientPortalModalProps) {
  const { user, isAdmin, signInWithGoogle, signOut, loading: authLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<'projects' | 'inquiries'>('projects');
  const [clientProjects, setClientProjects] = useState<ClientProject[]>([]);
  const [inquiries, setInquiries] = useState<ProjectInquiryRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dbHealth, setDbHealth] = useState<{ status: string; latencyMs: number; totalRecords: number; storage: string } | null>(null);
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);

  const refreshData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [inqs, health, projs] = await Promise.all([
        getProjectInquiries(),
        checkDatabaseHealth(),
        getClientProjects(user?.email || undefined, user?.uid || undefined),
      ]);
      setInquiries(inqs);
      setDbHealth(health);
      setClientProjects(projs);
    } catch (e: any) {
      console.error('[ClientPortal] Refresh error:', e);
      setError('Could not refresh portal data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      refreshData();
    }
  }, [isOpen, user]);

  const handleGoogleSignIn = async () => {
    setError(null);
    try {
      await signInWithGoogle();
      await refreshData();
    } catch (err: any) {
      const isUnauthorizedDomain =
        err?.code === 'auth/unauthorized-domain' ||
        err?.message?.includes('unauthorized-domain');

      if (isUnauthorizedDomain) {
        setError('unauthorized_domain');
      } else {
        setError(err?.message || 'Google sign-in was cancelled or failed.');
      }
    }
  };

  const handleUpdateProjectStatus = async (project: ClientProject, newStatus: ClientProjectStatus) => {
    setStatusUpdatingId(project.id);
    try {
      const updated: ClientProject = {
        ...project,
        status: newStatus,
        progress: newStatus === 'completed' ? 100 : newStatus === 'launch' ? 95 : newStatus === 'review' ? 85 : newStatus === 'development' ? 65 : 30,
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

  const handleDeleteInquiry = async (id: string) => {
    await deleteProjectInquiry(id);
    await refreshData();
  };

  const handleStatusChange = async (id: string, newStatus: ProjectInquiryRecord['status']) => {
    await updateInquiryStatus(id, newStatus);
    await refreshData();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.2 }}
          className="relative z-10 w-full max-w-4xl max-h-[92vh] sm:max-h-[88vh] glass-panel border border-white/15 shadow-2xl flex flex-col overflow-hidden text-[#F4F4F6]"
        >
          {/* Header */}
          <div className="px-5 py-4 sm:px-7 sm:py-5 border-b border-white/10 bg-white/[0.03] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#2563EB] to-[#60A5FA] flex items-center justify-center text-white shadow-md">
                <FolderKanban className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                  <span>Client Delivery & Sprint Hub</span>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Cloud Firestore Active
                  </span>
                </h3>
                <p className="text-xs text-[#A1A1AA]">
                  Milestone Tracking · Private Phone Staging · Direct Briefs
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={refreshData}
                disabled={loading}
                className="w-9 h-9 rounded-full glass-btn p-0 flex items-center justify-center text-[#A1A1AA] hover:text-white"
                title="Refresh records"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full glass-btn p-0 flex items-center justify-center text-[#A1A1AA] hover:text-white"
                aria-label="Close portal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* User Auth Banner & Tabs */}
          <div className="px-5 sm:px-7 py-3 border-b border-white/10 bg-white/[0.02] flex flex-wrap items-center justify-between gap-3">
            {/* Nav Tabs: My Projects vs Inquiries */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('projects')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  activeTab === 'projects'
                    ? 'bg-[var(--accent)] text-white shadow-md'
                    : 'glass-btn text-[#A1A1AA] hover:text-white'
                }`}
              >
                <FolderKanban className="w-3.5 h-3.5 inline mr-1.5" />
                <span>My Projects ({clientProjects.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('inquiries')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  activeTab === 'inquiries'
                    ? 'bg-[var(--accent)] text-white shadow-md'
                    : 'glass-btn text-[#A1A1AA] hover:text-white'
                }`}
              >
                <Mail className="w-3.5 h-3.5 inline mr-1.5" />
                <span>Briefs & Inquiries ({inquiries.length})</span>
              </button>
            </div>

            {/* Auth Session State */}
            <div className="flex items-center gap-2 text-xs">
              {user ? (
                <div className="flex items-center gap-2 bg-white/[0.04] px-3 py-1.5 rounded-full border border-white/10">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-white font-medium truncate max-w-[160px]">
                    {user.displayName || user.email}
                  </span>
                  <button
                    onClick={signOut}
                    className="text-[#A1A1AA] hover:text-rose-400 ml-1 font-mono text-[10px] uppercase"
                  >
                    Sign out
                  </button>
                </div>
              ) : isAdmin ? (
                <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-emerald-300 font-medium text-xs">
                    Founder Active
                  </span>
                  <button
                    onClick={signOut}
                    className="text-[#A1A1AA] hover:text-rose-400 ml-1 font-mono text-[10px] uppercase"
                  >
                    Lock
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleGoogleSignIn}
                  disabled={authLoading}
                  className="glass-btn-primary px-4 py-1.5 text-xs text-white"
                >
                  <Key className="w-3.5 h-3.5 mr-1" />
                  <span>Google Client Sign-In</span>
                </button>
              )}
            </div>
          </div>

          {/* Modal Body Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
            
            {error === 'unauthorized_domain' ? (
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-3 text-left">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Domain Authorization Notice (auth/unauthorized-domain)</span>
                </div>
                <p className="text-xs text-[#D4D4D8] leading-relaxed">
                  Firebase Authentication restricts Google popup sign-in to domains listed in your Firebase project. Current domain: <code className="bg-black/40 px-1.5 py-0.5 rounded text-amber-300 font-mono text-[11px]">{typeof window !== 'undefined' ? window.location.hostname : 'run.app'}</code>.
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <a
                    href="https://console.firebase.google.com/project/profound-handbook-z3skh/authentication/settings"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-btn px-3 py-1.5 text-xs text-[#60A5FA] flex items-center gap-1.5"
                  >
                    <span>Add to Firebase Authorized Domains</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  {onOpenAdminPanel && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenAdminPanel();
                      }}
                      className="glass-btn-primary px-3 py-1.5 text-xs text-white flex items-center gap-1.5"
                    >
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span>Open Founder Admin Panel</span>
                    </button>
                  )}
                </div>
              </div>
            ) : error ? (
              <div className="admin-error">
                <span>{error}</span>
              </div>
            ) : null}

            {/* TAB 1: MY PROJECTS (Delivery Milestones Tracking) */}
            {activeTab === 'projects' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.08] pb-3">
                  <div>
                    <h4 className="text-sm font-black text-white font-mono uppercase tracking-wider">
                      Active Website Sprints & Delivery Tracker
                    </h4>
                    <p className="text-xs text-[#A1A1AA]">
                      Real-time visibility from brief intake to phone staging and source code delivery.
                    </p>
                  </div>
                  {isAdmin && onOpenAdminPanel && (
                    <button
                      onClick={onOpenAdminPanel}
                      className="glass-btn text-[11px] px-3 py-1 text-[#60A5FA] self-start"
                    >
                      Open Founder Admin CMS →
                    </button>
                  )}
                </div>

                {clientProjects.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl border border-white/10 bg-white/[0.02] space-y-3">
                    <FolderKanban className="w-10 h-10 text-[#71717A] mx-auto" />
                    <h5 className="text-sm font-bold text-white">No active sprints assigned to this account</h5>
                    <p className="text-xs text-[#A1A1AA] max-w-md mx-auto">
                      Have you commissioned a project with AS Studio? Sign in with your registered client email or submit a project brief to initialize your sprint tracker.
                    </p>
                    {onNavigateToContact && (
                      <button
                        onClick={() => {
                          onClose();
                          onNavigateToContact();
                        }}
                        className="glass-btn-primary px-6 py-2.5 text-xs text-white"
                      >
                        Submit Project Brief
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-5">
                    {clientProjects.map((project) => {
                      const statusKey = project.status as ClientProjectStatus;
                      const statusInfo = STATUS_CONFIG[statusKey] || STATUS_CONFIG.discovery;
                      return (
                        <div
                          key={project.id}
                          className="glass-card p-6 space-y-5"
                        >
                          {/* Card Top: Title, Business, Status Pill */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <h5 className="text-lg font-black text-white">{project.title}</h5>
                                <span className="text-xs text-[#A1A1AA]">· {project.businessName}</span>
                              </div>
                              <span className="text-xs text-[var(--accent)] font-mono">
                                Scope: {project.projectType} · Client: {project.clientName || project.clientEmail}
                              </span>
                            </div>

                            {/* Status Indicator Pill */}
                            <div className="flex items-center gap-2">
                              <span
                                className="px-3 py-1 rounded-full text-xs font-bold font-mono tracking-wider uppercase border border-white/10"
                                style={{ backgroundColor: statusInfo.bg, color: statusInfo.color }}
                              >
                                ● {statusInfo.label}
                              </span>
                              
                              {/* Admin Status Quick Updater */}
                              {isAdmin && (
                                <select
                                  disabled={statusUpdatingId === project.id}
                                  value={project.status}
                                  onChange={(e) => handleUpdateProjectStatus(project, e.target.value as ClientProjectStatus)}
                                  className="text-xs bg-[#1A1A22] border border-white/20 rounded-lg px-2 py-1 text-white outline-none cursor-pointer"
                                >
                                  {(['discovery', 'planning', 'design', 'development', 'review', 'launch', 'completed'] as ClientProjectStatus[]).map((st) => (
                                    <option key={st} value={st}>
                                      Set: {STATUS_CONFIG[st].label}
                                    </option>
                                  ))}
                                </select>
                              )}
                            </div>
                          </div>

                          {/* Progress Bar (0 to 100%) */}
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs font-mono">
                              <span className="text-[#A1A1AA] uppercase tracking-wider">Overall Sprint Progress</span>
                              <span className="text-white font-bold">{project.progress}%</span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-white/[0.08] overflow-hidden">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-[#2563EB] via-[var(--hero-accent)] to-emerald-400 transition-all duration-500"
                                style={{ width: `${project.progress}%` }}
                              />
                            </div>
                          </div>

                          {/* Sprint Details Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-1">
                              <span className="text-[10px] font-mono uppercase text-[#71717A] block">Current Sprint</span>
                              <span className="text-xs font-bold text-white block">{project.currentSprint || 'Sprint 1: Architecture'}</span>
                            </div>
                            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-1">
                              <span className="text-[10px] font-mono uppercase text-[#71717A] block">Next Milestone</span>
                              <span className="text-xs font-bold text-emerald-400 block">{project.nextMilestone || 'Phone Staging Review'}</span>
                            </div>
                            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-1">
                              <span className="text-[10px] font-mono uppercase text-[#71717A] block">Target Handover</span>
                              <span className="text-xs font-bold text-white block">{project.deadline || '7–14 Business Days'}</span>
                            </div>
                          </div>

                          {/* Recent Update Note */}
                          {project.recentUpdate && (
                            <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 text-xs text-[#D4D4D8] space-y-1">
                              <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block">
                                Latest Sprint Update
                              </span>
                              <p className="leading-relaxed">{project.recentUpdate}</p>
                            </div>
                          )}

                          {/* Deliverables Checklist */}
                          {project.deliverables && project.deliverables.length > 0 && (
                            <div className="space-y-2 pt-2 border-t border-white/[0.08]">
                              <span className="text-[11px] font-mono uppercase text-[#A1A1AA] font-bold block">
                                Deliverables Scope Checklist
                              </span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {project.deliverables.map((del: string, dIdx: number) => (
                                  <div key={dIdx} className="flex items-center gap-2 text-xs text-[#E4E4E7]">
                                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                    <span>{del}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Staging Link Action */}
                          {project.liveStagingUrl && (
                            <div className="pt-2 flex items-center justify-between text-xs">
                              <span className="text-[#A1A1AA] font-mono">Private Staging Environment Ready</span>
                              <a
                                href={project.liveStagingUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="glass-btn-primary px-4 py-2 text-xs text-white"
                              >
                                <Smartphone className="w-3.5 h-3.5" />
                                <span>Open Phone Staging Preview</span>
                                <ExternalLink className="w-3 h-3 ml-1" />
                              </a>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: INQUIRIES & SUBMITTED BRIEFS */}
            {activeTab === 'inquiries' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                  <div>
                    <h4 className="text-sm font-black text-white font-mono uppercase tracking-wider">
                      Submitted Project Briefs
                    </h4>
                    <p className="text-xs text-[#A1A1AA]">
                      All brief submissions are recorded permanently in Cloud Firestore.
                    </p>
                  </div>
                </div>

                {inquiries.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl border border-white/10 bg-white/[0.02] text-xs text-[#A1A1AA]">
                    No inquiries recorded in this session.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {inquiries.map((inq) => (
                      <div
                        key={inq.id}
                        className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-2 text-xs"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <span className="text-white font-bold text-sm">
                            {inq.businessName} ({inq.clientName})
                          </span>
                          <span className="text-[11px] font-mono text-[#A1A1AA]">
                            {new Date(inq.createdAt).toLocaleString()} · ID: {inq.id}
                          </span>
                        </div>
                        <p className="text-[#D4D4D8] leading-relaxed bg-[#0E0E12] p-3 rounded-xl border border-white/[0.05]">
                          {inq.scopeSummary}
                        </p>
                        <div className="flex items-center justify-between pt-1 text-[11px] font-mono">
                          <span className="text-[#A1A1AA]">
                            Contact: <strong className="text-white">{inq.contactChannel}</strong> · Budget: {inq.targetBudget || 'Negotiable'}
                          </span>
                          <span className="text-emerald-400 font-bold uppercase">
                            Status: {inq.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Modal Footer */}
          <div className="px-6 py-4 border-t border-white/10 bg-white/[0.03] flex items-center justify-between text-xs text-[#A1A1AA]">
            <span className="font-mono">
              AS Studio Client Delivery Guarantee · 100% Code Ownership Handover
            </span>
            <button
              onClick={onClose}
              className="glass-btn px-5 py-2 text-xs uppercase tracking-wider text-white"
            >
              Close Hub
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
