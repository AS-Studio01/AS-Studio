import { useState } from 'react';
import { ArrowRight, ShieldCheck, Zap, Lock, Sparkles, Smartphone, Monitor, Star, CheckCircle2 } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';
import { PageType } from '../types';

interface HeroProps {
  onNavigate: (page: PageType) => void;
}

export function Hero({ onNavigate }: HeroProps) {
  const { content } = useSiteContent();
  const brand = content.brand;
  const [previewTab, setPreviewTab] = useState<'clinic' | 'decor' | 'cafe'>('clinic');
  const [deviceMode, setDeviceMode] = useState<'mobile' | 'desktop'>('mobile');

  const guarantees = [
    { label: 'Turnaround Sprint', value: '7–14 Days', note: 'Fast staging preview', icon: Zap },
    { label: 'Code Ownership', value: '100% Complete', note: 'Full GitHub handover', icon: Lock },
    { label: 'Pricing Model', value: 'Negotiable', note: 'Adapts to your budget', icon: ShieldCheck },
    { label: 'Post-Launch', value: '30-Day Warranty', note: 'Free technical fixes', icon: Sparkles },
  ];

  return (
    <section className="relative pt-10 pb-16 sm:pt-20 sm:pb-24 landscape:pt-8 landscape:pb-12 zone-hero border-b border-white/[0.08] overflow-hidden">
      {/* Ambient background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[680px] h-[340px] bg-gradient-to-tr from-[var(--hero-accent)]/15 to-[var(--accent)]/10 blur-[90px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Brand Storytelling & Primary CTAs */}
          <div className="lg:col-span-7 space-y-6">
            {/* Domain & Location Kicker Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-md text-[11px] text-[#A1A1AA]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold text-white uppercase tracking-wider">{brand.studioLabel || 'AS Studio'}</span>
              <span className="text-[#52525B]">·</span>
              <span className="truncate max-w-[280px] sm:max-w-none">{brand.eyebrow}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-[1.08]">
              {brand.headline}
            </h1>

            {/* Subtitle Paragraph */}
            <p className="text-base sm:text-lg text-[#D4D4D8] leading-relaxed font-normal max-w-xl">
              {brand.description}
            </p>

            {/* Primary & Secondary Pill Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('contact')}
                className="glass-btn-primary px-7 py-3.5 text-xs uppercase tracking-wider text-white shadow-lg"
              >
                <span>{brand.primaryCta || 'Start a project'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('work')}
                className="glass-btn px-7 py-3.5 text-xs uppercase tracking-wider text-white"
              >
                <span>{brand.secondaryCta || 'View selected work'}</span>
                <ArrowRight className="w-4 h-4 text-[#60A5FA]" />
              </button>
            </div>

            {/* Client Reassurance Badge */}
            <div className="flex items-center gap-2 text-xs text-[#A1A1AA] pt-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{brand.reassurance}</span>
            </div>

            {/* Four Studio Guarantees (Medical & Creative Quality Standard) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/[0.08]">
              {guarantees.map((g) => {
                const IconComponent = g.icon;
                return (
                  <div key={g.label} className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] text-[#A1A1AA] font-mono uppercase tracking-wider">
                      <IconComponent className="w-3.5 h-3.5 text-[var(--accent)]" />
                      <span>{g.label}</span>
                    </div>
                    <div className="text-xs font-bold text-white">{g.value}</div>
                    <div className="text-[10px] text-[#71717A] truncate">{g.note}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Floating Interactive Showroom & Triage Preview */}
          <div className="lg:col-span-5 relative">
            <div className="glass-card p-5 sm:p-6 space-y-4">
              {/* Preview Header & Controls */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EC4899]" />
                  <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                    Interactive Live Staging
                  </span>
                </div>
                {/* Viewport device switcher */}
                <div className="flex items-center gap-1 p-0.5 rounded-full bg-white/[0.06] border border-white/10">
                  <button
                    onClick={() => setDeviceMode('mobile')}
                    className={`p-1.5 rounded-full transition-colors ${
                      deviceMode === 'mobile' ? 'bg-[#2563EB] text-white' : 'text-[#A1A1AA] hover:text-white'
                    }`}
                    title="Mobile Viewport"
                    aria-label="Mobile Viewport"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeviceMode('desktop')}
                    className={`p-1.5 rounded-full transition-colors ${
                      deviceMode === 'desktop' ? 'bg-[#2563EB] text-white' : 'text-[#A1A1AA] hover:text-white'
                    }`}
                    title="Desktop Viewport"
                    aria-label="Desktop Viewport"
                  >
                    <Monitor className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Prototype Category Switcher Tabs */}
              <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <button
                  onClick={() => setPreviewTab('clinic')}
                  className={`py-1.5 text-[11px] font-bold rounded-lg transition-colors ${
                    previewTab === 'clinic' ? 'bg-white/15 text-white shadow-sm' : 'text-[#A1A1AA] hover:text-white'
                  }`}
                >
                  Clinic Triage
                </button>
                <button
                  onClick={() => setPreviewTab('decor')}
                  className={`py-1.5 text-[11px] font-bold rounded-lg transition-colors ${
                    previewTab === 'decor' ? 'bg-white/15 text-white shadow-sm' : 'text-[#A1A1AA] hover:text-white'
                  }`}
                >
                  Home Decor
                </button>
                <button
                  onClick={() => setPreviewTab('cafe')}
                  className={`py-1.5 text-[11px] font-bold rounded-lg transition-colors ${
                    previewTab === 'cafe' ? 'bg-white/15 text-white shadow-sm' : 'text-[#A1A1AA] hover:text-white'
                  }`}
                >
                  Café Menu
                </button>
              </div>

              {/* Dynamic Preview Container with Browser Frame */}
              <div className={`demo-browser p-4 transition-all duration-300 ${deviceMode === 'mobile' ? 'max-w-[320px] mx-auto' : 'w-full'}`}>
                {previewTab === 'clinic' && (
                  <div className="space-y-3 font-sans">
                    <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                      <span className="text-[11px] font-black text-cyan-400 font-mono tracking-wider">APEX DENTAL CLINIC</span>
                      <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">Open Today</span>
                    </div>
                    <p className="text-xs font-bold text-white leading-snug">
                      Comprehensive Smile Aesthetics & Implantology
                    </p>
                    <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] space-y-1">
                      <span className="text-[10px] uppercase font-mono text-[#A1A1AA] block">Quick Appointment Triage</span>
                      <div className="flex items-center justify-between text-xs text-white">
                        <span>Tomorrow at 10:30 AM</span>
                        <span className="text-cyan-400 font-bold">Selected</span>
                      </div>
                    </div>
                    <button
                      onClick={() => onNavigate('work')}
                      className="w-full glass-btn-primary py-2 text-[11px] font-bold rounded-full justify-center"
                    >
                      <span>Explore Clinic Demo</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {previewTab === 'decor' && (
                  <div className="space-y-3 font-sans">
                    <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                      <span className="text-[11px] font-black text-indigo-400 font-mono tracking-wider">AURA LIVING ATELIER</span>
                      <span className="text-[10px] text-[#A1A1AA] font-mono">Lookbook 2026</span>
                    </div>
                    <div className="aspect-video w-full rounded-xl bg-neutral-900 border border-white/10 overflow-hidden relative flex items-center justify-center">
                      <img
                        src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80"
                        alt="Sculptural travertine lamp and minimalist lounge chair in a modern aesthetic atelier"
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-2.5">
                        <span className="text-[11px] font-bold text-white">Travertine & Oak Collection</span>
                      </div>
                    </div>
                    <button
                      onClick={() => onNavigate('work')}
                      className="w-full glass-btn py-2 text-[11px] font-bold rounded-full justify-center text-white"
                    >
                      <span>Inspect Material Swatches</span>
                      <ArrowRight className="w-3 h-3 text-indigo-400" />
                    </button>
                  </div>
                )}

                {previewTab === 'cafe' && (
                  <div className="space-y-3 font-sans">
                    <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                      <span className="text-[11px] font-black text-amber-400 font-mono tracking-wider">MITTI ARTISAN CAFÉ</span>
                      <span className="text-[10px] text-emerald-400 font-bold">Zero-PDF Menu</span>
                    </div>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between items-center p-2 rounded-lg bg-white/[0.03]">
                        <span className="text-white font-medium">Single Origin Pourover</span>
                        <span className="text-amber-400 font-mono font-bold">$4.50</span>
                      </div>
                      <div className="flex justify-between items-center p-2 rounded-lg bg-white/[0.03]">
                        <span className="text-white font-medium">Sourdough Cardamom Buns</span>
                        <span className="text-amber-400 font-mono font-bold">$3.80</span>
                      </div>
                    </div>
                    <button
                      onClick={() => onNavigate('work')}
                      className="w-full glass-btn-primary py-2 text-[11px] font-bold rounded-full justify-center"
                    >
                      <span>View Live Reservation Demo</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              {/* Bottom Card Footer */}
              <div className="flex items-center justify-between text-[11px] text-[#A1A1AA] pt-1">
                <span className="flex items-center gap-1 font-mono">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>Sub-second mobile speed guarantee</span>
                </span>
                <button
                  onClick={() => onNavigate('work')}
                  className="text-white font-bold hover:text-[var(--accent)] transition-colors underline"
                >
                  View all 3 prototypes →
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
