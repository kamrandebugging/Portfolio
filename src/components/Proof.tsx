import React, { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP, MOTION_OK, motionMatchMedia } from '../engine/gsap';
import { playPop } from '../engine/sound';
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
        const grid = root.current?.querySelector<HTMLElement>('.stats-grid');
        const cells = gsap.utils.toArray<HTMLElement>('.stat-cell', root.current);
        const cleanups: (() => void)[] = [];

        // Pop-up stat badges: each cell pops with a strong back.out overshoot +
        // a synthesized pop sound, staggered 0.15s apart. Number counts up
        // inside while the cell pops (no scramble — pop + scramble is noise).
        if (grid && cells.length) {
          gsap.set(cells, { scale: 0.6, autoAlpha: 0, transformOrigin: '50% 50%' });

          const startCount = (el: HTMLElement, delay: number) => {
            const raw = el.dataset.count ?? '';
            const match = raw.match(/^([\d.]+)(.*)$/);
            if (!match) return;
            const target = parseFloat(match[1]);
            const decimals = (match[1].split('.')[1] ?? '').length;
            const suffix = match[2];
            const state = { v: 0 };
            const tween = gsap.to(state, {
              v: target,
              duration: 1.6,
              delay,
              ease: 'power3.out',
              onUpdate: () => {
                el.textContent = state.v.toFixed(decimals) + suffix;
              },
            });
            cleanups.push(() => {
              tween.kill();
              el.textContent = raw;
            });
          };

          let played = false;
          const playAll = () => {
            if (played) return;
            played = true;
            cells.forEach((cell, i) => {
              const delay = i * 0.15;
              const tween = gsap.fromTo(
                cell,
                { scale: 0.6, autoAlpha: 0 },
                {
                  scale: 1,
                  autoAlpha: 1,
                  duration: 0.6,
                  delay,
                  ease: 'back.out(2.2)',
                  onStart: () => playPop(),
                }
              );
              cleanups.push(() => tween.kill());
              const num = cell.querySelector<HTMLElement>('[data-count]');
              if (num) startCount(num, delay + 0.15);
            });
          };

          const st = ScrollTrigger.create({
            trigger: grid,
            start: 'top 92%',
            once: true,
            onEnter: playAll,
          });
          cleanups.push(() => st.kill());

          // IntersectionObserver fallback (guarantees execution on mobile browsers)
          let observer: IntersectionObserver | null = null;
          if (typeof IntersectionObserver !== 'undefined') {
            observer = new IntersectionObserver(
              (entries) => {
                entries.forEach((entry) => {
                  if (entry.isIntersecting) {
                    observer?.disconnect();
                    playAll();
                  }
                });
              },
              { threshold: 0.15 }
            );
            observer.observe(grid);
            cleanups.push(() => observer?.disconnect());
          }
        }

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
          cleanups.forEach((cleanup) => cleanup());
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

        {/* 2x2 Pop-up Stats Grid */}
        <div className="mt-16 w-full max-w-[64rem]">
          <dl className="stats-grid grid grid-cols-2">
            {impact.stats.map((stat, i) => (
              <div
                key={stat.label}
                className={`stat-cell flex flex-col justify-between p-5 sm:p-8 md:p-10 min-w-0 ${
                  i % 2 === 0 ? 'border-r' : ''
                } ${i < 2 ? 'border-b' : ''} border-[var(--line)]`}
              >
                <dd
                  className="mb-3 sm:mb-4 font-display font-semibold text-[clamp(2.75rem,7vw,6rem)] leading-none tracking-tight text-[var(--accent,var(--color-leaf))] tabular-nums"
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
