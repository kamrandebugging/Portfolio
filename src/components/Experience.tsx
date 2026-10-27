import React, { useRef } from 'react';
import { portfolioData } from '../data/portfolio';
import { useReveals } from '../hooks/useReveals';

export const Experience: React.FC = () => {
  const root = useRef<HTMLElement>(null);
  const { experience, skills } = portfolioData;
  useReveals(root);

  return (
    <section
      id="experience"
      ref={root}
      data-chapter="06"
      data-chapter-title="Experience"
      data-tone="dark"
      className="tone-dark px-[var(--pad-x)] py-28 md:py-36"
    >
      <div className="mx-auto max-w-[88rem]">
        <span data-fade className="eyebrow">
          {experience.eyebrow}
        </span>
        <h2 data-split className="display mt-6 text-[clamp(3.25rem,8vw,8rem)]">
          What I&rsquo;ve <em>done.</em>
        </h2>

        <ol className="mt-16">
          {experience.entries.map((item) => (
            <li key={item.num} className="relative grid gap-3 py-9 md:grid-cols-[4rem_1.3fr_1fr] md:gap-8">
              <span
                data-line
                className="absolute inset-x-0 top-0 h-px"
                style={{ background: 'var(--line)' }}
              />
              <span className="font-mono text-sm tabular-nums text-[var(--accent)]">{item.num}</span>
              <h3 data-fade className="display text-[clamp(1.5rem,2.6vw,2.4rem)]">
                {item.title}
              </h3>
              <p data-fade className="muted leading-relaxed">
                {item.desc}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-28">
          <span data-fade className="eyebrow">
            {skills.sectionHeading}
          </span>
          <div className="mt-10 grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
            {skills.groups.map((group) => (
              <div key={group.title}>
                <h3 className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--accent)]">
                  {group.title}
                </h3>
                <ul className="mt-5">
                  {group.items.map((skill) => (
                    <li
                      key={skill}
                      className="border-t border-[var(--line)] py-2.5 text-lg transition-[padding,color] duration-500 hover:pl-3 hover:text-[var(--accent)]"
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div data-fade className="mt-14 flex flex-wrap items-center gap-3">
            <span className="font-mono text-xs uppercase tracking-[0.16em] muted">
              {skills.learningHeading}
            </span>
            {skills.learningList.map((skill) => (
              <span key={skill} className="chip border-dashed">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
