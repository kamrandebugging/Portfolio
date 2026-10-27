import React from 'react';
import { portfolioData } from '../data/portfolio';
import { ScrollHeading, FadingListItem } from './motion/ScrollReveal';

export const Story: React.FC = () => {
  const { story } = portfolioData;

  return (
    <section id="story" className="relative px-6 sm:px-10 md:px-14 py-20 sm:py-28 border-b border-white/5">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start">
        {/* Left Column */}
        <div className="lg:col-span-5 flex flex-col items-start">
          <span className="eyebrow">{story.eyebrow}</span>
          <ScrollHeading
            text={story.heading}
            className="font-display uppercase tracking-tight text-4xl sm:text-6xl text-[#f3f1ea] mt-5 leading-[0.95]"
          />
          <p className="mt-8 text-lg sm:text-xl text-[#807f78] leading-relaxed max-w-xl">
            {story.lead}
          </p>
        </div>

        {/* Right Column: Principles (Fading list on scroll) */}
        <div className="lg:col-span-7">
          <ul className="divide-y divide-white/10 border-y border-white/10">
            {story.principles.map((item, idx) => (
              <FadingListItem
                key={item.num}
                delay={idx * 0.05}
                className="group py-6 sm:py-8 flex gap-6 sm:gap-8 items-start transition-colors duration-300 hover:bg-white/[0.015] px-2"
              >
                <span className="font-mono text-xl sm:text-2xl font-semibold text-[#ff3b1d] tabular-nums">
                  {item.num}
                </span>
                <div className="space-y-2">
                  <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#f3f1ea] group-hover:text-[#ff3b1d] transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-base sm:text-lg text-[#807f78] leading-relaxed max-w-xl">
                    {item.desc}
                  </p>
                </div>
              </FadingListItem>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
