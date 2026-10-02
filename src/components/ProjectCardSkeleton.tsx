interface ProjectCardSkeletonProps {
  variant?: 'grid' | 'detailed';
}

export function ProjectCardSkeleton({ variant = 'grid' }: ProjectCardSkeletonProps) {
  if (variant === 'detailed') {
    return (
      <div 
        className="bg-white/80 dark:bg-[#18181B]/80 border border-[#DDD7CD] dark:border-[#27272A] grid grid-cols-1 lg:grid-cols-12 overflow-hidden shadow-sm animate-pulse"
        aria-hidden="true"
      >
        {/* Visual Preview Skeleton */}
        <div className="lg:col-span-7 aspect-[16/10] bg-[#ECE8E0] dark:bg-[#1A1A1E] border-b lg:border-b-0 lg:border-r border-[#DDD7CD] dark:border-[#27272A] p-6 sm:p-8 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2DDD3] dark:border-[#27272A]">
            <div className="h-3 w-28 bg-[#DDD7CD] dark:bg-[#27272A] rounded-sm" />
            <div className="h-3 w-20 bg-[#DDD7CD] dark:bg-[#27272A] rounded-sm" />
          </div>
          <div className="space-y-3 my-auto py-4">
            <div className="h-5 w-3/4 bg-[#DDD7CD] dark:bg-[#27272A] rounded-sm" />
            <div className="h-4 w-1/2 bg-[#DDD7CD] dark:bg-[#27272A] rounded-sm" />
            <div className="grid grid-cols-3 gap-3 pt-3">
              <div className="h-10 bg-[#E0DBD0] dark:bg-[#222226] rounded-sm" />
              <div className="h-10 bg-[#E0DBD0] dark:bg-[#222226] rounded-sm" />
              <div className="h-10 bg-[#E0DBD0] dark:bg-[#222226] rounded-sm" />
            </div>
          </div>
          <div className="flex justify-between pt-3 border-t border-[#E2DDD3] dark:border-[#27272A]">
            <div className="h-2.5 w-32 bg-[#DDD7CD] dark:bg-[#27272A] rounded-sm" />
            <div className="h-2.5 w-24 bg-[#DDD7CD] dark:bg-[#27272A] rounded-sm" />
          </div>
        </div>

        {/* Text & Specs Skeleton */}
        <div className="lg:col-span-5 p-7 sm:p-9 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Category & Badge */}
            <div className="flex items-center justify-between">
              <div className="h-3 w-32 bg-[#DDD7CD] dark:bg-[#27272A] rounded-sm" />
              <div className="h-4 w-24 bg-[#DDD7CD] dark:bg-[#27272A] rounded-sm" />
            </div>

            {/* Title */}
            <div className="h-8 w-4/5 bg-[#DDD7CD] dark:bg-[#27272A] rounded-sm" />

            {/* Description */}
            <div className="space-y-2 pt-1">
              <div className="h-3.5 w-full bg-[#DDD7CD] dark:bg-[#27272A] rounded-sm" />
              <div className="h-3.5 w-5/6 bg-[#DDD7CD] dark:bg-[#27272A] rounded-sm" />
              <div className="h-3.5 w-2/3 bg-[#DDD7CD] dark:bg-[#27272A] rounded-sm" />
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 pt-2">
              <div className="h-5 w-20 bg-[#EAE6DE] dark:bg-[#27272A] rounded-sm" />
              <div className="h-5 w-24 bg-[#EAE6DE] dark:bg-[#27272A] rounded-sm" />
              <div className="h-5 w-16 bg-[#EAE6DE] dark:bg-[#27272A] rounded-sm" />
            </div>

            {/* Highlights */}
            <div className="space-y-2 pt-3 border-t border-[#F0EBE1] dark:border-[#27272A]">
              <div className="h-3 w-3/4 bg-[#EAE6DE] dark:bg-[#27272A] rounded-sm" />
              <div className="h-3 w-2/3 bg-[#EAE6DE] dark:bg-[#27272A] rounded-sm" />
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4 border-t border-[#F0EBE1] dark:border-[#27272A] flex items-center justify-between">
            <div className="h-9 w-36 bg-[#DDD7CD] dark:bg-[#27272A] rounded-sm" />
            <div className="h-3 w-20 bg-[#EAE6DE] dark:bg-[#27272A] rounded-sm" />
          </div>
        </div>
      </div>
    );
  }

  // Grid variant for Home Page
  return (
    <div 
      className="bg-white/80 dark:bg-[#18181B]/80 border border-[#DDD7CD] dark:border-[#27272A] flex flex-col justify-between shadow-sm animate-pulse"
      aria-hidden="true"
    >
      <div>
        {/* Visual Preview Skeleton */}
        <div className="w-full aspect-[16/10] bg-[#ECE8E0] dark:bg-[#1A1A1E] border-b border-[#E5E0D8] dark:border-[#27272A] p-5 sm:p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-[#E2DDD3] dark:border-[#27272A]">
            <div className="h-3 w-24 bg-[#DDD7CD] dark:bg-[#27272A] rounded-sm" />
            <div className="h-3 w-16 bg-[#DDD7CD] dark:bg-[#27272A] rounded-sm" />
          </div>
          <div className="space-y-2.5 my-auto py-2">
            <div className="h-4 w-3/4 bg-[#DDD7CD] dark:bg-[#27272A] rounded-sm" />
            <div className="h-3.5 w-1/2 bg-[#DDD7CD] dark:bg-[#27272A] rounded-sm" />
            <div className="grid grid-cols-3 gap-2 pt-2">
              <div className="h-8 bg-[#E0DBD0] dark:bg-[#222226] rounded-sm" />
              <div className="h-8 bg-[#E0DBD0] dark:bg-[#222226] rounded-sm" />
              <div className="h-8 bg-[#E0DBD0] dark:bg-[#222226] rounded-sm" />
            </div>
          </div>
          <div className="flex justify-between pt-2 border-t border-[#E2DDD3] dark:border-[#27272A]">
            <div className="h-2 w-28 bg-[#DDD7CD] dark:bg-[#27272A] rounded-sm" />
            <div className="h-2 w-20 bg-[#DDD7CD] dark:bg-[#27272A] rounded-sm" />
          </div>
        </div>

        {/* Card Content Skeleton */}
        <div className="p-6 sm:p-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-3 w-28 bg-[#DDD7CD] dark:bg-[#27272A] rounded-sm" />
            <div className="h-4 w-20 bg-[#DDD7CD] dark:bg-[#27272A] rounded-sm" />
          </div>

          <div className="h-7 w-3/4 bg-[#DDD7CD] dark:bg-[#27272A] rounded-sm" />

          <div className="space-y-2">
            <div className="h-3 w-full bg-[#DDD7CD] dark:bg-[#27272A] rounded-sm" />
            <div className="h-3 w-5/6 bg-[#DDD7CD] dark:bg-[#27272A] rounded-sm" />
            <div className="h-3 w-2/3 bg-[#DDD7CD] dark:bg-[#27272A] rounded-sm" />
          </div>

          <div className="pt-1 flex flex-wrap gap-1.5">
            <div className="h-4 w-16 bg-[#EAE6DE] dark:bg-[#27272A] rounded-sm" />
            <div className="h-4 w-20 bg-[#EAE6DE] dark:bg-[#27272A] rounded-sm" />
            <div className="h-4 w-14 bg-[#EAE6DE] dark:bg-[#27272A] rounded-sm" />
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-7 pt-0">
        <div className="h-10 w-full bg-[#DDD7CD] dark:bg-[#27272A] rounded-sm" />
      </div>
    </div>
  );
}
