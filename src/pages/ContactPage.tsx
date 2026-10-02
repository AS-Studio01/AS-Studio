import { useState } from 'react';
import { Mail, Send, CheckCircle2, AlertCircle, Copy, Check, Clock, ShieldCheck } from 'lucide-react';
import { STUDIO_CONTACT, buildMailtoLink } from '../constants/communication';

interface ContactPageProps {
  onOpenLegal: (type: 'privacy' | 'terms' | 'disclaimer') => void;
  onNavigate?: (page: any) => void;
}

export function ContactPage({ onOpenLegal, onNavigate }: ContactPageProps) {
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
  const [error, setError] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.businessName.trim() || !formData.contactInfo.trim() || !formData.helpDetails.trim()) {
      setError('Please complete all four fields before submitting.');
      return;
    }
    setError(null);
    setSubmitted(true);
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
    <div className="py-16 sm:py-24 fade-in">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
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
        <div className="max-w-3xl mb-12 space-y-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#6B6661] dark:text-[#A1A1AA] font-bold font-mono">
            <span>Initiate Project</span>
            <span className="text-[#999288] dark:text-[#52525B]">·</span>
            <span className="text-[#0047AB] dark:text-[#3B82F6]">Direct Communication</span>
          </div>

          {/* Heading (use exactly, bold & assertive) */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-[#121212] dark:text-white leading-[1.08]">
            Have a business that needs a clearer website?
          </h1>

          {/* Body text (use exactly) */}
          <p className="text-base sm:text-xl text-[#3E3B37] dark:text-[#D4D4D8] leading-relaxed font-medium">
            Share your current website or business details. We will tell you the first improvement we would make.
          </p>
        </div>

        {/* Highlighted availability & communication status */}
        <div className="mb-12 p-6 sm:p-7 bg-white/80 dark:bg-[#18181B]/80 border border-[#DDD7CD] dark:border-[#27272A] grid grid-cols-1 md:grid-cols-3 gap-6 shadow-sm backdrop-blur-sm">
          <div className="flex items-start gap-3.5">
            <Clock className="w-5 h-5 text-[#0047AB] dark:text-[#3B82F6] shrink-0 mt-0.5" />
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-[#736E66] dark:text-[#A1A1AA] block font-mono">
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

          <div className="flex items-start gap-3.5">
            <Send className="w-5 h-5 text-[#0047AB] dark:text-[#3B82F6] shrink-0 mt-0.5" />
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-[#736E66] dark:text-[#A1A1AA] block font-mono">
                Fastest Chat
              </span>
              <span className="text-sm font-black text-[#121212] dark:text-white block mt-0.5">
                Telegram: {STUDIO_CONTACT.telegramHandle}
              </span>
              <span className="text-xs font-medium text-[#6B6661] dark:text-[#A1A1AA]">
                Ideal for quick questions and voice briefs
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <ShieldCheck className="w-5 h-5 text-[#0047AB] dark:text-[#3B82F6] shrink-0 mt-0.5" />
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-[#736E66] dark:text-[#A1A1AA] block font-mono">
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Direct Channels */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white/80 dark:bg-[#18181B]/80 border border-[#DDD7CD] dark:border-[#27272A] p-6 sm:p-8 space-y-6 shadow-sm backdrop-blur-sm">
              <h2 className="text-xl font-black tracking-tight text-[#121212] dark:text-white border-b border-[#E7E2DA] dark:border-[#27272A] pb-3">
                Active Direct Channels
              </h2>

              {/* Channel 1: Gmail */}
              <div className="p-4 bg-[#FAF8F5] dark:bg-[#141416] border border-[#DDD7CD] dark:border-[#27272A] space-y-2">
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
                    className="glass-btn-primary flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 text-white text-xs font-bold uppercase tracking-wider"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Open Email</span>
                  </a>
                  <button
                    onClick={copyEmail}
                    className="glass-btn inline-flex items-center justify-center gap-1 py-2 px-3 text-[#383531] dark:text-[#E4E4E7] text-xs font-bold"
                  >
                    {copiedEmail ? <Check className="w-3.5 h-3.5 text-[#0047AB] dark:text-[#3B82F6]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedEmail ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Channel 2: Telegram */}
              <div className="p-4 bg-[#FAF8F5] dark:bg-[#141416] border border-[#DDD7CD] dark:border-[#27272A] space-y-2">
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
                    className="glass-btn w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 text-[#121212] dark:text-white text-xs font-bold uppercase tracking-wider"
                  >
                    <Send className="w-3.5 h-3.5 text-[#0047AB] dark:text-[#3B82F6]" />
                    <span>Start Chat on Telegram</span>
                  </a>
                </div>
              </div>

              {/* Channel 3: WhatsApp (Disabled status clearly marked) */}
              <div className="p-4 bg-[#F5F2EB] dark:bg-[#141416] border border-[#DDD7CD] dark:border-[#27272A] space-y-2 opacity-85">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#736E66] dark:text-[#A1A1AA] line-through">
                    WhatsApp
                  </span>
                  <span className="text-[10px] uppercase font-bold text-[#8C857B] dark:text-[#71717A] border border-[#DDD7CD] dark:border-[#3F3F46] px-1.5 py-0.5">
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
            <div className="p-5 bg-[#F5F2EB] dark:bg-[#141416] border border-[#DDD7CD] dark:border-[#27272A] text-xs text-[#6B6661] dark:text-[#A1A1AA] leading-relaxed">
              <span className="font-bold text-[#121212] dark:text-white block mb-1">
                Zero Sales Pressure
              </span>
              We review your link, give you our honest thoughts on structure, typography, and conversion speed, and quote a flat project fee. No persistent follow-ups.
            </div>
          </div>

          {/* Right Column: 4-Field Enquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-white/80 dark:bg-[#18181B]/80 border border-[#DDD7CD] dark:border-[#27272A] p-6 sm:p-10 shadow-sm backdrop-blur-sm">
              <h2 className="text-xl font-black tracking-tight text-[#121212] dark:text-white mb-6">
                Project Intake Brief
              </h2>

              {submitted ? (
                <div className="py-8 space-y-6 fade-in">
                  <div className="flex items-center gap-3 text-[#0047AB] dark:text-[#3B82F6]">
                    <CheckCircle2 className="w-7 h-7" />
                    <h3 className="text-xl font-black text-[#121212] dark:text-white">
                      Enquiry received
                    </h3>
                  </div>

                  <p className="text-sm text-[#4A4641] dark:text-[#D4D4D8] leading-relaxed font-medium">
                    Thank you, <strong>{formData.name}</strong>. We have logged your request for <strong>{formData.businessName}</strong>. We will review your current presence and reach out with the first improvement suggestion within 24 hours.
                  </p>

                  <div className="p-4 bg-[#FAF8F5] dark:bg-[#141416] border border-[#DDD7CD] dark:border-[#27272A] space-y-2 text-xs text-[#57534E] dark:text-[#A1A1AA]">
                    <div><span className="font-bold text-[#121212] dark:text-white">Contact:</span> {formData.contactInfo}</div>
                    <div><span className="font-bold text-[#121212] dark:text-white">Scope note:</span> {formData.helpDetails}</div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                    <a
                      href={formattedMailto}
                      className="glass-btn-primary inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Also send via your email client</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({ name: '', businessName: '', contactInfo: '', helpDetails: '' });
                      }}
                      className="glass-btn px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-[#57534E] dark:text-[#D4D4D8]"
                    >
                      Send another enquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {hasPrefill && (
                    <div className="p-3.5 bg-[#3B82F6]/15 border border-[#3B82F6]/30 text-xs text-[#93C5FD] rounded-sm flex items-center justify-between gap-2 fade-in">
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
                    <div className="p-3 bg-[#FFF3F3] dark:bg-[#2A1215] border border-[#E5B5B5] dark:border-[#7F1D1D] text-xs text-[#B91C1C] dark:text-[#F87171] font-semibold">
                      {error}
                    </div>
                  )}

                  {/* Field 1 & 2 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                        placeholder="Your full name"
                        className="w-full px-4 py-3 bg-[#FAF8F5] dark:bg-[#141416] border border-[#DDD7CD] dark:border-[#27272A] text-sm text-[#121212] dark:text-white placeholder:text-[#9C968E] dark:placeholder:text-[#71717A] focus:outline-none focus:border-[#0047AB] dark:focus:border-[#3B82F6] focus:bg-white dark:focus:bg-[#18181B] transition-colors"
                      />
                    </div>

                    <div>
                      <label htmlFor="input-business" className="block text-xs font-bold uppercase tracking-wider text-[#121212] dark:text-white mb-2">
                        Business name <span className="text-[#0047AB] dark:text-[#3B82F6]">*</span>
                      </label>
                      <input
                        id="input-business"
                        type="text"
                        required
                        value={formData.businessName}
                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                        placeholder="e.g. Apex Diagnostics, Mitti Studio"
                        className="w-full px-4 py-3 bg-[#FAF8F5] dark:bg-[#141416] border border-[#DDD7CD] dark:border-[#27272A] text-sm text-[#121212] dark:text-white placeholder:text-[#9C968E] dark:placeholder:text-[#71717A] focus:outline-none focus:border-[#0047AB] dark:focus:border-[#3B82F6] focus:bg-white dark:focus:bg-[#18181B] transition-colors"
                      />
                    </div>
                  </div>

                  {/* Field 3: Email or WhatsApp number */}
                  <div>
                    <label htmlFor="input-contact" className="block text-xs font-bold uppercase tracking-wider text-[#121212] dark:text-white mb-2">
                      Email or WhatsApp number <span className="text-[#0047AB] dark:text-[#3B82F6]">*</span>
                    </label>
                    <input
                      id="input-contact"
                      type="text"
                      required
                      value={formData.contactInfo}
                      onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
                      placeholder="name@business.com or Telegram @handle"
                      className="w-full px-4 py-3 bg-[#FAF8F5] dark:bg-[#141416] border border-[#DDD7CD] dark:border-[#27272A] text-sm text-[#121212] dark:text-white placeholder:text-[#9C968E] dark:placeholder:text-[#71717A] focus:outline-none focus:border-[#0047AB] dark:focus:border-[#3B82F6] focus:bg-white dark:focus:bg-[#18181B] transition-colors"
                    />
                    <span className="text-[11px] text-[#736E66] dark:text-[#A1A1AA] mt-1.5 block font-medium">
                      Email or Telegram handle preferred.
                    </span>
                  </div>

                  {/* Field 4: What do you need help with? */}
                  <div>
                    <label htmlFor="input-help" className="block text-xs font-bold uppercase tracking-wider text-[#121212] dark:text-white mb-2">
                      What do you need help with? <span className="text-[#0047AB] dark:text-[#3B82F6]">*</span>
                    </label>
                    <textarea
                      id="input-help"
                      required
                      rows={5}
                      value={formData.helpDetails}
                      onChange={(e) => setFormData({ ...formData, helpDetails: e.target.value })}
                      placeholder="Share your current website link, business model, or what isn't working right now..."
                      className="w-full px-4 py-3 bg-[#FAF8F5] dark:bg-[#141416] border border-[#DDD7CD] dark:border-[#27272A] text-sm text-[#121212] dark:text-white placeholder:text-[#9C968E] dark:placeholder:text-[#71717A] focus:outline-none focus:border-[#0047AB] dark:focus:border-[#3B82F6] focus:bg-white dark:focus:bg-[#18181B] transition-colors resize-none"
                    />
                  </div>

                  {/* Submit button (Glassmorphic Primary) */}
                  <div>
                    <button
                      type="submit"
                      className="glass-btn-primary w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-xs font-bold uppercase tracking-wider text-white"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send enquiry</span>
                    </button>
                  </div>

                  {/* Exact text below the form */}
                  <p className="text-xs text-[#736E66] dark:text-[#A1A1AA] pt-2 font-medium">
                    By submitting this form, you acknowledge and agree to our{' '}
                    <button
                      type="button"
                      onClick={() => onOpenLegal('terms')}
                      className="underline hover:text-[#121212] dark:hover:text-white font-bold"
                    >
                      Terms & Conditions
                    </button>
                    ,{' '}
                    <button
                      type="button"
                      onClick={() => onOpenLegal('privacy')}
                      className="underline hover:text-[#121212] dark:hover:text-white font-bold"
                    >
                      Privacy Policy
                    </button>
                    , and{' '}
                    <button
                      type="button"
                      onClick={() => onOpenLegal('disclaimer')}
                      className="underline hover:text-[#121212] dark:hover:text-white font-bold"
                    >
                      Disclaimer
                    </button>
                    .
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
