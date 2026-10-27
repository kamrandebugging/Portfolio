import React, { useEffect, useState } from 'react';
import { portfolioData } from '../data/portfolio';
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
    const el = document.querySelector(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="top"
      className="relative flex flex-col justify-between min-h-[96vh] sm:min-h-screen overflow-hidden px-6 sm:px-10 md:px-14 pt-24 sm:pt-28 pb-8"
    >
      {/* (c) Subtle Dot/Grid Pattern background with radial mask */}
      <DotPattern
        width={32}
        height={32}
        cx={1}
        cy={1}
        cr={1}
        className="[mask-image:radial-gradient(ellipse_60%_50%_at_50%_35%,#000_70%,transparent_100%)] opacity-35"
      />

      {/* (a) Subtle Aurora gradient glow behind the hero */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[75vw] max-w-[850px] h-[55vh] bg-gradient-to-tr from-[#ff3b1d]/15 via-[#ff6a3d]/20 to-[#ff3b1d]/10 rounded-full blur-[140px] pointer-events-none -z-10 animate-aurora"
        aria-hidden="true"
      />

      {/* (b) Top Row with BlurFade entrance animation */}
      <div className="relative z-30 flex flex-col sm:flex-row items-start justify-between gap-6 sm:gap-12">
        <BlurFade delay={0.1} yOffset={12}>
          <div>
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
          </div>
        </BlurFade>

        <BlurFade delay={0.2} yOffset={12} className="flex flex-col items-start sm:items-end">
          {/* Live line exactly as live */}
          <p className="max-w-md text-base sm:text-lg text-[#807f78] leading-relaxed sm:text-right">
            {personal.heroDesc}
          </p>

          {/* (d) Primary ShimmerButton CTA "View Projects" and secondary CTA "Contact" */}
          <div className="mt-5 flex items-center gap-3 sm:gap-4 flex-wrap">
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
        </BlurFade>
      </div>

      {/* Centered Hero Portrait: uncropped, original photo asset */}
      <div className="relative z-20 flex justify-center items-end my-auto sm:my-0 h-[46vh] sm:h-[58vh] lg:h-[64vh] pointer-events-none">
        <div className="relative h-full w-auto aspect-[3/4] sm:aspect-auto flex items-end justify-center">
          <img
            src={personal.heroImage}
            alt={personal.heroImageAlt}
            loading="eager"
            fetchPriority="high"
            className="h-full w-auto object-contain object-bottom drop-shadow-[0_25px_45px_rgba(0,0,0,0.95)] filter contrast-[1.03]"
          />
          {/* Bottom gradient fade */}
          <div
            className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#08080a] via-[#08080a]/65 to-transparent pointer-events-none"
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Bottom Name & (e) Scroll indicator */}
      <div className="relative z-10 flex flex-col items-center">
        <BlurFade delay={0.25} yOffset={16} className="w-full">
          <h1
            className="font-display uppercase tracking-tight text-center select-none leading-[0.8] text-[16vw] sm:text-[14vw] lg:text-[12.5vw] drop-shadow-[0_4px_30px_rgba(255,59,29,0.3)]"
            aria-label={personal.name}
          >
            <AuroraText className="block">{personal.firstName}</AuroraText>
            <AuroraText className="block">{personal.lastName}</AuroraText>
          </h1>
        </BlurFade>

        {/* (e) Small scroll indicator */}
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

export default Hero;
