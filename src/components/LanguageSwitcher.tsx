/**
 * LANGUAGE SWITCHER COMPONENT
 * ==============================================================================
 * A sleek, high-taste dropdown allowing visitors to switch languages
 * (English, Hindi, German, Japanese, French, Spanish).
 * ==============================================================================
 */

import { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguage, SUPPORTED_LANGUAGES, LanguageCode } from '../context/LanguageContext';

interface LanguageSwitcherProps {
  compact?: boolean;
}

export function LanguageSwitcher({ compact = false }: LanguageSwitcherProps) {
  const { currentLanguage, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentOption = SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="glass-btn px-2.5 py-1.5 text-xs font-semibold text-[#D4D4D8] hover:text-white flex items-center gap-1.5 border border-white/10 hover:border-white/30 rounded-lg transition-all"
        aria-label="Select language"
        title={`Current Language: ${currentOption.name}`}
      >
        <Globe className="w-3.5 h-3.5 text-[#60A5FA]" />
        <span className="font-mono uppercase font-bold text-[11px]">{currentOption.code}</span>
        {!compact && (
          <span className="hidden xl:inline text-xs text-[#A1A1AA]">{currentOption.nativeName}</span>
        )}
        <ChevronDown className="w-3 h-3 text-[#71717A] ml-0.5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-44 rounded-xl bg-[#141418] border border-[#27272A] shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-1 text-[10px] uppercase font-mono tracking-wider text-[#71717A] border-b border-white/5 font-bold">
            Select Language
          </div>
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code as LanguageCode);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors ${
                currentLanguage === lang.code
                  ? 'bg-[#3B82F6]/15 text-[#60A5FA] font-bold'
                  : 'text-[#D4D4D8] hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-2">
                <span>{lang.flag}</span>
                <span>{lang.nativeName}</span>
                <span className="text-[10px] text-[#71717A] uppercase font-mono">({lang.code})</span>
              </span>
              {currentLanguage === lang.code && <Check className="w-3.5 h-3.5 text-[#60A5FA]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
