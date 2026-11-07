import React, { useRef } from 'react';
import { ArrowRight, BadgeCheck, GitBranch } from 'lucide-react';
import { gsap, SplitText, useGSAP, MOTION_OK, motionMatchMedia } from '../../engine/gsap';

/**
 * Hero. Lands directly on the real content — no boot sequence, no fake
 * IDs. Terminal mirrors the Home hero's own bash window (same colors,
 * same chrome) for visual consistency across the site.
 */

const REPORT_ROWS: { name: string; value: string; ref: string }[] = [
  { name: 'HbA1c (Glycated Hemoglobin)', value: '5.4 %', ref: '4.0 – 5.6' },
  { name: 'CBC — Total Leukocyte (WBC)', value: '7.2 x10³/µL', ref: '4.0 – 11.0' },
  { name: 'TSH (Thyroid Stimulating)', value: '2.1 mIU/L', ref: '0.4 – 4.0' },
];

export const CaseStudyHero: React.FC = () => {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = motionMatchMedia();
      mm.add(MOTION_OK, () => {
        const q = gsap.utils.selector(root);
        const title = q('[data-title]')[0];
        const parts = q('[data-intro]');

        gsap.set(title, { autoAlpha: 1 });
        const split = SplitText.create(title, {
          type: 'lines',
          mask: 'lines',
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, { yPercent: 115, duration: 1.1, ease: 'expo.out', stagger: 0.1 }),
        });
        gsap.fromTo(
          parts,
          { y: 20, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.8, ease: 'expo.out', stagger: 0.08, delay: 0.2 }
        );

        return () => split.revert();
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="labflow-cs tone-dark relative" data-tone="dark" id="hero-storyboard">
      <div className="mx-auto max-w-[88rem] px-[var(--pad-x)] pb-16 pt-24 md:pb-24 md:pt-32">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <h1
              data-title
              className="display max-w-xl text-[clamp(2.4rem,5vw,4rem)] opacity-0"
            >
              A multi-tenant SaaS for diagnostic labs, designed and built end to end.
            </h1>

            <p data-intro className="mt-5 max-w-lg text-lg leading-relaxed text-[var(--fg-muted)] opacity-0">
              Self-directed showcase, not in production. Registration, billing, and a signed report
              delivered on WhatsApp — one modelled pipeline.
            </p>

            <div data-intro className="mt-8 w-full max-w-[30rem] opacity-0">
              <div
                className="overflow-hidden rounded-lg border border-[rgb(216_243_220/0.14)] bg-[#081c15]/95 text-[#d8f3dc] shadow-xl"
                role="img"
                aria-label="Terminal showing: labflow --case-study"
              >
                <div className="flex items-center justify-between border-b border-[rgb(216_243_220/0.12)] bg-[#1b4332]/40 px-3 py-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#2d6a4f]" />
                    <span className="h-2 w-2 rounded-full bg-[#40916c]" />
                    <span className="h-2 w-2 rounded-full bg-[#52b788]" />
                  </div>
                  <span className="font-mono text-[11px] text-[#95d5b2]/80">bash ~ labflow</span>
                  <div className="w-10" />
                </div>
                <div className="space-y-1.5 p-3.5 font-mono text-[13px] leading-snug sm:px-4 sm:py-3">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-[#52b788]">$</span>
                    <span>labflow --case-study</span>
                  </div>
                  <div className="flex items-start gap-1.5 pl-2 text-[#95d5b2]">
                    <span className="font-bold text-[#74c69d]">→</span>
                    <span className="text-[#b7e4c7]">
                      registration → billing → report → whatsapp (demo build)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div data-intro className="mt-8 flex flex-wrap items-center gap-3 opacity-0">
              <a
                href="https://github.com/kamrandebugging/LabFlow"
                target="_blank"
                rel="noreferrer noopener"
                className="btn btn-solid"
                data-cursor="GitHub"
              >
                <GitBranch className="h-4 w-4" aria-hidden="true" />
                View on GitHub
              </a>
              <a href="/#projects" className="btn">
                Back to projects
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div data-intro className="opacity-0">
            <div className="lf-doc-card rounded-xl p-6 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="display text-lg font-semibold text-[var(--color-forest)]">LabFlow</p>
                  <p className="font-mono text-xs tracking-wide text-[rgb(8_28_21/0.55)]">
                    Pathology report (mockup)
                  </p>
                </div>
                <span className="rounded-full bg-[rgb(8_28_21/0.08)] px-3 py-1 font-mono text-[11px] text-[var(--color-forest)]">
                  demo
                </span>
              </div>

              <div className="mt-5 rounded bg-[rgb(8_28_21/0.05)] px-4 py-2.5 text-sm">
                <span className="font-semibold">Patient:</span> Ayesha Khan (demo) ·{' '}
                <span className="font-semibold">Sample:</span> Blood (EDTA)
              </div>

              <div className="mt-5 flex flex-col gap-2">
                {REPORT_ROWS.map((row) => (
                  <div
                    key={row.name}
                    className="flex items-center justify-between gap-3 rounded bg-white/70 px-4 py-2.5 text-sm"
                  >
                    <div>
                      <p className="font-semibold">{row.name}</p>
                      <p className="font-mono text-xs text-[rgb(8_28_21/0.6)]">{row.value}</p>
                    </div>
                    <span className="font-mono text-xs text-[rgb(8_28_21/0.5)]">ref {row.ref}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-[rgb(8_28_21/0.1)] pt-4">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-wide text-[rgb(8_28_21/0.4)]">
                    Pathologist on record
                  </p>
                  <p className="display italic">Dr. Tariq Mahmood (demo)</p>
                </div>
                <BadgeCheck className="h-6 w-6 text-[var(--color-forest)]" aria-hidden="true" />
              </div>
            </div>
            <p className="mt-3 text-center font-mono text-[11px] uppercase tracking-wide text-[rgb(216_243_220/0.4)]">
              Mockup — demo data, not a live product screen
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CaseStudyHero;
