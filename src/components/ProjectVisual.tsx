interface ProjectVisualProps {
  projectId: string;
  name: string;
}

export function ProjectVisual({ projectId, name }: ProjectVisualProps) {
  if (projectId === 'aura-home-decor') {
    return (
      <div 
        className="w-full aspect-[16/10] bg-[#121216] border-b border-white/[0.08] relative overflow-hidden group select-none"
        aria-label={`Visual preview for ${name}`}
      >
        <img
          src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=85"
          alt="Aura Living sculptural travertine furniture and ambient lighting showroom"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E10] via-black/40 to-black/20" />

        {/* Top Tag & Status */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-[11px] font-mono">
          <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white font-bold tracking-wider uppercase">
            AURA LIVING · 2026 LOOKBOOK
          </span>
          <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
            Tactile Showroom
          </span>
        </div>

        {/* Bottom Material Swatches Overlay */}
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {[
              { label: 'Travertine', color: '#DCD5C6' },
              { label: 'Oak', color: '#8F6C47' },
              { label: 'Linen', color: '#E5E0D5' },
              { label: 'Brass', color: '#BFA05A' },
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
          <span className="text-[10px] font-mono text-white/80 hidden sm:inline">
            Zero-Bloat Staging
          </span>
        </div>
      </div>
    );
  }

  if (projectId === 'nova-dental-care') {
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
            ● Fast Staging
          </span>
        </div>
      </div>
    );
  }

  // Mitti Café
  return (
    <div 
      className="w-full aspect-[16/10] bg-[#121216] border-b border-white/[0.08] relative overflow-hidden group select-none"
      aria-label={`Visual preview for ${name}`}
    >
      <img
        src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1000&q=85"
        alt="Artisan cafe specialty coffee pour-over and zero-PDF mobile menu"
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E10] via-black/40 to-black/20" />

      {/* Top Tag & Status */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-[11px] font-mono">
        <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white font-bold tracking-wider uppercase">
          MITTI CAFÉ & ROASTERY
        </span>
        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
          Zero-PDF Menu
        </span>
      </div>

      {/* Bottom Feature Badges */}
      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[10px] font-mono">
          <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-white">
            Single Origin Pourover
          </span>
          <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-amber-300">
            One-Tap Reservations
          </span>
        </div>
        <span className="text-[10px] font-mono text-white/80 hidden sm:inline">
          Sub-second Speed
        </span>
      </div>
    </div>
  );
}
