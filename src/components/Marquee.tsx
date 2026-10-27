import React from 'react';
import { portfolioData } from '../data/portfolio';

export const Marquee: React.FC = () => {
  const { marqueeWords } = portfolioData;
  const loop = [...marqueeWords, ...marqueeWords, ...marqueeWords, ...marqueeWords];

  return (
    <section className="relative overflow-hidden border-y border-white/10 py-5 bg-[#08080a]" aria-label="Core Technologies">
      <div className="animate-marquee flex items-center">
        {loop.map((word, idx) => (
          <React.Fragment key={`${word}-${idx}`}>
            <span className="font-display uppercase tracking-tight text-3xl sm:text-5xl text-[#f3f1ea] px-6 sm:px-8 select-none">
              {word}
            </span>
            <span className="inline-block w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-[#ff3b1d] shadow-[0_0_8px_rgba(255,59,29,0.7)] flex-shrink-0" />
          </React.Fragment>
        ))}
      </div>
    </section>
  );
};
