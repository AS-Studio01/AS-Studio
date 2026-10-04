interface ProjectVisualProps {
  projectId: string;
  name: string;
}

export function ProjectVisual({ projectId, name }: ProjectVisualProps) {
  if (projectId === 'apex-residences') {
    return (
      <div 
        className="w-full aspect-[16/10] bg-[#121216] border-b border-white/[0.08] relative overflow-hidden group select-none"
        aria-label={`Visual preview for ${name}`}
      >
        <img
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=85"
          alt="Apex Residences penthouse architectural terrace overlooking skyline"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E10] via-black/40 to-black/20" />

        {/* Top Tag & Status */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-[11px] font-mono">
          <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white font-bold tracking-wider uppercase">
            APEX RESIDENCES · PENTHOUSES
          </span>
          <span className="px-2 py-0.5 rounded-full bg-[#C5A880]/20 text-[#C5A880] font-bold border border-[#C5A880]/30">
            Real Estate
          </span>
        </div>

        {/* Bottom Specs Overlay */}
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[10px] font-mono">
            <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-white">
              360° Sky Views
            </span>
            <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-[#C5A880]">
              Floorplan Inspector
            </span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 font-bold">
            ● Live Staging Demo
          </span>
        </div>
      </div>
    );
  }

  if (projectId === 'atelier-north') {
    return (
      <div 
        className="w-full aspect-[16/10] bg-[#121216] border-b border-white/[0.08] relative overflow-hidden group select-none"
        aria-label={`Visual preview for ${name}`}
      >
        <img
          src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1000&q=85"
          alt="Atelier North minimal spatial pavilion with natural cedar and travertine"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E10] via-black/40 to-black/20" />

        {/* Top Tag & Status */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-[11px] font-mono">
          <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white font-bold tracking-wider uppercase">
            ATELIER NORTH · MONOGRAPH
          </span>
          <span className="px-2 py-0.5 rounded-full bg-[#8F9F8F]/20 text-[#8F9F8F] font-bold border border-[#8F9F8F]/30">
            Spatial Architecture
          </span>
        </div>

        {/* Bottom Material Swatches Overlay */}
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {[
              { label: 'Travertine', color: '#C7B79D' },
              { label: 'Smoked Oak', color: '#5A4B3C' },
              { label: 'Bronze', color: '#3D3A38' },
              { label: 'Plaster', color: '#9E9B93' },
            ].map((m) => (
              <span
                key={m.label}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-[10px] text-white font-mono"
              >
                <span className="w-2 h-2 rounded-full border border-white/20" style={{ backgroundColor: m.color }} />
                <span>{m.label}</span>
              </span>
            ))}
          </div>
          <span className="text-[10px] font-mono text-emerald-400 font-bold hidden sm:inline">
            ● Live Staging Demo
          </span>
        </div>
      </div>
    );
  }

  // Nova Dental Care
  return (
    <div 
      className="w-full aspect-[16/10] bg-[#121216] border-b border-white/[0.08] relative overflow-hidden group select-none"
      aria-label={`Visual preview for ${name}`}
    >
      <img
        src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1000&q=85"
        alt="Modern aesthetic dental clinic treatment suite and appointment triage interface"
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E10] via-black/40 to-black/20" />

      {/* Top Tag & Status */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-[11px] font-mono">
        <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white font-bold tracking-wider uppercase">
          NOVA DENTAL · CLINIC SUITE
        </span>
        <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
          Healthcare Triage
        </span>
      </div>

      {/* Bottom Feature Badges */}
      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[10px] font-mono">
          <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-white">
            Instant Mobile Booking
          </span>
          <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-cyan-300">
            Dr. Credibility Triage
          </span>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 font-bold">
          ● Live Staging Demo
        </span>
      </div>
    </div>
  );
}
