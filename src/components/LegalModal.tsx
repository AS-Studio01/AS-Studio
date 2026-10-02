import { useEffect, useState } from 'react';
import { X, ShieldAlert, FileText, Lock } from 'lucide-react';
import { DEFAULT_LEGAL, getLegalDocument, LegalDocument } from '../services/siteContent';

interface LegalModalProps { type: 'privacy' | 'terms' | 'disclaimer' | null; onClose: () => void; }

export function LegalModal({ type, onClose }: LegalModalProps) {
  const [legalDoc, setLegalDoc] = useState<LegalDocument | null>(null);
  useEffect(() => {
    if (!type) return;
    document.body.style.overflow = 'hidden';
    getLegalDocument(type).then(setLegalDoc);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); };
  }, [type, onClose]);

  if (!type) return null;
  const current = legalDoc || DEFAULT_LEGAL[type];
  const icon = type === 'privacy' ? <Lock className="w-4 h-4 text-blue-400"/> : type === 'terms' ? <FileText className="w-4 h-4 text-blue-400"/> : <ShieldAlert className="w-4 h-4 text-amber-400"/>;
  return <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md">
    <div className="w-full max-w-2xl bg-[#141416]/95 border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[88vh] rounded-3xl glass-panel" role="dialog" aria-modal="true">
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div className="flex items-center gap-2.5">{icon}<h2 className="text-base sm:text-lg font-black tracking-tight text-white">{current.title}</h2></div>
        <button onClick={onClose} className="pill-icon" aria-label="Close"><X className="w-5 h-5"/></button>
      </div>
      <article className="px-6 py-7 overflow-y-auto prose prose-invert max-w-none text-sm leading-7 legal-content" dangerouslySetInnerHTML={{__html: current.contentHtml}} />
    </div>
  </div>;
}
