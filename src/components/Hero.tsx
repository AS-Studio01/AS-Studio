import { useState } from 'react';
import { 
  ArrowRight, ShieldCheck, Zap, Lock, Sparkles, Smartphone, Monitor, 
  Star, CheckCircle2, Sun, Moon, Plus, Minus, Check, Calendar, Coffee,
  Armchair, Stethoscope
} from 'lucide-react';
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

  // Interactive micro-states for live staging hero preview
  const [clinicService, setClinicService] = useState<'aligners' | 'smile' | 'implants'>('aligners');
  const [clinicBooked, setClinicBooked] = useState(false);

  const [decorLighting, setDecorLighting] = useState<'day' | 'evening'>('evening');
  const [decorSwatch, setDecorSwatch] = useState<'travertine' | 'oak' | 'brass'>('travertine');

  const [cafeCoffeeQty, setCafeCoffeeQty] = useState(1);
  const [cafeBunQty, setCafeBunQty] = useState(1);
  const [cafeOrdered, setCafeOrdered] = useState(false);

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
                className="glass-btn-primary px-7 py-3.5 text-xs uppercase tracking-wider text-white shadow-lg rounded-xl"
              >
                <span>{brand.primaryCta || 'Start a project'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('work')}
                className="glass-btn px-7 py-3.5 text-xs uppercase tracking-wider text-white rounded-xl"
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

            {/* Four Studio Guarantees */}
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

          {/* Right Column: Interactive Staging Preview Device Frame */}
          <div className="lg:col-span-5 relative">
            <div className="glass-card p-5 sm:p-6 space-y-4 shadow-2xl border-white/15">
              
              {/* Device Header Bar & Viewport Switcher */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EC4899] animate-pulse" />
                  <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                    Live Smartphone Staging
                  </span>
                </div>
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
                  onClick={() => {
                    setPreviewTab('clinic');
                    setClinicBooked(false);
                  }}
                  className={`py-1.5 text-[11px] font-bold rounded-lg transition-colors ${
                    previewTab === 'clinic' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm' : 'text-[#A1A1AA] hover:text-white'
                  }`}
                >
                  Clinic Triage
                </button>
                <button
                  onClick={() => setPreviewTab('decor')}
                  className={`py-1.5 text-[11px] font-bold rounded-lg transition-colors ${
                    previewTab === 'decor' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shadow-sm' : 'text-[#A1A1AA] hover:text-white'
                  }`}
                >
                  Home Decor
                </button>
                <button
                  onClick={() => {
                    setPreviewTab('cafe');
                    setCafeOrdered(false);
                  }}
                  className={`py-1.5 text-[11px] font-bold rounded-lg transition-colors ${
                    previewTab === 'cafe' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm' : 'text-[#A1A1AA] hover:text-white'
                  }`}
                >
                  Café Menu
                </button>
              </div>

              {/* Dynamic Interactive Mini-App Inside the Browser Frame */}
              <div className={`p-4 rounded-xl bg-[#090B0E] border border-white/10 transition-all duration-300 ${deviceMode === 'mobile' ? 'max-w-[320px] mx-auto' : 'w-full'}`}>
                
                {/* 1. CLINIC TRIAGE LIVE INTERACTION */}
                {previewTab === 'clinic' && (
                  <div className="space-y-3 font-sans">
                    <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                      <div className="flex items-center gap-1.5">
                        <Stethoscope className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="text-[11px] font-black text-white font-mono tracking-wider">APEX DENTAL CLINIC</span>
                      </div>
                      <span className="text-[9px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        Open Now
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-[#A1A1AA] block">Dr. Rahul Jaiswal, BDS, MDS</span>
                      <p className="text-xs font-bold text-white">
                        Select consultation reason:
                      </p>
                    </div>

                    {/* Interactive Service Buttons */}
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { id: 'aligners', label: 'Aligners', icon: '✨' },
                        { id: 'smile', label: 'Veneers', icon: '💎' },
                        { id: 'implants', label: 'Implants', icon: '🦷' },
                      ].map((s) => (
                        <button
                          key={s.id}
                          onClick={() => {
                            setClinicService(s.id as any);
                            setClinicBooked(false);
                          }}
                          className={`py-1.5 px-1 rounded-lg text-[10px] font-mono font-bold transition-all border ${
                            clinicService === s.id
                              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
                              : 'bg-white/[0.02] border-white/10 text-[#A1A1AA] hover:text-white'
                          }`}
                        >
                          {s.icon} {s.label}
                        </button>
                      ))}
                    </div>

                    {/* Dynamic appointment slot status */}
                    <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-white">
                        <span className="text-[#A1A1AA]">Next Available Slot:</span>
                        <span className="text-cyan-400 font-bold font-mono">Tomorrow · 10:30 AM</span>
                      </div>
                    </div>

                    {clinicBooked ? (
                      <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold text-center flex items-center justify-center gap-1.5 animate-in fade-in">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Pass #APX-482 Reserved for 10:30 AM!</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => setClinicBooked(true)}
                        className="w-full glass-btn-primary py-2 text-[11px] font-bold uppercase rounded-lg justify-center flex items-center gap-1.5"
                      >
                        <Calendar className="w-3 h-3" />
                        <span>Simulate 1-Tap Booking</span>
                      </button>
                    )}
                  </div>
                )}

                {/* 2. AURA HOME DECOR LIVE INTERACTION */}
                {previewTab === 'decor' && (
                  <div className="space-y-3 font-sans">
                    <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                      <div className="flex items-center gap-1.5">
                        <Armchair className="w-3.5 h-3.5 text-indigo-400" />
                        <span className="text-[11px] font-black text-white font-mono tracking-wider">AURA LIVING ATELIER</span>
                      </div>
                      {/* Interactive Lighting Toggle */}
                      <button
                        onClick={() => setDecorLighting(decorLighting === 'day' ? 'evening' : 'day')}
                        className="flex items-center gap-1 text-[10px] font-mono text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded-full border border-indigo-500/30"
                      >
                        {decorLighting === 'day' ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
                        <span>{decorLighting === 'day' ? '5000K' : '2700K'}</span>
                      </button>
                    </div>

                    <div className="aspect-[16/9] w-full rounded-xl overflow-hidden relative border border-white/10 group">
                      <img
                        src={decorLighting === 'day' 
                          ? 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80'
                          : 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80'
                        }
                        alt="Aura Living interior piece"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5 justify-between">
                        <span className="text-[11px] font-bold text-white">Monolith Lounge Table</span>
                        <span className="text-[10px] font-mono text-emerald-400 font-bold">$1,450 USD</span>
                      </div>
                    </div>

                    {/* Interactive Material Chips */}
                    <div className="flex items-center justify-between gap-1 pt-1">
                      {[
                        { id: 'travertine', label: 'Travertine', color: '#DCD5C6' },
                        { id: 'oak', label: 'Smoked Oak', color: '#8F6C47' },
                        { id: 'brass', label: 'Brass Halo', color: '#BFA05A' },
                      ].map((m) => (
                        <button
                          key={m.id}
                          onClick={() => setDecorSwatch(m.id as any)}
                          className={`flex-1 py-1 px-1.5 rounded-lg flex items-center justify-center gap-1 border text-[10px] font-mono ${
                            decorSwatch === m.id
                              ? 'border-indigo-400 bg-indigo-500/20 text-white font-bold'
                              : 'border-white/10 bg-white/[0.02] text-[#A1A1AA]'
                          }`}
                        >
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: m.color }} />
                          <span>{m.label}</span>
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => onNavigate('work')}
                      className="w-full glass-btn py-1.5 text-[10px] uppercase font-bold rounded-lg justify-center text-white flex items-center gap-1"
                    >
                      <span>Open Full 3D Showroom</span>
                      <ArrowRight className="w-3 h-3 text-indigo-400" />
                    </button>
                  </div>
                )}

                {/* 3. CAFÉ MENU & INSTANT ORDER LIVE INTERACTION */}
                {previewTab === 'cafe' && (
                  <div className="space-y-3 font-sans">
                    <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                      <div className="flex items-center gap-1.5">
                        <Coffee className="w-3.5 h-3.5 text-amber-400" />
                        <span className="text-[11px] font-black text-white font-mono tracking-wider">MITTI CAFÉ</span>
                      </div>
                      <span className="text-[9px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        Zero-PDF
                      </span>
                    </div>

                    {/* Interactive Item Steppers */}
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between items-center p-2 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                        <div>
                          <span className="text-white font-bold block text-[11px]">Single Origin Pourover</span>
                          <span className="text-[10px] text-amber-400 font-mono font-bold">$4.50</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setCafeCoffeeQty(Math.max(0, cafeCoffeeQty - 1))}
                            className="w-5 h-5 rounded bg-white/10 flex items-center justify-center text-white text-xs"
                          >
                            <Minus className="w-2.5 h-2.5" />
                          </button>
                          <span className="font-mono text-white text-[11px] w-3 text-center">{cafeCoffeeQty}</span>
                          <button
                            onClick={() => setCafeCoffeeQty(cafeCoffeeQty + 1)}
                            className="w-5 h-5 rounded bg-white/10 flex items-center justify-center text-white text-xs"
                          >
                            <Plus className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-between items-center p-2 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                        <div>
                          <span className="text-white font-bold block text-[11px]">Cardamom Sourdough Knot</span>
                          <span className="text-amber-400 font-mono font-bold">$3.80</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setCafeBunQty(Math.max(0, cafeBunQty - 1))}
                            className="w-5 h-5 rounded bg-white/10 flex items-center justify-center text-white text-xs"
                          >
                            <Minus className="w-2.5 h-2.5" />
                          </button>
                          <span className="font-mono text-white text-[11px] w-3 text-center">{cafeBunQty}</span>
                          <button
                            onClick={() => setCafeBunQty(cafeBunQty + 1)}
                            className="w-5 h-5 rounded bg-white/10 flex items-center justify-center text-white text-xs"
                          >
                            <Plus className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Total pill */}
                    <div className="flex items-center justify-between text-[11px] font-mono p-1.5 bg-amber-500/10 rounded-lg border border-amber-500/20 text-amber-300">
                      <span>Live Order (Table 4):</span>
                      <span className="font-bold font-mono text-white">
                        ${(cafeCoffeeQty * 4.5 + cafeBunQty * 3.8).toFixed(2)} USD
                      </span>
                    </div>

                    {cafeOrdered ? (
                      <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold text-center flex items-center justify-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Order dispatched to barista counter!</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => setCafeOrdered(true)}
                        className="w-full glass-btn-primary py-2 text-[11px] font-bold rounded-lg justify-center flex items-center gap-1"
                      >
                        <span>Simulate Instant Table Order</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
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
                  View full prototypes →
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
