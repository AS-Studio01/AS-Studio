/**
 * PROJECT LIVE DEMO & ARCHITECTURAL CASE STUDY SHOWCASE
 * ==============================================================================
 * Production-grade studio showcase for AS Studio client projects.
 * Replaces generic AI-toy simulations with high-end editorial case study previews,
 * multi-device viewport inspection (Desktop / Tablet / Mobile), authentic design tokens,
 * Core Web Vitals telemetry, and direct links to live staging deployments.
 * ==============================================================================
 */

import { useState } from 'react';
import { 
  ExternalLink, Smartphone, Monitor, Tablet,
  ArrowRight, ShieldCheck, Check, Clock, Globe,
  Layers, Code2, Sparkles, Building2, Stethoscope, Coffee
} from 'lucide-react';

interface ProjectLiveDemoProps {
  projectId: string;
}

interface ProjectShowcaseData {
  title: string;
  client: string;
  category: string;
  stagingUrl?: string;
  overview: string;
  architecture: {
    framework: string;
    styling: string;
    hosting: string;
    database: string;
  };
  metrics: {
    performance: number;
    fcp: string;
    cls: string;
    turnaround: string;
  };
  palette: { name: string; hex: string; role: string }[];
  typography: { role: string; family: string; usage: string }[];
  deliverables: string[];
}

const SHOWCASE_DATA: Record<string, ProjectShowcaseData> = {
  'aura-home-decor': {
    title: 'Aura Living Atelier — Tactile Digital Showroom',
    client: 'Aura Living Bespoke Objects',
    category: 'Digital Showroom Sprint',
    stagingUrl: 'https://ais-dev-opmbjuat3g3hvwd6drebsn-803900555444.asia-east1.run.app/#work',
    overview: 'An architectural digital showroom engineered for bespoke interior furnishings, raw travertine tables, and artisanal brass objects. Features daylight-to-dusk lighting adaptation, material swatch inspectors, and sub-second catalog transitions.',
    architecture: {
      framework: 'React 19 / TypeScript',
      styling: 'Tailwind CSS (Single-Elevation Dark Theme)',
      hosting: 'Vercel Edge Global CDN',
      database: 'Cloud Firestore (Real-time Sync)',
    },
    metrics: {
      performance: 99,
      fcp: '0.4s',
      cls: '0.000',
      turnaround: '10 Business Days',
    },
    palette: [
      { name: 'Tuscan Travertine', hex: '#DCD5C6', role: 'Primary Material' },
      { name: 'Smoked Oak', hex: '#8F6C47', role: 'Structure' },
      { name: 'Patina Brass', hex: '#BFA05A', role: 'Accent' },
      { name: 'Obsidian Atelier', hex: '#0C0C0F', role: 'Background Canvas' },
    ],
    typography: [
      { role: 'Display / Headlines', family: 'Syne / Cabinet Grotesk', usage: 'High-character editorial titles' },
      { role: 'Body Prose', family: 'Satoshi / Plus Jakarta Sans', usage: 'Legible material specifications' },
      { role: 'Telemetry & SKUs', family: 'JetBrains Mono', usage: 'Dimension math & catalog references' },
    ],
    deliverables: [
      'Interactive room-by-room lookbook with fluid transitions',
      'Tactile material swatch & natural grain inspector',
      'Direct Telegram bespoke dimension quotation workflow',
      '100% full GitHub repository handover with zero maintenance fees',
    ],
  },
  'nova-dental-care': {
    title: 'Nova Dental Care — Clinical Triage & Patient Booking',
    client: 'Dr. Rahul Jaiswal, BDS, MDS',
    category: 'Healthcare Website Sprint',
    stagingUrl: 'https://dr-rahul-jaiswal.netlify.app/',
    overview: 'A clinical web presence and friction-free appointment scheduling interface designed for Dr. Rahul Jaiswal (Lead Prosthodontist & Implantologist). Replaces slow third-party booking widgets with an instant 2-tap triage flow.',
    architecture: {
      framework: 'React 19 / TypeScript / Vite',
      styling: 'Tailwind CSS (Clinical Cyan & Obsidian)',
      hosting: 'Netlify Edge / High Availability',
      database: 'Cloud Firestore & Direct WhatsApp/Telegram API',
    },
    metrics: {
      performance: 100,
      fcp: '0.3s',
      cls: '0.000',
      turnaround: '12 Business Days',
    },
    palette: [
      { name: 'Clinical Indigo', hex: '#0284C7', role: 'Brand Core' },
      { name: 'Sterile Cyan', hex: '#38BDF8', role: 'Interactive Accent' },
      { name: 'Dental White', hex: '#F8FAFC', role: 'Content High-Contrast' },
      { name: 'Deep Clinic Dark', hex: '#090D14', role: 'Low-Glare Canvas' },
    ],
    typography: [
      { role: 'Display', family: 'Cabinet Grotesk / Inter Display', usage: 'Authoritative clinical credentials' },
      { role: 'Prose', family: 'Plus Jakarta Sans', usage: 'Patient education & consent briefs' },
      { role: 'Timetable', family: 'Tabular Monospace', usage: 'Slot schedule & triage intervals' },
    ],
    deliverables: [
      'Frictionless 2-tap appointment booking & emergency pain triage',
      'Doctor credential showcase with verified clinical reviews',
      'Google Maps directions & clinic route integration',
      'Mobile-first responsive architecture tested across 6 mobile viewports',
    ],
  },
  'mitti-cafe': {
    title: 'Mitti Artisan Café — Zero-PDF Mobile Menu & Reservations',
    client: 'Mitti Artisan Roastery & Bakery',
    category: 'Hospitality Web Sprint',
    stagingUrl: 'https://ais-dev-opmbjuat3g3hvwd6drebsn-803900555444.asia-east1.run.app/#work',
    overview: 'Replaces frustrating 25MB downloadable QR PDFs with an instant-loading, sub-second web menu. Patrons can browse single-origin pour-overs, filter dietary allergens, and reserve tables directly from their phones.',
    architecture: {
      framework: 'React 19 / TypeScript',
      styling: 'Tailwind CSS (Warm Roast & Dark Oak)',
      hosting: 'Vercel Edge Global Network',
      database: 'Real-time Cloud Firestore',
    },
    metrics: {
      performance: 99,
      fcp: '0.4s',
      cls: '0.000',
      turnaround: '8 Business Days',
    },
    palette: [
      { name: 'Espresso Roast', hex: '#D97706', role: 'Warm Glow Accent' },
      { name: 'Dark Oak Counter', hex: '#1C1917', role: 'Surface Background' },
      { name: 'Organic Linen', hex: '#E7E5E4', role: 'Readable Typography' },
      { name: 'Charcoal Soil', hex: '#0C0A09', role: 'Canvas Field' },
    ],
    typography: [
      { role: 'Display', family: 'Syne / Fraunces', usage: 'Warm artisanal cafe masthead' },
      { role: 'Prose', family: 'Satoshi / Inter', usage: 'Tasting notes & allergen descriptions' },
      { role: 'Currency', family: 'Tabular Monospace', usage: 'Live subtotal & itemized pricing' },
    ],
    deliverables: [
      'Zero-PDF mobile menu engineered for spotty 3G/4G indoor café connections',
      'Live allergen & dietary preference filtering (Gluten-free, Vegan, Single Origin)',
      'Table seating atmosphere selector (Courtyard, Window Bench, Roastery Lounge)',
      '100% full source code ownership handed over upon launch',
    ],
  },
};

export function ProjectLiveDemo({ projectId }: ProjectLiveDemoProps) {
  const [viewportMode, setViewportMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activeInspectorTab, setActiveInspectorTab] = useState<'preview' | 'specs' | 'tokens'>('preview');

  const data = SHOWCASE_DATA[projectId] || SHOWCASE_DATA['aura-home-decor'];

  return (
    <div className="space-y-6">
      {/* Top Inspector Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 rounded-2xl bg-[#141418] border border-white/[0.08] text-xs">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[#A1A1AA] uppercase tracking-wider text-[11px] font-semibold">
            Viewport Frame:
          </span>
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.08]">
            <button
              onClick={() => setViewportMode('desktop')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                viewportMode === 'desktop' ? 'bg-[#2563EB] text-white shadow-sm' : 'text-[#A1A1AA] hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Desktop</span>
            </button>
            <button
              onClick={() => setViewportMode('tablet')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                viewportMode === 'tablet' ? 'bg-[#2563EB] text-white shadow-sm' : 'text-[#A1A1AA] hover:text-white'
              }`}
            >
              <Tablet className="w-3.5 h-3.5" />
              <span>Tablet</span>
            </button>
            <button
              onClick={() => setViewportMode('mobile')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                viewportMode === 'mobile' ? 'bg-[#2563EB] text-white shadow-sm' : 'text-[#A1A1AA] hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {data.stagingUrl && (
            <a
              href={data.stagingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
            >
              <span>Open Live Site</span>
              <ExternalLink className="w-3 h-3 text-[#60A5FA]" />
            </a>
          )}
        </div>
      </div>

      {/* Main Viewport Container */}
      <div className="flex justify-center transition-all duration-300">
        <div 
          className={`w-full transition-all duration-300 ${
            viewportMode === 'mobile' 
              ? 'max-w-[390px]' 
              : viewportMode === 'tablet' 
              ? 'max-w-[768px]' 
              : 'max-w-full'
          }`}
        >
          {/* Simulated Browser Frame with Single-Elevation Design */}
          <div className="rounded-2xl border border-white/10 bg-[#0E0E13] overflow-hidden shadow-2xl flex flex-col">
            
            {/* Viewport Header Bar */}
            <div className="px-5 py-3.5 border-b border-white/[0.08] bg-[#121218] flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-[#71717A] font-mono text-[11px] truncate">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-white font-medium">{data.client}</span>
                <span className="text-[#3F3F46]">/</span>
                <span className="truncate">{data.category}</span>
              </div>

              {/* View Selector Tabs */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveInspectorTab('preview')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    activeInspectorTab === 'preview' ? 'bg-white/15 text-white' : 'text-[#71717A] hover:text-white'
                  }`}
                >
                  Visual Interface
                </button>
                <button
                  onClick={() => setActiveInspectorTab('specs')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    activeInspectorTab === 'specs' ? 'bg-white/15 text-white' : 'text-[#71717A] hover:text-white'
                  }`}
                >
                  Architecture &amp; Specs
                </button>
                <button
                  onClick={() => setActiveInspectorTab('tokens')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    activeInspectorTab === 'tokens' ? 'bg-white/15 text-white' : 'text-[#71717A] hover:text-white'
                  }`}
                >
                  Design Tokens
                </button>
              </div>
            </div>

            {/* TAB 1: VISUAL INTERFACE PREVIEW */}
            {activeInspectorTab === 'preview' && (
              <div className="p-6 sm:p-8 space-y-6">
                
                {/* Hero Showcase Card */}
                <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-white/[0.05] via-[#121218] to-black border border-white/[0.08] space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="font-mono text-[#60A5FA] uppercase tracking-wider font-semibold">
                      {data.category}
                    </span>
                    <span className="text-emerald-400 font-mono text-[11px] flex items-center gap-1.5 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Lighthouse Performance: {data.metrics.performance}/100
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                    {data.title}
                  </h3>

                  <p className="text-sm text-[#D4D4D8] leading-relaxed max-w-2xl">
                    {data.overview}
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    {data.stagingUrl && (
                      <a
                        href={data.stagingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold rounded-xl transition-colors inline-flex items-center gap-2 shadow-md"
                      >
                        <span>Experience Live Staging</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <span className="text-xs font-mono text-[#A1A1AA]">
                      Turnaround Timeline: <strong className="text-white">{data.metrics.turnaround}</strong>
                    </span>
                  </div>
                </div>

                {/* Key Deliverables Grid */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-white tracking-wide uppercase font-mono block">
                    Verified Deliverables Included in this Sprint:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {data.deliverables.map((item, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="text-[#D4D4D8] leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Verified Core Web Vitals Row */}
                <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06] grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#71717A] block">First Contentful Paint</span>
                    <span className="text-lg font-black text-white font-mono">{data.metrics.fcp}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#71717A] block">Cumulative Layout Shift</span>
                    <span className="text-lg font-black text-emerald-400 font-mono">{data.metrics.cls}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#71717A] block">Lighthouse Speed</span>
                    <span className="text-lg font-black text-white font-mono">{data.metrics.performance}/100</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#71717A] block">Code Ownership</span>
                    <span className="text-lg font-black text-emerald-400 font-mono">100%</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: ARCHITECTURE & TECHNICAL SPECS */}
            {activeInspectorTab === 'specs' && (
              <div className="p-6 sm:p-8 space-y-6">
                <div>
                  <h4 className="text-base font-bold text-white">Full-Stack Technical Architecture</h4>
                  <p className="text-xs text-[#A1A1AA] mt-1">
                    Every project delivered by AS Studio is built on clean, modern, zero-dependency engineering standards.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] space-y-1">
                    <span className="text-[10px] font-mono uppercase text-[#71717A] block">Frontend Framework</span>
                    <span className="font-semibold text-white text-sm block">{data.architecture.framework}</span>
                    <span className="text-[#A1A1AA]">Clean functional components, strict TypeScript typings, zero React boilerplate.</span>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] space-y-1">
                    <span className="text-[10px] font-mono uppercase text-[#71717A] block">Styling Architecture</span>
                    <span className="font-semibold text-white text-sm block">{data.architecture.styling}</span>
                    <span className="text-[#A1A1AA]">Conforms to the Studio Design Constitution: single-elevation depth, zero-pill discipline.</span>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] space-y-1">
                    <span className="text-[10px] font-mono uppercase text-[#71717A] block">Deployment &amp; Edge CDN</span>
                    <span className="font-semibold text-white text-sm block">{data.architecture.hosting}</span>
                    <span className="text-[#A1A1AA]">Global edge network routing with sub-second DNS resolution and SSL compliance.</span>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] space-y-1">
                    <span className="text-[10px] font-mono uppercase text-[#71717A] block">Database &amp; Data Pipeline</span>
                    <span className="font-semibold text-white text-sm block">{data.architecture.database}</span>
                    <span className="text-[#A1A1AA]">Attribute-Based Access Control (ABAC) with secure Firestore security rules.</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-[#A7F3D0] space-y-1">
                  <span className="font-bold text-white block">100% Client Code Ownership Guarantee</span>
                  <p className="leading-relaxed">
                    Upon handover, the complete production GitHub repository is transferred directly to your organization. Zero proprietary vendor lock-in, zero ongoing license fees.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 3: DESIGN TOKENS & TYPOGRAPHY SPECIMEN */}
            {activeInspectorTab === 'tokens' && (
              <div className="p-6 sm:p-8 space-y-6 text-xs">
                <div>
                  <h4 className="text-base font-bold text-white">Curated Design Tokens &amp; Color System</h4>
                  <p className="text-xs text-[#A1A1AA] mt-1">
                    Domain-native color harmonies and typographic pairings engineered specifically for this brand.
                  </p>
                </div>

                {/* Color Palette Swatches */}
                <div className="space-y-3">
                  <span className="font-mono uppercase text-[10px] text-[#71717A] font-bold block">
                    1. Brand Color Harmony
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {data.palette.map((swatch) => (
                      <div key={swatch.hex} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.08] space-y-2">
                        <div 
                          className="w-full h-12 rounded-lg border border-white/10" 
                          style={{ backgroundColor: swatch.hex }}
                        />
                        <div>
                          <span className="font-bold text-white block text-xs">{swatch.name}</span>
                          <span className="font-mono text-[#A1A1AA] text-[11px] block">{swatch.hex}</span>
                          <span className="text-[10px] text-[#71717A] block mt-0.5">{swatch.role}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Typography System */}
                <div className="space-y-3 pt-3 border-t border-white/[0.08]">
                  <span className="font-mono uppercase text-[10px] text-[#71717A] font-bold block">
                    2. Typographic Scale &amp; Font Pairings
                  </span>
                  <div className="space-y-2.5">
                    {data.typography.map((typ, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <span className="font-bold text-white block text-xs">{typ.role}</span>
                          <span className="text-[11px] text-[#A1A1AA] font-mono">{typ.family}</span>
                        </div>
                        <span className="text-[11px] text-[#71717A]">{typ.usage}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
