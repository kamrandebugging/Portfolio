import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { scrollToTarget } from '../utils/scroll';

interface FloatingCTAProps {
  isContactVisible: boolean;
}

export const FloatingCTA: React.FC<FloatingCTAProps> = ({ isContactVisible }) => {
  return (
    <div
      className={`fixed bottom-6 right-6 sm:right-10 z-40 transition-all duration-300 ${
        isContactVisible
          ? 'opacity-0 pointer-events-none translate-y-3'
          : 'opacity-100 pointer-events-auto translate-y-0'
      }`}
      aria-hidden={isContactVisible}
    >
      <button
        type="button"
        onClick={() => scrollToTarget('#contact')}
        className="group inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#ff3b1d]/40 bg-[#08080a]/90 backdrop-blur-md text-[#f3f1ea] text-xs font-mono uppercase tracking-wider shadow-[0_4px_24px_rgba(255,59,29,0.25)] hover:border-[#ff3b1d] hover:bg-[#ff3b1d]/15 hover:shadow-[0_4px_30px_rgba(255,59,29,0.4)] transition-all duration-300"
        aria-label="Scroll to contact section"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#ff3b1d] animate-pulse" />
        <span>Get in touch</span>
        <ArrowUpRight className="w-3.5 h-3.5 text-[#ff3b1d] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
      </button>
    </div>
  );
};
