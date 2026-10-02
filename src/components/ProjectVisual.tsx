interface ProjectVisualProps {
  projectId: string;
  name: string;
}

export function ProjectVisual({ projectId, name }: ProjectVisualProps) {
  if (projectId === 'aura-home-decor') {
    return (
      <div 
        className="w-full aspect-[16/10] bg-[#F4F1EA] dark:bg-[#141416] border-b lg:border-b-0 lg:border-r border-[#E5E0D8] dark:border-[#27272A] p-5 sm:p-7 flex flex-col justify-between overflow-hidden relative transition-colors duration-300"
        aria-label={`Architectural layout schematic for ${name}`}
      >
        {/* Subtle top bar */}
        <div className="flex items-center justify-between border-b border-[#E2DDD3] dark:border-[#27272A] pb-3 text-[11px] tracking-wider uppercase text-[#736E66] dark:text-[#A1A1AA]">
          <span className="font-bold text-[#121212] dark:text-white">AURA LIVING / HOME DECOR</span>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0047AB] dark:bg-[#3B82F6]" />
            <span className="font-mono text-[10px] text-[#0047AB] dark:text-[#3B82F6] font-bold">DIGITAL SHOWROOM</span>
          </div>
        </div>

        {/* Center layout schematic for Home Decor showroom */}
        <div className="space-y-3.5 my-auto py-2">
          {/* Main featured furniture piece representation */}
          <div className="flex items-center justify-between bg-[#ECE7DE] dark:bg-[#1C1C20] p-3 border border-[#DDD7CD] dark:border-[#2E2E33]">
            <div className="space-y-1">
              <span className="text-[9px] uppercase font-bold tracking-wider text-[#736E66] dark:text-[#A1A1AA] block">
                Signature Piece
              </span>
              <div className="h-3 w-40 bg-[#121212] dark:bg-white rounded-[1px]" />
              <div className="h-1.5 w-24 bg-[#8C857B] dark:bg-[#71717A]" />
            </div>
            <div className="border border-[#0047AB] dark:border-[#3B82F6] bg-white dark:bg-[#141416] px-2 py-1 text-[9px] font-mono font-bold text-[#0047AB] dark:text-[#3B82F6]">
              View Lookbook
            </div>
          </div>

          {/* Material & room catalogue swatches */}
          <div className="grid grid-cols-4 gap-2">
            <div className="p-2 bg-[#EAE5DC] dark:bg-[#1F1F23] border border-[#DDD7CD] dark:border-[#2E2E33] text-center">
              <div className="h-4 w-4 mx-auto rounded-full bg-[#D4CEBF] border border-[#BDB6A5] mb-1" />
              <span className="text-[8px] uppercase tracking-wider font-bold text-[#55514B] dark:text-[#A1A1AA] block">Travertine</span>
            </div>
            <div className="p-2 bg-[#EAE5DC] dark:bg-[#1F1F23] border border-[#DDD7CD] dark:border-[#2E2E33] text-center">
              <div className="h-4 w-4 mx-auto rounded-full bg-[#9E7D58] border border-[#856643] mb-1" />
              <span className="text-[8px] uppercase tracking-wider font-bold text-[#55514B] dark:text-[#A1A1AA] block">Warm Oak</span>
            </div>
            <div className="p-2 bg-[#EAE5DC] dark:bg-[#1F1F23] border border-[#DDD7CD] dark:border-[#2E2E33] text-center">
              <div className="h-4 w-4 mx-auto rounded-full bg-[#E5DFD3] border border-[#CCC4B4] mb-1" />
              <span className="text-[8px] uppercase tracking-wider font-bold text-[#55514B] dark:text-[#A1A1AA] block">Raw Linen</span>
            </div>
            <div className="p-2 bg-[#EAE5DC] dark:bg-[#1F1F23] border border-[#DDD7CD] dark:border-[#2E2E33] text-center">
              <div className="h-4 w-4 mx-auto rounded-full bg-[#B89650] border border-[#9E7F3D] mb-1" />
              <span className="text-[8px] uppercase tracking-wider font-bold text-[#55514B] dark:text-[#A1A1AA] block">Brass</span>
            </div>
          </div>
        </div>

        {/* Footer line */}
        <div className="flex items-center justify-between text-[10px] text-[#8C857B] dark:text-[#A1A1AA] border-t border-[#E2DDD3] dark:border-[#27272A] pt-2.5 font-mono">
          <span>MATERIAL PALETTES & SIZING</span>
          <span>CURATED ROOM ARCHITECTURE</span>
        </div>
      </div>
    );
  }

  if (projectId === 'nova-dental-care') {
    return (
      <div 
        className="w-full aspect-[16/10] bg-[#F4F1EA] dark:bg-[#141416] border-b lg:border-b-0 lg:border-r border-[#E5E0D8] dark:border-[#27272A] p-5 sm:p-7 flex flex-col justify-between overflow-hidden relative transition-colors duration-300"
        aria-label={`Architectural layout schematic for ${name}`}
      >
        {/* Subtle top bar */}
        <div className="flex items-center justify-between border-b border-[#E2DDD3] dark:border-[#27272A] pb-3 text-[11px] tracking-wider uppercase text-[#736E66] dark:text-[#A1A1AA]">
          <span className="font-bold text-[#121212] dark:text-white">NOVA DENTAL / CONCEPT</span>
          <span className="text-[10px] text-[#0047AB] dark:text-[#3B82F6] font-bold uppercase tracking-wider">Independent Concept</span>
        </div>

        {/* Center schematic for clinic */}
        <div className="my-auto space-y-3 py-2">
          <div className="flex items-center justify-between bg-[#EBE7DF] dark:bg-[#1F1F23] p-3 border border-[#DCD6CC] dark:border-[#2E2E33]">
            <div>
              <div className="h-2.5 w-32 bg-[#121212] dark:bg-white rounded-[1px] mb-1.5" />
              <div className="h-1.5 w-44 bg-[#8C857B] dark:bg-[#71717A]" />
            </div>
            <div className="h-6 w-20 bg-[#0047AB] dark:bg-[#3B82F6] flex items-center justify-center">
              <span className="text-[9px] text-white font-bold">BOOK</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 bg-[#EFECE5] dark:bg-[#1C1C20] border border-[#DDD7CC] dark:border-[#2E2E33]">
              <div className="text-[9px] text-[#736E66] dark:text-[#A1A1AA] uppercase mb-1 font-semibold">Clinic Timings</div>
              <div className="h-2 w-16 bg-[#121212] dark:bg-white mb-1" />
              <div className="h-1.5 w-24 bg-[#8C857B] dark:bg-[#71717A]" />
            </div>
            <div className="p-2.5 bg-[#EFECE5] dark:bg-[#1C1C20] border border-[#DDD7CC] dark:border-[#2E2E33]">
              <div className="text-[9px] text-[#736E66] dark:text-[#A1A1AA] uppercase mb-1 font-semibold">Doctor Profiles</div>
              <div className="h-2 w-20 bg-[#121212] dark:bg-white mb-1" />
              <div className="h-1.5 w-16 bg-[#8C857B] dark:bg-[#71717A]" />
            </div>
          </div>
        </div>

        {/* Footer label */}
        <div className="flex items-center justify-between text-[10px] text-[#8C857B] dark:text-[#A1A1AA] border-t border-[#E2DDD3] dark:border-[#27272A] pt-2.5 font-mono">
          <span>APPOINTMENT TRIAGE FLOW</span>
          <span>LOCATION & PRACTITIONER CLARITY</span>
        </div>
      </div>
    );
  }

  // Mitti Café
  return (
    <div 
      className="w-full aspect-[16/10] bg-[#F4F1EA] dark:bg-[#141416] border-b lg:border-b-0 lg:border-r border-[#E5E0D8] dark:border-[#27272A] p-5 sm:p-7 flex flex-col justify-between overflow-hidden relative transition-colors duration-300"
      aria-label={`Architectural layout schematic for ${name}`}
    >
      {/* Subtle top bar */}
      <div className="flex items-center justify-between border-b border-[#E2DDD3] dark:border-[#27272A] pb-3 text-[11px] tracking-wider uppercase text-[#736E66] dark:text-[#A1A1AA]">
        <span className="font-bold text-[#121212] dark:text-white">MITTI CAFÉ / CONCEPT</span>
        <span className="text-[10px] text-[#0047AB] dark:text-[#3B82F6] font-bold uppercase tracking-wider">Independent Concept</span>
      </div>

      {/* Center schematic for restaurant landing */}
      <div className="my-auto space-y-3 py-2">
        <div className="flex items-center justify-between">
          <div className="space-y-1.5 max-w-[65%]">
            <div className="h-3.5 w-36 bg-[#121212] dark:bg-white" />
            <div className="h-1.5 w-48 bg-[#8C857B] dark:bg-[#71717A]" />
          </div>
          <div className="border border-[#0047AB] dark:border-[#3B82F6] text-[#0047AB] dark:text-[#3B82F6] px-2.5 py-1 text-[9px] font-bold tracking-wider uppercase">
            Direct Table Reservation
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-1">
          <div className="p-2 bg-[#EAE6DE] dark:bg-[#1F1F23] border border-[#DDD7CD] dark:border-[#2E2E33]">
            <div className="text-[8px] uppercase text-[#736E66] dark:text-[#A1A1AA] font-bold">Specialty Brew</div>
            <div className="h-1.5 w-10 bg-[#121212] dark:bg-white mt-1" />
          </div>
          <div className="p-2 bg-[#EAE6DE] dark:bg-[#1F1F23] border border-[#DDD7CD] dark:border-[#2E2E33]">
            <div className="text-[8px] uppercase text-[#736E66] dark:text-[#A1A1AA] font-bold">Artisanal Bakes</div>
            <div className="h-1.5 w-12 bg-[#121212] dark:bg-white mt-1" />
          </div>
          <div className="p-2 bg-[#EAE6DE] dark:bg-[#1F1F23] border border-[#DDD7CD] dark:border-[#2E2E33]">
            <div className="text-[8px] uppercase text-[#736E66] dark:text-[#A1A1AA] font-bold">Live Hours</div>
            <div className="h-1.5 w-11 bg-[#121212] dark:bg-white mt-1" />
          </div>
        </div>
      </div>

      {/* Footer label */}
      <div className="flex items-center justify-between text-[10px] text-[#8C857B] dark:text-[#A1A1AA] border-t border-[#E2DDD3] dark:border-[#27272A] pt-2.5 font-mono">
        <span>MENU DISCOVERY WITHOUT PDF</span>
        <span>ONE-TAP RESERVATIONS</span>
      </div>
    </div>
  );
}
