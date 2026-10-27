import React from 'react';
import { portfolioData } from '../data/portfolio';

export const Impact: React.FC = () => {
  const { impact } = portfolioData;

  return (
    <section id="impact" className="relative px-6 sm:px-10 md:px-14 py-20 sm:py-28 border-b border-white/5">
      <span className="eyebrow">{impact.eyebrow}</span>
      <h2 className="font-display uppercase tracking-tight text-4xl sm:text-6xl text-[#f3f1ea] mt-4 leading-[0.95]">
        {impact.heading.map((line, idx) => (
          <span key={idx} className="block">
            {line}
          </span>
        ))}
      </h2>

      <dl className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-y border-white/10 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
        {impact.stats.map((stat, idx) => (
          <div
            key={idx}
            className="group py-8 sm:py-10 px-0 sm:px-6 lg:px-8 flex flex-col justify-between transition-colors duration-300 hover:bg-white/[0.015]"
          >
            <dd className="font-display text-6xl sm:text-7xl lg:text-8xl text-[#f3f1ea] group-hover:text-[#ff3b1d] transition-colors duration-300 tabular-nums">
              {stat.value}
            </dd>
            <dt className="mt-4 text-xs sm:text-sm font-medium uppercase tracking-[0.14em] text-[#807f78] leading-relaxed max-w-[22ch]">
              {stat.label}
            </dt>
          </div>
        ))}
      </dl>
    </section>
  );
};
