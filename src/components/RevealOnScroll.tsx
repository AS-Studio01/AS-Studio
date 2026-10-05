import { useEffect, useRef, useState, ReactNode } from 'react';
import { useCinematicReveal, UseCinematicRevealOptions } from '../hooks/useCinematicReveal';

export { useCinematicReveal };
export type { UseCinematicRevealOptions };

interface RevealOnScrollProps {
  children: ReactNode;
  className?: string;
  delayMs?: number;
  direction?: 'up' | 'none';
  threshold?: number;
  rootMargin?: string;
}

/**
 * RevealOnScroll
 * ==============================================================================
 * Lightweight, high-performance IntersectionObserver-based reveal wrapper.
 * Ensures a cinematic editorial entrance for sections with 15% viewport threshold.
 * ==============================================================================
 */
export function RevealOnScroll({
  children,
  className = '',
  delayMs = 0,
  direction = 'up',
  threshold = 0.15,
  rootMargin = '0px 0px -40px 0px',
}: RevealOnScrollProps) {
  const { ref, isRevealed } = useCinematicReveal<HTMLDivElement>({
    threshold,
    rootMargin,
    delayMs,
  });
  const [cleanGpu, setCleanGpu] = useState(false);

  // Clean up GPU will-change memory after transition completes
  const handleTransitionEnd = () => {
    if (isRevealed) {
      setCleanGpu(true);
    }
  };

  const transformStyle = direction === 'none' ? 'translateY(0)' : undefined;

  return (
    <div
      ref={ref}
      onTransitionEnd={handleTransitionEnd}
      style={{
        transitionDelay: delayMs > 0 ? `${delayMs}ms` : undefined,
        transform: !isRevealed && direction === 'none' ? transformStyle : undefined,
      }}
      className={`cinematic-reveal ${cleanGpu ? 'clean-gpu' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * Backwards-compatible alias for useCinematicReveal
 */
export const useRevealOnScroll = useCinematicReveal;

