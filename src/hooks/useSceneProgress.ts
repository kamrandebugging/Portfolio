import type { RefObject } from 'react';
import { ScrollTrigger, useGSAP, SCENES_ON, motionMatchMedia } from '../engine/gsap';

interface SceneOptions {
  start?: string;
  end?: string;
  /** Media query the scene runs under. Defaults to tablets and up. */
  query?: string;
  /** Called every scroll update with progress 0..1. */
  onProgress?: (progress: number, el: HTMLElement) => void;
  /** Called once when the scene is set up; may return a teardown. */
  onSetup?: (el: HTMLElement) => void | (() => void);
}

/**
 * Writes the scene's scroll progress to `--p` on the element. CSS does the
 * choreography with calc(); JS never touches individual transforms.
 */
export const useSceneProgress = (
  ref: RefObject<HTMLElement | null>,
  {
    start = 'top top',
    end = 'bottom bottom',
    query = SCENES_ON,
    onProgress,
    onSetup,
  }: SceneOptions = {}
) => {
  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const mm = motionMatchMedia();
      mm.add(query, () => {
        el.style.setProperty('--p', '0');
        const teardown = onSetup?.(el);

        const trigger = ScrollTrigger.create({
          trigger: el,
          start,
          end,
          onUpdate: (self) => {
            el.style.setProperty('--p', self.progress.toFixed(4));
            onProgress?.(self.progress, el);
          },
        });

        return () => {
          trigger.kill();
          el.style.removeProperty('--p');
          if (typeof teardown === 'function') teardown();
        };
      });
    },
    { scope: ref }
  );
};
