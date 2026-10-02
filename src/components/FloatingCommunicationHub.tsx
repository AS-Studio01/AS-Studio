import { useState, useEffect, useRef } from 'react';
import { Mail, Send, X, Copy, Check, MessageSquare, AlertCircle, MessageCircle } from 'lucide-react';
import { STUDIO_CONTACT, buildMailtoLink } from '../constants/communication';

interface FloatingCommunicationHubProps {
  onNavigateToContact: () => void;
}

export function FloatingCommunicationHub({ onNavigateToContact }: FloatingCommunicationHubProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const copyEmail = () => {
    navigator.clipboard.writeText(STUDIO_CONTACT.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end" ref={panelRef}>
      {/* Popover Card */}
      {isOpen && (
        <div 
          className="mb-4 w-80 sm:w-96 bg-[#FAF8F5]/95 dark:bg-[#141416]/95 border border-[#DDD7CD] dark:border-[#27272A] backdrop-blur-xl shadow-2xl overflow-hidden fade-in text-[#121212] dark:text-[#F4F4F6] transition-colors duration-300"
          role="dialog"
          aria-labelledby="comm-hub-title"
        >
          {/* Header */}
          <div className="p-4 bg-[#F5F2EB] dark:bg-[#18181B] border-b border-[#E5E0D8] dark:border-[#27272A] flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0047AB] dark:bg-[#3B82F6]" />
                <h3 id="comm-hub-title" className="text-xs font-bold uppercase tracking-wider text-[#121212] dark:text-white font-mono">
                  Direct Communication
                </h3>
              </div>
              <p className="text-[11px] text-[#6B6661] dark:text-[#A1A1AA] mt-0.5 font-medium">
                Reach AS Studio directly. Direct replies within 24 hours.
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-[#6B6661] dark:text-[#A1A1AA] hover:text-[#121212] dark:hover:text-white transition-colors"
              aria-label="Close channels menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Active Methods */}
          <div className="p-4 space-y-3">
            {/* 1. Gmail (Active) */}
            <div className="p-3.5 bg-white dark:bg-[#1C1C20] border border-[#DDD7CD] dark:border-[#2E2E33] hover:border-[#0047AB] dark:hover:border-[#3B82F6] transition-colors">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#0047AB] dark:text-[#3B82F6]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#121212] dark:text-white">Gmail</span>
                </div>
                <span className="text-[10px] uppercase font-bold text-[#0047AB] dark:text-[#3B82F6] tracking-wide font-mono">
                  Active
                </span>
              </div>
              <p className="text-xs font-mono font-medium text-[#4A4641] dark:text-[#D4D4D8] break-all select-all mb-2.5">
                {STUDIO_CONTACT.email}
              </p>
              <div className="flex items-center gap-2">
                <a
                  href={buildMailtoLink()}
                  className="glass-btn-primary flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 text-white text-[11px] font-bold uppercase tracking-wider"
                >
                  <Mail className="w-3 h-3" />
                  <span>Write Email</span>
                </a>
                <button
                  onClick={copyEmail}
                  className="glass-btn inline-flex items-center justify-center gap-1.5 py-2 px-3 text-[#4A4641] dark:text-[#D4D4D8] text-[11px] font-bold"
                  title="Copy email address"
                >
                  {copiedEmail ? <Check className="w-3 h-3 text-[#0047AB] dark:text-[#3B82F6]" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedEmail ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* 2. Telegram (Active) */}
            <div className="p-3.5 bg-white dark:bg-[#1C1C20] border border-[#DDD7CD] dark:border-[#2E2E33] hover:border-[#0047AB] dark:hover:border-[#3B82F6] transition-colors">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <Send className="w-4 h-4 text-[#0047AB] dark:text-[#3B82F6]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#121212] dark:text-white">Telegram</span>
                </div>
                <span className="text-[10px] uppercase font-bold text-[#0047AB] dark:text-[#3B82F6] tracking-wide font-mono">
                  Fastest Chat
                </span>
              </div>
              <p className="text-xs font-mono font-medium text-[#4A4641] dark:text-[#D4D4D8] mb-2.5">
                {STUDIO_CONTACT.telegramHandle}
              </p>
              <a
                href={STUDIO_CONTACT.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-btn w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 text-[#121212] dark:text-white text-[11px] font-bold uppercase tracking-wider"
              >
                <Send className="w-3 h-3 text-[#0047AB] dark:text-[#3B82F6]" />
                <span>Open in Telegram</span>
              </a>
            </div>

            {/* 3. WhatsApp (Disabled - per user requirement) */}
            <div className="p-3 bg-[#F4F1EA] dark:bg-[#17171A] border border-[#DDD7CD] dark:border-[#27272A] opacity-80">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2 text-[#736E66] dark:text-[#A1A1AA]">
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider line-through">WhatsApp</span>
                </div>
                <span className="text-[10px] uppercase font-bold text-[#8C857B] dark:text-[#71717A] tracking-wider border border-[#DDD7CD] dark:border-[#3F3F46] px-1.5 py-0.5">
                  Disabled
                </span>
              </div>
              <div className="flex items-start gap-1.5 text-[11px] text-[#736E66] dark:text-[#A1A1AA] leading-relaxed">
                <AlertCircle className="w-3.5 h-3.5 text-[#8C857B] shrink-0 mt-0.5" />
                <span>WhatsApp channel disabled. Please contact us via Gmail or Telegram above.</span>
              </div>
            </div>
          </div>

          {/* Quick Form Link Footer */}
          <div className="p-3 bg-[#F5F2EB] dark:bg-[#18181B] border-t border-[#E5E0D8] dark:border-[#27272A] flex items-center justify-between text-xs">
            <span className="text-[#6B6661] dark:text-[#A1A1AA] text-[11px] font-medium">Need to submit project brief?</span>
            <button
              onClick={() => {
                setIsOpen(false);
                onNavigateToContact();
              }}
              className="text-[#0047AB] dark:text-[#3B82F6] font-bold uppercase tracking-wider text-[11px] hover:underline"
            >
              Fill brief form →
            </button>
          </div>
        </div>
      )}

      {/* The Simple Blue Circle Button with Chat Logo in the Middle & Glass Specular Depth */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="glass-btn-primary w-14 h-14 rounded-full text-white shadow-2xl flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0047AB] relative"
        aria-label="Direct communication options"
        aria-expanded={isOpen}
        title="Direct Communication (Gmail & Telegram)"
      >
        {isOpen ? (
          <X className="w-6 h-6 transition-transform duration-200" />
        ) : (
          <>
            <span className="absolute top-0 right-0 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0047AB] dark:bg-[#3B82F6] opacity-75" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white dark:border-[#0E0E10]" />
            </span>
            <MessageCircle className="w-6 h-6" />
          </>
        )}
      </button>
    </div>
  );
}
