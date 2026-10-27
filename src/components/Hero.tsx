import React from 'react';
import { portfolioData } from '../data/portfolio';

export const Hero: React.FC = () => {
  const { personal } = portfolioData;

  return (
    <section
      id="top"
      className="relative flex flex-col justify-between min-h-[92vh] sm:min-h-screen overflow-hidden px-6 sm:px-10 md:px-14 pt-24 sm:pt-28 pb-8"
    >
      {/* Background subtle radial glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] max-w-[800px] h-[50vh] bg-[#ff3b1d]/10 rounded-full blur-[140px] pointer-events-none -z-10"
        aria-hidden="true"
      />

      {/* Top row: Role and Description */}
      <div className="relative z-30 flex flex-col sm:flex-row items-start sm:items-start justify-between gap-6 sm:gap-12">
        <h2 className="font-display uppercase tracking-tight text-3xl sm:text-5xl lg:text-6xl text-[#f3f1ea] leading-[1.05]">
          {personal.role}
        </h2>
        <p className="max-w-md text-base sm:text-lg text-[#807f78] leading-relaxed sm:text-right">
          {personal.heroDesc}
        </p>
      </div>

      {/* Centered Hero Portrait with authentic live photo */}
      <div className="relative z-20 flex justify-center items-end my-auto sm:my-0 h-[46vh] sm:h-[58vh] lg:h-[64vh] pointer-events-none">
        <div className="relative h-full w-auto aspect-[3/4] sm:aspect-auto flex items-end justify-center">
          <img
            src={personal.heroImage}
            alt={personal.heroImageAlt}
            loading="eager"
            fetchPriority="high"
            className="h-full w-auto object-contain object-bottom drop-shadow-[0_20px_40px_rgba(0,0,0,0.85)] filter contrast-[1.03]"
          />
          {/* Subtle bottom fade gradient */}
          <div
            className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#08080a] via-[#08080a]/60 to-transparent pointer-events-none"
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Bottom Name & Scroll cue */}
      <div className="relative z-10 flex flex-col items-center">
        <h1
          className="font-display uppercase tracking-tight text-[#ff3b1d] text-center select-none leading-[0.8] text-[16vw] sm:text-[14vw] lg:text-[12.5vw] drop-shadow-[0_4px_24px_rgba(255,59,29,0.25)]"
          aria-label={personal.name}
        >
          <span className="block">{personal.firstName}</span>
          <span className="block">{personal.lastName}</span>
        </h1>

        <div className="w-full flex items-center justify-between pt-6 text-[0.8125rem] uppercase tracking-[0.22em] text-[#807f78]">
          <div className="flex items-center gap-3">
            <span className="w-8 sm:w-12 h-[1px] bg-[#ff3b1d]" />
            <span>Scroll to enter</span>
          </div>
          <span className="hidden sm:inline-block font-mono text-xs text-[#807f78]/60">
            {personal.location}
          </span>
        </div>
      </div>
    </section>
  );
};
