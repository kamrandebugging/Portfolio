import React, { useRef } from 'react';
import { gsap, useGSAP, motionMatchMedia } from '../../engine/gsap';

interface MagneticProps {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}

/** Wraps a control so it leans toward the pointer. Pointer devices only. */
export const Magnetic: React.FC<MagneticProps> = ({ children, strength = 0.3, className = '' }) => {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const mm = motionMatchMedia();
      mm.add(
        '(hover: hover) and (pointer: fine)',
        () => {
          const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3' });
          const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3' });

          const onMove = (e: PointerEvent) => {
            const r = el.getBoundingClientRect();
            xTo((e.clientX - (r.left + r.width / 2)) * strength);
            yTo((e.clientY - (r.top + r.height / 2)) * strength);
          };
          const onLeave = () => {
            xTo(0);
            yTo(0);
          };

          el.addEventListener('pointermove', onMove);
          el.addEventListener('pointerleave', onLeave);
          return () => {
            el.removeEventListener('pointermove', onMove);
            el.removeEventListener('pointerleave', onLeave);
            gsap.set(el, { x: 0, y: 0 });
          };
        }
      );
    },
    { scope: ref }
  );

  return (
    <span ref={ref} className={`inline-block ${className}`}>
      {children}
    </span>
  );
};
