import { useState } from 'react';
import { Check, Calendar, Clock, MapPin, Sparkles, Send, Coffee, Armchair, Stethoscope, ChevronRight } from 'lucide-react';

interface ProjectLiveDemoProps {
  projectId: string;
}

export function ProjectLiveDemo({ projectId }: ProjectLiveDemoProps) {
  // 1. Aura Home Decor state
  const [decorRoom, setDecorRoom] = useState<'living' | 'dining' | 'lighting'>('living');
  const [selectedMaterial, setSelectedMaterial] = useState<'travertine' | 'oak' | 'linen' | 'brass'>('travertine');
  const [inquirySent, setInquirySent] = useState(false);

  // 2. Nova Dental Care state
  const [dentalService, setDentalService] = useState('Comprehensive Consultation');
  const [dentalTime, setDentalTime] = useState('Tomorrow, 10:30 AM');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  // 3. Mitti Café state
  const [cafeCategory, setCafeCategory] = useState<'coffee' | 'bakery' | 'brews'>('coffee');
  const [tableParty, setTableParty] = useState('2 Guests');
  const [tableReserved, setTableReserved] = useState(false);

  if (projectId === 'aura-home-decor') {
    return (
      <div className="bg-[#FAF8F5] dark:bg-[#121214] border border-[#DDD7CD] dark:border-[#27272A] p-5 sm:p-7 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E7E2DA] dark:border-[#27272A] pb-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-sm bg-[#0047AB]/10 text-[#0047AB] dark:text-[#3B82F6]">
              <Armchair className="w-4 h-4" />
            </span>
            <div>
              <span className="text-xs uppercase font-mono font-bold text-[#736E66] dark:text-[#A1A1AA] block">
                Interactive Showroom Prototype
              </span>
              <h4 className="text-base font-black text-[#121212] dark:text-white">
                Aura Living & Home Decor
              </h4>
            </div>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">
            ● Live Interactive Demo
          </span>
        </div>

        {/* Room Tab Selector */}
        <div className="flex gap-2">
          {(['living', 'dining', 'lighting'] as const).map((room) => (
            <button
              key={room}
              onClick={() => setDecorRoom(room)}
              className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-[2px] transition-colors ${
                decorRoom === room
                  ? 'bg-[#121212] dark:bg-white text-white dark:text-[#121212]'
                  : 'bg-white dark:bg-[#1A1A1E] border border-[#DDD7CD] dark:border-[#2E2E33] text-[#55514B] dark:text-[#A1A1AA]'
              }`}
            >
              {room === 'living' && 'Living Room'}
              {room === 'dining' && 'Dining Gallery'}
              {room === 'lighting' && 'Sculptural Lighting'}
            </button>
          ))}
        </div>

        {/* Product Visual Mock */}
        <div className="bg-white dark:bg-[#18181B] border border-[#DDD7CD] dark:border-[#27272A] p-5 grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
          <div className="sm:col-span-6 space-y-2">
            <div className="text-[10px] font-mono text-[#0047AB] dark:text-[#3B82F6] font-bold uppercase">
              {decorRoom === 'living' && 'Featured / Bespoke Piece'}
              {decorRoom === 'dining' && 'Artisanal Craftwork'}
              {decorRoom === 'lighting' && 'Atmospheric Light'}
            </div>
            <h5 className="text-xl font-black text-[#121212] dark:text-white">
              {decorRoom === 'living' && 'The Monolith Travertine Table'}
              {decorRoom === 'dining' && 'Solid European Oak Dining Bench'}
              {decorRoom === 'lighting' && 'Aura Cast Brass Floating Pendant'}
            </h5>
            <p className="text-xs text-[#55514B] dark:text-[#A1A1AA] leading-relaxed">
              Hand-finished with natural stone pigments and tactile organic edges. Designed for serene, contemplative residential interiors.
            </p>
            <div className="pt-2 flex items-center gap-3 text-xs font-mono font-bold text-[#121212] dark:text-white">
              <span>Made to order</span>
              <span className="text-[#8C857B]">·</span>
              <span className="text-[#0047AB] dark:text-[#3B82F6]">Custom Dimensions Available</span>
            </div>
          </div>

          <div className="sm:col-span-6 bg-[#F4F0E8] dark:bg-[#1F1F24] p-5 border border-[#E2DDD3] dark:border-[#2E2E33] space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#736E66] dark:text-[#A1A1AA] block font-mono">
              Material Swatch Selector:
            </span>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'travertine', name: 'Raw Travertine', color: 'bg-[#DCD5C6]' },
                { id: 'oak', name: 'Fumed Smoked Oak', color: 'bg-[#8F6C47]' },
                { id: 'linen', name: 'Belgian Slub Linen', color: 'bg-[#E5E0D5]' },
                { id: 'brass', name: 'Hand-Brushed Brass', color: 'bg-[#BFA05A]' },
              ].map((mat) => (
                <button
                  key={mat.id}
                  onClick={() => setSelectedMaterial(mat.id as any)}
                  className={`p-2 flex items-center gap-2 text-xs font-semibold text-left border transition-all ${
                    selectedMaterial === mat.id
                      ? 'border-[#0047AB] dark:border-[#3B82F6] bg-white dark:bg-[#141416]'
                      : 'border-transparent hover:border-[#DDD7CD] dark:hover:border-[#333]'
                  }`}
                >
                  <span className={`w-3.5 h-3.5 rounded-full ${mat.color} border border-black/10 shrink-0`} />
                  <span className="text-[11px] truncate text-[#121212] dark:text-white">{mat.name}</span>
                </button>
              ))}
            </div>

            <div className="pt-2">
              {inquirySent ? (
                <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold text-center">
                  ✓ Sizing & lookbook request sent to studio!
                </div>
              ) : (
                <button
                  onClick={() => setInquirySent(true)}
                  className="w-full glass-btn-primary py-2 px-3 text-xs font-bold uppercase tracking-wider text-white flex items-center justify-center gap-2"
                >
                  <span>Request Lookbook & Pricing</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (projectId === 'nova-dental-care') {
    return (
      <div className="bg-[#FAF8F5] dark:bg-[#121214] border border-[#DDD7CD] dark:border-[#27272A] p-5 sm:p-7 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E7E2DA] dark:border-[#27272A] pb-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-sm bg-[#0047AB]/10 text-[#0047AB] dark:text-[#3B82F6]">
              <Stethoscope className="w-4 h-4" />
            </span>
            <div>
              <span className="text-xs uppercase font-mono font-bold text-[#736E66] dark:text-[#A1A1AA] block">
                Interactive Triage Prototype
              </span>
              <h4 className="text-base font-black text-[#121212] dark:text-white">
                Nova Dental Care
              </h4>
            </div>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">
            ● Live Interactive Demo
          </span>
        </div>

        <div className="bg-white dark:bg-[#18181B] border border-[#DDD7CD] dark:border-[#27272A] p-6 space-y-5">
          <div className="space-y-1">
            <h5 className="text-lg font-black text-[#121212] dark:text-white">
              Instant Appointment Triage Demo
            </h5>
            <p className="text-xs text-[#55514B] dark:text-[#A1A1AA]">
              See how patients quickly book a consultation on their phones in less than 30 seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] uppercase font-bold text-[#736E66] dark:text-[#A1A1AA] mb-1.5 font-mono">
                Select Care Type
              </label>
              <select
                value={dentalService}
                onChange={(e) => setDentalService(e.target.value)}
                className="w-full p-2.5 bg-[#FAF8F5] dark:bg-[#141416] border border-[#DDD7CD] dark:border-[#27272A] text-xs font-semibold text-[#121212] dark:text-white focus:outline-none"
              >
                <option>Comprehensive Consultation</option>
                <option>Invisible Orthodontic Aligners</option>
                <option>Ultrasonic Hygiene & Polish</option>
                <option>Emergency Tooth Relief</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] uppercase font-bold text-[#736E66] dark:text-[#A1A1AA] mb-1.5 font-mono">
                Preferred Consultation Time
              </label>
              <select
                value={dentalTime}
                onChange={(e) => setDentalTime(e.target.value)}
                className="w-full p-2.5 bg-[#FAF8F5] dark:bg-[#141416] border border-[#DDD7CD] dark:border-[#27272A] text-xs font-semibold text-[#121212] dark:text-white focus:outline-none"
              >
                <option>Tomorrow, 10:30 AM</option>
                <option>Tomorrow, 02:00 PM</option>
                <option>Friday, 11:15 AM</option>
                <option>Saturday Morning, 09:30 AM</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            {bookingConfirmed ? (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold text-center">
                ✓ Consultation reserved for {dentalTime} ({dentalService})
              </div>
            ) : (
              <button
                onClick={() => setBookingConfirmed(true)}
                className="w-full glass-btn-primary py-3 px-4 text-xs font-bold uppercase tracking-wider text-white flex items-center justify-center gap-2"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Confirm Appointment Time</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Mitti Café
  return (
    <div className="bg-[#FAF8F5] dark:bg-[#121214] border border-[#DDD7CD] dark:border-[#27272A] p-5 sm:p-7 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E7E2DA] dark:border-[#27272A] pb-4">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-sm bg-[#0047AB]/10 text-[#0047AB] dark:text-[#3B82F6]">
            <Coffee className="w-4 h-4" />
          </span>
          <div>
            <span className="text-xs uppercase font-mono font-bold text-[#736E66] dark:text-[#A1A1AA] block">
              Zero-PDF Menu & Table Reservation Prototype
            </span>
            <h4 className="text-base font-black text-[#121212] dark:text-white">
              Mitti Café
            </h4>
          </div>
        </div>
        <span className="text-[11px] font-mono px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">
          ● Live Interactive Demo
        </span>
      </div>

      <div className="space-y-4">
        {/* Menu category tabs */}
        <div className="flex gap-2">
          {(['coffee', 'bakery', 'brews'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setCafeCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-[2px] transition-colors ${
                cafeCategory === cat
                  ? 'bg-[#121212] dark:bg-white text-white dark:text-[#121212]'
                  : 'bg-white dark:bg-[#1A1A1E] border border-[#DDD7CD] dark:border-[#2E2E33] text-[#55514B] dark:text-[#A1A1AA]'
              }`}
            >
              {cat === 'coffee' && 'Single Origin Espresso'}
              {cat === 'bakery' && 'Artisanal Sourdough & Bakes'}
              {cat === 'brews' && 'Cold Drips & Tonics'}
            </button>
          ))}
        </div>

        {/* Menu item cards */}
        <div className="bg-white dark:bg-[#18181B] border border-[#DDD7CD] dark:border-[#27272A] p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#F0EBE1] dark:border-[#27272A]">
            <div>
              <span className="text-xs font-bold text-[#121212] dark:text-white block">
                {cafeCategory === 'coffee' && 'Kalledevarapura Estate Cortado'}
                {cafeCategory === 'bakery' && 'Wild Yeast Cardamom Croissant'}
                {cafeCategory === 'brews' && '18-Hour Kyoto Drip Tonic'}
              </span>
              <span className="text-[11px] text-[#736E66] dark:text-[#A1A1AA]">
                {cafeCategory === 'coffee' && 'Tasting notes: Orange blossom, almond praline, dark cocoa'}
                {cafeCategory === 'bakery' && 'Baked fresh every morning with cultured butter'}
                {cafeCategory === 'brews' && 'Slow extracted over mountain spring water & citrus peel'}
              </span>
            </div>
            <span className="font-mono text-xs font-bold text-[#0047AB] dark:text-[#3B82F6]">
              {cafeCategory === 'coffee' && '$4.50'}
              {cafeCategory === 'bakery' && '$5.00'}
              {cafeCategory === 'brews' && '$6.00'}
            </span>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs font-medium text-[#736E66] dark:text-[#A1A1AA]">
              No PDF download required. Instant responsive menu.
            </span>
            {tableReserved ? (
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                ✓ Table reserved for {tableParty}!
              </span>
            ) : (
              <button
                onClick={() => setTableReserved(true)}
                className="glass-btn px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#121212] dark:text-white"
              >
                Reserve Table for 2 →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
