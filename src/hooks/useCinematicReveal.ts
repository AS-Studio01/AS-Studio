import { useEffect, useRef, useState, RefObject } from 'react';

export interface UseCinematicRevealOptions {
  threshold?: number;
  rootMargin?: string;
  delayMs?: number;
  triggerOnce?: boolean;
}

export interface UseCinematicRevealResult<T extends HTMLElement> {
  ref: RefObject<T | null>;
  isRevealed: boolean;
  [0]: RefObject<T | null>;
  [1]: boolean;
}

/**
 * Safe cinematic reveal: content is ALWAYS visible. IntersectionObserver only
 * controls the finishing transform/filter, so a browser/observer failure can
 * never make a section disappear.
 */
export function useCinematicReveal<T extends HTMLElement = HTMLDivElement>(
  options: UseCinematicRevealOptions = {}
): UseCinematicRevealResult<T> {
  const {
    threshold = 0.08,
    rootMargin = '0px 0px -10% 0px',
    delayMs = 0,
    triggerOnce = true,
  } = options;

  const ref = useRef<T | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const reveal = () => setIsRevealed(true);

    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      reveal();
      return;
    }

    if (!('IntersectionObserver' in window)) {
      reveal();
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        if (delayMs > 0) window.setTimeout(reveal, delayMs);
        else reveal();
        if (triggerOnce) observer.unobserve(entry.target);
      }
    }, { threshold, rootMargin });

    observer.observe(element);

    // If a browser fails to report the initial intersection, never leave the
    // content in an incomplete visual state.
    const safety = window.setTimeout(reveal, 1800 + delayMs);

    return () => {
      observer.disconnect();
      window.clearTimeout(safety);
    };
  }, [threshold, rootMargin, delayMs, triggerOnce]);

  const tuple = [ref, isRevealed] as unknown as UseCinematicRevealResult<T>;
  tuple.ref = ref;
  tuple.isRevealed = isRevealed;
  return tuple;
}

export default useCinematicReveal;
