import { useEffect, useRef, useState, RefObject } from 'react';

export interface UseCinematicRevealOptions {
  /**
   * Intersection threshold (ratio of element visible before triggering).
   * Defaults to 0.15 (15% threshold) as requested.
   */
  threshold?: number;
  /**
   * Root margin to offset the viewport bounds.
   * Defaults to '0px 0px -40px 0px' for natural fluid anticipation.
   */
  rootMargin?: string;
  /**
   * Optional delay in milliseconds before activating the reveal state.
   */
  delayMs?: number;
  /**
   * Whether to unobserve once revealed. Defaults to true.
   */
  triggerOnce?: boolean;
}

export interface UseCinematicRevealResult<T extends HTMLElement> {
  ref: RefObject<T | null>;
  isRevealed: boolean;
  [0]: RefObject<T | null>;
  [1]: boolean;
}

/**
 * useCinematicReveal
 * ==============================================================================
 * Custom hook using IntersectionObserver with a 15% viewport threshold.
 * Automatically toggles the 'is-revealed' class on the target DOM element
 * once it enters the viewport, and returns { ref, isRevealed }.
 *
 * Supports both object destructuring:
 *   const { ref, isRevealed } = useCinematicReveal();
 * and array destructuring:
 *   const [ref, isRevealed] = useCinematicReveal();
 * ==============================================================================
 */
export function useCinematicReveal<T extends HTMLElement = HTMLDivElement>(
  options: UseCinematicRevealOptions = {}
): UseCinematicRevealResult<T> {
  const {
    threshold = 0.12,
    rootMargin = '0px 0px -12% 0px',
    delayMs = 0,
    triggerOnce = true,
  } = options;

  const ref = useRef<T | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof window === 'undefined') return;

    let revealTimer: ReturnType<typeof setTimeout> | null = null;
    let failsafeTimer: ReturnType<typeof setTimeout> | null = null;
    let observer: IntersectionObserver | null = null;

    const reveal = () => {
      if (revealTimer) clearTimeout(revealTimer);
      const apply = () => {
        element.classList.add('is-revealed');
        setIsRevealed(true);
      };
      if (delayMs > 0) revealTimer = setTimeout(apply, delayMs);
      else apply();
    };

    // Never let an animation layer make content permanently invisible.
    // Reduced-motion, unsupported observers, browser edge cases, or an observer
    // that fails to fire all fall back to a visible state.
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion || !('IntersectionObserver' in window)) {
      reveal();
      return () => { if (revealTimer) clearTimeout(revealTimer); };
    }

    const rect = element.getBoundingClientRect();
    const inViewportNow = rect.top < window.innerHeight && rect.bottom > 0;
    if (inViewportNow) reveal();

    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            reveal();
            if (triggerOnce) observer?.unobserve(entry.target);
          } else if (!triggerOnce) {
            element.classList.remove('is-revealed');
            setIsRevealed(false);
          }
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    // Safety valve: a section should never disappear because an observer was
    // interrupted by navigation, browser restoration, or a rendering edge case.
    failsafeTimer = setTimeout(() => {
      if (!element.classList.contains('is-revealed')) reveal();
    }, 1800);

    return () => {
      observer?.disconnect();
      if (revealTimer) clearTimeout(revealTimer);
      if (failsafeTimer) clearTimeout(failsafeTimer);
    };
  }, [threshold, rootMargin, delayMs, triggerOnce]);

  const tuple = [ref, isRevealed] as unknown as UseCinematicRevealResult<T>;
  tuple.ref = ref;
  tuple.isRevealed = isRevealed;
  return tuple;
}
export default useCinematicReveal;
