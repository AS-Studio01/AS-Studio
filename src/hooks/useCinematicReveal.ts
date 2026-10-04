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
    threshold = 0.15,
    rootMargin = '0px 0px -40px 0px',
    delayMs = 0,
    triggerOnce = true,
  } = options;

  const ref = useRef<T | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    // Respect accessibility reduced-motion preference
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      if (ref.current) {
        ref.current.classList.add('is-revealed');
      }
      setIsRevealed(true);
      return;
    }

    const element = ref.current;
    if (!element) return;

    // Fallback if IntersectionObserver is not supported
    if (!('IntersectionObserver' in window)) {
      element.classList.add('is-revealed');
      setIsRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const applyReveal = () => {
              if (ref.current) {
                ref.current.classList.add('is-revealed');
              }
              setIsRevealed(true);
            };

            if (delayMs > 0) {
              setTimeout(applyReveal, delayMs);
            } else {
              applyReveal();
            }

            if (triggerOnce) {
              observer.unobserve(entry.target);
            }
          } else if (!triggerOnce) {
            if (ref.current) {
              ref.current.classList.remove('is-revealed');
            }
            setIsRevealed(false);
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, delayMs, triggerOnce]);

  const tuple = [ref, isRevealed] as unknown as UseCinematicRevealResult<T>;
  tuple.ref = ref;
  tuple.isRevealed = isRevealed;

  return tuple;
}

export default useCinematicReveal;
