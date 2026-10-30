import React, { useRef } from 'react';
import { gsap, useGSAP, motionMatchMedia } from '../../engine/gsap';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  /** Max rotation in degrees at the card's edge. */
  max?: number;
  /** Add a specular glare highlight that follows the pointer. */
  glare?: boolean;
}

/** A panel that tilts toward the cursor in 3D — pointer devices only. */
export const TiltCard: React.FC<TiltCardProps> = ({ children, className = '', max = 10, glare = false }) => {
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
          const px = (e.clientX - r.left) / r.width;
          const py = (e.clientY - r.top) / r.height;
          ryTo((px - 0.5) * max);
          rxTo(-(py - 0.5) * max);
          sTo(1.03);
          if (glare) {
            el.style.setProperty('--tilt-gx', `${(px * 100).toFixed(1)}%`);
            el.style.setProperty('--tilt-gy', `${(py * 100).toFixed(1)}%`);
          }
        };
        const onLeave = () => {
          rxTo(0);
          ryTo(0);
          sTo(1);
          if (glare) {
            el.style.removeProperty('--tilt-gx');
            el.style.removeProperty('--tilt-gy');
          }
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
    <div ref={ref} className={`tilt-card${glare ? ' tilt-card--glare' : ''}${className ? ` ${className}` : ''}`}>
      {children}
      {glare && <div className="tilt-glare" aria-hidden="true" />}
    </div>
  );
};

export default TiltCard;
