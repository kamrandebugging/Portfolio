import Lenis from 'lenis';

let lenisInstance: Lenis | null = null;

export const initLenis = (): (() => void) => {
  // Respect prefers-reduced-motion
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return () => {};
  }

  const lenis = new Lenis({
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  lenisInstance = lenis;

  let rafId: number;
  function raf(time: number) {
    lenis.raf(time);
    rafId = requestAnimationFrame(raf);
  }

  rafId = requestAnimationFrame(raf);

  return () => {
    cancelAnimationFrame(rafId);
    lenis.destroy();
    lenisInstance = null;
  };
};

export const getLenis = (): Lenis | null => lenisInstance;

export const scrollToTarget = (target: string | HTMLElement, options?: { offset?: number }): void => {
  if (typeof document === 'undefined') return;

  const element = typeof target === 'string' ? document.querySelector(target) as HTMLElement : target;
  if (!element) return;

  const offset = options?.offset ?? 0;

  if (lenisInstance) {
    lenisInstance.scrollTo(element, { offset, duration: 1.2 });
  } else {
    const top = element.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top, behavior: 'auto' });
  }
};
