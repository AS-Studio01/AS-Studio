import { useState } from 'react';
import { Building2, Compass, Stethoscope, Smartphone } from 'lucide-react';

interface ProjectVisualProps {
  projectId: string;
  name: string;
}

export function ProjectVisual({ projectId, name }: ProjectVisualProps) {
  const [imageError, setImageError] = useState(false);

  if (projectId === 'apex-residences') {
    return (
      <div 
        className="w-full aspect-[16/10] bg-[#121216] border-b border-[#E5E2D9] dark:border-white/[0.08] relative overflow-hidden group select-none"
        aria-label={`Visual preview for ${name}`}
      >
        {!imageError ? (
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=85"
            alt="Apex Residences penthouse architectural terrace overlooking skyline"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#1C1A17] to-[#0E0E12] flex flex-col items-center justify-center p-6 text-center">
            <Building2 className="w-10 h-10 text-[#C5A880] mb-2 stroke-[1.2]" />
            <span className="text-sm font-bold text-white font-mono">Apex Residences</span>
            <span className="text-[11px] text-[#A1A1AA] font-mono mt-1">Luxury Real Estate · Penthouse Living</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E10] via-black/35 to-black/20" />

        {/* Top Unboxed Metadata */}
        <div className="absolute top-3.5 left-4 right-4 flex items-center justify-between text-[11px] font-mono text-white/90">
          <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded">
            <span className="font-bold tracking-wider uppercase text-white">APEX RESIDENCES</span>
            <span className="text-white/40">·</span>
            <span className="text-[#C5A880] font-semibold">Studio Concept</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-bold bg-black/60 backdrop-blur-md px-2 py-0.5 rounded">
            Live Staging
          </span>
        </div>

        {/* Bottom Specs Overlay */}
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] font-mono">
          <div className="flex items-center gap-2 text-white/80">
            <span>360° Sky Views</span>
            <span className="text-white/40">·</span>
            <span className="text-[#C5A880]">Floorplan Inspector</span>
          </div>
          <span className="text-[10px] text-white/60">
            Interactive Prototype
          </span>
        </div>
      </div>
    );
  }

  if (projectId === 'atelier-north') {
    return (
      <div 
        className="w-full aspect-[16/10] bg-[#121216] border-b border-[#E5E2D9] dark:border-white/[0.08] relative overflow-hidden group select-none"
        aria-label={`Visual preview for ${name}`}
      >
        {!imageError ? (
          <img
            src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1000&q=85"
            alt="Atelier North minimal spatial pavilion with natural cedar and travertine"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#181C18] to-[#0E0E12] flex flex-col items-center justify-center p-6 text-center">
            <Compass className="w-10 h-10 text-[#8F9F8F] mb-2 stroke-[1.2]" />
            <span className="text-sm font-bold text-white font-mono">Atelier North</span>
            <span className="text-[11px] text-[#A1A1AA] font-mono mt-1">Spatial Architecture · Monograph</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E10] via-black/35 to-black/20" />

        {/* Top Unboxed Metadata */}
        <div className="absolute top-3.5 left-4 right-4 flex items-center justify-between text-[11px] font-mono text-white/90">
          <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded">
            <span className="font-bold tracking-wider uppercase text-white">ATELIER NORTH</span>
            <span className="text-white/40">·</span>
            <span className="text-[#8F9F8F] font-semibold">Studio Concept</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-bold bg-black/60 backdrop-blur-md px-2 py-0.5 rounded">
            Live Staging
          </span>
        </div>

        {/* Bottom Material Swatches Overlay */}
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] font-mono">
          <div className="flex items-center gap-1.5">
            {[
              { label: 'Travertine', color: '#C7B79D' },
              { label: 'Smoked Oak', color: '#5A4B3C' },
              { label: 'Bronze', color: '#3D3A38' },
            ].map((m) => (
              <span
                key={m.label}
                className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-black/60 backdrop-blur-md text-[10px] text-white/90 rounded"
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: m.color }} />
                <span>{m.label}</span>
              </span>
            ))}
          </div>
          <span className="text-[10px] text-white/60">
            Interactive Prototype
          </span>
        </div>
      </div>
    );
  }

  // Nova Dental Care
  return (
    <div 
      className="w-full aspect-[16/10] bg-[#121216] border-b border-[#E5E2D9] dark:border-white/[0.08] relative overflow-hidden group select-none"
      aria-label={`Visual preview for ${name}`}
    >
      {!imageError ? (
        <img
          src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1000&q=85"
          alt="Modern aesthetic dental clinic treatment suite and appointment triage interface"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-[#121C1C] to-[#0E0E12] flex flex-col items-center justify-center p-6 text-center">
          <Stethoscope className="w-10 h-10 text-cyan-400 mb-2 stroke-[1.2]" />
          <span className="text-sm font-bold text-white font-mono">Nova Dental Care</span>
          <span className="text-[11px] text-[#A1A1AA] font-mono mt-1">Healthcare Triage · Clinic Suite</span>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E10] via-black/35 to-black/20" />

      {/* Top Unboxed Metadata */}
      <div className="absolute top-3.5 left-4 right-4 flex items-center justify-between text-[11px] font-mono text-white/90">
        <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded">
          <span className="font-bold tracking-wider uppercase text-white">NOVA DENTAL</span>
          <span className="text-white/40">·</span>
          <span className="text-cyan-300 font-semibold">Studio Concept</span>
        </div>
        <span className="text-[10px] text-emerald-400 font-bold bg-black/60 backdrop-blur-md px-2 py-0.5 rounded">
          Live Staging
        </span>
      </div>

      {/* Bottom Feature Badges */}
      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] font-mono">
        <div className="flex items-center gap-2 text-white/80">
          <span>Same-Day Triage</span>
          <span className="text-white/40">·</span>
          <span className="text-cyan-300">Dr. Credentials</span>
        </div>
        <span className="text-[10px] text-white/60">
          Interactive Prototype
        </span>
      </div>
    </div>
  );
}

