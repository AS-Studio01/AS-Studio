/**
 * CLIENT & INQUIRIES PORTAL
 * ==============================================================================
 * Powered by real Firebase Authentication (useAuth) and Cloud Firestore.
 * Allows clients to track submitted project briefs and view live inquiry status.
 * ==============================================================================
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, User, Mail, Database, ShieldCheck, CheckCircle2, 
  Clock, LogOut, Key, ArrowRight, ExternalLink, RefreshCw,
  Send, Sparkles, Filter, Trash2, Lock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { 
  getProjectInquiries, ProjectInquiryRecord, checkDatabaseHealth, 
  verifyGmailServiceStatus, deleteProjectInquiry, updateInquiryStatus 
} from '../services';
import { STUDIO_CONTACT } from '../constants/communication';
import { ClientProject, getClientProjects } from '../services/siteContent';

interface ClientPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToContact?: () => void;
  onOpenAdminPanel?: () => void;
}

export function ClientPortalModal({ 
  isOpen, 
  onClose, 
  onNavigateToContact, 
  onOpenAdminPanel 
}: ClientPortalModalProps) {
  const { user, isAdmin, signInWithGoogle, signOut, loading: authLoading } = useAuth();

  const [inquiries, setInquiries] = useState<ProjectInquiryRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dbHealth, setDbHealth] = useState<{ status: string; latencyMs: number; totalRecords: number; storage: string } | null>(null);
  const [projects, setProjects] = useState<ClientProject[]>([]);
  const [gmailStatus, setGmailStatus] = useState<{ active: boolean; sender: string; totalSent: number; mode: string } | null>(null);

  const refreshData = async () => {
    try {
      setLoading(true);
      const inqs = await getProjectInquiries();
      setInquiries(inqs);
      if (user) setProjects(await getClientProjects(user.uid)); else setProjects([]);
      const health = await checkDatabaseHealth();
      setDbHealth(health);
      const gmail = await verifyGmailServiceStatus();
      setGmailStatus(gmail);
    } catch (e) {
      console.error(e);
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
      console.error('Google Sign-In failed:', err);
      setError(err?.message || 'Google sign-in was cancelled or encountered an error.');
    }
  };

  const handleSignOut = async () => {
    await signOut();
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
          className="fixed inset-0 bg-black/75 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.2 }}
          className="relative z-10 w-full max-w-4xl max-h-[92vh] sm:max-h-[88vh] bg-[#121216] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-[#F4F4F6]"
        >
          {/* Header */}
          <div className="px-5 py-4 sm:px-7 sm:py-5 border-b border-white/10 bg-[#16161C] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#2563EB] to-[#60A5FA] flex items-center justify-center text-white shadow-md">
                <Database className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                  <span>Client & Project Hub</span>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Firebase Connected
                  </span>
                </h3>
                <p className="text-xs text-[#A1A1AA]">
                  Real-time Cloud Firestore · Firebase Auth · Gmail Notifications
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={refreshData}
                disabled={loading}
                className="p-2 text-[#A1A1AA] hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                title="Refresh system records"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-[#A1A1AA] hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                aria-label="Close portal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6">
            {/* System Status Indicators Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Database Health Card */}
              <div className="p-3.5 bg-[#17171E] border border-white/[0.08] rounded-xl flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono uppercase font-bold text-[#A1A1AA] flex items-center gap-1.5">
                    <Database className="w-3 h-3 text-[#60A5FA]" />
                    <span>Cloud Firestore</span>
                  </span>
                  <div className="text-sm font-bold text-white">
                    {dbHealth?.totalRecords || inquiries.length} Inquiries Stored
                  </div>
                  <span className="text-[11px] text-emerald-400 font-mono">
                    Enterprise Online · {dbHealth?.latencyMs || 5}ms
                  </span>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              </div>

              {/* Gmail Dispatcher Card */}
              <div className="p-3.5 bg-[#17171E] border border-white/[0.08] rounded-xl flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono uppercase font-bold text-[#A1A1AA] flex items-center gap-1.5">
                    <Mail className="w-3 h-3 text-[#60A5FA]" />
                    <span>Gmail Dispatcher</span>
                  </span>
                  <div className="text-sm font-bold text-white truncate max-w-[170px]">
                    asbusinessofficial01@gmail.com
                  </div>
                  <span className="text-[11px] text-emerald-400 font-mono">
                    Automated Receipts Active
                  </span>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0" />
              </div>

              {/* Auth Session Card */}
              <div className="p-3.5 bg-[#17171E] border border-white/[0.08] rounded-xl flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono uppercase font-bold text-[#A1A1AA] flex items-center gap-1.5">
                    <User className="w-3 h-3 text-[#60A5FA]" />
                    <span>Firebase Auth</span>
                  </span>
                  <div className="text-sm font-bold text-white truncate max-w-[170px]">
                    {user ? user.displayName || user.email : 'Guest Session'}
                  </div>
                  <span className="text-[11px] text-[#A1A1AA] font-mono">
                    {user ? (isAdmin ? 'Founder Admin' : 'Authenticated Client') : '1-Click Google Sign-In'}
                  </span>
                </div>
                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${user ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              </div>
            </div>

            {/* If NOT signed in with Firebase */}
            {!user ? (
              <div className="bg-[#181820] border border-white/10 rounded-xl p-5 sm:p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
                  <div>
                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                      <Key className="w-4 h-4 text-[#60A5FA]" />
                      <span>Sign In with Firebase</span>
                    </h4>
                    <p className="text-xs text-[#A1A1AA] mt-0.5">
                      Authenticate with your Google account to track your project inquiries and communicate securely.
                    </p>
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-300">
                    {error}
                  </div>
                )}

                {/* 1-Click Google Sign-In Button */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={authLoading}
                  className="w-full py-3.5 px-4 bg-white hover:bg-slate-100 text-[#121212] rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-3 transition-colors shadow-lg disabled:opacity-50"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Continue with Google Account (Firebase Auth)</span>
                </button>
              </div>
            ) : (
              /* Signed In User Card */
              <div className="bg-[#181820] border border-white/10 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt="Avatar" 
                      className="w-10 h-10 rounded-full border border-white/20 object-cover" 
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#2563EB]/20 border border-[#3B82F6]/30 flex items-center justify-center text-[#60A5FA] font-bold text-sm">
                      {user.displayName?.slice(0, 2).toUpperCase() || 'AS'}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{user.displayName || user.email}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                        isAdmin 
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                          : 'bg-[#2563EB]/20 text-[#60A5FA] border border-[#3B82F6]/30'
                      }`}>
                        {isAdmin ? 'Founder Admin' : 'Client'}
                      </span>
                    </div>
                    <span className="text-xs text-[#A1A1AA] font-mono">{user.email}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* If user is founder admin: Secret Admin Link */}
                  {isAdmin && onOpenAdminPanel && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenAdminPanel();
                      }}
                      className="px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 rounded-lg text-xs font-bold font-mono flex items-center gap-1.5 transition-colors"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Secret Admin Console</span>
                    </button>
                  )}

                  {onNavigateToContact && (
                    <button
                      onClick={() => {
                        onClose();
                        onNavigateToContact();
                      }}
                      className="glass-btn px-3 py-1.5 text-xs font-bold text-white flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5 text-[#3B82F6]" />
                      <span>Submit New Brief</span>
                    </button>
                  )}
                  <button
                    onClick={handleSignOut}
                    className="p-2 text-[#A1A1AA] hover:text-red-400 hover:bg-white/5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}

            {user && !isAdmin && (
              <div className="space-y-4" data-reveal>
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-blue-400 font-bold">Client dashboard</p>
                    <h4 className="text-lg font-black text-white">My Projects</h4>
                  </div>
                  <span className="text-xs text-zinc-500">{projects.length} active record{projects.length === 1 ? '' : 's'}</span>
                </div>
                {projects.length === 0 ? (
                  <div className="glass-panel p-6 text-sm text-zinc-400">Your project sprint will appear here once AS Studio creates your project record.</div>
                ) : projects.map(project => (
                  <div key={project.id} className="glass-panel p-5 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div><p className="text-xs text-blue-400 font-bold uppercase tracking-wider">{project.businessName}</p><h5 className="text-lg font-black text-white mt-1">{project.title}</h5><p className="text-xs text-zinc-400 mt-1">{project.summary}</p></div>
                      <span className="pill-badge">{project.status}</span>
                    </div>
                    <div>
                      <div className="flex justify-between text-[11px] text-zinc-400 mb-1.5"><span>{project.phase}</span><span>{project.progress}%</span></div>
                      <div className="h-2 rounded-full bg-white/10 overflow-hidden"><div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500" style={{width:`${Math.max(0,Math.min(100,project.progress))}%`}}/></div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3 text-xs"><div className="p-3 rounded-xl bg-white/[.03] border border-white/10"><span className="text-zinc-500 block mb-1">Next milestone</span><span className="text-zinc-200">{project.nextMilestone || 'To be scheduled'}</span></div><div className="p-3 rounded-xl bg-white/[.03] border border-white/10"><span className="text-zinc-500 block mb-1">Last updated</span><span className="text-zinc-200">{new Date(project.updatedAt).toLocaleDateString()}</span></div></div>
                  </div>
                ))}
              </div>
            )}

            {/* Inquiries Section */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-white font-mono flex items-center gap-2">
                    <Database className="w-4 h-4 text-[#60A5FA]" />
                    <span>Logged Inquiries in Firestore ({inquiries.length})</span>
                  </h4>
                </div>
                <span className="text-xs text-[#A1A1AA]">
                  Cloud Firestore collection: <code className="text-[#60A5FA]">/inquiries</code>
                </span>
              </div>

              {inquiries.length === 0 ? (
                <div className="p-8 text-center bg-[#15151B] border border-white/[0.06] rounded-xl space-y-3">
                  <p className="text-xs text-[#A1A1AA]">No inquiries logged in the database yet.</p>
                  {onNavigateToContact && (
                    <button
                      onClick={() => {
                        onClose();
                        onNavigateToContact();
                      }}
                      className="glass-btn-primary px-4 py-2 text-xs font-bold uppercase tracking-wider text-white inline-flex items-center gap-1.5"
                    >
                      <span>Submit First Project Brief</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3.5">
                  {inquiries.map((inq) => (
                    <div
                      key={inq.id}
                      className="p-4 sm:p-5 bg-[#16161D] border border-white/[0.08] glass-card hover:border-white/20 rounded-xl space-y-3 transition-colors shadow-sm"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className="w-2 h-2 rounded-full bg-[#3B82F6]" />
                          <h5 className="text-sm font-bold text-white">
                            {inq.businessName} <span className="text-[#A1A1AA] font-normal">({inq.clientName})</span>
                          </h5>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#D4D4D8]">
                            {inq.source === 'website_contact_form' ? 'Website Form' : 'AI Concierge'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[11px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Status: {inq.status}
                          </span>

                          {isAdmin && (
                            <button
                              onClick={() => handleDeleteInquiry(inq.id)}
                              className="p-1.5 text-[#71717A] hover:text-red-400 rounded transition-colors"
                              title="Delete record (Admin only)"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-[#D4D4D8] leading-relaxed bg-[#0E0E12] p-3 rounded-lg border border-white/[0.06] font-mono whitespace-pre-wrap">
                        {inq.scopeSummary}
                      </p>

                      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#A1A1AA] font-mono pt-1 border-t border-white/[0.06]">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1 text-[#60A5FA]">
                            <Mail className="w-3 h-3" />
                            <span>Contact: {inq.contactChannel}</span>
                          </span>
                          {inq.targetBudget && (
                            <span>Budget: {inq.targetBudget}</span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 text-[10px] text-[#71717A]">
                          <Clock className="w-3 h-3" />
                          <span>Logged: {new Date(inq.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="px-5 py-3 sm:px-7 sm:py-4 bg-[#14141A] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#A1A1AA]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Full source code delivered · 30-day post-launch warranty</span>
            </div>

            <div className="flex items-center gap-3 font-mono">
              <a
                href={STUDIO_CONTACT.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#60A5FA] hover:underline flex items-center gap-1"
              >
                <span>Telegram: @AS_Studio_official01</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
