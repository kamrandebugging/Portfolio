import React from 'react';
import { portfolioData } from '../data/portfolio';

export const Experience: React.FC = () => {
  const { experience, skills } = portfolioData;

  return (
    <section id="experience" className="relative px-6 sm:px-10 md:px-14 py-20 sm:py-28 border-b border-white/5">
      {/* Experience Header */}
      <span className="eyebrow">{experience.eyebrow}</span>
      <h2 className="font-display uppercase tracking-tight text-4xl sm:text-6xl text-[#f3f1ea] mt-4 leading-[0.95]">
        {experience.heading}
      </h2>

      {/* Experience Timeline */}
      <ul className="mt-12 sm:mt-16 divide-y divide-white/10 border-y border-white/10">
        {experience.entries.map((item) => (
          <li
            key={item.num}
            className="group py-6 sm:py-8 flex gap-6 sm:gap-8 items-start transition-colors duration-300 hover:bg-white/[0.015] px-2"
          >
            <span className="font-mono text-xl sm:text-2xl font-semibold text-[#ff3b1d] tabular-nums">
              {item.num}
            </span>
            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#f3f1ea] group-hover:text-[#ff3b1d] transition-colors duration-300">
                {item.title}
              </h3>
              <p className="text-base sm:text-lg text-[#807f78] leading-relaxed max-w-3xl">
                {item.desc}
              </p>
            </div>
          </li>
        ))}
      </ul>

      {/* Skills Section - Exactly "Technical Skills and Tools" (NO "Strong" anywhere) */}
      <div className="mt-16 sm:mt-20 pt-12 border-t border-white/10">
        <div className="flex flex-col gap-8">
          <div>
            <h3 className="text-xs uppercase tracking-[0.22em] text-[#ff3b1d] font-semibold">
              {skills.sectionHeading}
            </h3>
            <ul className="mt-6 flex flex-wrap gap-2.5 sm:gap-3">
              {skills.skillsList.map((skill) => (
                <li
                  key={skill}
                  className="rounded-full border border-white/15 bg-white/[0.02] px-4 sm:px-5 py-2 text-sm sm:text-base font-medium text-[#f3f1ea] transition-all duration-300 hover:border-[#ff3b1d]/60 hover:text-[#ff3b1d] hover:bg-[#ff3b1d]/5"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-4">
            <h4 className="text-xs uppercase tracking-[0.22em] text-[#807f78] font-semibold">
              {skills.learningHeading}
            </h4>
            <ul className="mt-4 flex flex-wrap gap-2.5 sm:gap-3">
              {skills.learningList.map((skill) => (
                <li
                  key={skill}
                  className="rounded-full border border-dashed border-white/20 bg-transparent px-4 sm:px-5 py-2 text-sm sm:text-base font-medium text-[#807f78] transition-all duration-300 hover:border-[#ff3b1d]/50 hover:text-[#f3f1ea]"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
