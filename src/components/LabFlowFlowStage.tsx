import React, { useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import patientImg from '../assets/labflow/stage-patient-registration.jpg';
import sampleImg from '../assets/labflow/stage-sample-collection.jpg';
import resultImg from '../assets/labflow/stage-result-entry.jpg';
import approvalImg from '../assets/labflow/stage-pathologist-approval.jpg';
import reportImg from '../assets/labflow/stage-pdf-report.jpg';
import { portfolioData } from '../data/portfolio';
import { gsap, useGSAP, motionMatchMedia } from '../engine/gsap';

/** One real render per stage, in the same order as flowExplorer.steps. */
const STAGE_IMAGES = [patientImg, sampleImg, resultImg, approvalImg, reportImg];

export const LabFlowFlowStage: React.FC = () => {
  const root = useRef<HTMLElement>(null);
  const { flowExplorer: flow } = portfolioData;
  const total = flow.steps.length;

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const mm = motionMatchMedia();

      // Desktop breakpoint (min-width: 1024px): Forge scroll pattern
      mm.add('(min-width: 1024px)', () => {
        const strip = el.querySelector<HTMLElement>('.flow-strip');
        const panelItems = el.querySelectorAll<HTMLElement>('.flow-panel-item');
        const blurItems = el.querySelectorAll<HTMLElement>('.flow-blur-item');
        const progressSpan = el.querySelector<HTMLElement>('.flow-progress span');
        const blocks = el.querySelectorAll<HTMLElement>('.flow-step-block');

        if (!strip || panelItems.length === 0 || blurItems.length === 0) return;

        // Initial setup for desktop
        gsap.set(strip, { yPercent: 0 });
        if (progressSpan) {
          gsap.set(progressSpan, { scaleX: 1 / total, transformOrigin: 'left center' });
        }

        panelItems.forEach((img, i) => {
          if (i === 0) {
            gsap.set(img, { scale: 1, opacity: 1, zIndex: 1 });
          } else {
            gsap.set(img, { scale: 0.16, opacity: 0, zIndex: i + 1 });
          }
        });

        blurItems.forEach((blur, i) => {
          if (i === 0) {
            gsap.set(blur, { opacity: 1, zIndex: 1 });
          } else {
            gsap.set(blur, { opacity: 0, zIndex: i + 1 });
          }
        });

        const setA11y = (activeIndex: number) => {
          blocks.forEach((block, idx) => {
            const isActive = idx === activeIndex;
            block.dataset.active = String(isActive);
            if (isActive) {
              block.removeAttribute('aria-hidden');
              block.removeAttribute('inert');
            } else {
              block.setAttribute('aria-hidden', 'true');
              block.setAttribute('inert', '');
            }
          });
        };

        setA11y(0);

        // Calibrated dwell & transition:
        // 5 steps, 4 transitions.
        // Total duration: 5 * 0.6s hold + 4 * 1.6s transition = 9.4s.
        const HOLD = 0.6;
        const TRANS = 1.6;

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: el,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.2,
            onUpdate: (self) => {
              const p = self.progress;
              let current = 0;
              if (p < 0.21) current = 0;
              else if (p < 0.44) current = 1;
              else if (p < 0.67) current = 2;
              else if (p < 0.90) current = 3;
              else current = 4;

              setA11y(current);
            },
          },
        });

        let cursorTime = HOLD;

        for (let i = 0; i < total - 1; i++) {
          const nextIndex = i + 1;
          const targetYPercent = -((nextIndex / total) * 100);
          const targetProgress = (nextIndex + 1) / total;

          // 1. Right strip translates upward as one block
          tl.to(
            strip,
            {
              yPercent: targetYPercent,
              duration: TRANS,
            },
            cursorTime
          );

          // 2. Next left image appears as small centered tile and grows outward to fill frame
          tl.to(
            panelItems[nextIndex],
            {
              opacity: 1,
              duration: 0.15,
            },
            cursorTime
          );

          tl.to(
            panelItems[nextIndex],
            {
              scale: 1.0,
              duration: TRANS,
            },
            cursorTime
          );

          // 3. Blurred background switches to new image DURING growth (45% into transition)
          tl.to(
            blurItems[nextIndex],
            {
              opacity: 1,
              duration: TRANS * 0.45,
            },
            cursorTime
          );

          // 4. Bottom progress bar line advances
          if (progressSpan) {
            tl.to(
              progressSpan,
              {
                scaleX: targetProgress,
                duration: TRANS,
              },
              cursorTime
            );
          }

          cursorTime += TRANS + HOLD;
        }

        return () => {
          tl.kill();
          blocks.forEach((block) => {
            block.removeAttribute('aria-hidden');
            block.removeAttribute('inert');
            block.dataset.active = 'true';
          });
        };
      });

      // Mobile & Tablet (< 1024px): No pin, normal flow, all blocks active
      mm.add('(max-width: 1023px)', () => {
        const blocks = el.querySelectorAll<HTMLElement>('.flow-step-block');
        blocks.forEach((block) => {
          block.removeAttribute('aria-hidden');
          block.removeAttribute('inert');
          block.dataset.active = 'true';
        });
      });
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      className="flowstage tone-dark"
      data-tone="dark"
    >
      <div className="flow-inner">
        <div className="flow-blur" aria-hidden="true">
          {STAGE_IMAGES.map((src, i) => (
            <img
              key={src}
              className="flow-blur-item"
              src={src}
              alt=""
              loading={i === 0 ? 'eager' : 'lazy'}
              style={{ zIndex: i + 1 }}
            />
          ))}
        </div>
        <div className="flow-scrim" aria-hidden="true" />

        <div className="flow-grid">
          <div className="flow-panel">
            {STAGE_IMAGES.map((src, i) => (
              <img
                key={src}
                className="flow-panel-item"
                src={src}
                alt=""
                loading={i === 0 ? 'eager' : 'lazy'}
                style={{ zIndex: i + 1 }}
              />
            ))}
          </div>

          <div className="flow-col">
            <div className="flow-strip">
              {flow.steps.map((step, i) => (
                <article
                  key={step.step}
                  className="flow-step-block"
                  data-active={i === 0}
                >
                  <span className="flow-counter">
                    <strong>{String(step.step).padStart(2, '0')}</strong> / {String(total).padStart(2, '0')}
                  </span>
                  <img
                    className="flow-item-img"
                    src={STAGE_IMAGES[i]}
                    alt=""
                    loading={i === 0 ? 'eager' : 'lazy'}
                  />
                  <h3 className="display flow-title">{step.title}</h3>
                  <p className="flow-desc">{step.desc}</p>
                  <a href="#contact-cta" className="btn flow-cta" data-cursor="Open">
                    <span>Get in touch</span>
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                </article>
              ))}
            </div>
          </div>
        </div>

        <div className="flow-progress" aria-hidden="true">
          <span />
        </div>
      </div>
    </section>
  );
};

export default LabFlowFlowStage;
