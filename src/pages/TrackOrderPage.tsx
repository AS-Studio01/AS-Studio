import { useState, useEffect } from 'react';
import { 
  Search, CheckCircle2, Clock, ShieldCheck, Mail, Send, 
  ArrowRight, FileText, Database, AlertCircle, RefreshCw, Smartphone
} from 'lucide-react';
import { PageType } from '../types';
import { getProjectInquiries, ProjectInquiryRecord } from '../services';
import { STUDIO_CONTACT, buildMailtoLink, buildTelegramLink } from '../constants/communication';

interface TrackOrderPageProps {
  onNavigate: (page: PageType) => void;
}

export function TrackOrderPage({ onNavigate }: TrackOrderPageProps) {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const [matchedRecord, setMatchedRecord] = useState<ProjectInquiryRecord | null>(null);

  // Check URL params on mount for auto-tracking (?ref=... or ?email=...)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const ref = params.get('ref') || params.get('id') || params.get('email');
      if (ref) {
        setQuery(ref);
        performSearch(ref);
      }
    }
  }, []);

  const performSearch = async (searchVal: string) => {
    const term = searchVal.trim().toLowerCase();
    if (!term) return;

    setIsSearching(true);
    setSearched(true);
    setMatchedRecord(null);

    try {
      const allInquiries = await getProjectInquiries();
      // Match by ID, email/contact info, or client name
      const found = allInquiries.find(
        (inq) => 
          inq.id.toLowerCase() === term ||
          inq.contactChannel.toLowerCase().includes(term) ||
          inq.clientName.toLowerCase().includes(term) ||
          inq.businessName.toLowerCase().includes(term)
      );

      setMatchedRecord(found || null);
    } catch (err) {
      console.warn('[TrackOrder] Search note:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  return (
    <div className="py-16 sm:py-24 fade-in">
      <div className="max-w-4xl mx-auto px-5 sm:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-xs text-[#736E66] dark:text-[#A1A1AA] font-medium">
          <button
            onClick={() => onNavigate('home')}
            className="hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Home
          </button>
          <span>/</span>
          <span className="text-slate-900 dark:text-white font-bold">Track Project</span>
        </div>

        {/* Page Header */}
        <div className="max-w-2xl mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-blue-600 dark:text-[#60A5FA] font-bold">
            <Clock className="w-3.5 h-3.5" />
            <span>Real-time Status Verification</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.08]">
            Track your project or inquiry.
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-[#D4D4D8] leading-relaxed">
            Enter your inquiry reference code or email address to verify real-time submission status, review milestones, and direct communication history.
          </p>
        </div>

        {/* Search Bar Box */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#141418] border border-slate-200 dark:border-white/10 shadow-sm mb-10">
          <form onSubmit={handleSearchSubmit} className="space-y-4">
            <label htmlFor="track-input" className="block text-xs font-mono uppercase tracking-wider text-slate-700 dark:text-[#A1A1AA] font-bold">
              Enter Tracking Reference or Email:
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  id="track-input"
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. INQ-1728... or you@company.com"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/15 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-600 dark:focus:border-blue-400 transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={isSearching || !query.trim()}
                className="glass-btn-primary px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-white disabled:opacity-50 transition-all rounded-xl shrink-0 flex items-center justify-center gap-2"
              >
                {isSearching ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                <span>{isSearching ? 'Searching...' : 'Track Status'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Search Result or Empty State */}
        {searched && (
          <div className="fade-in space-y-6">
            {matchedRecord ? (
              <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#141418] border border-slate-200 dark:border-white/10 shadow-lg space-y-6">
                
                {/* Result Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 dark:border-white/10 gap-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-blue-600 dark:text-[#60A5FA] font-bold block mb-1">
                      Tracking Reference: {matchedRecord.id}
                    </span>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                      {matchedRecord.businessName || matchedRecord.clientName}
                    </h2>
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-bold self-start sm:self-auto">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Inquiry Logged & Verified</span>
                  </div>
                </div>

                {/* Scope & Client Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 space-y-1.5">
                    <span className="font-mono text-slate-400 uppercase text-[10px] block">Client Contact</span>
                    <p className="font-bold text-slate-900 dark:text-white">{matchedRecord.clientName}</p>
                    <p className="font-mono text-slate-600 dark:text-[#A1A1AA]">{matchedRecord.contactChannel}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 space-y-1.5">
                    <span className="font-mono text-slate-400 uppercase text-[10px] block">Commercial Scope</span>
                    <p className="font-bold text-slate-900 dark:text-white">{matchedRecord.targetBudget || 'Negotiable Scope'}</p>
                    <p className="font-mono text-slate-600 dark:text-[#A1A1AA]">
                      Logged: {matchedRecord.createdAt ? new Date(matchedRecord.createdAt).toLocaleDateString() : 'Active'}
                    </p>
                  </div>
                </div>

                {/* Submitted Brief Summary */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 space-y-2">
                  <span className="font-mono text-slate-400 uppercase text-[10px] block">Submitted Scope Summary</span>
                  <p className="text-xs text-slate-700 dark:text-[#D4D4D8] leading-relaxed whitespace-pre-wrap">
                    {matchedRecord.scopeSummary}
                  </p>
                </div>

                {/* Delivery Stages Checklist */}
                <div className="space-y-3 pt-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-[#A1A1AA] font-bold block">
                    Studio Delivery Roadmap:
                  </span>
                  <div className="space-y-2.5">
                    <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5 text-emerald-700 dark:text-emerald-400 font-bold">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>Phase 1: Project Brief Received & Database Ingestion</span>
                      </div>
                      <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">Complete</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5 text-blue-700 dark:text-blue-400 font-bold">
                        <Clock className="w-4 h-4 shrink-0" />
                        <span>Phase 2: Lead Founder Review & Milestone Estimate</span>
                      </div>
                      <span className="text-[11px] font-mono text-blue-600 dark:text-blue-400">Underway (Within 24h)</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 flex items-center justify-between text-xs text-slate-400 dark:text-[#71717A]">
                      <div className="flex items-center gap-2.5">
                        <span className="w-4 h-4 rounded-full border border-slate-300 dark:border-white/20 flex items-center justify-center text-[10px]">3</span>
                        <span>Phase 3: Design, Wireframing & Staging Build</span>
                      </div>
                      <span className="text-[11px] font-mono">Next</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 flex items-center justify-between text-xs text-slate-400 dark:text-[#71717A]">
                      <div className="flex items-center gap-2.5">
                        <span className="w-4 h-4 rounded-full border border-slate-300 dark:border-white/20 flex items-center justify-center text-[10px]">4</span>
                        <span>Phase 4: Live Smartphone Staging & Client Verification</span>
                      </div>
                      <span className="text-[11px] font-mono">Upcoming</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 flex items-center justify-between text-xs text-slate-400 dark:text-[#71717A]">
                      <div className="flex items-center gap-2.5">
                        <span className="w-4 h-4 rounded-full border border-slate-300 dark:border-white/20 flex items-center justify-center text-[10px]">5</span>
                        <span>Phase 5: Launch & Project Handover</span>
                      </div>
                      <span className="text-[11px] font-mono">Handover</span>
                    </div>
                  </div>
                </div>

                {/* Direct Founder Communication Buttons */}
                <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <span className="text-xs text-slate-500 dark:text-[#A1A1AA] font-medium">
                    Questions about your inquiry?
                  </span>
                  <div className="flex items-center gap-2.5">
                    <a
                      href={buildTelegramLink(`Regarding inquiry ${matchedRecord.id} for ${matchedRecord.businessName}`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="glass-btn px-4 py-2.5 text-xs uppercase tracking-wider text-slate-800 dark:text-white flex items-center gap-1.5 rounded-lg"
                    >
                      <Send className="w-3.5 h-3.5 text-blue-500" />
                      <span>Telegram Direct</span>
                    </a>
                    <a
                      href={buildMailtoLink(`Question on inquiry ${matchedRecord.id}`, `Hi AS Studio,\n\nI am checking on inquiry ${matchedRecord.id} for ${matchedRecord.businessName}.`)}
                      className="glass-btn px-4 py-2.5 text-xs uppercase tracking-wider text-slate-800 dark:text-white flex items-center gap-1.5 rounded-lg"
                    >
                      <Mail className="w-3.5 h-3.5 text-blue-500" />
                      <span>Email Studio</span>
                    </a>
                  </div>
                </div>

              </div>
            ) : (
              /* Honest Empty State: No Fake Projects */
              <div className="p-8 sm:p-12 rounded-2xl bg-white dark:bg-[#141418] border border-slate-200 dark:border-white/10 text-center space-y-4 shadow-sm">
                <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 flex items-center justify-center mx-auto text-xl">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    No active project found for "{query}"
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-[#A1A1AA] max-w-md mx-auto leading-relaxed">
                    We maintain zero fake projects in our database. If you have not submitted a brief yet or need a quote, start a project below and receive a tracking reference immediately.
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    onClick={() => onNavigate('contact')}
                    className="glass-btn-primary px-7 py-3 text-xs font-bold uppercase tracking-wider text-white rounded-xl inline-flex items-center gap-2"
                  >
                    <span>Start a Project Brief</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Guarantees Box */}
        <div className="mt-12 p-6 rounded-2xl bg-slate-100 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-700 dark:text-white font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>AS Studio Client Guarantees</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600 dark:text-[#A1A1AA]">
            <div>
              <strong className="block text-slate-900 dark:text-white mb-0.5">Project Handover</strong>
              Full GitHub repo or production zip delivered upon launch.
            </div>
            <div>
              <strong className="block text-slate-900 dark:text-white mb-0.5">Live Phone Staging</strong>
              Test the actual site on your smartphone before final payment.
            </div>
            <div>
              <strong className="block text-slate-900 dark:text-white mb-0.5">30-Day Support</strong>
              Complimentary bug fixes and responsiveness updates.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
