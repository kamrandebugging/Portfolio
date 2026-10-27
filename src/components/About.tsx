import React, { useRef } from 'react';
import { ScrollTrigger, useGSAP, MOTION_OK, motionMatchMedia, gsap } from '../engine/gsap';
import { portfolioData } from '../data/portfolio';
import { useReveals } from '../hooks/useReveals';

export const About: React.FC = () => {
  const root = useRef<HTMLElement>(null);
  const { story } = portfolioData;
  useReveals(root);

  // Reading focus: each principle brightens as it reaches the reading zone.
  // Scroll-linked, so it works the same with a finger as with a wheel.
  useGSAP(
    () => {
      const mm = motionMatchMedia();
      mm.add(MOTION_OK, () => {
        const items = gsap.utils.toArray<HTMLElement>('.principle', root.current);
        const triggers = items.map((item) =>
          ScrollTrigger.create({
            trigger: item,
            start: 'top 82%',
            end: 'top 46%',
            onUpdate: (self) => item.style.setProperty('--on', self.progress.toFixed(3)),
          })
        );
        return () => {
          triggers.forEach((t) => t.kill());
          items.forEach((item) => item.style.removeProperty('--on'));
        };
      });
    },
    { scope: root }
  );

  return (
    <section
      id="about"
      ref={root}
      data-chapter="02"
      data-chapter-title="About"
      data-tone="light"
      className="sheet-top tone-light px-[var(--pad-x)] pb-28 pt-24 md:pb-36 md:pt-32"
    >
      <div className="mx-auto grid max-w-[88rem] gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <span data-fade className="eyebrow">
            {story.eyebrow}
          </span>
          <h2 data-split className="display mt-6 text-[clamp(3.5rem,9vw,8.5rem)]">
            {story.heading[0]} <em>{story.heading[1]}</em>
          </h2>
          <p data-fade className="muted mt-8 max-w-[32rem] text-lg leading-relaxed">
            {story.lead}
          </p>
        </div>

        <ol className="lg:col-span-7 lg:pt-4">
          {story.principles.map((item) => (
            <li key={item.num} className="principle relative py-9">
              <span
                data-line
                className="absolute inset-x-0 top-0 h-px"
                style={{ background: 'var(--line)' }}
              />
              <div className="grid grid-cols-[3rem_1fr] gap-4">
                <span className="font-mono text-sm tabular-nums text-[var(--accent)]">
                  {item.num}
                </span>
                <div data-fade>
                  <h3 className="display text-[clamp(1.75rem,3vw,2.75rem)]">{item.title}</h3>
                  <p className="muted mt-3 max-w-[34rem] leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default About;
