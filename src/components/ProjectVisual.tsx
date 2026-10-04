import { ArrowUpRight } from 'lucide-react';

interface ProjectVisualProps {
  projectId: string;
  name: string;
  imageUrl?: string;
  category?: string;
}

export function ProjectVisual({ projectId, name, imageUrl, category }: ProjectVisualProps) {
  const safeImage = imageUrl || '';

  return (
    <div
      className="w-full aspect-[16/10] bg-[#121216] border-b border-white/[0.08] relative overflow-hidden group select-none"
      aria-label={`Visual preview for ${name}`}
    >
      {safeImage ? (
        <img
          src={safeImage}
          alt={`${name} project preview`}
          className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.045]"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,.28),transparent_35%),radial-gradient(circle_at_80%_70%,rgba(124,58,237,.22),transparent_35%)]" />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-[#09090D]/95 via-[#09090D]/15 to-transparent" />
      <div className="absolute inset-x-4 top-4 flex items-center justify-between gap-2">
        <span className="max-w-[70%] truncate rounded-full bg-black/55 px-3 py-1.5 text-[10px] font-semibold tracking-[0.14em] text-white/90 backdrop-blur-md border border-white/10">
          {name}
        </span>
        <span className="rounded-full bg-white/10 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-white/80 backdrop-blur-md border border-white/10">
          Studio Concept
        </span>
      </div>

      <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.16em] text-white/55">{category || 'Selected Work'}</p>
          <p className="mt-1 text-sm font-semibold text-white">A visual direction for a real business brief</p>
        </div>
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/15 bg-black/35 text-white/90 backdrop-blur-md transition-transform duration-300 group-hover:-translate-y-1">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
    </div>
  );
}
