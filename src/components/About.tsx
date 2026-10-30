import React, { useRef } from 'react';
import { ScrollTrigger, useGSAP, MOTION_OK, motionMatchMedia, gsap } from '../engine/gsap';
import { portfolioData } from '../data/portfolio';
import { useReveals } from '../hooks/useReveals';

export const About: React.FC = () => {
  const root = useRef<HTMLElement>(null);
  const { story } = portfolioData;
  useReveals(root);

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
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div>
            <span data-fade className="eyebrow">
              {story.eyebrow}
            </span>
            <h2 data-split className="display mt-6 text-[clamp(3.5rem,9vw,8.5rem)]">
              {story.heading[0]} <em>{story.heading[1]}</em>
            </h2>
            <p data-fade className="muted mt-6 max-w-[32rem] text-base leading-relaxed">
              Full-stack developer building robust web applications and production-ready systems.
              Focused on clean database architecture and reliable shipping.
            </p>
          </div>

          {/* Syntax-highlighted code profile card */}
          <div
            data-fade
            className="mt-8 overflow-hidden rounded-lg border border-[var(--line)] bg-[#081c15] text-[#d8f3dc] shadow-xl"
          >
            {/* Window header */}
            <div className="flex items-center justify-between border-b border-[rgb(216_243_220/0.12)] bg-[#1b4332]/40 px-4 py-2.5">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#2d6a4f]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#40916c]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#52b788]" />
              </div>
              <span className="font-mono text-xs text-[#95d5b2]">kamran.ts</span>
            </div>

            {/* Code Body */}
            <div className="overflow-x-auto p-4 font-mono text-xs sm:text-sm leading-relaxed">
              <pre className="m-0 font-inherit">
                <code>
                  <span className="text-[#52b788]">const</span> <span className="text-[#d8f3dc]">kamran</span> = &#123;{'\n'}
                  {'  '}<span className="text-[#74c69d]">role</span>: <span className="text-[#b7e4c7]">'Full-Stack Developer'</span>,{'\n'}
                  {'  '}<span className="text-[#74c69d]">location</span>: <span className="text-[#b7e4c7]">'Lahore, Pakistan'</span>,{'\n'}
                  {'  '}<span className="text-[#74c69d]">stack</span>: [{'\n'}
                  {'    '}<span className="text-[#b7e4c7]">'React (via LabFlow)'</span>,{'\n'}
                  {'    '}<span className="text-[#b7e4c7]">'Laravel'</span>,{'\n'}
                  {'    '}<span className="text-[#b7e4c7]">'Django'</span>,{'\n'}
                  {'    '}<span className="text-[#b7e4c7]">'PostgreSQL'</span>{'\n'}
                  {'  '}],{'\n'}
                  {'  '}<span className="text-[#74c69d]">currently</span>: <span className="text-[#b7e4c7]">'Building LabFlow (Multi-tenant SaaS)'</span>,{'\n'}
                  {'  '}<span className="text-[#74c69d]">learning</span>: [<span className="text-[#95d5b2]">'Node.js'</span>, <span className="text-[#95d5b2]">'MongoDB'</span>, <span className="text-[#95d5b2]">'LLMs'</span>]{'\n'}
                  &#125;;
                </code>
              </pre>
            </div>
          </div>
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
