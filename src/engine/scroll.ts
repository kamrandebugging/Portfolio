import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './gsap';
import { isReduced } from './motion';

let lenis: Lenis | null = null;

export const getLenis = (): Lenis | null => lenis;

/**
 * Lenis drives the scroll position, GSAP's ticker drives Lenis, and
 * ScrollTrigger reads the smoothed position. One clock, no drift.
 */
export const initScroll = (): (() => void) => {
  if (isReduced()) {
    return () => {};
  }

  const instance = new Lenis({
    duration: 1.15,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });
  lenis = instance;

  instance.on('scroll', ScrollTrigger.update);
  const tick = (time: number) => instance.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  return () => {
    gsap.ticker.remove(tick);
    instance.destroy();
    lenis = null;
  };
};

/**
 * Nav/menu links are either a page route ("/projects/labflow") or a home
 * section hash ("#about"). A hash only resolves on the home page's DOM, so
 * from any other route it navigates home first and lets Home's hash effect
 * (src/pages/Home.tsx) finish the scroll once the sections exist.
 */
export const goToSection = (
  navigate: (to: string) => void,
  onHome: boolean,
  href: string
): void => {
  if (!href.startsWith('#')) {
    navigate(href);
  } else if (onHome) {
    scrollToTarget(href);
  } else {
    navigate(`/${href}`);
  }
};

export const scrollToTarget = (target: string | HTMLElement, offset = 0): void => {
  let element =
    typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
  if (!element) return;

  // On desktop the contact footer is fixed behind the page; its spacer is the scroll target.
  if (element.id === 'contact') {
    const spacer = document.getElementById('contact-sentinel');
    if (spacer && spacer.offsetHeight > 0) element = spacer;
  }

  if (lenis) {
    lenis.scrollTo(element, { offset, duration: 1.4 });
  } else {
    const top = element.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top, behavior: 'auto' });
  }
};
