import React, { useRef } from 'react';
import { portfolioData } from '../data/portfolio';
import { useReveals } from '../hooks/useReveals';

export const Experience: React.FC = () => {
  const root = useRef<HTMLElement>(null);
  const { experience } = portfolioData;
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
        <h2 data-split className="display text-[clamp(3.25rem,8vw,8rem)]">
          What I&rsquo;ve <em>done.</em>
        </h2>

        <ol className="mt-16">
          {experience.entries.map((item) => (
            <li key={item.num} className="relative grid gap-3 py-9 md:grid-cols-[1.3fr_1fr] md:gap-8">
              <span
                data-line
                className="absolute inset-x-0 top-0 h-px"
                style={{ background: 'var(--line)' }}
              />
                            <h3 data-fade className="display text-[clamp(1.5rem,2.6vw,2.4rem)]">
                {item.title}
              </h3>
              <p data-fade className="muted leading-relaxed">
                {item.desc}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default Experience;
