import React, { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP, MOTION_OK, motionMatchMedia } from '../engine/gsap';
import { isReduced } from '../engine/motion';
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
        const cells = gsap.utils.toArray<HTMLElement>('.stat-cell', root.current);

        if (cells.length) {
          gsap.from(cells, {
            y: 28,
            autoAlpha: 0,
            duration: 1,
            ease: 'expo.out',
            stagger: 0.08,
            scrollTrigger: { trigger: cells[0], start: 'top 92%', once: true },
          });
        }

        const counters = gsap.utils.toArray<HTMLElement>('[data-count]', root.current);
        const activeCleanups: (() => void)[] = [];

        counters.forEach((el, i) => {
          const raw = el.dataset.count ?? '';
          const match = raw.match(/^([\d.]+)(.*)$/);
          if (!match) return;
          const target = parseFloat(match[1]);
          const decimals = (match[1].split('.')[1] ?? '').length;
          const suffix = match[2];
          const state = { v: 0 };
          const len = raw.length;

          let hasTriggered = false;
          let scrambleTimer: ReturnType<typeof setInterval> | null = null;
          let delayTimer: ReturnType<typeof setTimeout> | null = null;
          let countTween: gsap.core.Tween | null = null;

          const triggerAnimation = () => {
            if (hasTriggered || isReduced()) return;
            hasTriggered = true;

            delayTimer = setTimeout(() => {
              const startTime = Date.now();
              const scrambleDuration = 700; // ~0.7s

              scrambleTimer = setInterval(() => {
                const elapsed = Date.now() - startTime;
                if (elapsed >= scrambleDuration) {
                  if (scrambleTimer) clearInterval(scrambleTimer);
                  scrambleTimer = null;
                  el.textContent = (0).toFixed(decimals) + suffix;
                  countTween = gsap.to(state, {
                    v: target,
                    duration: 1.9,
                    ease: 'power3.out',
                    onUpdate: () => {
                      el.textContent = state.v.toFixed(decimals) + suffix;
                    },
                  });
                } else {
                  let scrambled = '';
                  for (let c = 0; c < len; c++) {
                    scrambled += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
                  }
                  el.textContent = scrambled;
                }
              }, 40);
            }, i * 100);
          };

          // 1. ScrollTrigger trigger
          const st = ScrollTrigger.create({
            trigger: el,
            start: 'top 92%',
            once: true,
            onEnter: triggerAnimation,
          });

          // 2. IntersectionObserver fallback (guarantees execution on mobile browsers)
          let observer: IntersectionObserver | null = null;
          if (typeof IntersectionObserver !== 'undefined') {
            observer = new IntersectionObserver(
              (entries) => {
                entries.forEach((entry) => {
                  if (entry.isIntersecting) {
                    observer?.disconnect();
                    triggerAnimation();
                  }
                });
              },
              { threshold: 0.15 }
            );
            observer.observe(el);
          }

          activeCleanups.push(() => {
            if (delayTimer) clearTimeout(delayTimer);
            if (scrambleTimer) clearInterval(scrambleTimer);
            if (countTween) countTween.kill();
            st.kill();
            observer?.disconnect();
            el.textContent = el.dataset.count ?? '';
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
          activeCleanups.forEach((cleanup) => cleanup());
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
