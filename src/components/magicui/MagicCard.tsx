import React, { useCallback, useEffect, useRef, useState } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface MagicCardProps extends React.HTMLAttributes<HTMLDivElement> {
  gradientSize?: number;
  gradientColor?: string;
  gradientOpacity?: number;
  className?: string;
  children: React.ReactNode;
}

export const MagicCard: React.FC<MagicCardProps> = ({
  gradientSize = 320,
  gradientColor = '#ff3b1d',
  gradientOpacity = 0.16,
  className,
  children,
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mouseX, setMouseX] = useState<number>(-gradientSize);
  const [mouseY, setMouseY] = useState<number>(-gradientSize);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isPointerFine, setIsPointerFine] = useState<boolean>(false);

  useEffect(() => {
    // Only enable mouse glow on devices with fine pointer and hover support
    const media = window.matchMedia('(hover: hover) and (pointer: fine)');
    setIsPointerFine(media.matches);

    const handler = (e: MediaQueryListEvent) => setIsPointerFine(e.matches);
    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isPointerFine || !cardRef.current) return;
      const { left, top } = cardRef.current.getBoundingClientRect();
      setMouseX(e.clientX - left);
      setMouseY(e.clientY - top);
    },
    [isPointerFine]
  );

  const handleMouseEnter = useCallback(() => {
    if (isPointerFine) setIsHovered(true);
  }, [isPointerFine]);

  const handleMouseLeave = useCallback(() => {
    if (isPointerFine) {
      setIsHovered(false);
      setMouseX(-gradientSize);
      setMouseY(-gradientSize);
    }
  }, [isPointerFine, gradientSize]);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={twMerge(
        clsx(
          'group relative overflow-hidden rounded-xl border border-white/10 bg-[#111114]/50 backdrop-blur-sm transition-all duration-300 hover:border-white/25 hover:bg-[#111114]/80',
          className
        )
      )}
      {...props}
    >
      {/* Spotlight radial glow (desktop fine-pointer only) */}
      {isPointerFine && isHovered && (
        <div
          className="pointer-events-none absolute -inset-px rounded-xl opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px, ${gradientColor}${Math.round(
              gradientOpacity * 255
            ).toString(16).padStart(2, '0')}, transparent 80%)`,
          }}
          aria-hidden="true"
        />
      )}

      {/* Card Content */}
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
};

export default MagicCard;
