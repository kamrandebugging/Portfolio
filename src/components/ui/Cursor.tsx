import React, { useRef } from 'react';
import { gsap, useGSAP, motionMatchMedia } from '../../engine/gsap';

/**
 * Trailing ring + dot. Grows on links and shows a label for any element
 * with data-cursor="Label". The native cursor is left alone on purpose.
 */
export const Cursor: React.FC = () => {
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const mm = motionMatchMedia();

    mm.add('(hover: hover) and (pointer: fine)', () => {
      const ringEl = ring.current;
      const dotEl = dot.current;
      const labelEl = label.current;
      if (!ringEl || !dotEl || !labelEl) return;

      gsap.set([ringEl, dotEl], { xPercent: -50, yPercent: -50, x: -200, y: -200 });
      const rx = gsap.quickTo(ringEl, 'x', { duration: 0.5, ease: 'power3' });
      const ry = gsap.quickTo(ringEl, 'y', { duration: 0.5, ease: 'power3' });
      const dx = gsap.quickTo(dotEl, 'x', { duration: 0.1, ease: 'power2' });
      const dy = gsap.quickTo(dotEl, 'y', { duration: 0.1, ease: 'power2' });

      let shown = false;
      const onMove = (e: PointerEvent) => {
        if (!shown) {
          shown = true;
          gsap.to([ringEl, dotEl], { opacity: 1, duration: 0.3 });
        }
        rx(e.clientX);
        ry(e.clientY);
        dx(e.clientX);
        dy(e.clientY);
      };

      const onOver = (e: PointerEvent) => {
        const target = (e.target as Element | null)?.closest<HTMLElement>(
          '[data-cursor], a, button, summary'
        );
        const text = target?.dataset.cursor;
        if (text) {
          labelEl.textContent = text;
          ringEl.dataset.state = 'label';
        } else if (target) {
          ringEl.dataset.state = 'link';
        } else {
          ringEl.dataset.state = '';
        }
      };

      const onLeaveWindow = () => {
        shown = false;
        gsap.to([ringEl, dotEl], { opacity: 0, duration: 0.2 });
      };

      document.addEventListener('pointermove', onMove);
      document.addEventListener('pointerover', onOver);
      document.documentElement.addEventListener('pointerleave', onLeaveWindow);

      return () => {
        document.removeEventListener('pointermove', onMove);
        document.removeEventListener('pointerover', onOver);
        document.documentElement.removeEventListener('pointerleave', onLeaveWindow);
      };
    });
  }, []);

  return (
    <>
      <div ref={ring} className="cursor-ring" data-state="" aria-hidden="true">
        <span ref={label} className="cursor-label" />
      </div>
      <div ref={dot} className="cursor-dot" aria-hidden="true" />
    </>
  );
};
