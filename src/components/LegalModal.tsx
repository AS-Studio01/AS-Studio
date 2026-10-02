import { useEffect } from 'react';
import { X, ShieldAlert, FileText, Lock } from 'lucide-react';

interface LegalModalProps {
  type: 'privacy' | 'terms' | 'disclaimer' | null;
  onClose: () => void;
}

export function LegalModal({ type, onClose }: LegalModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (type) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [type, onClose]);

  if (!type) return null;

  const getTitle = () => {
    switch (type) {
      case 'privacy':
        return 'Privacy Policy';
      case 'terms':
        return 'Terms & Conditions';
      case 'disclaimer':
        return 'Disclaimer & Practice Disclosure';
      default:
        return 'Legal Information';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'privacy':
        return <Lock className="w-4 h-4 text-[#3B82F6]" />;
      case 'terms':
        return <FileText className="w-4 h-4 text-[#3B82F6]" />;
      case 'disclaimer':
        return <ShieldAlert className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md">
      <div 
        className="w-full max-w-xl bg-[#141416] border border-[#27272A] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] fade-in rounded-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="legal-title"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#27272A] bg-[#18181B]">
          <div className="flex items-center gap-2.5">
            {getIcon()}
            <h2 id="legal-title" className="text-base sm:text-lg font-black tracking-tight text-white">
              {getTitle()}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#A1A1AA] hover:text-white transition-colors rounded-md hover:bg-white/5"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-6 overflow-y-auto space-y-4 text-xs text-[#D4D4D8] leading-relaxed font-sans">
          {type === 'privacy' && (
            <>
              <p>
                <strong>Last updated:</strong> 2026. AS Studio respects your privacy and is committed to protecting your personal information.
              </p>
              <h3 className="text-sm font-bold text-white pt-2">1. Information We Collect</h3>
              <p>
                We only collect information voluntarily provided by you through our project brief forms, direct Telegram communication, or email correspondence (such as your name, business name, and email or Telegram handle).
              </p>
              <h3 className="text-sm font-bold text-white pt-2">2. How Information is Used</h3>
              <p>
                Your details are strictly used to evaluate project requirements, prepare custom scope proposals, and coordinate design and engineering deliverables. We never sell, rent, or trade your data to third-party advertisers.
              </p>
              <h3 className="text-sm font-bold text-white pt-2">3. Zero Invasive Tracking</h3>
              <p>
                AS Studio uses zero advertising networks, tracking pixels, or invasive behavioral profiling. We prioritize clean, minimal web telemetry solely for essential app functionality.
              </p>
              <h3 className="text-sm font-bold text-white pt-2">4. Contact & Inquiries</h3>
              <p>
                For any questions regarding data handling, contact us at <strong>asbusinessofficial01@gmail.com</strong>.
              </p>
            </>
          )}

          {type === 'terms' && (
            <>
              <p>
                <strong>Last updated:</strong> 2026. Terms governing design, development, and consultation by AS Studio.
              </p>
              <h3 className="text-sm font-bold text-white pt-2">1. Scope of Engagement</h3>
              <p>
                AS Studio delivers bespoke digital design, mobile-first responsive architecture, and production frontend code. Every sprint begins with an agreed-upon milestone schedule and pricing breakdown.
              </p>
              <h3 className="text-sm font-bold text-white pt-2">2. 100% Code Ownership</h3>
              <p>
                Upon project completion and final payment, 100% of clean source code, design assets, and repository rights are transferred to the client with zero mandatory monthly builder lock-ins or licensing fees.
              </p>
              <h3 className="text-sm font-bold text-white pt-2">3. Staging & Client Verification</h3>
              <p>
                Clients receive live smartphone staging previews to test performance and usability on their real hardware prior to production release and final payment.
              </p>
              <h3 className="text-sm font-bold text-white pt-2">4. 30-Day Post-Launch Warranty</h3>
              <p>
                We provide a 30-day post-launch warranty covering complimentary bug fixes, cross-browser adjustments, and minor copy updates.
              </p>
            </>
          )}

          {type === 'disclaimer' && (
            <>
              <p>
                <strong>Last updated:</strong> 2026. Official Practice Disclosure and Legal Disclaimer for AS Studio.
              </p>
              <h3 className="text-sm font-bold text-white pt-2">1. Exploratory Case Studies & Concepts</h3>
              <p>
                Select featured prototypes labeled &quot;Independent Concept&quot; in our portfolio (including <em>Atelier Forma</em>, <em>Nova Dental Studio</em>, and <em>Mitti Café & Roastery</em>) are self-initiated architectural and UX case studies. They are designed to demonstrate design excellence, material lookbooks, and conversion triage, and do not imply official brand affiliation or endorsement.
              </p>
              <h3 className="text-sm font-bold text-white pt-2">2. Scope & Pricing Estimates</h3>
              <p>
                All pricing figures and sprint timelines published on this site or discussed with our AI assistant represent typical ranges and starting points. Every project is individually scoped with flexible, negotiable pricing tailored to the client&apos;s specific budget.
              </p>
              <h3 className="text-sm font-bold text-white pt-2">3. Direct Channels Only (WhatsApp Disabled)</h3>
              <p>
                AS Studio operates exclusively through official direct channels: Telegram (<strong>@AS_Studio_official01</strong>) and Gmail (<strong>asbusinessofficial01@gmail.com</strong>). WhatsApp is currently disabled. We never conduct cold calls or send unsolicited marketing messages.
              </p>
              <h3 className="text-sm font-bold text-white pt-2">4. Intellectual Property</h3>
              <p>
                All custom design systems, interactive prototypes, and code created by AS Studio are protected. Upon contractual delivery and completion, complete ownership of client deliverables transfers in full to the client.
              </p>
            </>
          )}
        </div>

        <div className="px-6 py-3.5 border-t border-[#27272A] bg-[#18181B] flex items-center justify-between">
          <span className="text-[11px] text-[#71717A] font-mono">
            AS Studio · Official Legal Notice
          </span>
          <button
            onClick={onClose}
            className="glass-btn px-4 py-2 text-xs font-bold uppercase tracking-wider text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
