import React, { useEffect, useState } from 'react';
import { portfolioData } from '../data/portfolio';
import { scrollToTarget } from '../utils/scroll';
import { DotPattern } from './magicui/DotPattern';
import { BlurFade } from './magicui/BlurFade';
import { AuroraText } from './magicui/AuroraText';
import { ShimmerButton } from './magicui/ShimmerButton';

const ALLOWED_ROLES = [
  'Web & Software Developer',
  'Full-Stack Developer',
  'Laravel Developer',
  'Django Developer',
  'LabFlow Builder',
];

export const Hero: React.FC = () => {
  const { personal } = portfolioData;
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    // Respect prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % ALLOWED_ROLES.length);
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  const handleScrollTo = (id: string) => {
    scrollToTarget(id);
  };

  return (
    <section
      id="top"
      className="relative px-6 sm:px-10 md:px-14 py-24 sm:py-28 min-h-0"
    >
      {/* Subtle Dot/Grid Pattern background with radial mask */}
      <DotPattern
        width={32}
        height={32}
        cx={1}
        cy={1}
        cr={1}
        className="[mask-image:radial-gradient(ellipse_60%_50%_at_50%_35%,#000_70%,transparent_100%)] opacity-35"
      />

      {/* Subtle Aurora gradient glow behind the hero */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[75vw] max-w-[850px] h-[55vh] bg-gradient-to-tr from-[#ff3b1d]/15 via-[#ff6a3d]/20 to-[#ff3b1d]/10 rounded-full blur-[140px] pointer-events-none -z-10 animate-aurora"
        aria-hidden="true"
      />

      {/* Normal-flow side-by-side grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Column: Text, badges, CTAs, and scroll cue */}
        <div className="flex flex-col items-start justify-center">
          <BlurFade delay={0.1} yOffset={12}>
            {/* The ONLY badge allowed: "Open to paid remote internships" */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#ff3b1d]/30 bg-[#ff3b1d]/10 text-xs font-medium text-[#ff3b1d] tracking-wide mb-3 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff3b1d] animate-pulse" />
              <span>Open to paid remote internships</span>
            </div>

            {/* Subtitle / Role rotator */}
            <h2 className="font-display uppercase tracking-tight text-3xl sm:text-5xl lg:text-6xl text-[#f3f1ea] leading-[1.05] min-h-[2.4em] sm:min-h-[1.2em]">
              <span className="transition-opacity duration-300">
                {ALLOWED_ROLES[roleIndex]}
              </span>
            </h2>
          </BlurFade>

          <BlurFade delay={0.2} yOffset={12}>
            {/* Live line exactly as live */}
            <p className="mt-6 text-base sm:text-lg text-[#807f78] leading-relaxed max-w-xl">
              {personal.heroDesc}
            </p>

            {/* Primary ShimmerButton CTA "View Projects" and secondary CTA "Contact" */}
            <div className="mt-8 flex items-center gap-3 sm:gap-4 flex-wrap">
              <ShimmerButton
                onClick={() => handleScrollTo('#projects')}
                className="text-xs sm:text-sm font-medium py-2.5 px-5"
              >
                View Projects
              </ShimmerButton>

              <button
                type="button"
                onClick={() => handleScrollTo('#contact')}
                className="text-xs sm:text-sm font-medium py-2.5 px-5 rounded-full border border-white/15 bg-white/[0.03] text-[#f3f1ea] hover:bg-white/10 hover:border-white/30 transition-all duration-300"
              >
                Contact
              </button>
            </div>

            {/* Scroll cue in left column */}
            <div className="mt-10 sm:mt-12 flex items-center gap-3 text-[0.8125rem] uppercase tracking-[0.22em] text-[#807f78]">
              <span className="w-8 sm:w-12 h-[1px] bg-[#ff3b1d]" />
              <span>Scroll to explore</span>
            </div>
          </BlurFade>
        </div>

        {/* Right Column: Portrait Card ONLY (normal document flow, no floating legs) */}
        <div className="flex justify-center items-center w-full">
          <BlurFade delay={0.15} yOffset={12} className="w-full flex justify-center">
            <div className="relative w-full max-w-[420px] aspect-[2/3] max-h-[60svh] lg:max-h-[640px] rounded-2xl border border-white/10 bg-[#08080a] overflow-hidden flex items-center justify-center p-2 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
              <img
                src={personal.heroImage}
                alt={personal.heroImageAlt}
                loading="eager"
                fetchPriority="high"
                className="h-full w-full object-contain object-center"
              />
            </div>
          </BlurFade>
        </div>
      </div>

      {/* Huge Name: Separate full-width strip BELOW the grid with >=48px gap, never overlapping portrait */}
      <div className="mt-12 sm:mt-16 pt-8 border-t border-white/5 w-full">
        <BlurFade delay={0.25} yOffset={16} className="w-full">
          <h1
            className="font-display uppercase tracking-tight text-center select-none leading-[0.85] text-[13vw] sm:text-[12vw] lg:text-[11vw] drop-shadow-[0_4px_30px_rgba(255,59,29,0.3)]"
            aria-label={personal.name}
          >
            <AuroraText className="block">{personal.firstName}</AuroraText>
            <AuroraText className="block">{personal.lastName}</AuroraText>
          </h1>
        </BlurFade>

        <div className="mt-4 flex items-center justify-between text-[0.8125rem] uppercase tracking-[0.22em] text-[#807f78]">
          <span className="font-mono text-xs text-[#807f78]/60">
            {personal.location}
          </span>
          <span className="font-mono text-xs text-[#807f78]/60">
            Portfolio 2026
          </span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
