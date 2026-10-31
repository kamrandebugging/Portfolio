import React, { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '../engine/gsap';
import { scrollToTarget } from '../engine/scroll';

/**
 * One fixed control instead of three: it travels along the bottom edge with
 * page progress, names the current chapter, and flips colour with the
 * section beneath it. It also drives the nav/pill tone variables.
 */
export const ProgressPill: React.FC = () => {
  const pill = useRef<HTMLDivElement>(null);
    const title = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = pill.current;
      if (!el) return;
      const root = document.documentElement;

      const margin = () => (window.innerWidth < 640 ? 16 : 32);
      const setX = gsap.quickSetter(el, 'x', 'px');
      let progress = 0;
      const place = () =>
        setX(margin() + progress * Math.max(0, window.innerWidth - el.offsetWidth - margin() * 2));
      place();

      ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => {
          progress = self.progress;
          place();
          root.style.setProperty('--progress', self.progress.toFixed(4));
        },
      });
      window.addEventListener('resize', place);

      const resolve = (section: HTMLElement): HTMLElement => {
        const sel = section.dataset.trigger;
        const alt = sel ? document.querySelector<HTMLElement>(sel) : null;
        return alt && alt.offsetHeight > 0 ? alt : section;
      };

      // Explicit `document` scope: inside useGSAP, bare selectors resolve within `scope` (the pill).
      gsap.utils.toArray<HTMLElement>('[data-chapter]', document).forEach((section) => {
        const target = resolve(section);
        const { chapterTitle, tone = 'dark' } = section.dataset;
        const hide = chapterTitle === 'Contact';

        ScrollTrigger.create({
          trigger: target,
          start: 'top 60%',
          end: 'bottom 60%',
          onToggle: (self) => {
            if (!self.isActive) return;
                        if (title.current) title.current.textContent = chapterTitle ?? '';
            el.style.opacity = hide ? '0' : '1';
            el.style.pointerEvents = hide ? 'none' : 'auto';
          },
        });
        ScrollTrigger.create({
          trigger: target,
          start: 'top 6%',
          end: 'bottom 6%',
          onToggle: (self) => {
            if (self.isActive) root.dataset.navTone = tone;
          },
        });
        ScrollTrigger.create({
          trigger: target,
          start: 'top 92%',
          end: 'bottom 92%',
          onToggle: (self) => {
            if (self.isActive) root.dataset.pillTone = tone;
          },
        });
      });

      return () => window.removeEventListener('resize', place);
    },
    { scope: pill }
  );

  return (
    <>
      <div className="scroll-progress" aria-hidden="true" />
      <div ref={pill} className="pill" role="group" aria-label="Page position">
      <span className="pill-label">
        <span ref={title}>Intro</span>
      </span>
      <button
        type="button"
        className="pill-btn"
        onClick={() => scrollToTarget('#contact')}
        data-cursor="Email"
      >
        Get in touch
      </button>
      </div>
    </>
  );
};
