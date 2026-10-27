import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';

interface SheetLiftProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  enabled?: boolean;
}

export const SheetLift: React.FC<SheetLiftProps> = ({
  children,
  id,
  className = '',
  enabled = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(typeof window !== 'undefined' && window.innerWidth >= 1024);
    };
    checkDesktop();
    window.addEventListener('resize', checkDesktop, { passive: true });
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['end end', 'end start'],
  });

  // Desktop 3D perspective lift & slight tilt as section exits
  const rotateX = useTransform(scrollYProgress, [0, 1], [0, 3.5]);
  const translateY = useTransform(scrollYProgress, [0, 1], [0, -28]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.985]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.9]);

  // Mobile or reduced-motion: zero 3D tilt, no perspective, no layout shift
  if (!enabled || !isDesktop || shouldReduceMotion) {
    return (
      <div id={id} className={className}>
        {children}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      id={id}
      style={{ perspective: 1200 }}
      className={`relative ${className}`}
    >
      <motion.div
        style={{
          rotateX,
          y: translateY,
          scale,
          opacity,
          transformOrigin: 'top center',
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};
