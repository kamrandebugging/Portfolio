import type { RefObject } from 'react';
import {
  gsap,
  ScrollTrigger,
  SplitText,
  useGSAP,
  MOTION_OK,
  motionMatchMedia,
} from '../engine/gsap';

/**
 * Scroll-triggered reveals for everything inside `scope`:
 *   [data-split]  headline lines rise out of a mask
 *   [data-fade]   block fades up
 *   [data-line]   hairline draws left to right
 * Triggers are the elements themselves (position math, not
 * IntersectionObserver), so clipped children can never deadlock a reveal.
 */
export const useReveals = (scope: RefObject<HTMLElement | null>) => {
  useGSAP(
    () => {
      const mm = motionMatchMedia();

      mm.add(MOTION_OK, () => {
        gsap.utils.toArray<HTMLElement>('[data-split]').forEach((el) => {
          SplitText.create(el, {
            type: 'lines',
            mask: 'lines',
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self.lines, {
                yPercent: 110,
                duration: 1.1,
                ease: 'expo.out',
                stagger: 0.09,
                scrollTrigger: { trigger: el, start: 'top 88%', once: true },
              }),
          });
        });

        gsap.utils.toArray<HTMLElement>('[data-fade]').forEach((el) => {
          gsap.from(el, {
            y: 28,
            autoAlpha: 0,
            duration: 1,
            ease: 'expo.out',
            scrollTrigger: { trigger: el, start: 'top 92%', once: true },
          });
        });

        gsap.utils.toArray<HTMLElement>('[data-line]').forEach((el) => {
          gsap.from(el, {
            scaleX: 0,
            transformOrigin: 'left center',
            duration: 1.3,
            ease: 'expo.out',
            scrollTrigger: { trigger: el, start: 'top 94%', once: true },
          });
        });
      });

      ScrollTrigger.refresh();
    },
    { scope }
  );
};
