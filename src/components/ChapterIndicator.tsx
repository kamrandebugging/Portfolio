import React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Chapter } from '../hooks/useScrollChapter';

interface ChapterIndicatorProps {
  activeChapter: Chapter;
  scrollProgress: number;
  isContactVisible: boolean;
}

export const ChapterIndicator: React.FC<ChapterIndicatorProps> = ({
  activeChapter,
  scrollProgress,
  isContactVisible,
}) => {
  const shouldReduceMotion = useReducedMotion();

  // If on contact section, subtly tuck the indicator so it never covers contact info or footer
  const opacity = isContactVisible ? 0.35 : 1;

  return (
    <aside
      className="fixed bottom-6 left-6 sm:left-10 z-40 pointer-events-none select-none transition-opacity duration-500"
      style={{ opacity }}
      aria-label="Current chapter indicator"
    >
      <div className="flex items-center gap-3 px-3 sm:px-4 py-1.5 rounded-full bg-[#08080a]/85 backdrop-blur-md border border-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.6)]">
        {/* Travelling red progress line motif */}
        <div className="w-7 sm:w-10 h-[2px] bg-white/15 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#ff3b1d] transition-all duration-150 ease-out rounded-full"
            style={{ width: `${Math.max(10, scrollProgress * 100)}%` }}
          />
        </div>

        {/* Chapter label */}
        <div className="flex items-center gap-1.5 font-mono text-[0.6875rem] sm:text-xs uppercase tracking-wider overflow-hidden">
          <span className="text-[#ff3b1d] font-semibold tabular-nums">
            {activeChapter.num}
          </span>
          <span className="text-white/20">/</span>
          {shouldReduceMotion ? (
            <span className="text-[#f3f1ea] font-medium">
              {activeChapter.title}
            </span>
          ) : (
            <AnimatePresence mode="wait">
              <motion.span
                key={activeChapter.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="text-[#f3f1ea] font-medium"
              >
                {activeChapter.title}
              </motion.span>
            </AnimatePresence>
          )}
        </div>
      </div>
    </aside>
  );
};
