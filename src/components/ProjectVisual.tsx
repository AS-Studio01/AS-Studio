import { useState } from 'react';
import { Building2, Compass, Stethoscope, ImageOff } from 'lucide-react';

interface ProjectVisualProps {
  projectId: string;
  name: string;
  imageUrl?: string;
  category?: string;
  accentColor?: string;
  badge?: string;
}

const fallbackMeta: Record<string, { icon: typeof Building2; subtitle: string }> = {
  'apex-residences': { icon: Building2, subtitle: 'Luxury Real Estate · Architectural Living' },
  'atelier-north': { icon: Compass, subtitle: 'Architecture · Spatial Design' },
  'nova-dental-care': { icon: Stethoscope, subtitle: 'Healthcare · Clinical Practice' },
};

export function ProjectVisual({ projectId, name, imageUrl, category, accentColor = '#60A5FA', badge = 'Studio Concept' }: ProjectVisualProps) {
  const [imageError, setImageError] = useState(false);
  const meta = fallbackMeta[projectId];
  const Icon = meta?.icon ?? ImageOff;

  return (
    <div
      className="w-full aspect-[16/10] bg-[#121216] relative overflow-hidden group select-none"
      aria-label={`Visual preview for ${name}`}
    >
      {!imageError && imageUrl ? (
        <img
          src={imageUrl}
          alt={`${name} project preview`}
          className="w-full h-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.045]"
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-[#18181B] to-[#0E0E12] flex flex-col items-center justify-center p-6 text-center">
          <Icon className="w-10 h-10 mb-3 stroke-[1.2]" style={{ color: accentColor }} />
          <span className="text-sm font-bold text-white">{name}</span>
          <span className="text-[11px] text-[#A1A1AA] mt-1">{meta?.subtitle ?? category ?? 'Studio Project'}</span>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E10]/90 via-black/20 to-black/10 pointer-events-none" />
      <div className="absolute inset-0 ring-1 ring-inset ring-white/[0.08] pointer-events-none" />

      <div className="absolute top-3.5 left-4 right-4 flex items-center justify-between text-[11px] font-mono text-white/90">
        <div className="flex items-center gap-1.5 bg-black/55 backdrop-blur-md px-2.5 py-1 rounded-full">
          <span className="font-bold tracking-wider uppercase text-white">{name}</span>
          <span className="text-white/40">·</span>
          <span className="font-semibold" style={{ color: accentColor }}>{badge}</span>
        </div>
        <span className="text-[10px] text-emerald-300 font-bold bg-black/55 backdrop-blur-md px-2.5 py-1 rounded-full">
          Concept Preview
        </span>
      </div>

      <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between gap-3 text-[11px] font-mono">
        <span className="text-white/75 max-w-[70%] truncate">{category ?? meta?.subtitle}</span>
        <span className="text-[10px] text-white/60 shrink-0">Interactive Prototype</span>
      </div>
    </div>
  );
}
