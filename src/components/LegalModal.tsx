import { useEffect } from 'react';
import { X } from 'lucide-react';

interface LegalModalProps {
  type: 'privacy' | 'terms' | null;
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm">
      <div 
        className="w-full max-w-xl bg-[#FAF8F5] dark:bg-[#141416] border border-[#DDD7CD] dark:border-[#27272A] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] fade-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby="legal-title"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E0D8] dark:border-[#27272A] bg-[#F5F2EB] dark:bg-[#18181B]">
          <h2 id="legal-title" className="text-lg font-black tracking-tight text-[#121212] dark:text-white">
            {type === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-[#6B6661] dark:text-[#A1A1AA] hover:text-[#121212] dark:hover:text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0047AB]"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-6 overflow-y-auto space-y-4 text-xs text-[#383531] dark:text-[#D4D4D8] leading-relaxed">
          {type === 'privacy' ? (
            <>
              <p>
                <strong>Last updated:</strong> 2026. AS Studio respects your personal and business privacy.
              </p>
              <h3 className="text-sm font-bold text-[#121212] dark:text-white pt-2">1. Information We Collect</h3>
              <p>
                We only collect information you voluntarily provide via our contact form or direct communication: your name, business name, and email or Telegram handle.
              </p>
              <h3 className="text-sm font-bold text-[#121212] dark:text-white pt-2">2. How We Use It</h3>
              <p>
                Your contact details are strictly used to evaluate your website requirements, respond with suggestions, and coordinate design work. We never sell or share your data.
              </p>
              <h3 className="text-sm font-bold text-[#121212] dark:text-white pt-2">3. Cookies & Tracking</h3>
              <p>
                AS Studio uses zero advertising trackers, invasive profiling cookies, or external analytics networks.
              </p>
              <h3 className="text-sm font-bold text-[#121212] dark:text-white pt-2">4. Contact</h3>
              <p>
                For questions regarding your data, contact us at <strong>asbusinessofficial01@gmail.com</strong>.
              </p>
            </>
          ) : (
            <>
              <p>
                <strong>Last updated:</strong> 2026. Terms governing design, development, and consultation by AS Studio.
              </p>
              <h3 className="text-sm font-bold text-[#121212] dark:text-white pt-2">1. Scope of Work</h3>
              <p>
                AS Studio delivers bespoke website design, landing page architecture, and frontend source code. Each engagement begins with a clear scope, schedule, and milestone review.
              </p>
              <h3 className="text-sm font-bold text-[#121212] dark:text-white pt-2">2. Independent Concepts Disclosure</h3>
              <p>
                Selected exploratory projects labeled "Independent Concept" on this website (such as Nova Dental Care and Mitti Café) are self-initiated architectural case studies and do not represent direct commercial relationships or brand endorsements.
              </p>
              <h3 className="text-sm font-bold text-[#121212] dark:text-white pt-2">3. Source Code & IP Handover</h3>
              <p>
                Upon project completion and final payment, full intellectual property and clean source code are delivered directly to the client with no ongoing lock-ins.
              </p>
              <h3 className="text-sm font-bold text-[#121212] dark:text-white pt-2">4. Inquiries</h3>
              <p>
                For official correspondence, reach us at <strong>asbusinessofficial01@gmail.com</strong>.
              </p>
            </>
          )}
        </div>

        <div className="px-6 py-3 border-t border-[#E5E0D8] dark:border-[#27272A] bg-[#F5F2EB] dark:bg-[#18181B] flex justify-end">
          <button
            onClick={onClose}
            className="glass-btn px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#121212] dark:text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
