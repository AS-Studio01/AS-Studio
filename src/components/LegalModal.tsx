import { useEffect, useState } from 'react';
import { X, ShieldAlert, FileText, Lock } from 'lucide-react';
import { DEFAULT_LEGAL, getLegalDocument, LegalDocument } from '../services/siteContent';

interface LegalModalProps {
  type: 'privacy' | 'terms' | 'disclaimer' | null;
  onClose: () => void;
}

export function LegalModal({ type, onClose }: LegalModalProps) {
  const [legalDoc, setLegalDoc] = useState<LegalDocument | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (type) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      setLegalDoc(null);
      getLegalDocument(type).then(setLegalDoc).catch(() => setLegalDoc(null));
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [type, onClose]);

  if (!type) return null;

  const current = legalDoc ?? DEFAULT_LEGAL[type];
  const icon = type === 'privacy'
    ? <Lock className="w-4 h-4 text-[#3B82F6]" />
    : type === 'terms'
      ? <FileText className="w-4 h-4 text-[#3B82F6]" />
      : <ShieldAlert className="w-4 h-4 text-amber-400" />;

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
            {icon}
            <h2 id="legal-title" className="text-base sm:text-lg font-black tracking-tight text-white">
              {current.title}
            </h2>
          </div>
          <button onClick={onClose} className="p-1.5 text-[#A1A1AA] hover:text-white transition-colors rounded-md hover:bg-white/5" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>
        <article
          className="px-6 py-6 overflow-y-auto space-y-4 text-xs text-[#D4D4D8] leading-relaxed font-sans legal-content"
          dangerouslySetInnerHTML={{ __html: current.contentHtml }}
        />
        <div className="px-6 py-3.5 border-t border-[#27272A] bg-[#18181B] flex items-center justify-between">
          <span className="text-[11px] text-[#71717A] font-mono">AS Studio · Official Legal Notice</span>
          <button onClick={onClose} className="glass-btn px-4 py-2 text-xs font-bold uppercase tracking-wider text-white">Close</button>
        </div>
      </div>
    </div>
  );
}
