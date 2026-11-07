import React, { useRef, useState } from 'react';
import { GitBranch, Calendar } from 'lucide-react';
import { gsap, ScrollTrigger, useGSAP } from '../../engine/gsap';
import { systemReducesMotion } from '../../engine/motion';
import { useReveals } from '../../hooks/useReveals';

/** Before / after drag comparison, then the closing CTA. */

export const CaseStudyWorkflowDelta: React.FC = () => {
  const root = useRef<HTMLElement>(null);
  const [pct, setPct] = useState(50);
  const tookOver = useRef(false);
  const autoplayTween = useRef<gsap.core.Tween | null>(null);
  const baRoot = useRef<HTMLDivElement>(null);
  useReveals(root);

  const stopAutoplay = () => {
    tookOver.current = true;
    autoplayTween.current?.kill();
  };

  useGSAP(
    () => {
      const el = baRoot.current;
      if (!el || systemReducesMotion()) return;
      const st = ScrollTrigger.create({
        trigger: el,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          if (tookOver.current) return;
          const proxy = { v: 50 };
          autoplayTween.current = gsap.to(proxy, {
            v: 65,
            duration: 2.5,
            ease: 'power1.inOut',
            yoyo: true,
            repeat: 1,
            onUpdate: () => {
              if (!tookOver.current) setPct(proxy.v);
            },
          });
        },
      });
      return () => st.kill();
    },
    { scope: baRoot }
  );

  return (
    <section ref={root} className="labflow-cs tone-dark border-t border-[color:var(--line)]" data-tone="dark">
      <div className="mx-auto max-w-[72rem] px-[var(--pad-x)] py-20 md:py-28">
        <h2 data-split className="display max-w-[20ch] text-[clamp(2rem,4vw,3.25rem)]">
          The register book, versus one card.
        </h2>
        <p data-fade className="mt-4 max-w-[56ch] text-lg leading-relaxed muted">
          Drag to compare the old paper workflow against LabFlow.
        </p>

        <div
          ref={baRoot}
          data-fade
          className="relative mt-10 h-[420px] w-full select-none overflow-hidden rounded-xl border border-[color:var(--line)]"
          style={{ ['--pos' as unknown as string]: `${pct}%` }}
        >
          <div className="lf-doc-card absolute inset-0 flex flex-col justify-center gap-4 p-6 sm:p-10">
            <span className="w-fit rounded-full bg-[var(--color-forest)] px-3 py-1 font-mono text-[11px] text-white">
              After — LabFlow
            </span>
            <p className="display text-2xl sm:text-3xl">One card. Report delivered.</p>
            <p className="max-w-md text-[var(--color-forest)]/80">
              Registration → billing → signed PDF → WhatsApp, in a single flow. The patient stops calling;
              the report finds them.
            </p>
          </div>

          <div
            className="absolute inset-y-0 left-0 overflow-hidden bg-[#1b4332]"
            style={{ width: `${pct}%` }}
          >
            <div className="flex h-[420px] w-full flex-col justify-center gap-4 p-6 text-[var(--color-paper)] sm:p-10">
              <span className="w-fit rounded-full bg-[rgb(216_243_220/0.12)] px-3 py-1 font-mono text-[11px]">
                Before — paper register
              </span>
              <p className="display text-2xl sm:text-3xl">The register book era.</p>
              <p className="max-w-md text-[rgb(216_243_220/0.7)]">
                Handwritten entries, totals that don&apos;t add up, patients calling the lab all day asking
                if the report has arrived.
              </p>
            </div>
          </div>

          <div
            className="absolute bottom-0 top-0 z-30 flex w-0.5 -translate-x-1/2 items-center justify-center bg-[var(--color-leaf)]"
            style={{ left: `${pct}%` }}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-leaf)] text-sm font-bold text-[var(--color-ink)] shadow-lg">
              ↔
            </div>
          </div>

          <input
            type="range"
            min={4}
            max={96}
            value={pct}
            onChange={(e) => {
              stopAutoplay();
              setPct(Number(e.target.value));
            }}
            onPointerDown={stopAutoplay}
            onKeyDown={(e) => {
              if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
              e.preventDefault();
              stopAutoplay();
              setPct((p) => Math.min(96, Math.max(4, p + (e.key === 'ArrowLeft' ? -5 : 5))));
            }}
            aria-label="Drag to compare the paper workflow and LabFlow"
            className="absolute inset-0 z-40 h-full w-full cursor-ew-resize opacity-0"
          />
        </div>
        <p className="mt-3 text-center font-mono text-[11px] uppercase tracking-wide text-[rgb(216_243_220/0.35)]">
          Drag, or use arrow keys, to compare
        </p>

        {/* Closing CTA */}
        <div data-fade className="mt-20 rounded-2xl border border-[color:var(--line)] p-8 text-center sm:p-12">
          <p className="display text-2xl sm:text-3xl">Let&apos;s talk.</p>
          <p className="mx-auto mt-3 max-w-md text-[var(--fg-muted)]">
            Self-directed showcase build — Django 5, DRF, React 18, PostgreSQL, Redis, Celery. Not in
            production, no real patient data.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://cal.com/kamrandebugging/intro-call"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-solid"
              data-cursor="Book"
            >
              <Calendar className="h-4 w-4" aria-hidden="true" />
              Book a Call
            </a>
            <a
              href="https://github.com/kamrandebugging/LabFlow"
              target="_blank"
              rel="noreferrer noopener"
              className="btn"
              data-cursor="GitHub"
            >
              <GitBranch className="h-4 w-4" aria-hidden="true" />
              View repository
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CaseStudyWorkflowDelta;
