import React, { useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import patientImg from '../assets/labflow/stage-patient-registration.jpg';
import sampleImg from '../assets/labflow/stage-sample-collection.jpg';
import resultImg from '../assets/labflow/stage-result-entry.jpg';
import approvalImg from '../assets/labflow/stage-pathologist-approval.jpg';
import reportImg from '../assets/labflow/stage-pdf-report.jpg';
import { portfolioData } from '../data/portfolio';
import { useSceneProgress } from '../hooks/useSceneProgress';

type CSSVars = React.CSSProperties & Record<`--${string}`, string | number>;

/** One real render per stage, in the same order as flowExplorer.steps. */
const STAGE_IMAGES = [patientImg, sampleImg, resultImg, approvalImg, reportImg];

/**
 * The real 5-stage patient-to-report flow (src/data/portfolio.ts
 * flowExplorer.steps), built to match the reference exactly: a pinned
 * two-column panel — a left image that swaps small-to-large, a right
 * column with a plain counter, heading, paragraph and one constant CTA —
 * over a blurred fill of the same image, with a thin progress line at the
 * foot. Phones drop the pin and stack every stage (scenes.css).
 */
export const LabFlowFlowStage: React.FC = () => {
  const root = useRef<HTMLElement>(null);
  const lastStage = useRef(1);
  const [stage, setStage] = React.useState(1);
  const { flowExplorer: flow } = portfolioData;
  const total = flow.steps.length;

  useSceneProgress(root, {
    onSetup: (el) => {
      lastStage.current = 1;
      el.style.setProperty('--stage', '1');
      return () => el.style.removeProperty('--stage');
    },
    onProgress: (p, el) => {
      const next = Math.min(total, Math.floor(p * total) + 1);
      if (next === lastStage.current) return;
      lastStage.current = next;
      el.style.setProperty('--stage', String(next));
      setStage(next);
      el.querySelectorAll<HTMLElement>('.flow-item, .flow-panel-item').forEach((item, i) => {
        item.dataset.active = String(i + 1 === next);
      });
    },
  });

  return (
    <section
      ref={root}
      className="flowstage tone-dark"
      data-tone="dark"
      style={{ '--steps': total } as CSSVars}
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
              style={{ '--i': i + 1 } as CSSVars}
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
                data-active={i === 0}
                src={src}
                alt=""
                loading={i === 0 ? 'eager' : 'lazy'}
                style={{ '--i': i + 1 } as CSSVars}
              />
            ))}
          </div>

          <div className="flow-col">
            <span className="flow-counter">
              <strong>{String(stage).padStart(2, '0')}</strong> / {String(total).padStart(2, '0')}
            </span>

            <div className="flow-items">
              {flow.steps.map((step, i) => (
                <article
                  key={step.step}
                  className="flow-item"
                  style={{ '--i': i + 1 } as CSSVars}
                  data-active={i === 0}
                >
                  <img
                    className="flow-item-img"
                    src={STAGE_IMAGES[i]}
                    alt=""
                    loading={i === 0 ? 'eager' : 'lazy'}
                  />
                  <h3 className="display flow-title">{step.title}</h3>
                  <p className="flow-desc">{step.desc}</p>
                </article>
              ))}
            </div>

            <a href="#contact-cta" className="btn flow-cta" data-cursor="Open">
              <span>Get in touch</span>
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
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
