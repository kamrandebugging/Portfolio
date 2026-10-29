import React, { useRef } from 'react';
import problemImg from '../assets/labflow/problem.jpg';
import solutionImg from '../assets/labflow/solution.jpg';
import { gsap, useGSAP, motionMatchMedia } from '../engine/gsap';
import SkelImage from './ui/SkelImage';

export const LabFlowProblemCards: React.FC = () => {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const mm = motionMatchMedia();

      // Desktop breakpoint (min-width: 1024px): 2-card pinned stack
      mm.add('(min-width: 1024px)', () => {
        const card1 = el.querySelector<HTMLElement>('.why-card--problem');
        const card2 = el.querySelector<HTMLElement>('.why-card--solution');

        if (!card1 || !card2) return;

        // Initial positions below viewport (110vh) with subtle scale-down
        gsap.set(card1, { y: '110vh', scale: 0.94, opacity: 1, transformOrigin: 'center center' });
        gsap.set(card2, { y: '110vh', scale: 0.94, opacity: 1, transformOrigin: 'center center' });

        // Set initial accessibility states
        card1.setAttribute('aria-hidden', 'true');
        card1.setAttribute('inert', '');
        card2.setAttribute('aria-hidden', 'true');
        card2.setAttribute('inert', '');

        // Pinned scroll sequence:
        // Pinned travel: 2.5 viewports (height: 350svh).
        // Scrub: 1.0 (buttery smooth lerp toward scroll target, physical and fully reversible).
        //
        // Timeline breakdown (5.0s total):
        // - 0.0s -> 0.4s: Hold - "Why LabFlow exists." visible at dead center
        // - 0.4s -> 2.0s: Card 1 rises from 110vh -> 0vh, scale 0.94 -> 1.0 (power2.out ease)
        //                 settles at viewport center covering the heading behind it
        // - 2.0s -> 2.8s: Card 1 dwell (hold at center)
        // - 2.8s -> 4.4s: Card 2 rises from 110vh -> 0vh, scale 0.94 -> 1.0 (power2.out ease)
        //                 settles at viewport center FULLY covering Card 1
        // - 4.1s -> 4.4s: Card 1 fades to 0 under Card 2 for clean occlusion
        // - 4.4s -> 5.0s: Card 2 dwell (hold at center)
        // - 5.0s: Clean unpin into the next section beneath
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1.0,
            onUpdate: (self) => {
              const p = self.progress;
              // Card 1 is active when settled and not yet covered by Card 2
              if (p >= 0.28 && p < 0.68) {
                card1.removeAttribute('aria-hidden');
                card1.removeAttribute('inert');
              } else {
                card1.setAttribute('aria-hidden', 'true');
                card1.setAttribute('inert', '');
              }

              // Card 2 is active when settled over Card 1
              if (p >= 0.68) {
                card2.removeAttribute('aria-hidden');
                card2.removeAttribute('inert');
              } else {
                card2.setAttribute('aria-hidden', 'true');
                card2.setAttribute('inert', '');
              }
            },
          },
        });

        // 1. Card 1 rises from below and settles centered over the heading
        tl.to(
          card1,
          {
            y: '0vh',
            scale: 1.0,
            duration: 1.6,
            ease: 'power2.out',
          },
          0.4
        );

        // 2. Card 2 rises from below and settles centered, covering Card 1
        tl.to(
          card2,
          {
            y: '0vh',
            scale: 1.0,
            duration: 1.6,
            ease: 'power2.out',
          },
          2.8
        );

        // 3. Card 1 fades out cleanly beneath Card 2 as Card 2 completes docking
        tl.to(
          card1,
          {
            opacity: 0,
            duration: 0.3,
            ease: 'power1.out',
          },
          4.1
        );

        return () => {
          tl.kill();
          card1.removeAttribute('aria-hidden');
          card1.removeAttribute('inert');
          card2.removeAttribute('aria-hidden');
          card2.removeAttribute('inert');
          gsap.set([card1, card2], { clearProps: 'all' });
        };
      });

      // Mobile & Tablet (< 1024px): No pin, normal document flow, all content accessible
      mm.add('(max-width: 1023px)', () => {
        const card1 = el.querySelector<HTMLElement>('.why-card--problem');
        const card2 = el.querySelector<HTMLElement>('.why-card--solution');
        if (card1) {
          card1.removeAttribute('aria-hidden');
          card1.removeAttribute('inert');
        }
        if (card2) {
          card2.removeAttribute('aria-hidden');
          card2.removeAttribute('inert');
        }
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="why-labflow tone-dark" data-tone="dark">
      <div className="why-labflow-inner">
        <div className="why-heading-wrap">
          <h2 data-split className="why-heading display text-[clamp(2.5rem,5.5vw,5rem)] text-center">
            Why LabFlow exists.
          </h2>
        </div>

        <div className="why-cards-deck">
          {/* Card 1: The problem. */}
          <article className="why-card why-card--problem">
            <div className="why-card-img-wrap">
              <SkelImage
                src={problemImg}
                alt="Diagnostic lab paperwork and manual registration records"
                loading="eager"
                wrapperClassName="h-full w-full"
                imgClassName="why-card-img"
              />
            </div>
            <div className="why-card-text">
              <h3 className="display text-2xl md:text-3xl text-[var(--color-paper)]">
                The problem.
              </h3>
              <p className="text-[0.95rem] md:text-base leading-relaxed text-[rgb(216_243_220_/_0.85)]">
                Pakistan&apos;s diagnostic labs run on paper registers and scattered spreadsheets. No
                modelled flow, no real separation between branches.
              </p>
            </div>
          </article>

          {/* Card 2: The solution. */}
          <article className="why-card why-card--solution">
            <div className="why-card-img-wrap">
              <SkelImage
                src={solutionImg}
                alt="LabFlow modern digital workflow with technician at computer"
                loading="eager"
                wrapperClassName="h-full w-full"
                imgClassName="why-card-img"
              />
            </div>
            <div className="why-card-text">
              <h3 className="display text-2xl md:text-3xl text-[var(--color-paper)]">
                The solution.
              </h3>
              <p className="text-[0.95rem] md:text-base leading-relaxed text-[rgb(216_243_220_/_0.85)]">
                LabFlow models the entire lab flow as software &mdash; with every lab&apos;s data provably
                isolated in its own database schema.
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};

export default LabFlowProblemCards;
