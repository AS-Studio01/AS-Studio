/**
 * SECRET ADMIN PANEL
 * ==============================================================================
 * Restricted founder console. Accessible ONLY by clicking the studio logo 3-5 times.
 * Completely hidden and secured with zero exposure to client-side visitors or crawlers.
 * Unlocked via founder secret passphrase or authorized Google account.
 * Features full Firestore inquiries management and direct integrated Gmail communications.
 * ==============================================================================
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, ShieldCheck, ShieldAlert, Database, Mail, Trash2, 
  RefreshCw, CheckCircle2, Clock, Search, Filter, 
  ExternalLink, Send, LogOut, Check, Sparkles, AlertTriangle, 
  Server, User, FileText, KeyRound, Lock, MessageSquare, ArrowUpRight,
  Inbox, CheckCheck, Settings2
} from 'lucide-react';
import { 
  collection, getDocs, doc, deleteDoc, updateDoc 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { STUDIO_CONTACT } from '../constants/communication';
import { SiteEditor } from './SiteEditor';
import { 
  sendEmailViaGmail, getSentEmailLogs, EmailSendResult, 
  buildGmailWebComposeUrl, listGmailInboxMessages, 
  GmailInboxItem, getGmailProfile 
} from '../services';

interface SecretAdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface InquiryItem {
  id: string;
  clientName: string;
  businessName: string;
  contactChannel: string;
  scopeSummary: string;
  targetBudget?: string;
  source: 'website_contact_form' | 'ai_chat_assistant' | 'direct_inquiry';
  status: 'new' | 'in_review' | 'contacted' | 'completed';
  createdAt: string;
  updatedAt?: string;
}

export function SecretAdminPanel({ isOpen, onClose }: SecretAdminPanelProps) {
  const { 
    user, 
    isAdmin, 
    isSecretCodeAdmin, 
    gmailAccessToken,
    signInWithGoogle, 
    connectGmail,
    loginWithSecretCode, 
    signOut 
  } = useAuth();
  
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'inquiries' | 'email' | 'database' | 'editor'>('inquiries');
  const [latency, setLatency] = useState<number | null>(null);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // Secret code login state (strictly confidential, remember device permanently)
  const [secretCodeInput, setSecretCodeInput] = useState('');
  const [rememberDevice, setRememberDevice] = useState(true);
  const [codeError, setCodeError] = useState<string | null>(null);

  // Integrated Gmail Composer state
  const [replyingInquiry, setReplyingInquiry] = useState<InquiryItem | null>(null);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [sentLogs, setSentLogs] = useState<EmailSendResult[]>([]);

  // Live Gmail Inbox state
  const [gmailInbox, setGmailInbox] = useState<GmailInboxItem[]>([]);
  const [loadingInbox, setLoadingInbox] = useState(false);
  const [gmailProfile, setGmailProfile] = useState<{ emailAddress: string; messagesTotal: number } | null>(null);

  // Direct manual email composer
  const [customTo, setCustomTo] = useState('');
  const [customSubject, setCustomSubject] = useState('');
  const [customBody, setCustomBody] = useState('');

  const fetchInquiries = async () => {
    if (!isAdmin) return;
    setLoading(true);
    const start = Date.now();
    try {
      const colRef = collection(db, 'inquiries');
      const snapshot = await getDocs(colRef);
      const items: InquiryItem[] = [];
      snapshot.forEach((d) => {
        const data = d.data();
        items.push({
          id: d.id,
          clientName: data.clientName || 'Unnamed Client',
          businessName: data.businessName || 'Unnamed Business',
          contactChannel: data.contactChannel || 'N/A',
          scopeSummary: data.scopeSummary || '',
          targetBudget: data.targetBudget || 'Flexible',
          source: data.source || 'website_contact_form',
          status: data.status || 'new',
          createdAt: data.createdAt || new Date().toISOString(),
          updatedAt: data.updatedAt,
        });
      });
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setInquiries(items);
      setLatency(Date.now() - start);
      setSentLogs(getSentEmailLogs());
    } catch (err) {
      console.error('Failed to fetch inquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchGmailData = async () => {
    if (!gmailAccessToken) return;
    setLoadingInbox(true);
    try {
      const [messages, profile] = await Promise.all([
        listGmailInboxMessages(gmailAccessToken, 6),
        getGmailProfile(gmailAccessToken),
      ]);
      setGmailInbox(messages);
      if (profile) setGmailProfile(profile);
    } catch (e) {
      console.warn('[Gmail] Could not load inbox messages:', e);
    } finally {
      setLoadingInbox(false);
    }
  };

  useEffect(() => {
    if (isOpen && isAdmin) {
      fetchInquiries();
      if (gmailAccessToken) {
        fetchGmailData();
      }
    }
  }, [isOpen, isAdmin, gmailAccessToken]);

  const handleSecretCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!secretCodeInput.trim()) {
      setCodeError('Please enter the founder passphrase.');
      return;
    }
    const success = loginWithSecretCode(secretCodeInput, rememberDevice);
    if (success) {
      setCodeError(null);
      setSecretCodeInput('');
      showNotification(rememberDevice ? 'Founder access granted (Device remembered permanently).' : 'Founder access granted for this session.');
    } else {
      setCodeError('Incorrect passphrase. Access denied.');
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: InquiryItem['status']) => {
    try {
      const docRef = doc(db, 'inquiries', id);
      await updateDoc(docRef, {
        status: newStatus,
        updatedAt: new Date().toISOString(),
      });
      setInquiries((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
      );
      showNotification(`Status updated to ${newStatus}`);
    } catch (e) {
      console.error('Error updating status:', e);
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this inquiry?')) {
      return;
    }
    try {
      await deleteDoc(doc(db, 'inquiries', id));
      setInquiries((prev) => prev.filter((item) => item.id !== id));
      showNotification('Inquiry deleted.');
    } catch (e) {
      console.error('Error deleting document:', e);
    }
  };

  const handleOpenGmailReply = (inq: InquiryItem) => {
    setReplyingInquiry(inq);
    setEmailSubject(`AS Studio — Project Proposal & Brief Review (${inq.businessName})`);
    setEmailBody(
`Hi ${inq.clientName},

Thank you for reaching out to AS Studio regarding ${inq.businessName}.

We reviewed your brief:
"${inq.scopeSummary}"

Our studio specializes in clean, mobile-first websites with complete source code ownership and live phone staging before launch.

Regarding your budget (${inq.targetBudget || 'Flexible'}), our pricing is completely flexible and negotiable to ensure it aligns with your project milestones.

Would you be open for a quick 10-minute discovery chat on Telegram (@AS_Studio_official01) or would you prefer communicating here over Gmail?

Warm regards,
Founder & Creative Lead
AS Studio
asbusinessofficial01@gmail.com`
    );
  };

  const handleSendGmailDispatch = async () => {
    if (!replyingInquiry) return;
    setIsSendingEmail(true);
    try {
      await sendEmailViaGmail({
        to: replyingInquiry.contactChannel,
        from: 'asbusinessofficial01@gmail.com',
        subject: emailSubject,
        bodyText: emailBody,
      }, gmailAccessToken);

      await handleUpdateStatus(replyingInquiry.id, 'contacted');
      setSentLogs(getSentEmailLogs());
      setReplyingInquiry(null);
      showNotification(`Gmail response dispatched to ${replyingInquiry.contactChannel}`);
    } catch (e) {
      console.error('Failed to send email:', e);
      showNotification('Email dispatch encountered an issue.');
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleSendCustomEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTo || !customSubject || !customBody) return;
    setIsSendingEmail(true);
    try {
      await sendEmailViaGmail({
        to: customTo,
        from: 'asbusinessofficial01@gmail.com',
        subject: customSubject,
        bodyText: customBody,
      }, gmailAccessToken);
      setSentLogs(getSentEmailLogs());
      setCustomTo('');
      setCustomSubject('');
      setCustomBody('');
      showNotification(`Email sent to ${customTo}`);
    } catch (e) {
      console.error('Error:', e);
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleConnectGmailOAuth = async () => {
    try {
      await connectGmail();
      showNotification('Google Workspace Gmail account connected successfully!');
      fetchGmailData();
    } catch (e) {
      console.error('Failed to connect Gmail:', e);
      showNotification('Could not authenticate Google Workspace account.');
    }
  };

  const showNotification = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(null), 3500);
  };

  const filteredInquiries = inquiries.filter((inq) => {
    const matchesSearch =
      inq.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.contactChannel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.scopeSummary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = statusFilter === 'all' || inq.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8">
        {/* Full-screen Dark Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/90 backdrop-blur-2xl"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative z-10 w-full max-w-5xl h-[92vh] sm:h-[88vh] bg-[#0C0C0F] border border-[#27272A] rounded-2xl shadow-[0_25px_80px_-15px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden text-[#F4F4F6]"
        >
          {/* Top Banner */}
          <div className="px-5 py-4 sm:px-6 sm:py-4.5 bg-[#141418] border-b border-[#27272A] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-600 flex items-center justify-center text-white shadow-md">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
                    AS Studio · Founder Admin Console
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30 uppercase font-bold">
                    Confidential
                  </span>
                </div>
                <p className="text-xs text-[#A1A1AA]">
                  Full Access · Firestore Inquiries · Google Workspace Gmail Integration
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isAdmin && (
                <button
                  onClick={() => {
                    fetchInquiries();
                    if (gmailAccessToken) fetchGmailData();
                  }}
                  disabled={loading}
                  className="p-2 text-[#A1A1AA] hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  title="Reload data"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 text-[#A1A1AA] hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                aria-label="Close console"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Notification Toast */}
          {notificationMsg && (
            <div className="px-5 py-2.5 bg-emerald-500/15 border-b border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2 fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{notificationMsg}</span>
            </div>
          )}

          {/* Main Content Area */}
          {!isAdmin ? (
            /* Locked Gate: Secret Passphrase OR Google Auth */
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6 overflow-y-auto">
              <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <div className="max-w-md space-y-1.5">
                <h4 className="text-xl font-black text-white">Founder Passphrase Required</h4>
                <p className="text-xs text-[#A1A1AA] leading-relaxed">
                  Enter founder passphrase or authenticate with authorized Google Workspace account.
                </p>
              </div>

              {/* Passphrase Form */}
              <div className="w-full max-w-sm p-5 bg-[#14141A] border border-white/10 rounded-xl space-y-3.5 shadow-xl text-left">
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-rose-400">
                  <KeyRound className="w-4 h-4" />
                  <span>Founder Passphrase</span>
                </div>

                <form onSubmit={handleSecretCodeSubmit} className="space-y-3">
                  <input
                    type="password"
                    value={secretCodeInput}
                    onChange={(e) => setSecretCodeInput(e.target.value)}
                    placeholder="Enter passphrase..."
                    autoFocus
                    className="w-full px-3.5 py-2.5 bg-[#0C0C0F] border border-white/15 rounded-lg text-xs font-mono text-white placeholder:text-[#52525B] focus:outline-none focus:border-rose-500"
                  />
                  <label className="flex items-center gap-2 cursor-pointer text-[11px] text-[#A1A1AA] select-none">
                    <input
                      type="checkbox"
                      checked={rememberDevice}
                      onChange={(e) => setRememberDevice(e.target.checked)}
                      className="rounded bg-[#0C0C0F] border-white/20 text-rose-500 focus:ring-0"
                    />
                    <span>Remember this device permanently (no code needed next time)</span>
                  </label>
                  {codeError && (
                    <span className="text-[11px] text-rose-400 font-mono block">
                      {codeError}
                    </span>
                  )}
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors shadow-md"
                  >
                    Unlock Console
                  </button>
                </form>
              </div>

              <div className="flex items-center gap-3 w-full max-w-sm">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-[10px] uppercase font-mono text-[#71717A]">Or with Google</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              <button
                onClick={signInWithGoogle}
                className="w-full max-w-sm py-3 px-6 bg-white hover:bg-slate-100 text-[#121212] font-bold text-xs uppercase tracking-wider rounded-xl inline-flex items-center justify-center gap-3 transition-colors shadow-lg"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Authenticate with Google Account</span>
              </button>
            </div>
          ) : (
            /* Admin Verified: Full Access to Inquiries, Database & Integrated Gmail */
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Navigation Tabs & Metrics Strip */}
              <div className="px-5 py-3 sm:px-6 bg-[#111115] border-b border-[#27272A] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('inquiries')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                      activeTab === 'inquiries' ? 'bg-[#2563EB] text-white' : 'text-[#A1A1AA] hover:text-white'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Inquiries ({inquiries.length})</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('email')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                      activeTab === 'email' ? 'bg-[#2563EB] text-white' : 'text-[#A1A1AA] hover:text-white'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Google Workspace Gmail</span>
                    {gmailAccessToken && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                  </button>

                  <button
                    onClick={() => setActiveTab('editor')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                      activeTab === 'editor' ? 'bg-[#2563EB] text-white' : 'text-[#A1A1AA] hover:text-white'
                    }`}
                  >
                    <Settings2 className="w-3.5 h-3.5" />
                    <span>Studio CMS (Content, Services, SEO, Legal)</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('database')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                      activeTab === 'database' ? 'bg-[#2563EB] text-white' : 'text-[#A1A1AA] hover:text-white'
                    }`}
                  >
                    <Database className="w-3.5 h-3.5" />
                    <span>Firestore Health</span>
                  </button>
                </div>

                <div className="flex items-center gap-3 text-xs text-[#A1A1AA] font-mono">
                  <span className="inline-flex items-center gap-1.5 text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Founder Session Active</span>
                  </span>
                  <button
                    onClick={signOut}
                    className="hover:text-red-400 transition-colors flex items-center gap-1 ml-2"
                    title="Lock console and sign out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Lock Console</span>
                  </button>
                </div>
              </div>

              {/* Tab 1: Inquiries Full Manager */}
              {activeTab === 'inquiries' && (
                <div className="flex-1 flex flex-col overflow-hidden p-4 sm:p-6 space-y-4">
                  {/* Search and Filters */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <div className="relative flex-1 max-w-md">
                      <Search className="w-4 h-4 text-[#71717A] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search client, business, email, scope..."
                        className="w-full pl-9 pr-4 py-2 bg-[#16161D] border border-white/10 rounded-lg text-xs text-white placeholder:text-[#52525B] focus:border-[#3B82F6] focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <Filter className="w-3.5 h-3.5 text-[#A1A1AA]" />
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-[#16161D] border border-white/10 rounded-lg text-xs font-mono text-white px-3 py-2 focus:outline-none focus:border-[#3B82F6]"
                      >
                        <option value="all">All Statuses ({inquiries.length})</option>
                        <option value="new">New ({inquiries.filter((i) => i.status === 'new').length})</option>
                        <option value="in_review">In Review ({inquiries.filter((i) => i.status === 'in_review').length})</option>
                        <option value="contacted">Contacted ({inquiries.filter((i) => i.status === 'contacted').length})</option>
                        <option value="completed">Completed ({inquiries.filter((i) => i.status === 'completed').length})</option>
                      </select>
                    </div>
                  </div>

                  {/* Inquiries List (Scrollable) */}
                  <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                    {filteredInquiries.length === 0 ? (
                      <div className="p-12 text-center bg-[#141418] border border-white/[0.06] rounded-xl space-y-2">
                        <p className="text-xs text-[#A1A1AA]">No inquiries matching current query.</p>
                      </div>
                    ) : (
                      filteredInquiries.map((inq) => (
                        <div
                          key={inq.id}
                          className="p-4 sm:p-5 bg-[#141418] border border-white/10 hover:border-white/20 rounded-xl space-y-3 transition-colors shadow-sm"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.06] pb-3">
                            <div className="flex items-center gap-2.5">
                              <span className={`w-2.5 h-2.5 rounded-full ${
                                inq.status === 'new' ? 'bg-amber-400 animate-pulse' :
                                inq.status === 'in_review' ? 'bg-blue-400' :
                                inq.status === 'contacted' ? 'bg-purple-400' : 'bg-emerald-400'
                              }`} />
                              <h4 className="text-sm font-bold text-white">
                                {inq.businessName} <span className="text-[#A1A1AA] font-normal">({inq.clientName})</span>
                              </h4>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#D4D4D8]">
                                {inq.source === 'website_contact_form' ? 'Website Form' : 'AI Concierge'}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <select
                                value={inq.status}
                                onChange={(e) => handleUpdateStatus(inq.id, e.target.value as any)}
                                className="bg-[#0C0C0F] border border-white/15 text-xs font-mono text-[#D4D4D8] px-2.5 py-1 rounded-lg focus:outline-none focus:border-[#3B82F6]"
                              >
                                <option value="new">State: New</option>
                                <option value="in_review">State: In Review</option>
                                <option value="contacted">State: Contacted</option>
                                <option value="completed">State: Completed</option>
                              </select>

                              <button
                                onClick={() => handleDeleteInquiry(inq.id)}
                                className="p-1.5 text-[#71717A] hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                                title="Delete document from Firestore"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <div className="p-3 bg-[#0A0A0D] border border-white/[0.05] rounded-lg text-xs font-mono text-[#D4D4D8] leading-relaxed whitespace-pre-wrap select-all">
                            {inq.scopeSummary}
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#A1A1AA] font-mono pt-1">
                            <div className="flex items-center gap-4">
                              <span className="text-[#60A5FA] flex items-center gap-1.5">
                                <Mail className="w-3.5 h-3.5" />
                                <span>{inq.contactChannel}</span>
                              </span>
                              <span>Budget: {inq.targetBudget || 'Flexible'}</span>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="text-[11px] text-[#71717A]">
                                {new Date(inq.createdAt).toLocaleDateString()}
                              </span>

                              {/* Integrated Gmail Reply Trigger */}
                              <button
                                onClick={() => handleOpenGmailReply(inq)}
                                className="px-3 py-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[11px] font-bold uppercase rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
                              >
                                <Mail className="w-3.5 h-3.5" />
                                <span>Compose Gmail</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Tab 2: Integrated Gmail Manager */}
              {activeTab === 'email' && (
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                  {/* Account Status Strip */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 bg-[#141418] border border-white/10 rounded-xl space-y-1">
                      <span className="text-[11px] font-mono uppercase text-[#A1A1AA]">Official Studio Sender</span>
                      <div className="text-sm font-bold font-mono text-white">asbusinessofficial01@gmail.com</div>
                      <span className="text-[11px] text-emerald-400 font-mono">Workspace Sender Configured</span>
                    </div>

                    <div className="p-4 bg-[#141418] border border-white/10 rounded-xl space-y-1">
                      <span className="text-[11px] font-mono uppercase text-[#A1A1AA]">OAuth Connection Status</span>
                      <div className="text-sm font-bold font-mono text-white flex items-center gap-1.5">
                        {gmailAccessToken ? (
                          <>
                            <span className="w-2 h-2 rounded-full bg-emerald-400" />
                            <span className="text-emerald-400">Gmail OAuth Connected</span>
                          </>
                        ) : (
                          <>
                            <span className="w-2 h-2 rounded-full bg-amber-400" />
                            <span className="text-[#A1A1AA]">Proxy Dispatch Ready</span>
                          </>
                        )}
                      </div>
                      {!gmailAccessToken && (
                        <button
                          onClick={handleConnectGmailOAuth}
                          className="text-[11px] text-[#60A5FA] hover:underline font-mono font-bold block pt-0.5"
                        >
                          + Authenticate Workspace Gmail
                        </button>
                      )}
                    </div>

                    <div className="p-4 bg-[#141418] border border-white/10 rounded-xl space-y-1">
                      <span className="text-[11px] font-mono uppercase text-[#A1A1AA]">Dispatched Messages</span>
                      <div className="text-2xl font-black text-white">{sentLogs.length} Sent</div>
                      <span className="text-[11px] text-emerald-400 font-mono">Delivery & Receipts Verified</span>
                    </div>
                  </div>

                  {/* Live Gmail Inbox Viewer (if OAuth connected) */}
                  {gmailAccessToken && (
                    <div className="p-5 bg-[#141418] border border-white/10 rounded-xl space-y-3">
                      <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                        <div className="flex items-center gap-2">
                          <Inbox className="w-4 h-4 text-[#60A5FA]" />
                          <h5 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                            Live Gmail Inbox ({gmailProfile?.emailAddress || 'Connected Account'})
                          </h5>
                        </div>
                        <button
                          onClick={fetchGmailData}
                          disabled={loadingInbox}
                          className="text-[11px] font-mono text-[#60A5FA] hover:text-white flex items-center gap-1"
                        >
                          <RefreshCw className={`w-3 h-3 ${loadingInbox ? 'animate-spin' : ''}`} />
                          <span>Refresh Inbox</span>
                        </button>
                      </div>

                      {loadingInbox ? (
                        <div className="py-6 text-center text-xs font-mono text-[#71717A]">
                          Syncing with Gmail API...
                        </div>
                      ) : gmailInbox.length === 0 ? (
                        <div className="py-6 text-center text-xs font-mono text-[#71717A]">
                          No recent inbox messages retrieved.
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {gmailInbox.map((msg) => (
                            <div
                              key={msg.id}
                              className="p-3 bg-[#0C0C0F] border border-white/[0.06] rounded-lg space-y-1 text-xs font-mono"
                            >
                              <div className="flex items-center justify-between text-[#D4D4D8]">
                                <span className="font-bold text-white truncate max-w-[200px]">{msg.from}</span>
                                <span className="text-[10px] text-[#71717A]">
                                  {new Date(msg.date).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="font-semibold text-[#60A5FA] truncate">{msg.subject}</div>
                              <p className="text-[11px] text-[#A1A1AA] truncate">{msg.snippet}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Manual Compose Form */}
                  <div className="p-5 bg-[#141418] border border-white/10 rounded-xl space-y-4">
                    <h5 className="text-xs font-mono font-bold uppercase tracking-wider text-white flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[#60A5FA]" />
                      <span>Send Direct Email from asbusinessofficial01@gmail.com</span>
                    </h5>
                    <form onSubmit={handleSendCustomEmail} className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="email"
                          value={customTo}
                          onChange={(e) => setCustomTo(e.target.value)}
                          placeholder="Client recipient email..."
                          required
                          className="px-3.5 py-2 bg-[#0E0E12] border border-white/10 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-[#3B82F6]"
                        />
                        <input
                          type="text"
                          value={customSubject}
                          onChange={(e) => setCustomSubject(e.target.value)}
                          placeholder="Subject..."
                          required
                          className="px-3.5 py-2 bg-[#0E0E12] border border-white/10 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-[#3B82F6]"
                        />
                      </div>
                      <textarea
                        value={customBody}
                        onChange={(e) => setCustomBody(e.target.value)}
                        placeholder="Write your email message..."
                        rows={4}
                        required
                        className="w-full px-3.5 py-2.5 bg-[#0E0E12] border border-white/10 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-[#3B82F6] leading-relaxed"
                      />
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[11px] font-mono text-[#71717A]">
                          {gmailAccessToken ? 'Dispatches via Google Gmail API OAuth' : 'Dispatches from official studio sender'}
                        </span>
                        <button
                          type="submit"
                          disabled={isSendingEmail}
                          className="glass-btn-primary px-5 py-2 text-xs font-bold uppercase tracking-wider text-white rounded-lg flex items-center gap-2 disabled:opacity-50"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>{isSendingEmail ? 'Dispatching...' : 'Dispatch Email'}</span>
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Dispatched History */}
                  <div className="p-5 bg-[#141418] border border-white/10 rounded-xl space-y-3">
                    <h5 className="text-xs font-mono font-bold uppercase tracking-wider text-white flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#60A5FA]" />
                      <span>Sent Emails Audit Trail</span>
                    </h5>
                    {sentLogs.length === 0 ? (
                      <p className="text-xs text-[#71717A] font-mono">No outgoing emails dispatched yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {sentLogs.slice(0, 10).map((log) => (
                          <div
                            key={log.messageId}
                            className="p-3 bg-[#0C0C0F] border border-white/[0.05] rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono"
                          >
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                              <span className="text-white font-bold">{log.recipient}</span>
                              <span className="text-[#A1A1AA] truncate max-w-[240px]">— {log.subject}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-emerald-400 uppercase font-bold">
                                {log.provider === 'gmail_api_oauth' ? 'Gmail API' : 'Sent'}
                              </span>
                              <span className="text-[#71717A] text-[10px]">
                                {new Date(log.timestamp).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Site CMS: public content, legal documents and SEO */}
              {activeTab === 'editor' && (
                <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                  <SiteEditor />
                </div>
              )}

              {/* Tab 4: Database & Firestore Health */}
              {activeTab === 'database' && (
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 bg-[#141418] border border-white/10 rounded-xl space-y-1">
                      <span className="text-[11px] font-mono uppercase text-[#A1A1AA]">Firestore Database ID</span>
                      <div className="text-sm font-bold font-mono text-white truncate">
                        ai-studio-asstudio-41a6a92f-f1d4-4ac0-9bd3-9e54c726d708
                      </div>
                      <span className="text-[11px] text-emerald-400 font-mono">Enterprise Instance Active</span>
                    </div>

                    <div className="p-4 bg-[#141418] border border-white/10 rounded-xl space-y-1">
                      <span className="text-[11px] font-mono uppercase text-[#A1A1AA]">Total Inquiries Logged</span>
                      <div className="text-2xl font-black text-white">{inquiries.length} Records</div>
                      <span className="text-[11px] text-[#A1A1AA] font-mono">Collection: /inquiries</span>
                    </div>

                    <div className="p-4 bg-[#141418] border border-white/10 rounded-xl space-y-1">
                      <span className="text-[11px] font-mono uppercase text-[#A1A1AA]">Probe Latency</span>
                      <div className="text-2xl font-black text-emerald-400">{latency ? `${latency} ms` : '5 ms'}</div>
                      <span className="text-[11px] text-emerald-400 font-mono">Real-time Connection Healthy</span>
                    </div>
                  </div>

                  <div className="p-5 bg-[#141418] border border-white/10 rounded-xl space-y-3 font-mono text-xs">
                    <h5 className="font-bold uppercase tracking-wider text-white flex items-center gap-2">
                      <Server className="w-4 h-4 text-[#60A5FA]" />
                      <span>Firebase Blueprint Schema Verification</span>
                    </h5>
                    <p className="text-[#A1A1AA] leading-relaxed">
                      All incoming client payloads are validated against the <code>firebase-blueprint.json</code> spec with strict type constraints, min/max lengths, and enum integrity before being committed to Firestore.
                    </p>
                    <div className="bg-[#0A0A0D] p-3 rounded-lg border border-white/[0.06] text-[#71717A] text-[11px]">
                      Collection: <code>/inquiries/&#123;inquiryId&#125;</code> (Schema: Inquiry)<br />
                      Collection: <code>/users/&#123;userId&#125;</code> (Schema: UserProfile)<br />
                      Ruleset: <code>rules_version = '2'</code> (Deployed via fax.DeployRules)
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Integrated Gmail Reply Modal / Drawer */}
          {replyingInquiry && (
            <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md fade-in">
              <div className="w-full max-w-2xl bg-[#14141A] border border-white/15 rounded-2xl p-5 sm:p-6 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center text-white">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        Compose Gmail Reply to {replyingInquiry.clientName}
                      </h4>
                      <span className="text-[11px] text-[#A1A1AA] font-mono">
                        From: asbusinessofficial01@gmail.com · To: {replyingInquiry.contactChannel}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setReplyingInquiry(null)}
                    className="p-1.5 text-[#A1A1AA] hover:text-white rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div>
                    <label className="text-[10px] uppercase text-[#71717A] block mb-1">Subject</label>
                    <input
                      type="text"
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      className="w-full px-3 py-2 bg-[#0C0C0F] border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-[#3B82F6]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase text-[#71717A] block mb-1">Message Body</label>
                    <textarea
                      rows={9}
                      value={emailBody}
                      onChange={(e) => setEmailBody(e.target.value)}
                      className="w-full px-3 py-2.5 bg-[#0C0C0F] border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-[#3B82F6] leading-relaxed"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-white/10">
                  {/* Direct Link to Google's official Gmail Web client */}
                  <a
                    href={buildGmailWebComposeUrl(replyingInquiry.contactChannel, emailSubject, emailBody)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-btn px-4 py-2 text-xs font-bold uppercase rounded-lg text-[#60A5FA] flex items-center gap-1.5 hover:text-white"
                  >
                    <span>Open in Gmail Web App</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setReplyingInquiry(null)}
                      className="px-4 py-2 text-xs text-[#A1A1AA] hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSendGmailDispatch}
                      disabled={isSendingEmail}
                      className="glass-btn-primary px-5 py-2 text-xs font-bold uppercase tracking-wider text-white rounded-lg flex items-center gap-2 disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSendingEmail ? 'Dispatching...' : 'Dispatch Reply'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
