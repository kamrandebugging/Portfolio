import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface ScrollHeadingProps {
  children?: React.ReactNode;
  text?: string | string[];
  className?: string;
  as?: 'h1' | 'h2' | 'h3';
}

export const ScrollHeading: React.FC<ScrollHeadingProps> = ({
  children,
  text,
  className = '',
  as = 'h2',
}) => {
  const shouldReduceMotion = useReducedMotion();

  // If reduced motion is requested, render clean standard heading without animation
  if (shouldReduceMotion) {
    const Tag = as;
    return (
      <Tag className={className}>
        {text ? (Array.isArray(text) ? text.join(' ') : text) : children}
      </Tag>
    );
  }

  // Handle word-by-word reveal if text string or string array is provided
  const lines = text ? (Array.isArray(text) ? text : [text]) : null;

  const Tag = motion[as] as React.ElementType;

  return (
    <Tag
      initial={{ opacity: 0.4, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: false, amount: 0.25, margin: '-8% 0px -12% 0px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {lines ? (
        lines.map((line, lineIdx) => {
          const words = line.split(' ');
          return (
            <span key={lineIdx} className="block overflow-hidden py-0.5">
              {words.map((word, wordIdx) => (
                <span
                  key={wordIdx}
                  className="inline-block overflow-hidden align-top mr-[0.25em]"
                >
                  <motion.span
                    className="inline-block"
                    initial={{ y: '100%', opacity: 0.4 }}
                    whileInView={{ y: '0%', opacity: 1 }}
                    viewport={{ once: false, amount: 0.25, margin: '-8% 0px -12% 0px' }}
                    transition={{
                      duration: 0.55,
                      delay: (lineIdx * 4 + wordIdx) * 0.04,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    {word}
                  </motion.span>
                </span>
              ))}
            </span>
          );
        })
      ) : (
        children
      )}
    </Tag>
  );
};

interface FadingListItemProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const FadingListItem: React.FC<FadingListItemProps> = ({
  children,
  className = '',
  delay = 0,
}) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <li className={className}>{children}</li>;
  }

  return (
    <motion.li
      initial={{ opacity: 0.4, y: 18, scale: 0.985 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: false, amount: 0.25, margin: '-5% 0px -10% 0px' }}
      transition={{
        duration: 0.45,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.li>
  );
};
