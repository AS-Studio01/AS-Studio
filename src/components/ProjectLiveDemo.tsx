import { useState } from 'react';
import { 
  Calendar, Clock, MapPin, Sparkles, Send, Coffee, Armchair, 
  Stethoscope, ChevronRight, CheckCircle2, Star, ShieldCheck, 
  Phone, Users, ExternalLink, RefreshCw, Sun, Moon, ShoppingBag,
  Plus, Minus, Check, ArrowRight, Smartphone, Monitor, Tablet,
  QrCode, Share2, Award, Zap, Heart
} from 'lucide-react';

interface ProjectLiveDemoProps {
  projectId: string;
}

export function ProjectLiveDemo({ projectId }: ProjectLiveDemoProps) {
  // Device frame view mode inside the demo modal
  const [viewportMode, setViewportMode] = useState<'mobile' | 'desktop'>('desktop');

  // =========================================================================
  // DEMO 1: AURA HOME DECOR STATE
  // =========================================================================
  const [decorRoom, setDecorRoom] = useState<'living' | 'dining' | 'lighting'>('living');
  const [decorLighting, setDecorLighting] = useState<'daylight' | 'evening'>('evening');
  const [selectedMaterial, setSelectedMaterial] = useState<'travertine' | 'oak' | 'linen' | 'brass'>('travertine');
  const [customLength, setCustomLength] = useState(160);
  const [sampleKitRequested, setSampleKitRequested] = useState(false);

  // =========================================================================
  // DEMO 2: NOVA DENTAL CARE CLINIC STATE
  // =========================================================================
  const [selectedTreatment, setSelectedTreatment] = useState('aligners');
  const [selectedDoctor, setSelectedDoctor] = useState<'dr_rahul' | 'dr_priya'>('dr_rahul');
  const [selectedDate, setSelectedDate] = useState('Tomorrow');
  const [selectedTime, setSelectedTime] = useState('10:30 AM');
  const [patientNameInput, setPatientNameInput] = useState('');
  const [appointmentPass, setAppointmentPass] = useState<{ id: string; time: string; doctor: string; treatment: string } | null>(null);

  // =========================================================================
  // DEMO 3: MITTI CAFÉ ZERO-PDF STATE
  // =========================================================================
  const [cafeTab, setCafeTab] = useState<'menu' | 'reserve'>('menu');
  const [activeMenuCategory, setActiveMenuCategory] = useState<'espresso' | 'bakes' | 'cold'>('espresso');
  const [cart, setCart] = useState<Record<string, number>>({
    'cortado': 1,
    'cardamom_bun': 1,
  });
  const [selectedTable, setSelectedTable] = useState<'courtyard' | 'lounge' | 'window'>('courtyard');
  const [partyGuests, setPartyGuests] = useState(2);
  const [reservationTime, setReservationTime] = useState('11:00 AM');
  const [bookingPass, setBookingPass] = useState<{ passId: string; table: string; guests: number; time: string } | null>(null);
  const [orderDispatched, setOrderDispatched] = useState(false);

  // =========================================================================
  // 1. AURA LIVING SHOWROOM PROTOTYPE
  // =========================================================================
  if (projectId === 'aura-home-decor') {
    const products = {
      living: {
        name: 'The Monolith Low Lounge Table',
        sku: 'AUR-TBL-840',
        dayImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85',
        eveningImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
        basePrice: 1450,
        craftDetails: 'Hand-honed from single slab with micro-textured matte finish. Zero synthetic sealing resins.',
        specs: { weight: '64 kg', leadTime: '14 Days', origin: 'Tuscan Travertine Quarries' },
      },
      dining: {
        name: 'The Fumed Oak Architectural Dining Table',
        sku: 'AUR-DIN-920',
        dayImage: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=85',
        eveningImage: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=1200&q=85',
        basePrice: 2200,
        craftDetails: 'Solid European oak smoked with natural ammonia fumes. Finished with organic hardwax botanical oil.',
        specs: { weight: '78 kg', leadTime: '21 Days', origin: 'Sustainable French Woodlands' },
      },
      lighting: {
        name: 'Aura Floating Cast Brass Halo Pendant',
        sku: 'AUR-LGT-104',
        dayImage: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=85',
        eveningImage: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1200&q=85',
        basePrice: 680,
        craftDetails: 'Untreated sand-cast brass reflector. Concealed 2700K warm dimmable CRI 98 architectural emitter.',
        specs: { weight: '6.5 kg', leadTime: 'In Stock', origin: 'Artisanal Brass Foundry' },
      },
    };

    const currentProd = products[decorRoom];
    const materialOptions = [
      { id: 'travertine', name: 'Raw Tuscan Travertine', color: '#DCD5C6', multiplier: 1.15, texture: 'Honed Matte with Organic Open Pores' },
      { id: 'oak', name: 'Smoked European White Oak', color: '#8F6C47', multiplier: 1.0, texture: 'Deep Radial Grain with Natural Oil Finish' },
      { id: 'linen', name: 'Belgian Slub Textured Linen', color: '#E5E0D5', multiplier: 0.9, texture: 'Heavyweight Pre-Washed Natural Fiber' },
      { id: 'brass', name: 'Hand-Brushed Patina Brass', color: '#BFA05A', multiplier: 1.25, texture: 'Living Finish That Develops Warm Tone with Age' },
    ];

    const activeMat = materialOptions.find((m) => m.id === selectedMaterial)!;
    const estimatedPrice = Math.round((currentProd.basePrice * (customLength / 160)) * activeMat.multiplier);

    return (
      <div className="space-y-4">
        {/* Browser Top Chrome */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            </div>
            <span className="text-[#A1A1AA] text-[11px] truncate">
              https://auraliving.atelier/lookbook/2026?room={decorRoom}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-emerald-400 font-bold px-2 py-0.5 rounded-full bg-emerald-500/10">
              ● Live Staging
            </span>
            <div className="hidden sm:flex items-center gap-1 border-l border-white/10 pl-2">
              <button
                onClick={() => setViewportMode('mobile')}
                className={`p-1 rounded ${viewportMode === 'mobile' ? 'bg-indigo-600 text-white' : 'text-[#71717A] hover:text-white'}`}
                title="Mobile View"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewportMode('desktop')}
                className={`p-1 rounded ${viewportMode === 'desktop' ? 'bg-indigo-600 text-white' : 'text-[#71717A] hover:text-white'}`}
                title="Desktop View"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Prototype Viewport Container */}
        <div className={`transition-all duration-300 mx-auto ${viewportMode === 'mobile' ? 'max-w-[420px]' : 'w-full'}`}>
          <div className="rounded-2xl border border-white/10 bg-[#0A0A0D] overflow-hidden shadow-2xl space-y-6 p-4 sm:p-6">
            
            {/* Showroom Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 block font-bold">
                  Aura Living Atelier · Bespoke Interior Objects
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Tactile Lookbook & Sizing Studio
                </h3>
              </div>

              {/* Daylight / Twilight Atmospheric Lighting Toggle */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/10">
                <button
                  onClick={() => setDecorLighting('daylight')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                    decorLighting === 'daylight' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-[#A1A1AA] hover:text-white'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Daylight 5000K</span>
                </button>
                <button
                  onClick={() => setDecorLighting('evening')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                    decorLighting === 'evening' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' : 'text-[#A1A1AA] hover:text-white'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Atmospheric 2700K</span>
                </button>
              </div>
            </div>

            {/* Room Switcher Gallery Tabs */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'living', label: 'Living Gallery', note: 'Low Lounge Pieces' },
                { id: 'dining', label: 'Dining Architecture', note: 'Monolithic Tables' },
                { id: 'lighting', label: 'Sculptural Lighting', note: 'Indirect Halos' },
              ].map((r) => (
                <button
                  key={r.id}
                  onClick={() => {
                    setDecorRoom(r.id as any);
                    setSampleKitRequested(false);
                  }}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    decorRoom === r.id
                      ? 'border-indigo-400 bg-indigo-500/10 shadow-lg'
                      : 'border-white/10 hover:border-white/20 bg-white/[0.02]'
                  }`}
                >
                  <span className="text-xs font-bold text-white block">{r.label}</span>
                  <span className="text-[10px] text-[#A1A1AA] font-mono">{r.note}</span>
                </button>
              ))}
            </div>

            {/* Interactive Showcase Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Product Visual with Live Lighting Temperature Shift */}
              <div className="lg:col-span-7 relative rounded-2xl overflow-hidden border border-white/10 aspect-[16/11] group bg-black">
                <img
                  src={decorLighting === 'daylight' ? currentProd.dayImage : currentProd.eveningImage}
                  alt={currentProd.name}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                />
                <div className={`absolute inset-0 transition-colors duration-500 ${
                  decorLighting === 'evening' ? 'bg-amber-950/20 mix-blend-color-burn' : 'bg-transparent'
                }`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md text-[10px] font-mono text-white border border-white/15">
                    {currentProd.sku}
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-indigo-500/80 backdrop-blur-md text-[10px] font-mono text-white font-bold">
                    {activeMat.name}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-mono">
                  <span className="text-white/90 font-bold bg-black/60 px-3 py-1 rounded-lg backdrop-blur-md">
                    Lighting: {decorLighting === 'daylight' ? 'Natural Sunlit' : 'Ambient Evening Glow'}
                  </span>
                  <span className="text-emerald-400 font-bold bg-black/60 px-3 py-1 rounded-lg backdrop-blur-md">
                    Lead: {currentProd.specs.leadTime}
                  </span>
                </div>
              </div>

              {/* Interactive Sizing & Material Configurator */}
              <div className="lg:col-span-5 space-y-4">
                <div>
                  <h4 className="text-lg font-black text-white">{currentProd.name}</h4>
                  <p className="text-xs text-[#D4D4D8] leading-relaxed mt-1">
                    {currentProd.craftDetails}
                  </p>
                </div>

                {/* Material Swatch Selector */}
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase text-[#A1A1AA] font-bold block">
                    1. Select Raw Material Spec:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {materialOptions.map((mat) => (
                      <button
                        key={mat.id}
                        onClick={() => setSelectedMaterial(mat.id as any)}
                        className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                          selectedMaterial === mat.id
                            ? 'border-indigo-400 bg-indigo-500/20 ring-1 ring-indigo-400/50'
                            : 'border-white/10 hover:border-white/20 bg-white/[0.02]'
                        }`}
                      >
                        <span
                          className="w-4 h-4 rounded-full border border-white/20 shrink-0"
                          style={{ backgroundColor: mat.color }}
                        />
                        <span className="text-[11px] font-bold text-white truncate">{mat.name}</span>
                      </button>
                    ))}
                  </div>
                  <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.06] text-[10px] font-mono text-[#A1A1AA]">
                    <span className="text-indigo-300 font-bold">Texture profile:</span> {activeMat.texture}
                  </div>
                </div>

                {/* Dimension Slider */}
                <div className="space-y-1.5 pt-1 border-t border-white/[0.06]">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-[#A1A1AA] text-[10px] uppercase font-bold">2. Custom Length Dimension:</span>
                    <span className="text-white font-bold">{customLength} cm</span>
                  </div>
                  <input
                    type="range"
                    min="120"
                    max="240"
                    step="10"
                    value={customLength}
                    onChange={(e) => setCustomLength(Number(e.target.value))}
                    className="w-full accent-indigo-500 h-1.5 bg-white/10 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-[#71717A]">
                    <span>120 cm (Apartment)</span>
                    <span>240 cm (Estate Grand)</span>
                  </div>
                </div>

                {/* Live Estimated Price & Dispatch Action */}
                <div className="p-3.5 rounded-xl bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-black border border-indigo-500/30 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-mono uppercase text-[#A1A1AA] block">Estimated Atelier Quotation</span>
                    <span className="text-xl font-black text-white font-mono">${estimatedPrice.toLocaleString()} USD</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                    Full Code Ownership
                  </span>
                </div>

                {sampleKitRequested ? (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-bold text-center flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Sample box & 3D layout dispatched! Courier tracking reference: #AUR-9842</span>
                  </div>
                ) : (
                  <button
                    onClick={() => setSampleKitRequested(true)}
                    className="w-full glass-btn-primary py-3 px-4 text-xs font-bold uppercase tracking-wider text-white flex items-center justify-center gap-2 rounded-xl"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Dispatch Tactile Swatch Kit & 3D Plan</span>
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. NOVA DENTAL CARE CLINIC TRIAGE (INSPIRED BY DR. RAHUL JAISWAL)
  // =========================================================================
  if (projectId === 'nova-dental-care') {
    const treatments = [
      { id: 'aligners', name: 'Clear Aligners & Invisible Braces', duration: '45 mins', estimate: '$120 Consultation', icon: '✨' },
      { id: 'smile_makeover', name: 'Cosmetic Smile Design & Veneers', duration: '60 mins', estimate: '3D Mockup Included', icon: '💎' },
      { id: 'implant', name: 'Prosthodontic Dental Implant', duration: '45 mins', estimate: 'Titanium / Zirconia', icon: '🦷' },
      { id: 'pain_relief', name: 'Emergency Tooth Relief & Triage', duration: 'Immediate', estimate: 'Priority Care', icon: '⚡' },
    ];

    const doctors = [
      {
        id: 'dr_rahul',
        name: 'Dr. Rahul Jaiswal, BDS, MDS',
        title: 'Lead Prosthodontist & Implantologist',
        exp: '14+ Years Clinical Excellence',
        badge: 'Director',
        rating: '4.9 (420+ Reviews)',
      },
      {
        id: 'dr_priya',
        name: 'Dr. Priya Sen, BDS',
        title: 'Aesthetic Orthodontics Specialist',
        exp: '9+ Years Clear Aligner Care',
        badge: 'Associate',
        rating: '4.9 (310+ Reviews)',
      },
    ];

    const dates = ['Today', 'Tomorrow', 'Friday', 'Saturday'];
    const times = ['09:30 AM', '11:00 AM', '02:30 PM', '04:15 PM', '06:00 PM'];

    const handleConfirmBooking = () => {
      const selectedTreatObj = treatments.find((t) => t.id === selectedTreatment)!;
      const docObj = doctors.find((d) => d.id === selectedDoctor)!;
      setAppointmentPass({
        id: `APX-${Math.floor(1000 + Math.random() * 9000)}`,
        time: `${selectedDate} at ${selectedTime}`,
        doctor: docObj.name,
        treatment: selectedTreatObj.name,
      });
    };

    return (
      <div className="space-y-4">
        {/* Browser Top Chrome */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            </div>
            <span className="text-[#A1A1AA] text-[11px] truncate">
              https://novadental.clinic/appointment/triage
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-cyan-400 font-bold px-2 py-0.5 rounded-full bg-cyan-500/10">
              ● Healthcare Verified
            </span>
            <div className="hidden sm:flex items-center gap-1 border-l border-white/10 pl-2">
              <button
                onClick={() => setViewportMode('mobile')}
                className={`p-1 rounded ${viewportMode === 'mobile' ? 'bg-cyan-600 text-white' : 'text-[#71717A] hover:text-white'}`}
                title="Mobile View"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewportMode('desktop')}
                className={`p-1 rounded ${viewportMode === 'desktop' ? 'bg-cyan-600 text-white' : 'text-[#71717A] hover:text-white'}`}
                title="Desktop View"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Prototype Viewport Container */}
        <div className={`transition-all duration-300 mx-auto ${viewportMode === 'mobile' ? 'max-w-[420px]' : 'w-full'}`}>
          <div className="rounded-2xl border border-white/10 bg-[#090C10] overflow-hidden shadow-2xl p-4 sm:p-6 space-y-6">
            
            {/* Clinic Navigation Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300 font-black">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-white">NOVA DENTAL CARE</span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      Open Today · Mon–Sat
                    </span>
                  </div>
                  <span className="text-[11px] text-[#A1A1AA] font-mono">
                    Clinic Director: Dr. Rahul Jaiswal, BDS, MDS
                  </span>
                </div>
              </div>

              <a
                href="https://dr-rahul-jaiswal.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-cyan-400 text-xs font-mono font-bold border border-white/10 transition-colors"
              >
                <span>Live Clinic Site Inspiration</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {appointmentPass ? (
              /* Generated Digital Patient Appointment Pass */
              <div className="p-6 rounded-2xl bg-gradient-to-b from-cyan-950/40 via-[#0A1218] to-black border border-cyan-400/40 space-y-6 text-center animate-in fade-in zoom-in-95 duration-300">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-400 flex items-center justify-center mx-auto">
                  <Check className="w-7 h-7" />
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
                    Official Appointment Confirmation
                  </span>
                  <h4 className="text-2xl font-black text-white">
                    You Are Booked with {appointmentPass.doctor.split(',')[0]}
                  </h4>
                  <p className="text-xs text-[#D4D4D8]">
                    A calendar invite and SMS confirmation with clinic route instructions have been prepared.
                  </p>
                </div>

                {/* Pass Ticket Card */}
                <div className="max-w-md mx-auto p-4 rounded-xl bg-black/60 border border-white/15 text-left font-mono text-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-[#A1A1AA]">Pass Reference</span>
                    <span className="text-cyan-400 font-bold">{appointmentPass.id}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-[#A1A1AA]">Care Category</span>
                    <span className="text-white font-bold">{appointmentPass.treatment}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-[#A1A1AA]">Reserved Time</span>
                    <span className="text-emerald-400 font-bold">{appointmentPass.time}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[#A1A1AA]">Location</span>
                    <span className="text-white">Apex Dental Suite · 2nd Floor</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => setAppointmentPass(null)}
                    className="glass-btn px-5 py-2.5 text-xs uppercase tracking-wider text-white"
                  >
                    <span>Book Another Appointment</span>
                  </button>
                  <a
                    href="https://dr-rahul-jaiswal.netlify.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-btn-primary px-5 py-2.5 text-xs uppercase tracking-wider text-white flex items-center gap-1.5"
                  >
                    <span>View Dr. Rahul Jaiswal's Full Site</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ) : (
              /* Interactive Triage Step Selector */
              <div className="space-y-6">
                {/* Step 1: Treatment Category */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono uppercase text-[#A1A1AA] font-bold">
                      1. Select Dental Care Service:
                    </span>
                    <span className="text-[11px] font-mono text-cyan-400 font-bold">
                      {treatments.find((t) => t.id === selectedTreatment)?.duration}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {treatments.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setSelectedTreatment(t.id)}
                        className={`p-3.5 rounded-xl border text-left flex items-start justify-between transition-all ${
                          selectedTreatment === t.id
                            ? 'border-cyan-400 bg-cyan-500/15 shadow-md ring-1 ring-cyan-400/40'
                            : 'border-white/10 hover:border-white/20 bg-white/[0.02]'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-base">{t.icon}</span>
                            <span className="text-xs font-bold text-white">{t.name}</span>
                          </div>
                          <span className="text-[10px] font-mono text-[#A1A1AA] block">{t.estimate}</span>
                        </div>
                        {selectedTreatment === t.id && (
                          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 2: Doctor Credibility Selector */}
                <div className="space-y-2.5">
                  <span className="font-mono uppercase text-[#A1A1AA] font-bold text-xs block">
                    2. Select Clinician:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {doctors.map((doc) => (
                      <button
                        key={doc.id}
                        onClick={() => setSelectedDoctor(doc.id as any)}
                        className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                          selectedDoctor === doc.id
                            ? 'border-cyan-400 bg-cyan-500/15 shadow-md ring-1 ring-cyan-400/40'
                            : 'border-white/10 hover:border-white/20 bg-white/[0.02]'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">{doc.name}</span>
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                              {doc.badge}
                            </span>
                          </div>
                          <span className="text-[10px] text-[#A1A1AA] font-mono block">{doc.title}</span>
                          <span className="text-[10px] text-amber-400 font-mono flex items-center gap-1 mt-0.5">
                            <Star className="w-3 h-3 fill-amber-400" />
                            <span>{doc.rating}</span>
                          </span>
                        </div>
                        {selectedDoctor === doc.id && (
                          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 3: Date & Time Picker */}
                <div className="space-y-2.5">
                  <span className="font-mono uppercase text-[#A1A1AA] font-bold text-xs block">
                    3. Select Preferred Day & Time Slot:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {dates.map((d) => (
                      <button
                        key={d}
                        onClick={() => setSelectedDate(d)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border ${
                          selectedDate === d
                            ? 'bg-cyan-500/20 border-cyan-400 text-white'
                            : 'bg-white/[0.02] border-white/10 text-[#A1A1AA] hover:text-white'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 pt-1">
                    {times.map((tm) => (
                      <button
                        key={tm}
                        onClick={() => setSelectedTime(tm)}
                        className={`py-2 px-1 text-center rounded-xl text-xs font-mono font-bold transition-all border ${
                          selectedTime === tm
                            ? 'bg-cyan-400 text-black border-cyan-400 shadow-md'
                            : 'bg-white/[0.02] border-white/10 text-[#A1A1AA] hover:text-white'
                        }`}
                      >
                        {tm}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Booking Trigger Button */}
                <div className="pt-2">
                  <button
                    onClick={handleConfirmBooking}
                    className="w-full glass-btn-primary py-3.5 px-5 text-xs font-bold uppercase tracking-wider text-white flex items-center justify-center gap-2 rounded-xl shadow-xl"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Confirm {selectedDate} {selectedTime} Consultation</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 3. MITTI ARTISAN CAFÉ ZERO-PDF MOBILE MENU & TABLE BOOKING
  // =========================================================================
  const menuCatalogue = {
    espresso: [
      { id: 'cortado', name: 'Kalledevarapura Estate Cortado', price: 4.5, desc: 'Orange blossom, toasted hazelnut, 70% dark cocoa finish', tag: 'Micro-Lot' },
      { id: 'aeropress', name: 'Aeropress Washed Ethiopian', price: 5.0, desc: 'Jasmine floral bouquet, bergamot tea, peach crispness', tag: 'Single Origin' },
      { id: 'dirty_chai', name: 'Cardamom Cinnamon Dirty Chai', price: 5.5, desc: 'House-spiced Assam tea reduction with double espresso shot', tag: 'Signature' },
    ],
    bakes: [
      { id: 'cardamom_bun', name: 'Wild Yeast Cardamom Knot Bun', price: 4.2, desc: 'Swedish-style laminated brioche with freshly ground green pods', tag: 'Fresh 7 AM' },
      { id: 'focaccia', name: 'Rosemary Sea Salt Focaccia', price: 4.8, desc: 'Slow-fermented sourdough, cold-pressed virgin olive oil, charred tomatoes', tag: 'Vegan' },
      { id: 'babka', name: 'Valrhona Dark Chocolate Babka', price: 5.2, desc: 'Braided sourdough with rich melted cocoa fudge & toasted pecans', tag: 'Bestseller' },
    ],
    cold: [
      { id: 'kyoto_drip', name: '18-Hour Kyoto Cold Drip Tonic', price: 5.8, desc: 'Mountain spring water slow-extracted over natural botanicals', tag: 'Cold Extract' },
      { id: 'cascara_fizz', name: 'Cascara Coffee Cherry Soda', price: 4.9, desc: 'Naturally sweet dried coffee fruit tea with sparkling bubbles & mint', tag: 'Zero Waste' },
      { id: 'nitro_brew', name: 'Nitro Cascara Draft Cold Brew', price: 5.5, desc: 'Velvety nitrogen micro-foam with smooth Guinness-like mouthfeel', tag: 'On Tap' },
    ],
  };

  const tables = [
    { id: 'courtyard', name: 'Sunlight Courtyard Table', capacity: 'Seats 2–4', icon: '🌿' },
    { id: 'window', name: 'Streetside Window Bench', capacity: 'Seats 1–2', icon: '☕' },
    { id: 'lounge', name: 'Roastery Lounge Booth', capacity: 'Seats 4–6', icon: '🛋️' },
  ];

  const updateCartQty = (id: string, delta: number) => {
    setCart((prev) => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: next };
    });
  };

  const allItems = [...menuCatalogue.espresso, ...menuCatalogue.bakes, ...menuCatalogue.cold];
  const cartTotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = allItems.find((i) => i.id === id);
    return sum + (item ? item.price * qty : 0);
  }, 0);
  const totalItemCount = Object.values(cart).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-4">
      {/* Browser Top Chrome */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-[#A1A1AA] text-[11px] truncate">
            https://mitticafe.com/menu/live?tab={cafeTab}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-amber-400 font-bold px-2 py-0.5 rounded-full bg-amber-500/10">
            ● Zero-PDF Speed
          </span>
          <div className="hidden sm:flex items-center gap-1 border-l border-white/10 pl-2">
            <button
              onClick={() => setViewportMode('mobile')}
              className={`p-1 rounded ${viewportMode === 'mobile' ? 'bg-amber-600 text-white' : 'text-[#71717A] hover:text-white'}`}
              title="Mobile View"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewportMode('desktop')}
              className={`p-1 rounded ${viewportMode === 'desktop' ? 'bg-amber-600 text-white' : 'text-[#71717A] hover:text-white'}`}
              title="Desktop View"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Prototype Viewport Container */}
      <div className={`transition-all duration-300 mx-auto ${viewportMode === 'mobile' ? 'max-w-[420px]' : 'w-full'}`}>
        <div className="rounded-2xl border border-white/10 bg-[#0C0B08] overflow-hidden shadow-2xl p-4 sm:p-6 space-y-6">
          
          {/* Cafe Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
                <Coffee className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 block font-bold">
                  Mitti Artisan Café & Roastery
                </span>
                <h3 className="text-xl font-black text-white">
                  Zero-PDF Menu & Table Reservation
                </h3>
              </div>
            </div>

            {/* Menu vs Table Reservation Switcher */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/10">
              <button
                onClick={() => setCafeTab('menu')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  cafeTab === 'menu' ? 'bg-amber-500 text-black font-black' : 'text-[#A1A1AA] hover:text-white'
                }`}
              >
                Food & Drinks Menu
              </button>
              <button
                onClick={() => setCafeTab('reserve')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  cafeTab === 'reserve' ? 'bg-amber-500 text-black font-black' : 'text-[#A1A1AA] hover:text-white'
                }`}
              >
                Reserve a Table
              </button>
            </div>
          </div>

          {cafeTab === 'menu' ? (
            /* Interactive Food & Drinks Menu */
            <div className="space-y-4">
              {/* Category tabs */}
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'espresso', label: 'Single Origin Espresso' },
                  { id: 'bakes', label: 'Artisanal Sourdough Bakes' },
                  { id: 'cold', label: 'Cold Drips & Tonics' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveMenuCategory(cat.id as any)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border ${
                      activeMenuCategory === cat.id
                        ? 'bg-amber-500/20 border-amber-400 text-white shadow-sm'
                        : 'bg-white/[0.02] border-white/10 text-[#A1A1AA] hover:text-white'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Menu Items List with Interactive Quantity Counters */}
              <div className="space-y-2.5">
                {menuCatalogue[activeMenuCategory].map((item) => {
                  const qty = cart[item.id] || 0;
                  return (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.08] hover:border-white/15 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">{item.name}</span>
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold">
                            {item.tag}
                          </span>
                        </div>
                        <p className="text-xs text-[#A1A1AA]">{item.desc}</p>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                        <span className="font-mono text-sm font-bold text-amber-400">
                          ${item.price.toFixed(2)}
                        </span>
                        
                        {/* Interactive Quantity Stepper */}
                        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-white/[0.06] border border-white/10">
                          <button
                            onClick={() => updateCartQty(item.id, -1)}
                            className="w-6 h-6 rounded flex items-center justify-center text-[#A1A1AA] hover:text-white hover:bg-white/10 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-mono font-bold text-white">
                            {qty}
                          </span>
                          <button
                            onClick={() => updateCartQty(item.id, 1)}
                            className="w-6 h-6 rounded flex items-center justify-center text-[#A1A1AA] hover:text-white hover:bg-white/10 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Floating Live Cart Summary */}
              {totalItemCount > 0 && (
                <div className="p-4 rounded-xl bg-amber-500/15 border border-amber-400/30 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-amber-500 text-black flex items-center justify-center font-bold">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">
                        Your Order: {totalItemCount} items selected
                      </span>
                      <span className="text-[11px] font-mono text-amber-300">
                        Total: ${cartTotal.toFixed(2)} USD · Zero download wait
                      </span>
                    </div>
                  </div>

                  {orderDispatched ? (
                    <span className="text-xs font-bold text-emerald-400 font-mono flex items-center gap-1">
                      <Check className="w-4 h-4" />
                      <span>Order Sent to Barista!</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => setOrderDispatched(true)}
                      className="glass-btn-primary px-5 py-2 text-xs font-bold uppercase tracking-wider text-white rounded-lg flex items-center gap-1.5"
                    >
                      <span>Simulate Order Dispatch</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* Interactive Table Reservation */
            <div className="space-y-6">
              {bookingPass ? (
                /* Reservation Confirmed Pass */
                <div className="p-6 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-5 text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">
                      Table Reservation Confirmed
                    </span>
                    <h4 className="text-xl font-black text-white">
                      We're Expecting You at {bookingPass.time}
                    </h4>
                    <p className="text-xs text-[#A1A1AA]">
                      Table reserved for {bookingPass.guests} guests at {bookingPass.table}. Pass #{bookingPass.passId}.
                    </p>
                  </div>
                  <button
                    onClick={() => setBookingPass(null)}
                    className="glass-btn px-5 py-2 text-xs uppercase font-bold text-white rounded-xl"
                  >
                    <span>Reserve Another Table</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  {/* Select Table Area */}
                  <div className="space-y-2">
                    <span className="text-xs font-mono uppercase text-[#A1A1AA] font-bold block">
                      1. Select Seating Atmosphere:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {tables.map((tbl) => (
                        <button
                          key={tbl.id}
                          onClick={() => setSelectedTable(tbl.id as any)}
                          className={`p-3.5 rounded-xl border text-left transition-all ${
                            selectedTable === tbl.id
                              ? 'border-amber-400 bg-amber-500/20 ring-1 ring-amber-400/40'
                              : 'border-white/10 hover:border-white/20 bg-white/[0.02]'
                          }`}
                        >
                          <span className="text-xl block mb-1">{tbl.icon}</span>
                          <span className="text-xs font-bold text-white block">{tbl.name}</span>
                          <span className="text-[10px] text-[#A1A1AA] font-mono">{tbl.capacity}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Party Size & Time */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono uppercase text-[#A1A1AA] font-bold block">
                        2. Party Guests:
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {[1, 2, 4, 6].map((num) => (
                          <button
                            key={num}
                            onClick={() => setPartyGuests(num)}
                            className={`py-2 rounded-xl text-xs font-mono font-bold transition-all border ${
                              partyGuests === num
                                ? 'bg-amber-400 text-black border-amber-400'
                                : 'bg-white/[0.02] border-white/10 text-white hover:bg-white/[0.06]'
                            }`}
                          >
                            {num} {num === 1 ? 'Guest' : 'Guests'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono uppercase text-[#A1A1AA] font-bold block">
                        3. Seating Window:
                      </label>
                      <select
                        value={reservationTime}
                        onChange={(e) => setReservationTime(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-[#141310] border border-white/15 text-xs font-mono text-white focus:outline-none"
                      >
                        <option>10:00 AM · Morning Espresso</option>
                        <option>11:00 AM · Brunch & Pastries</option>
                        <option>02:30 PM · Afternoon Pour-over</option>
                        <option>04:00 PM · Cold Drip & Tonic</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const selectedTableObj = tables.find((t) => t.id === selectedTable)!;
                      setBookingPass({
                        passId: `MIT-${Math.floor(100 + Math.random() * 900)}`,
                        table: selectedTableObj.name,
                        guests: partyGuests,
                        time: reservationTime,
                      });
                    }}
                    className="w-full glass-btn-primary py-3.5 text-xs font-bold uppercase tracking-wider text-white rounded-xl flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Instant Reserve {selectedTable.toUpperCase()} Table ({partyGuests} Guests)</span>
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
