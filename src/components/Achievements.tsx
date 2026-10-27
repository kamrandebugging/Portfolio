import React from 'react';
import { portfolioData } from '../data/portfolio';

export const Achievements: React.FC = () => {
  const { achievements } = portfolioData;

  return (
    <section id="achievements" className="relative px-6 sm:px-10 md:px-14 py-20 sm:py-28 border-b border-white/5">
      <span className="eyebrow">{achievements.eyebrow}</span>
      <h2 className="font-display uppercase tracking-tight text-4xl sm:text-6xl text-[#f3f1ea] mt-4 leading-[0.95]">
        {achievements.heading}
      </h2>

      <div className="mt-12 sm:mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Photo Container */}
        <div className="lg:col-span-6 w-full">
          <div className="image-glow-container aspect-[4/3] sm:aspect-[16/10] w-full">
            <img
              src={achievements.image}
              alt={achievements.imageAlt}
              loading="lazy"
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>

        {/* Text Container */}
        <div className="lg:col-span-6 space-y-4">
          <h3 className="font-display uppercase tracking-tight text-3xl sm:text-5xl text-[#ff3b1d]">
            {achievements.title}
          </h3>
          <p className="text-base sm:text-xl text-[#807f78] leading-relaxed max-w-xl">
            {achievements.caption}
          </p>
        </div>
      </div>
    </section>
  );
};
