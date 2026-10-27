import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';
import { isReduced } from './motion';

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

// Phone browsers resize the viewport as the address bar slides away; don't re-measure for that.
ScrollTrigger.config({ ignoreMobileResize: true });

export { gsap, ScrollTrigger, SplitText, useGSAP };

/** Every viewport. Reduced motion is handled by motionMatchMedia, not by the query. */
export const MOTION_OK = '(min-width: 0px)';
/** Tablets and up: pinned stages with room for side-by-side layouts. */
export const SCENES_ON = '(min-width: 768px)';
/** Phones: scroll-linked scenes redesigned for a single column and native touch scrolling. */
export const MOBILE_SCENES = '(max-width: 767px)';

/**
 * gsap.matchMedia() whose handlers are skipped entirely when the visitor has
 * reduced motion on (system setting or the menu toggle), so every scene
 * falls back to its static layout through one code path.
 */
export const motionMatchMedia = (): gsap.MatchMedia => {
  const mm = gsap.matchMedia();
  const add = mm.add.bind(mm) as (query: unknown, run: unknown, scope?: unknown) => unknown;
  (mm as unknown as { add: typeof add }).add = (query, run, scope) =>
    add(query, (ctx: unknown) => (isReduced() ? undefined : (run as (c: unknown) => unknown)(ctx)), scope);
  return mm;
};
