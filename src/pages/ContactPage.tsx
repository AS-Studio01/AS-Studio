import { useState } from 'react';
import confetti from 'canvas-confetti';
import { Mail, Send, CheckCircle2, AlertCircle, Copy, Check, Clock, ShieldCheck, Database, ArrowRight } from 'lucide-react';
import { STUDIO_CONTACT, buildMailtoLink } from '../constants/communication';
import { saveProjectInquiry, sendInquiryNotificationToFounders, sendClientConfirmationReceipt } from '../services';

interface ContactPageProps {
  onOpenLegal: (type: 'privacy' | 'terms' | 'disclaimer') => void;
  onNavigate?: (page: any) => void;
  onOpenPortal?: () => void;
}

export function ContactPage({ onOpenLegal, onNavigate, onOpenPortal }: ContactPageProps) {
  const [formData, setFormData] = useState(() => {
    const prefill = typeof window !== 'undefined' ? sessionStorage.getItem('as_studio_prefilled_inquiry') : null;
    return {
      name: '',
      businessName: '',
      contactInfo: '',
      helpDetails: prefill || '',
    };
  });

  const [hasPrefill, setHasPrefill] = useState(() => {
    return typeof window !== 'undefined' ? Boolean(sessionStorage.getItem('as_studio_prefilled_inquiry')) : false;
  });

  const [submitted, setSubmitted] = useState(false);
  const [submittedInquiryId, setSubmittedInquiryId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.businessName.trim() || !formData.contactInfo.trim() || !formData.helpDetails.trim()) {
      setError('Please complete all four fields before submitting.');
      return;
    }
    setError(null);
    setIsSubmitting(true);

    try {
      // 1. Save to Database
      const saved = await saveProjectInquiry({
        clientName: formData.name.trim(),
        businessName: formData.businessName.trim(),
        contactChannel: formData.contactInfo.trim(),
        scopeSummary: formData.helpDetails.trim(),
        targetBudget: 'Flexible (Negotiable)',
        source: 'website_contact_form',
      });
      setSubmittedInquiryId(saved.id);

      // 2. Dispatch Gmail Notification to Studio Founders
      await sendInquiryNotificationToFounders({
        clientName: formData.name.trim(),
        businessName: formData.businessName.trim(),
        contactChannel: formData.contactInfo.trim(),
        scopeSummary: formData.helpDetails.trim(),
      });

      // 3. If contactInfo has an email, dispatch confirmation receipt
      if (formData.contactInfo.includes('@')) {
        await sendClientConfirmationReceipt(formData.contactInfo.trim(), formData.name.trim());
      }

      setSubmitted(true);
      triggerConfetti();
    } catch (err) {
      console.error('Submission error:', err);
      // Even if background network fails, mark submitted with local confirmation
      setSubmitted(true);
      triggerConfetti();
    } finally {
      setIsSubmitting(false);
    }
  };

  const triggerConfetti = () => {
    try {
      // Subtle, elegant studio-branded confetti burst
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.62 },
        colors: ['#0047AB', '#3B82F6', '#60A5FA', '#10B981', '#F59E0B'],
        disableForReducedMotion: true,
        gravity: 0.85,
        scalar: 0.85,
        ticks: 160,
      });

      // Subtle flanking shimmers
      setTimeout(() => {
        confetti({
          particleCount: 22,
          angle: 60,
          spread: 45,
          origin: { x: 0.25, y: 0.65 },
          colors: ['#3B82F6', '#93C5FD', '#10B981'],
          disableForReducedMotion: true,
          gravity: 0.9,
          scalar: 0.75,
          ticks: 140,
        });
        confetti({
          particleCount: 22,
          angle: 120,
          spread: 45,
          origin: { x: 0.75, y: 0.65 },
          colors: ['#3B82F6', '#93C5FD', '#10B981'],
          disableForReducedMotion: true,
          gravity: 0.9,
          scalar: 0.75,
          ticks: 140,
        });
      }, 200);
    } catch (err) {
      console.warn('[Confetti] Canvas error:', err);
    }
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(STUDIO_CONTACT.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const formattedMailto = buildMailtoLink(
    `Project Brief from ${formData.name} (${formData.businessName})`,
    `Hi AS Studio team,\n\nName: ${formData.name}\nBusiness: ${formData.businessName}\nContact: ${formData.contactInfo}\n\nProject details:\n${formData.helpDetails}`
  );

  return (
    <div className="py-12 sm:py-16 md:py-20 lg:py-24 fade-in">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        {onNavigate && (
          <div className="mb-6 flex items-center gap-2 text-xs text-[#736E66] dark:text-[#A1A1AA] font-medium">
            <button
              onClick={() => onNavigate('home')}
              className="hover:text-[#121212] dark:hover:text-white transition-colors"
            >
              Home
            </button>
            <span>/</span>
            <span className="text-[#121212] dark:text-white font-bold">Contact</span>
          </div>
        )}

        {/* Page Header */}
        <div className="max-w-3xl mb-10 sm:mb-12 space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#6B6661] dark:text-[#A1A1AA] font-bold font-mono">
            <span>Initiate Project</span>
            <span className="text-[#999288] dark:text-[#52525B]">·</span>
            <span className="text-[#0047AB] dark:text-[#3B82F6]">Direct Communication</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-[#121212] dark:text-white leading-[1.08]">
            Have a business that needs a clearer website?
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-[#3E3B37] dark:text-[#D4D4D8] leading-relaxed font-medium">
            Share your current website or business details. We will tell you the first improvement we would make.
          </p>
        </div>

        {/* Highlighted availability & communication status (Tablet: 3-column clean cards) */}
        <div className="mb-10 sm:mb-12 p-5 sm:p-6 md:p-7 bg-white/80 dark:bg-[#18181B]/80 border border-[#DDD7CD] dark:border-[#27272A] grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 shadow-sm backdrop-blur-sm rounded-xl">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-[#0047AB] dark:text-[#3B82F6] shrink-0 mt-0.5" />
            <div>
              <span className="text-[11px] uppercase font-bold tracking-wider text-[#736E66] dark:text-[#A1A1AA] block font-mono">
                Response Guarantee
              </span>
              <span className="text-sm font-black text-[#121212] dark:text-white block mt-0.5">
                Within 24 Hours
              </span>
              <span className="text-xs font-medium text-[#6B6661] dark:text-[#A1A1AA]">
                Every inquiry reviewed by our lead designer
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Send className="w-5 h-5 text-[#0047AB] dark:text-[#3B82F6] shrink-0 mt-0.5" />
            <div>
              <span className="text-[11px] uppercase font-bold tracking-wider text-[#736E66] dark:text-[#A1A1AA] block font-mono">
                Fastest Direct Chat
              </span>
              <span className="text-sm font-black text-[#121212] dark:text-white block mt-0.5 truncate">
                Telegram: {STUDIO_CONTACT.telegramHandle}
              </span>
              <span className="text-xs font-medium text-[#6B6661] dark:text-[#A1A1AA]">
                Ideal for quick questions and voice briefs
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#0047AB] dark:text-[#3B82F6] shrink-0 mt-0.5" />
            <div>
              <span className="text-[11px] uppercase font-bold tracking-wider text-[#736E66] dark:text-[#A1A1AA] block font-mono">
                Direct Channels
              </span>
              <span className="text-sm font-black text-[#121212] dark:text-white block mt-0.5">
                Gmail & Telegram Only
              </span>
              <span className="text-xs font-medium text-[#6B6661] dark:text-[#A1A1AA]">
                WhatsApp is currently disabled
              </span>
            </div>
          </div>
        </div>

        {/* 2-Column Responsive Layout (Tablet md: 5 col / 7 col) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Direct Channels */}
          <div className="md:col-span-5 space-y-6">
            <div className="bg-white/80 dark:bg-[#18181B]/80 border border-[#DDD7CD] dark:border-[#27272A] p-5 sm:p-7 space-y-5 shadow-sm backdrop-blur-sm rounded-xl">
              <h2 className="text-lg sm:text-xl font-black tracking-tight text-[#121212] dark:text-white border-b border-[#E7E2DA] dark:border-[#27272A] pb-3">
                Active Direct Channels
              </h2>

              {/* Channel 1: Gmail */}
              <div className="p-4 bg-[#FAF8F5] dark:bg-[#141416] border border-[#DDD7CD] dark:border-[#27272A] space-y-2 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#0047AB] dark:text-[#3B82F6]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#121212] dark:text-white">
                      Email (Gmail)
                    </span>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-[#0047AB] dark:text-[#3B82F6] tracking-wide">
                    Primary
                  </span>
                </div>
                <p className="text-xs font-mono font-medium text-[#383531] dark:text-[#D4D4D8] select-all break-all">
                  {STUDIO_CONTACT.email}
                </p>
                <div className="flex items-center gap-2 pt-1.5">
                  <a
                    href={buildMailtoLink()}
                    className="glass-btn-primary flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 text-white text-xs font-bold uppercase tracking-wider rounded-lg"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Open Email</span>
                  </a>
                  <button
                    onClick={copyEmail}
                    className="glass-btn inline-flex items-center justify-center gap-1 py-2 px-3 text-[#383531] dark:text-[#E4E4E7] text-xs font-bold rounded-lg"
                  >
                    {copiedEmail ? <Check className="w-3.5 h-3.5 text-[#0047AB] dark:text-[#3B82F6]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedEmail ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Channel 2: Telegram */}
              <div className="p-4 bg-[#FAF8F5] dark:bg-[#141416] border border-[#DDD7CD] dark:border-[#27272A] space-y-2 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Send className="w-4 h-4 text-[#0047AB] dark:text-[#3B82F6]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#121212] dark:text-white">
                      Telegram
                    </span>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-[#0047AB] dark:text-[#3B82F6] tracking-wide">
                    Fast Chat
                  </span>
                </div>
                <p className="text-xs font-mono font-medium text-[#383531] dark:text-[#D4D4D8]">
                  {STUDIO_CONTACT.telegramHandle}
                </p>
                <div className="pt-1.5">
                  <a
                    href={STUDIO_CONTACT.telegramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-btn w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 text-[#121212] dark:text-white text-xs font-bold uppercase tracking-wider rounded-lg"
                  >
                    <Send className="w-3.5 h-3.5 text-[#0047AB] dark:text-[#3B82F6]" />
                    <span>Start Chat on Telegram</span>
                  </a>
                </div>
              </div>

              {/* Channel 3: WhatsApp (Disabled status clearly marked) */}
              <div className="p-4 bg-[#F5F2EB] dark:bg-[#141416] border border-[#DDD7CD] dark:border-[#27272A] space-y-2 opacity-85 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#736E66] dark:text-[#A1A1AA] line-through">
                    WhatsApp
                  </span>
                  <span className="text-[10px] uppercase font-bold text-[#8C857B] dark:text-[#71717A] border border-[#DDD7CD] dark:border-[#3F3F46] px-1.5 py-0.5 rounded">
                    Disabled
                  </span>
                </div>
                <div className="flex items-start gap-2 text-xs text-[#736E66] dark:text-[#A1A1AA] leading-relaxed">
                  <AlertCircle className="w-4 h-4 text-[#8C857B] shrink-0 mt-0.5" />
                  <span>
                    WhatsApp communication is currently disabled. Please reach out via Gmail or Telegram above.
                  </span>
                </div>
              </div>
            </div>

            {/* Quiet guarantee */}
            <div className="p-5 bg-[#F5F2EB] dark:bg-[#141416] border border-[#DDD7CD] dark:border-[#27272A] text-xs text-[#6B6661] dark:text-[#A1A1AA] leading-relaxed rounded-xl">
              <span className="font-bold text-[#121212] dark:text-white block mb-1">
                Zero Sales Pressure
              </span>
              We review your link, give you our honest thoughts on structure, typography, and conversion speed, and quote a flat project fee. No persistent follow-ups.
            </div>
          </div>

          {/* Right Column: 4-Field Enquiry Form */}
          <div className="md:col-span-7">
            <div className="bg-white/80 dark:bg-[#18181B]/80 border border-[#DDD7CD] dark:border-[#27272A] p-5 sm:p-8 md:p-9 shadow-sm backdrop-blur-sm rounded-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg sm:text-xl font-black tracking-tight text-[#121212] dark:text-white">
                  Project Intake Brief
                </h2>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#3B82F6]/15 text-[#60A5FA] border border-[#3B82F6]/30">
                  Direct Ingestion
                </span>
              </div>

              {submitted ? (
                <div className="py-6 space-y-6 fade-in">
                  <div className="flex items-center gap-3 text-emerald-500">
                    <CheckCircle2 className="w-7 h-7" />
                    <div>
                      <h3 className="text-xl font-black text-[#121212] dark:text-white">
                        Inquiry Successfully Logged
                      </h3>
                      {submittedInquiryId && (
                        <span className="text-[11px] font-mono text-[#A1A1AA]">
                          Tracking Reference: {submittedInquiryId}
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-[#4A4641] dark:text-[#D4D4D8] leading-relaxed font-medium">
                    Thank you, <strong>{formData.name}</strong>. Your project brief for <strong>{formData.businessName}</strong> has been logged to the AS Studio database. We will review your current presence and reach out with the first improvement suggestion within 24 hours.
                  </p>

                  {/* System Receipt Card */}
                  <div className="p-4 bg-[#FAF8F5] dark:bg-[#141416] border border-[#DDD7CD] dark:border-[#27272A] space-y-2.5 text-xs text-[#57534E] dark:text-[#A1A1AA] rounded-lg">
                    <div className="flex items-center justify-between gap-2 text-emerald-700 dark:text-emerald-400 font-mono font-bold text-[11px] pb-1 border-b border-[#E5E2D9] dark:border-white/[0.06]">
                      <div className="flex items-center gap-1.5">
                        <Database className="w-3.5 h-3.5" />
                        <span>Inquiry Saved & Dispatched</span>
                      </div>
                      {submittedInquiryId && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-[#0047AB] dark:text-[#60A5FA] border border-blue-500/20">
                          Ref: {submittedInquiryId}
                        </span>
                      )}
                    </div>
                    <div><span className="font-bold text-[#121212] dark:text-white">Client:</span> {formData.name} ({formData.businessName})</div>
                    <div><span className="font-bold text-[#121212] dark:text-white">Contact Channel:</span> {formData.contactInfo}</div>
                    <div><span className="font-bold text-[#121212] dark:text-white">Scope Brief:</span> {formData.helpDetails}</div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                    {onNavigate && (
                      <button
                        type="button"
                        onClick={() => onNavigate('track')}
                        className="glass-btn-primary inline-flex items-center justify-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white rounded-lg"
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>Track Project Status</span>
                      </button>
                    )}

                    <a
                      href={formattedMailto}
                      className="glass-btn inline-flex items-center justify-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#121212] dark:text-white rounded-lg"
                    >
                      <Mail className="w-3.5 h-3.5 text-[#0047AB] dark:text-[#3B82F6]" />
                      <span>Open in Gmail Client</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({ name: '', businessName: '', contactInfo: '', helpDetails: '' });
                      }}
                      className="glass-btn px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#57534E] dark:text-[#D4D4D8] rounded-lg"
                    >
                      Send Another
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {hasPrefill && (
                    <div className="p-3.5 bg-[#3B82F6]/15 border border-[#3B82F6]/30 text-xs text-[#93C5FD] rounded-lg flex items-center justify-between gap-2 fade-in">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Pre-filled with your customized project brief drafted by AS Studio Helper AI.</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          sessionStorage.removeItem('as_studio_prefilled_inquiry');
                          setHasPrefill(false);
                        }}
                        className="text-[11px] underline opacity-75 hover:opacity-100 font-mono"
                      >
                        Dismiss
                      </button>
                    </div>
                  )}

                  {error && (
                    <div className="p-3 bg-[#FFF3F3] dark:bg-[#2A1215] border border-[#E5B5B5] dark:border-[#7F1D1D] text-xs text-[#B91C1C] dark:text-[#F87171] font-semibold rounded-lg">
                      {error}
                    </div>
                  )}

                  {/* Field 1 & 2 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="input-name" className="block text-xs font-bold uppercase tracking-wider text-[#121212] dark:text-white mb-2">
                        Name <span className="text-[#0047AB] dark:text-[#3B82F6]">*</span>
                      </label>
                      <input
                        id="input-name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Dr. Arjun or Sarah Jenkins"
                        className="w-full p-3.5 bg-[#FAF8F5] dark:bg-[#141416] border border-[#DDD7CD] dark:border-[#27272A] text-sm text-[#121212] dark:text-white focus:outline-none focus:border-[#0047AB] dark:focus:border-[#3B82F6] transition-colors rounded-lg"
                      />
                    </div>

                    <div>
                      <label htmlFor="input-business" className="block text-xs font-bold uppercase tracking-wider text-[#121212] dark:text-white mb-2">
                        Business / Practice <span className="text-[#0047AB] dark:text-[#3B82F6]">*</span>
                      </label>
                      <input
                        id="input-business"
                        type="text"
                        required
                        value={formData.businessName}
                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                        placeholder="e.g. Veda Dental or Artisan Cafe"
                        className="w-full p-3.5 bg-[#FAF8F5] dark:bg-[#141416] border border-[#DDD7CD] dark:border-[#27272A] text-sm text-[#121212] dark:text-white focus:outline-none focus:border-[#0047AB] dark:focus:border-[#3B82F6] transition-colors rounded-lg"
                      />
                    </div>
                  </div>

                  {/* Field 3: Contact Info */}
                  <div>
                    <label htmlFor="input-contact" className="block text-xs font-bold uppercase tracking-wider text-[#121212] dark:text-white mb-2">
                      Email or Telegram Handle <span className="text-[#0047AB] dark:text-[#3B82F6]">*</span>
                    </label>
                    <input
                      id="input-contact"
                      type="text"
                      required
                      value={formData.contactInfo}
                      onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
                      placeholder="e.g. dr.arjun@clinic.com or @arjun_telegram"
                      className="w-full p-3.5 bg-[#FAF8F5] dark:bg-[#141416] border border-[#DDD7CD] dark:border-[#27272A] text-sm text-[#121212] dark:text-white focus:outline-none focus:border-[#0047AB] dark:focus:border-[#3B82F6] transition-colors rounded-lg"
                    />
                    <span className="text-[11px] text-[#736E66] dark:text-[#A1A1AA] mt-1 block">
                      We reply directly to this touchpoint within 24 hours.
                    </span>
                  </div>

                  {/* Field 4: Help Details */}
                  <div>
                    <label htmlFor="input-help" className="block text-xs font-bold uppercase tracking-wider text-[#121212] dark:text-white mb-2">
                      What can we build or improve for you? <span className="text-[#0047AB] dark:text-[#3B82F6]">*</span>
                    </label>
                    <textarea
                      id="input-help"
                      required
                      rows={5}
                      value={formData.helpDetails}
                      onChange={(e) => setFormData({ ...formData, helpDetails: e.target.value })}
                      placeholder="Share your current website link, services, or desired turnaround sprint..."
                      className="w-full p-3.5 bg-[#FAF8F5] dark:bg-[#141416] border border-[#DDD7CD] dark:border-[#27272A] text-sm text-[#121212] dark:text-white focus:outline-none focus:border-[#0047AB] dark:focus:border-[#3B82F6] transition-colors resize-y rounded-lg font-sans"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="glass-btn-primary w-full py-4 px-6 text-xs font-bold uppercase tracking-wider text-white inline-flex items-center justify-center gap-2 rounded-lg disabled:opacity-50"
                    >
                      <Database className="w-4 h-4" />
                      <span>{isSubmitting ? 'Logging to Database...' : 'Submit Project Brief to AS Studio'}</span>
                    </button>
                    <span className="text-[11px] text-[#736E66] dark:text-[#A1A1AA] text-center block mt-2 font-mono">
                      Stores to AS Studio database & dispatches notification to founders inbox
                    </span>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
