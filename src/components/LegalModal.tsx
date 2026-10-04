import { useSiteContent } from '../context/SiteContentContext';

interface LegalModalProps { type: 'privacy' | 'terms' | 'disclaimer' | null; onClose: () => void; }

export function LegalModal({ type, onClose }: LegalModalProps) {
  const { content } = useSiteContent();
  if (!type) return null;
  const document = content.legal[type];
  const formattedDate = !isNaN(Date.parse(document.updatedAt))
    ? new Date(document.updatedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
    : document.updatedAt || '02 October 2026';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" role="dialog" aria-modal="true">
      <div className="legal-modal glass-panel w-full max-w-3xl max-h-[86vh] overflow-hidden flex flex-col">
        <div className="px-6 py-5 border-b border-[#E5E2D9] dark:border-white/10 flex items-center justify-between">
          <div>
            <span className="section-kicker text-[#0047AB] dark:text-[#3B82F6]">AS Studio · Legal</span>
            <h2 className="text-xl sm:text-2xl font-black text-[#18181B] dark:text-white">{document.title}</h2>
            <p className="text-[11px] text-[#71717A] dark:text-white/40 mt-1">Last updated {formattedDate}</p>
          </div>
          <button onClick={onClose} className="glass-btn rounded-full w-9 h-9 text-[#18181B] dark:text-white" aria-label="Close">×</button>
        </div>
        <article className="legal-copy px-6 py-6 sm:px-8 sm:py-8 overflow-y-auto text-sm leading-7 text-[#374151] dark:text-white/80" dangerouslySetInnerHTML={{ __html: document.html }} />
        <div className="px-6 py-4 border-t border-[#E5E2D9] dark:border-white/10 flex justify-end">
          <button onClick={onClose} className="glass-btn-primary rounded-full px-5 py-2.5 text-xs font-bold text-white">Close</button>
        </div>
      </div>
    </div>
  );
}
