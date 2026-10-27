import React, { useRef, useState } from 'react';
import { gsap, useGSAP } from '../engine/gsap';
import { isReduced } from '../engine/motion';
import { portfolioData } from '../data/portfolio';

const SEEN_KEY = 'mk-intro-seen';

const introSeen = (): boolean => {
  try {
    return sessionStorage.getItem(SEEN_KEY) === '1';
  } catch {
    return false;
  }
};

interface LoaderProps {
  onDone: () => void;
}

/**
 * Counter preloader that waits for the web fonts, then lifts away like a
 * curtain. Plays once per session and never under reduced motion.
 */
export const Loader: React.FC<LoaderProps> = ({ onDone }) => {
  const root = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const [skip] = useState(() => introSeen() || isReduced());
  const [gone, setGone] = useState(skip);

  const { contextSafe } = useGSAP(
    () => {
      const fontsReady: Promise<unknown> = document.fonts?.ready ?? Promise.resolve();

      if (skip) {
        fontsReady.then(onDone);
        return;
      }

      document.documentElement.classList.add('is-loading');

      const state = { v: 0 };
      const render = () => {
        if (count.current) count.current.textContent = String(Math.round(state.v)).padStart(2, '0');
        if (bar.current) bar.current.style.transform = `scaleX(${state.v / 100})`;
      };

      const finish = contextSafe(() => {
        gsap
          .timeline()
          .to(state, { v: 100, duration: 0.35, ease: 'power1.inOut', onUpdate: render })
          .to(count.current, { yPercent: -120, duration: 0.7, ease: 'expo.in' }, '+=0.12')
          .add(onDone, '>-0.25')
          .to(root.current, { yPercent: -100, duration: 1, ease: 'expo.inOut' }, '<')
          .add(() => {
            document.documentElement.classList.remove('is-loading');
            try {
              sessionStorage.setItem(SEEN_KEY, '1');
            } catch {
              /* private mode: the intro simply plays again next visit */
            }
            setGone(true);
          });
      });

      const counting = gsap.to(state, { v: 88, duration: 1.2, ease: 'power2.out', onUpdate: render });
      const counted = new Promise<void>((resolve) => counting.eventCallback('onComplete', resolve));
      const bail = window.setTimeout(finish, 5000);

      Promise.all([fontsReady, counted]).then(() => {
        window.clearTimeout(bail);
        finish();
      });

      return () => {
        window.clearTimeout(bail);
        document.documentElement.classList.remove('is-loading');
      };
    },
    { scope: root }
  );

  if (gone) return null;

  return (
    <div ref={root} className="loader" role="status" aria-label="Loading">
      <div className="absolute inset-x-0 top-0 flex justify-between px-[var(--pad-x)] pt-6 font-mono text-xs uppercase tracking-[0.16em] text-paper/70">
        <span>{portfolioData.personal.name}</span>
        <span>Portfolio 2026</span>
      </div>

      <div className="overflow-hidden px-4">
        <span ref={count} className="loader-count block">
          00
        </span>
      </div>

      <span className="absolute inset-x-[var(--pad-x)] bottom-8 h-px bg-paper/15">
        <span
          ref={bar}
          className="block h-full origin-left bg-leaf"
          style={{ transform: 'scaleX(0)' }}
        />
      </span>
    </div>
  );
};
