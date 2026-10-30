import React, { useRef } from 'react';
import { gsap, useGSAP, MOTION_OK, motionMatchMedia } from '../engine/gsap';
import { portfolioData } from '../data/portfolio';
import { useReveals } from '../hooks/useReveals';

export const Proof: React.FC = () => {
  const root = useRef<HTMLElement>(null);
  const { impact, achievements } = portfolioData;
  useReveals(root);

  useGSAP(
    () => {
      const mm = motionMatchMedia();
      mm.add(MOTION_OK, () => {
        const counters = gsap.utils.toArray<HTMLElement>('[data-count]');

        counters.forEach((el) => {
          const match = (el.dataset.count ?? '').match(/^([\d.]+)(.*)$/);
          if (!match) return;
          const target = parseFloat(match[1]);
          const decimals = (match[1].split('.')[1] ?? '').length;
          const suffix = match[2];
          const state = { v: 0 };

          el.textContent = (0).toFixed(decimals) + suffix;
          gsap.to(state, {
            v: target,
            duration: 1.9,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
            onUpdate: () => {
              el.textContent = state.v.toFixed(decimals) + suffix;
            },
          });
        });

        const frame = root.current?.querySelector<HTMLElement>('.reveal-frame');
        const img = frame?.querySelector('img');
        if (frame && img) {
          gsap.fromTo(
            img,
            { yPercent: -7 },
            {
              yPercent: 7,
              ease: 'none',
              scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: true },
            }
          );
          gsap.from(frame, {
            clipPath: 'inset(14% 10% 14% 10% round 1.25rem)',
            ease: 'none',
            scrollTrigger: { trigger: frame, start: 'top 95%', end: 'top 40%', scrub: true },
          });
        }

        return () => {
          counters.forEach((el) => {
            el.textContent = el.dataset.count ?? '';
          });
        };
      });
    },
    { scope: root }
  );

  return (
    <section
      id="proof"
      ref={root}
      data-chapter="05"
      data-chapter-title="Proof"
      data-tone="light"
      className="tone-light px-[var(--pad-x)] py-28 md:py-36"
    >
      <div className="mx-auto max-w-[88rem]">
        <span data-fade className="eyebrow">
          {impact.eyebrow}
        </span>
        <h2 data-split className="display mt-6 text-[clamp(3.25rem,8vw,8rem)]">
          {impact.heading[0]} <em>{impact.heading[1]}</em>
        </h2>

        <dl className="mt-16 grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
          {impact.stats.map((stat) => (
            <div key={stat.label} className="relative pt-5">
              <span
                data-line
                className="absolute inset-x-0 top-0 h-px"
                style={{ background: 'var(--line)' }}
              />
              <dd className="stat-num" data-count={stat.value}>
                {stat.value}
              </dd>
              <dt className="muted mt-3 max-w-[16rem] text-sm leading-snug">{stat.label}</dt>
            </div>
          ))}
        </dl>

        <div className="proof-labflow-bento mt-20" data-fade>
          <div className="proof-bento-header" aria-hidden="true">
            <span className="proof-bento-dot" />
            <span className="proof-bento-dot" />
            <span className="proof-bento-dot" />
            <span className="proof-bento-title">labflow — production stats</span>
          </div>
          <dl className="proof-bento-grid">
            <div className="proof-bento-tile">
              <dd className="proof-bento-num" data-count="7">7</dd>
              <dt className="proof-bento-label">PRs merged</dt>
            </div>
            <div className="proof-bento-tile">
              <dd className="proof-bento-num" data-count="300">300</dd>
              <dt className="proof-bento-label">tests passing</dt>
            </div>
            <div className="proof-bento-tile">
              <dd className="proof-bento-num" data-count="6">6</dd>
              <dt className="proof-bento-label">CI checks green</dt>
            </div>
          </dl>
        </div>

        <div className="mt-28 grid items-center gap-12 lg:grid-cols-12">
          <figure className="reveal-frame lg:col-span-5">
            <img
              src={achievements.image}
              alt={achievements.imageAlt}
              loading="lazy"
              width={1100}
              height={1467}
            />
          </figure>
          <div className="lg:col-span-6 lg:col-start-7">
            <span data-fade className="eyebrow">
              {achievements.eyebrow}
            </span>
            <h3 data-split className="display mt-6 text-[clamp(2.4rem,5vw,5rem)]">
              {achievements.title}
            </h3>
            <p data-fade className="muted mt-6 max-w-[34rem] text-lg leading-relaxed">
              {achievements.caption}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Proof;
