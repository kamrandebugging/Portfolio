import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface AuroraTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  className?: string;
  children: React.ReactNode;
  as?: React.ElementType;
}

export const AuroraText: React.FC<AuroraTextProps> = ({
  className,
  children,
  as: Component = 'span',
  ...props
}) => {
  return (
    <Component
      className={twMerge(
        clsx(
          'relative inline-block bg-[linear-gradient(135deg,#ff3b1d_0%,#ff6a3d_25%,#ff9f43_50%,#ff3b1d_75%,#ff5252_100%)] bg-[length:250%_250%] bg-clip-text text-transparent animate-aurora',
          className
        )
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

export default AuroraText;
