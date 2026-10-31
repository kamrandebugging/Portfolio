import React, { useRef } from 'react';
import { gsap, useGSAP, MOTION_OK, motionMatchMedia } from '../engine/gsap';
import { portfolioData } from '../data/portfolio';
import { useReveals } from '../hooks/useReveals';

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/';

export const Proof: React.FC = () => {
  const root = useRef<HTMLElement>(null);
  const { impact, achievements } = portfolioData;
  useReveals(root);

  useGSAP(
    () => {
      const mm = motionMatchMedia();
      mm.add(MOTION_OK, () => {
        const counters = gsap.utils.toArray<HTMLElement>('[data-count]', root.current);
        const cells = gsap.utils.toArray<HTMLElement>('.stat-cell', root.current);

        if (cells.length) {
          gsap.from(cells, {
            y: 28,
            autoAlpha: 0,
            duration: 1,
            ease: 'expo.out',
            stagger: 0.08,
            scrollTrigger: { trigger: cells[0], start: 'top 90%', once: true },
          });
        }

        const timelines: gsap.core.Timeline[] = [];

        counters.forEach((el, i) => {
          const raw = el.dataset.count ?? '';
          const match = raw.match(/^([\d.]+)(.*)$/);
          if (!match) return;
          const target = parseFloat(match[1]);
          const decimals = (match[1].split('.')[1] ?? '').length;
          const suffix = match[2];
          const state = { v: 0 };
          const len = raw.length;

          const tl = gsap.timeline({
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
            delay: i * 0.1,
          });

          // Scramble phase: random chars from A-Z0-9+/ for ~0.7s
          tl.to(
            { p: 0 },
            {
              p: 1,
              duration: 0.7,
              ease: 'none',
              onUpdate: () => {
                let scrambled = '';
                for (let c = 0; c < len; c++) {
                  scrambled += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
                }
                el.textContent = scrambled;
              },
            }
          );

          // Hand off to existing data-count count-up (0 -> target)
          tl.call(() => {
            el.textContent = (0).toFixed(decimals) + suffix;
          });
          tl.to(state, {
            v: target,
            duration: 1.9,
            ease: 'power3.out',
            onUpdate: () => {
              el.textContent = state.v.toFixed(decimals) + suffix;
            },
          });

          timelines.push(tl);
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
          timelines.forEach((tl) => tl.kill());
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
        <h2 data-split className="display text-[clamp(3.25rem,8vw,8rem)]">
          {impact.heading[0]} <em>{impact.heading[1]}</em>
        </h2>

        {/* 2x2 Scramble Stats Grid */}
        <div className="mt-16 w-full max-w-[64rem]">
          <dl className="grid grid-cols-2">
            {impact.stats.map((stat, i) => (
              <div
                key={stat.label}
                className={`stat-cell flex flex-col justify-between p-5 sm:p-8 md:p-10 min-w-0 ${
                  i % 2 === 0 ? 'border-r' : ''
                } ${i < 2 ? 'border-b' : ''} border-[var(--line)]`}
              >
                <span className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--fg-muted)]">
                  STATS // {String(i + 1).padStart(2, '0')}
                </span>
                <dd
                  className="my-4 sm:my-6 font-display font-semibold text-[clamp(2.75rem,7vw,6rem)] leading-none tracking-tight text-[var(--accent,var(--color-leaf))] tabular-nums"
                  data-count={stat.value}
                >
                  {stat.value}
                </dd>
                <dt className="font-sans text-xs sm:text-sm md:text-base leading-snug text-[var(--fg-muted)] [text-wrap:balance] break-normal">
                  {stat.label}
                </dt>
              </div>
            ))}
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
            <h3 data-split className="display text-[clamp(2.4rem,5vw,5rem)]">
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
