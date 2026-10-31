import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

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
 * Plain gsap.matchMedia(). Owner decision 2026-10-31: animations always run
 * on every device — no reduced-motion skip.
 */
export const motionMatchMedia = (): gsap.MatchMedia => gsap.matchMedia();
