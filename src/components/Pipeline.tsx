import React, { useRef } from 'react';
import { ArrowDownRight, Check, FileText } from 'lucide-react';
import {
  gsap,
  ScrollTrigger,
  useGSAP,
  MOBILE_SCENES,
  motionMatchMedia,
} from '../engine/gsap';
import { portfolioData } from '../data/portfolio';
import { scrollToTarget } from '../engine/scroll';
import { useReveals } from '../hooks/useReveals';
import { useSceneProgress } from '../hooks/useSceneProgress';

type CSSVars = React.CSSProperties & Record<`--${string}`, string | number>;

const RESULTS = [
  { test: 'Hemoglobin', value: '13.8', unit: 'g/dL', range: '13.0 – 17.0' },
  { test: 'WBC', value: '6.2', unit: '×10³/µL', range: '4.0 – 11.0' },
  { test: 'Platelets', value: '245', unit: '×10³/µL', range: '150 – 400' },
];

/**
 * LabFlow's five-stage pipeline as a scroll-driven scene. Both layouts write
 * the same `--stage` variable and the report reacts to it:
 *   tablets and up  one pinned stage, ~92svh of scroll per step
 *   phones          the report is pinned at the top while the five steps scroll
 *                   underneath it, so each step arrives under the thumb
 * Reduced motion gets a static, fully revealed layout.
 */
export const Pipeline: React.FC = () => {
  const root = useRef<HTMLElement>(null);
  const lastStage = useRef(0);
  const { flowExplorer: flow } = portfolioData;
  const total = flow.steps.length;

  useReveals(root);

  // Tablets and up: scroll position inside the pinned stage picks the step.
  useSceneProgress(root, {
    onSetup: (el) => {
      lastStage.current = 1;
      el.style.setProperty('--stage', '1');
      return () => el.style.removeProperty('--stage');
    },
    onProgress: (p, el) => {
      const stage = Math.min(total, Math.floor(p * total) + 1);
      if (stage === lastStage.current) return;
      lastStage.current = stage;
      el.style.setProperty('--stage', String(stage));
      el.querySelectorAll<HTMLElement>('.pipe-item').forEach((item, i) => {
        item.dataset.active = String(i + 1 === stage);
      });
    },
  });

  // Phones: whichever step card crosses the reading line becomes the stage.
  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const mm = motionMatchMedia();
      mm.add(MOBILE_SCENES, () => {
        const steps = gsap.utils.toArray<HTMLElement>('.pipe-list > li', el);
        const list = el.querySelector<HTMLElement>('.pipe-list');
        if (!list) return;

        el.style.setProperty('--stage', '1');
        el.style.setProperty('--p', '0');

        const triggers = steps.map((step, i) =>
          ScrollTrigger.create({
            trigger: step,
            start: 'top 64%',
            end: 'bottom 64%',
            onToggle: (self) => {
              if (self.isActive) el.style.setProperty('--stage', String(i + 1));
            },
          })
        );
        triggers.push(
          ScrollTrigger.create({
            trigger: list,
            start: 'top 90%',
            end: 'bottom 55%',
            onUpdate: (self) => el.style.setProperty('--p', self.progress.toFixed(3)),
          })
        );

        return () => {
          triggers.forEach((t) => t.kill());
          el.style.removeProperty('--stage');
          el.style.removeProperty('--p');
        };
      });
    },
    { scope: root }
  );

  return (
    <>
      <section
        id="pipeline"
        ref={root}
        data-chapter="03"
        data-chapter-title="LabFlow"
        data-tone="dark"
        className="pipe tone-dark"
      >
        <div className="pipe-stage">
          <div className="pipe-left flex min-h-0 flex-col justify-center gap-8">
            <header className="pipe-head">
              <span className="eyebrow">{flow.eyebrow}</span>
              <h2 data-split className="display mt-5 text-[clamp(2.4rem,4.6vw,4.6rem)]">
                {flow.title}
              </h2>
              <p data-fade className="muted mt-5 max-w-[34rem] leading-relaxed">
                {flow.description}
              </p>
            </header>

            <div className="pipe-copy">
              {flow.steps.map((step, i) => (
                <article
                  key={step.step}
                  className="pipe-item"
                  style={{ '--i': i + 1 } as CSSVars}
                  data-active={i === 0}
                >
                  <span className="pipe-num">{String(step.step).padStart(2, '0')}</span>
                  <h3 className="display mt-4 text-[clamp(1.9rem,3.2vw,3rem)]">{step.title}</h3>
                  <p className="muted mt-3 max-w-[30rem] leading-relaxed">{step.desc}</p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {step.stack.map((tech) => (
                      <li key={tech} className="chip">
                        {tech}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>

            <div className="pipe-rail" aria-hidden="true">
              {flow.steps.map((step, i) => (
                <span key={step.step} className="pipe-dot" style={{ '--i': i + 1 } as CSSVars} />
              ))}
            </div>

            <ol className="pipe-list">
              {flow.steps.map((step, i) => (
                <li key={step.step} className="pipe-step" style={{ '--i': i + 1 } as CSSVars}>
                  <span className="pipe-step-num">{String(step.step).padStart(2, '0')}</span>
                  <h3 className="display mt-2 text-3xl">{step.title}</h3>
                  <p className="muted mt-3 leading-relaxed">{step.desc}</p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {step.stack.map((tech) => (
                      <li key={tech} className="chip">
                        {tech}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </div>

          <div className="report-wrap">
            <div className="report" aria-label="Illustrative lab report that builds as you scroll">
              <div className="report-head flex items-start justify-between gap-4">
                <div>
                  <p className="rep-label">LabFlow</p>
                  <p className="report-title display mt-1 text-3xl">Diagnostic report</p>
                </div>
                <span className="rep-label rounded-full border border-[var(--rule)] px-2.5 py-1">
                  Illustrative data
                </span>
              </div>

              <div className="rep" style={{ '--i': 1 } as CSSVars}>
                <p className="rep-label">01 · Patient &amp; invoice</p>
                <div className="rep-body">
                  <dl className="mt-3 grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <dt className="rep-label">Patient</dt>
                      <dd className="mt-1 font-medium">Sample Patient</dd>
                    </div>
                    <div>
                      <dt className="rep-label">Reg. no.</dt>
                      <dd className="mt-1 font-mono">LF-0001</dd>
                    </div>
                    <div>
                      <dt className="rep-label">Invoice</dt>
                      <dd className="mt-1 font-medium">Paid</dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div className="rep" style={{ '--i': 2 } as CSSVars}>
                <p className="rep-label">02 · Sample</p>
                <div className="rep-body">
                  <div className="mt-3 flex items-center gap-5">
                    <span className="font-mono text-sm">ACC-000123</span>
                    <span className="barcode flex-1" aria-hidden="true" />
                  </div>
                </div>
              </div>

              <div className="rep" style={{ '--i': 3 } as CSSVars}>
                <p className="rep-label">03 · Results vs. reference range</p>
                <div className="rep-body">
                  <table className="mt-3 w-full text-sm">
                    <tbody>
                      {RESULTS.map((row) => (
                        <tr key={row.test} className="border-t border-[var(--rule)]">
                          <td className="py-2 font-medium">{row.test}</td>
                          <td className="py-2 font-mono tabular-nums">
                            {row.value} <span className="text-[var(--muted)]">{row.unit}</span>
                          </td>
                          <td className="py-2 font-mono text-[var(--muted)]">{row.range}</td>
                          <td className="py-2 text-right">
                            <Check className="ml-auto h-4 w-4 text-pine" aria-label="In range" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="rep" style={{ '--i': 4 } as CSSVars}>
                <p className="rep-label">04 · Pathologist sign-off</p>
                <div className="rep-body">
                  <div className="mt-3">
                    <span className="stamp">Approved</span>
                  </div>
                </div>
              </div>

              <div className="rep" style={{ '--i': 5 } as CSSVars}>
                <p className="rep-label">05 · Report</p>
                <div className="rep-body">
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                    <span className="inline-flex items-center gap-2 font-mono">
                      <FileText className="h-4 w-4" aria-hidden="true" />
                      report.pdf
                    </span>
                    <span className="rep-label rounded-full border border-[var(--rule)] px-2.5 py-1">
                      Signed link · 7 days
                    </span>
                    <span className="rep-label rounded-full border border-[var(--rule)] px-2.5 py-1">
                      WhatsApp click-to-send
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="tone-dark px-[var(--pad-x)] pb-28 pt-6">
        <div className="mx-auto flex max-w-[88rem] flex-col gap-8" data-fade>
          <span className="chip w-fit">{flow.tagline}</span>
          <p className="muted max-w-[46rem] text-sm leading-relaxed">{flow.moneyNote}</p>
          <button
            type="button"
            className="btn w-fit"
            onClick={() => scrollToTarget('#projects')}
            data-cursor="Scroll"
          >
            {flow.ctaText}
            <ArrowDownRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </>
  );
};

export default Pipeline;
