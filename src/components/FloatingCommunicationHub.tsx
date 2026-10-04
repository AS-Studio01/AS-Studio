import { useState } from 'react';
import { MessageSquare, Bot, Send, Mail, X, ArrowUpRight } from 'lucide-react';
import { STUDIO_CONTACT, buildMailtoLink, buildTelegramLink } from '../constants/communication';

interface FloatingCommunicationHubProps {
  onNavigateToContact?: () => void;
  onOpenAIChat?: () => void;
}

export function FloatingCommunicationHub({ onNavigateToContact, onOpenAIChat }: FloatingCommunicationHubProps) {
  const [isOpen, setIsOpen] = useState(false);

  const telegramLink = buildTelegramLink('Hi AS Studio, I would like to discuss a new website sprint.');
  const emailLink = buildMailtoLink('Project Inquiry — AS Studio Sprint', 'Hi AS Studio team,\n\nI would like to discuss commissioning a website project.\n\nEstimated Timeline:\nKey Requirements:');

  return (
    <div className="fixed bottom-20 sm:bottom-24 right-4 sm:right-6 md:right-8 z-40 flex flex-col items-end gap-2 pointer-events-auto">
      {/* Expanded Quick Communication Drawer */}
      {isOpen && (
        <div className="mb-2 p-3.5 bg-[#141418] border border-white/15 rounded-2xl shadow-2xl flex flex-col gap-2 w-64 text-xs font-sans animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
            <span className="font-bold text-white tracking-wide">Direct Studio Channels</span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[#71717A] hover:text-white p-0.5 rounded"
              aria-label="Close channels"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <a
            href={telegramLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-2 rounded-xl bg-white/[0.04] hover:bg-[#2563EB]/20 border border-white/[0.06] hover:border-[#3B82F6]/40 text-white transition-colors group"
          >
            <div className="flex items-center gap-2">
              <Send className="w-3.5 h-3.5 text-[#38BDF8]" />
              <div>
                <span className="font-semibold block text-white text-xs">Telegram</span>
                <span className="text-[10px] text-[#A1A1AA] font-mono">{STUDIO_CONTACT.telegramHandle}</span>
              </div>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#71717A] group-hover:text-white" />
          </a>

          <a
            href={emailLink}
            className="flex items-center justify-between p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] hover:border-white/20 text-white transition-colors group"
          >
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-rose-400" />
              <div>
                <span className="font-semibold block text-white text-xs">Direct Gmail</span>
                <span className="text-[10px] text-[#A1A1AA] font-mono truncate max-w-[120px] block">{STUDIO_CONTACT.email}</span>
              </div>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#71717A] group-hover:text-white" />
          </a>

          {onNavigateToContact && (
            <button
              onClick={() => {
                setIsOpen(false);
                onNavigateToContact();
              }}
              className="w-full mt-1 py-2 px-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-xs rounded-xl transition-colors text-center shadow-md"
            >
              Start Project Brief
            </button>
          )}
        </div>
      )}

      {/* Floating actions: AI assistant + direct contact */}
      <div className="flex items-center gap-2">
        {onOpenAIChat && (
          <button
            onClick={onOpenAIChat}
            className="relative grid h-12 w-12 place-items-center rounded-full border border-cyan-300/25 bg-gradient-to-br from-violet-500 to-cyan-400 text-white shadow-[0_12px_36px_rgba(56,189,248,.25)] transition-all duration-300 hover:-translate-y-1 hover:scale-105 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300 group"
            aria-label="Open AS Studio AI assistant"
            title="Ask AS Studio"
          >
            <span className="absolute inset-0 rounded-full animate-ping bg-cyan-400/10 pointer-events-none" />
            <Bot className="relative w-5 h-5 transition-transform duration-300 group-hover:rotate-6" />
          </button>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="glass-btn-primary w-12 h-12 sm:w-13 sm:h-13 rounded-full text-white shadow-2xl flex items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:scale-105 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#3B82F6] relative group"
          aria-label="Direct studio communication"
          title="Direct Studio Contact"
        >
          <span className="absolute top-0 right-0 flex h-3 w-3">
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400 border-2 border-[#0E0E10]" />
          </span>
          {isOpen ? <X className="w-5 h-5 text-white" /> : <MessageSquare className="w-5 h-5 text-white transition-transform group-hover:scale-110" />}
        </button>
      </div>
    </div>
  );
}
