/**
 * FIXED BOTTOM LEGAL & COMPLIANCE BAR
 * ==============================================================================
 * Persistent viewport footer pinned to the bottom of all pages.
 * Displays All Rights Reserved copyright and explicit agreement notice with
 * interactive links to Privacy Policy, Terms of Service, and Disclaimer.
 * Designed to never be hidden or overlapped by floating controls.
 * ==============================================================================
 */

import React from 'react';

interface FixedBottomLegalBarProps {
  onOpenLegal: (type: 'privacy' | 'terms' | 'disclaimer') => void;
}

export function FixedBottomLegalBar({ onOpenLegal }: FixedBottomLegalBarProps) {
  return (
    <aside 
      aria-label="Legal & Compliance Notice" 
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#0A0A0D]/95 backdrop-blur-md border-t border-[#27272A] py-2 px-4 sm:px-6 shadow-[0_-8px_25px_rgba(0,0,0,0.45)] text-[11px] sm:text-xs text-[#A1A1AA] transition-all"
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-4 text-center sm:text-left font-sans">
        {/* Left: Copyright and Agreement Statement */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 sm:gap-2">
          <span className="inline-flex items-center gap-1.5 font-bold text-white shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 shadow-[0_0_6px_rgba(52,211,153,0.8)]" title="System Operational" />
            <span>© 2026 AS Studio. All rights reserved.</span>
          </span>
          <span className="hidden md:inline text-[#3F3F46]">|</span>
          <span className="text-[#8E8E93] dark:text-[#A1A1AA]">
            By continuing, you agree to our policies & terms.
          </span>
        </div>

        {/* Right: Explicit Clickable Policy Links */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 font-mono text-[11px] font-bold text-[#60A5FA] shrink-0">
          <button
            onClick={() => onOpenLegal('privacy')}
            className="hover:text-white hover:underline underline-offset-4 decoration-[#60A5FA]/40 transition-colors"
          >
            Privacy Policy
          </button>
          <span className="text-[#3F3F46]">·</span>
          <button
            onClick={() => onOpenLegal('terms')}
            className="hover:text-white hover:underline underline-offset-4 decoration-[#60A5FA]/40 transition-colors"
          >
            Terms of Service
          </button>
          <span className="text-[#3F3F46]">·</span>
          <button
            onClick={() => onOpenLegal('disclaimer')}
            className="hover:text-white hover:underline underline-offset-4 decoration-[#60A5FA]/40 transition-colors"
          >
            Disclaimer
          </button>
        </div>
      </div>
    </aside>
  );
}
