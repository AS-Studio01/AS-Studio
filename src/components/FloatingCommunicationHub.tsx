import { Bot } from 'lucide-react';

interface FloatingCommunicationHubProps {
  onNavigateToContact: () => void;
  onOpenAIChat: () => void;
}

export function FloatingCommunicationHub({ onOpenAIChat }: FloatingCommunicationHubProps) {
  return (
    /* Elevated cleanly above the footer rights reserved & legal compliance strip */
    <div className="fixed bottom-20 sm:bottom-24 md:bottom-24 right-4 sm:right-6 md:right-8 z-40 flex items-center gap-3 pointer-events-auto">
      {/* Tooltip hint on hover (Hidden on mobile to preserve screen space) */}
      <span className="hidden sm:inline-block px-3 py-1.5 bg-[#18181B] border border-[#27272A] text-xs font-bold text-white rounded-full shadow-lg pointer-events-none fade-in">
        Ask AS Studio Helper AI or Get Direct Contact
      </span>

      {/* The Primary Direct AI Launcher Button */}
      <button
        onClick={onOpenAIChat}
        className="glass-btn-primary w-13 h-13 sm:w-14 sm:h-14 rounded-full text-white shadow-2xl flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B82F6] relative group"
        aria-label="Open AS Studio Helper AI"
        title="Open AS Studio Helper AI & Direct Contact"
      >
        <span className="absolute top-0 right-0 flex h-3.5 w-3.5">
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-[#0E0E10] shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
        </span>
        <Bot className="w-5.5 h-5.5 sm:w-6 sm:h-6 transition-transform group-hover:scale-110" />
      </button>
    </div>
  );
}
