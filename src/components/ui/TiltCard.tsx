import React, { useRef } from 'react';
import { gsap, useGSAP, motionMatchMedia } from '../../engine/gsap';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  /** Max rotation in degrees at the card's edge. */
  max?: number;
}

/** A panel that tilts toward the cursor in 3D — pointer devices only. */
export const TiltCard: React.FC<TiltCardProps> = ({ children, className = '', max = 10 }) => {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      gsap.set(el, { transformPerspective: 900, transformStyle: 'preserve-3d' });

      const mm = motionMatchMedia();
      mm.add('(hover: hover) and (pointer: fine)', () => {
        const rxTo = gsap.quickTo(el, 'rotateX', { duration: 0.5, ease: 'power3' });
        const ryTo = gsap.quickTo(el, 'rotateY', { duration: 0.5, ease: 'power3' });
        const sTo = gsap.quickTo(el, 'scale', { duration: 0.5, ease: 'power3' });

        const onMove = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          ryTo(px * max);
          rxTo(-py * max);
          sTo(1.03);
        };
        const onLeave = () => {
          rxTo(0);
          ryTo(0);
          sTo(1);
        };

        el.addEventListener('pointermove', onMove);
        el.addEventListener('pointerleave', onLeave);
        return () => {
          el.removeEventListener('pointermove', onMove);
          el.removeEventListener('pointerleave', onLeave);
          gsap.set(el, { rotateX: 0, rotateY: 0, scale: 1 });
        };
      });
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

export default TiltCard;
