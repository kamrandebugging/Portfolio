import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import labflowImg from '../assets/labflow.webp';
import { useReveals } from '../hooks/useReveals';
import { gsap, ScrollTrigger, useGSAP, SCENES_ON, motionMatchMedia } from '../engine/gsap';

/**
 * LabFlow case study — Part 1 of 3 (S0 hero, S1 problem, S2 pinned journey).
 * Honesty contract: self-directed showcase build, LAB-14/50 stories merged,
 * not in production. The S2 journey demonstrates the DESIGNED pipeline from
 * the architecture docs with demo data — never a live system log.
 */

const AMBER_CLASS = 'text-[#fbbf24]'; // reserved: out-of-range / pending status only

interface BeatLine {
  text: string;
  tone?: 'muted' | 'amber' | 'stamp';
}
interface Beat {
  num: string;
  title: string;
  point: string;
  desc: string;
  lines: BeatLine[];
}

const BEATS: Beat[] = [
  {
    num: '01',
    title: 'Registration',
    point: 'TENANT_ID LOCKED',
    desc: 'One row, written into one tenant schema — never another.',
    lines: [
      { text: '[09:41:02] sample A-4821 registered — tenant: citylab' },
      { text: '[09:41:02] tenant_id locked · schema: citylab' },
    ],
  },
  {
    num: '02',
    title: 'Collection',
    point: 'CHAIN OF CUSTODY OPENED',
    desc: 'Barcode scanned at each hand-off; the custody log follows the sample.',
    lines: [
      { text: '[09:41:22] barcode A-4821-5631 scanned at collection' },
      { text: '[09:41:22] custody: phlebotomist → bench 2 — log line appended' },
    ],
  },
  {
    num: '03',
    title: 'Result',
    point: 'ONE MARKER OUT OF RANGE',
    desc: 'Values post against reference ranges; misses flag amber — nothing hides it.',
    lines: [
      { text: '[10:12:47] analyzer posted: WBC 6.4 · ref 4.0–11.0 · NORMAL', tone: 'muted' },
      { text: '[10:12:47] analyzer posted: Hb 9.1 · ref 12.0–17.0 · OUT OF RANGE', tone: 'amber' },
    ],
  },
  {
    num: '04',
    title: 'Pathologist approval',
    point: 'SIGNATURE APPLIED',
    desc: 'The signature is a legal act — a timestamped approval, not a stamp.',
    lines: [
      { text: '[11:02:10] routed to pathologist review' },
      { text: '[11:04:38] signed_at 2026-05-14T11:04:38+05:00 · signer: pathologist on record' },
    ],
  },
  {
    num: '05',
    title: 'PDF report',
    point: 'RENDERS LINE BY LINE',
    desc: 'Generated in the background, stamped, versioned — never soft-deleted.',
    lines: [
      { text: '[11:04:41] rendering: header → patient → results → footer' },
      { text: '[11:04:44] A-4821_final.pdf stored · report status: FINAL' },
      { text: 'VERIFIED ✓', tone: 'stamp' },
    ],
  },
];

const META: [string, string][] = [
  ['YEAR', '2026'],
  ['CLIENT', '— (self-directed showcase)'],
  ['TYPE', 'MULTI-TENANT SAAS'],
  ['ROLE', 'DESIGN + FULL-STACK'],
  ['STACK', 'Django 5 · DRF · PostgreSQL 16 · React 18 · Celery 5'],
  ['STATUS', 'IN DEVELOPMENT'],
];

/* SVG pipeline geometry: 5 nodes on a vertical spine, connectors between. */
const NODE_Y = [28, 154, 280, 406, 532];
const NODE_LABELS = [
  ['01 REGISTRATION', 'tenant_id locked'],
  ['02 COLLECTION', 'custody log opened'],
  ['03 RESULT', 'ranges checked'],
  ['04 APPROVAL', 'signed_at applied'],
  ['05 PDF REPORT', 'VERIFIED ✓'],
];

const lineToneClass = (tone: BeatLine['tone']): string => {
  switch (tone) {
    case 'amber':
      return AMBER_CLASS;
    case 'stamp':
      return 'mt-2 inline-block text-[var(--color-leaf)] tracking-[0.3em]';
    case 'muted':
      return 'text-[rgb(216_243_220/0.6)]';
    default:
      return 'text-[rgb(216_243_220/0.82)]';
  }
};

export const LabFlowCaseStudy: React.FC = () => {
  const root = useRef<HTMLElement>(null);
  const hero = useRef<HTMLDivElement>(null);
  const journey = useRef<HTMLDivElement>(null);
  useReveals(root); // [data-line] hairlines only — text reveals are handled below at stagger ≤0.05

  useEffect(() => {
    // Web fonts shift layout; pin measurements must be taken after they settle.
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener('load', refresh);
    return () => window.removeEventListener('load', refresh);
  }, []);

  /* ---------- S0 hero entrance (slow, precise; no bounce) ---------- */
  useGSAP(
    () => {
      const el = hero.current;
      if (!el) return;
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.from(el.querySelectorAll('[data-hero-rise]'), {
        y: 36,
        autoAlpha: 0,
        duration: 1.1,
        stagger: 0.05,
        ease: 'expo.out',
      }).from(
        el.querySelector('[data-hero-frame]'),
        { autoAlpha: 0, y: 24, duration: 1.2, ease: 'expo.out' },
        '-=0.7'
      );
    },
    { scope: hero }
  );

  /* ---------- S2 pinned journey (desktop) / static stack (phones) ---------- */
  useGSAP(
    () => {
      const el = journey.current;
      if (!el) return;
      const mm = motionMatchMedia();

      mm.add(SCENES_ON, () => {
        const blocks = gsap.utils.toArray<HTMLElement>('[data-beat]', el);
        const lines = gsap.utils.toArray<HTMLElement>('[data-beat-line]', el);
        const nodes = gsap.utils.toArray<SVGCircleElement>('[data-node]', el);
        const dots = gsap.utils.toArray<SVGCircleElement>('[data-node-dot]', el);
        const labels = gsap.utils.toArray<SVGGElement>('[data-node-label]', el);
        const connectors = gsap.utils.toArray<SVGLineElement>('[data-connector]', el);
        const hint = el.querySelector<HTMLElement>('[data-scroll-hint]');

        // Initial state is set by JS (never CSS): without JS all text is visible.
        gsap.set(blocks, { autoAlpha: 0, y: 24 });
        gsap.set(lines, { autoAlpha: 0, y: 8 });
        gsap.set(nodes, { strokeDashoffset: 100 });
        gsap.set(connectors, { strokeDashoffset: 100 });
        gsap.set(dots, { scale: 0, transformOrigin: 'center' });
        gsap.set(labels, { opacity: 0.3 });

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: el,
            pin: true,
            pinSpacing: true,
            start: 'top top',
            end: '+=380%',
            scrub: 0.6,
          },
        });

        if (hint) tl.to(hint, { autoAlpha: 0, duration: 0.2 }, 0);

        BEATS.forEach((_, i) => {
          const at = i * 1;
          const block = blocks[i];
          const beatLines = lines.filter((l) => l.dataset.beatIndex === String(i));

          if (i > 0) {
            tl.to(connectors[i - 1], { strokeDashoffset: 0, duration: 0.45 }, at + 0.05);
          }
          // Node draws on, then lights: fill + centre dot + label
          tl.to(nodes[i], { strokeDashoffset: 0, duration: 0.4 }, at + 0.15);
          tl.to(
            nodes[i],
            { fill: 'rgba(82, 183, 136, 0.14)', duration: 0.2, ease: 'power3.out' },
            at + 0.5
          );
          tl.to(dots[i], { scale: 1, duration: 0.35, ease: 'expo.out' }, at + 0.5);
          tl.to(labels[i], { opacity: 1, duration: 0.4, ease: 'power3.out' }, at + 0.4);

          // Beat block + its log lines, stagger ≤0.05
          if (block) {
            tl.to(
              block,
              { autoAlpha: 1, y: 0, duration: 0.55, ease: 'power3.out' },
              at + 0.15
            );
          }
          beatLines.forEach((line, j) => {
            tl.to(
              line,
              { autoAlpha: 1, y: 0, duration: 0.35, ease: 'power3.out' },
              at + 0.35 + j * 0.05
            );
          });
        });

        return () => {
          tl.kill();
          gsap.set([blocks, lines, dots, labels], { clearProps: 'all' });
          gsap.set([nodes, connectors], { clearProps: 'all' });
        };
      });

      // Phones (max-width: 767px): no pin, no JS choreography — the beats are
      // plain stacked cards in normal flow. Nothing to animate here on purpose.
      mm.add('(max-width: 767px)', () => undefined);
    },
    { scope: journey }
  );

  /* ---------- Fixed-nav tone follows the section under it ---------- */
  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const docEl = document.documentElement;
      docEl.dataset.navTone = 'dark';
      const trigger = ScrollTrigger.create({
        trigger: el,
        start: 'top 6%',
        end: 'bottom 6%',
        onToggle: (self) => {
          if (self.isActive) docEl.dataset.navTone = 'dark';
        },
      });
      return () => {
        trigger.kill();
        docEl.dataset.navTone = 'dark';
      };
    },
    { scope: root }
  );

  return (
    <main ref={root} className="bg-[var(--color-ink)] text-[var(--color-paper)]">
      {/* ============ S0 — Terminal hero ============ */}
      <section ref={hero} className="tone-dark relative" data-tone="dark">
        <div className="mx-auto flex max-w-[88rem] flex-col px-[var(--pad-x)] pb-12 pt-20 md:min-h-[100svh] md:justify-center md:pb-12 md:pt-24">
          <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_minmax(0,0.85fr)] lg:gap-16">
            <div>
              <p data-hero-rise className="font-mono text-sm text-[var(--color-leaf)] md:text-base">
                $ labflow --case-study
              </p>

              <h1
                data-hero-rise
                className="display mt-6 max-w-[20ch] text-[clamp(2.6rem,5.5vw,4.9rem)]"
              >
                A multi-tenant SaaS for diagnostic labs — designed and built end-to-end.
              </h1>

              <p data-hero-rise className="mt-5 font-mono text-sm tracking-[0.14em] text-[var(--color-sage)]">
                LAB-14/50 STORIES MERGED · CI GREEN
              </p>
              <p
                data-hero-rise
                className="mt-2 font-mono text-[0.68rem] tracking-[0.08em] text-[rgb(216_243_220/0.45)]"
              >
                SOURCE: GITHUB.COM/KAMRANDEBUGGING/LABFLOW — DEFAULT BRANCH, GITHUB ACTIONS RUNS
              </p>
            </div>

            <div data-hero-frame>
              <figure>
                <div className="border border-[rgb(82_183_136/0.22)] p-2">
                  <img
                    src={labflowImg}
                    alt="LabFlow cover card — interface design"
                    className="block w-full"
                    loading="eager"
                  />
                </div>
                <figcaption className="mt-3 font-mono text-[0.68rem] tracking-[0.1em] text-[rgb(216_243_220/0.45)]">
                  COVER CARD · INTERFACE DESIGN · NOT A LIVE PRODUCT SCREEN
                </figcaption>
              </figure>
            </div>
          </div>

          <dl data-hero-rise className="mt-10 max-w-[72rem] font-mono text-[0.82rem] leading-[1.9]">
            {META.map(([label, value]) => (
              <div key={label} className="flex gap-6 border-t border-[color:var(--line)] py-1">
                <dt className="w-20 shrink-0 tracking-[0.12em] text-[rgb(216_243_220/0.5)]">
                  {label}:
                </dt>
                <dd className="text-[rgb(216_243_220/0.9)]">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ============ S1 — Problem + the catch ============ */}
      <section className="tone-dark border-t border-[color:var(--line)]" data-tone="dark">
        <div className="mx-auto max-w-[88rem] px-[var(--pad-x)] py-24 md:py-32">
          <p data-fade className="eyebrow">
            01 / PROBLEM — AND THE CATCH
          </p>
          <h2 data-split className="display mt-6 max-w-[16ch] text-[clamp(2.2rem,4.5vw,3.75rem)]">
            Built to solve one flow. Two rules it can’t break.
          </h2>
          <hr data-line className="mt-8 border-0 h-px w-full bg-[rgb(82_183_136/0.3)]" />

          <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div data-fade className="max-w-[58ch]">
              <p className="font-mono text-[0.72rem] tracking-[0.14em] text-[var(--color-leaf)]">
                THE PROBLEM
              </p>
              <p className="mt-4 text-lg leading-relaxed md:text-xl">
                Requisitions arrive on paper. Samples travel without a chain of custody. Results
                come back as hand-signed PDFs that can’t be traced to the analyzer that produced
                them. LabFlow is built to turn that exact flow — registration, collection,
                analysis, approval, report — into one modelled pipeline.
              </p>
            </div>
            <div data-fade className="max-w-[58ch]">
              <p className="font-mono text-[0.72rem] tracking-[0.14em] text-[#fbbf24]">
                THE CATCH
              </p>
              <p className="mt-4 text-lg leading-relaxed md:text-xl">
                Patient data never crosses a tenant boundary — every query is scoped to one lab’s
                schema by construction. And the pathologist’s signature is a legal act: it is a
                timestamped approval on a result, not a stamp on a PDF. Every design decision
                downstream serves those two constraints.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ S2 — Signature scroll moment ============ */}
      <section className="tone-dark border-t border-[color:var(--line)]" data-tone="dark">
        <div
          ref={journey}
          className="mx-auto max-w-[88rem] px-[var(--pad-x)] py-14 md:flex md:h-[100svh] md:flex-col md:justify-center md:py-6 md:pt-16"
        >
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">02 / SIGNATURE MOMENT</p>
              <h2 className="display mt-2 text-[clamp(1.7rem,3.4vw,3rem)]">
                The journey of sample #A-4821
              </h2>
            </div>
            <p
              data-scroll-hint
              className="hidden font-mono text-[0.7rem] tracking-[0.2em] text-[rgb(216_243_220/0.5)] md:block"
            >
              SCROLL ▼
            </p>
          </div>
          <p className="mt-2 font-mono text-[0.66rem] leading-relaxed tracking-[0.06em] text-[rgb(216_243_220/0.45)]">
            DESIGNED PIPELINE · ARCHITECTURE DOCS · DEMO DATA — NOT A LIVE LOG
          </p>

          <div className="mt-6 grid gap-8 md:mt-[clamp(0.75rem,2.4vh,1.5rem)] md:grid-cols-[minmax(200px,280px)_1fr] md:gap-12 xl:gap-16">
            {/* Left: pipeline diagram (desktop only, holds while pinned) */}
            <div className="hidden md:block">
              <svg
                viewBox="0 0 300 560"
                className="mx-auto w-full max-w-[min(38vh,280px)]"
                role="img"
                aria-label="Pipeline diagram: registration, collection, result, approval, PDF report"
              >
                {NODE_Y.slice(0, -1).map((y, i) => (
                  <line
                    key={i}
                    data-connector
                    x1={24}
                    y1={y + 18}
                    x2={24}
                    y2={NODE_Y[i + 1] - 18}
                    stroke="rgba(82, 183, 136, 0.5)"
                    strokeWidth={1.5}
                    pathLength={100}
                    style={{ strokeDasharray: 100 }}
                  />
                ))}
                {NODE_Y.map((y, i) => (
                  <g key={i}>
                    <circle
                      data-node
                      cx={24}
                      cy={y}
                      r={15}
                      fill="transparent"
                      stroke="var(--color-leaf)"
                      strokeWidth={1.5}
                      pathLength={100}
                      style={{ strokeDasharray: 100 }}
                    />
                    <circle
                      data-node-dot
                      cx={24}
                      cy={y}
                      r={4}
                      fill="var(--color-leaf)"
                      style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                    />
                    <g data-node-label>
                      <text
                        x={56}
                        y={y - 2}
                        fill="var(--color-paper)"
                        fontSize={13}
                        style={{ fontFamily: 'var(--font-mono)' }}
                      >
                        {NODE_LABELS[i][0]}
                      </text>
                      <text
                        x={56}
                        y={y + 15}
                        fill="rgba(216, 243, 220, 0.5)"
                        fontSize={11}
                        style={{ fontFamily: 'var(--font-mono)' }}
                      >
                        {NODE_LABELS[i][1]}
                      </text>
                    </g>
                  </g>
                ))}
              </svg>
            </div>

            {/* Right: numbered beats with mono log lines. Phones: static stack. */}
            <ol className="flex flex-col gap-6 md:gap-[clamp(0.35rem,1.5vh,0.9rem)]">
              {BEATS.map((beat, i) => (
                <li
                  key={beat.num}
                  data-beat
                  className="border-t border-[color:var(--line)] pt-3 md:pt-[clamp(0.3rem,0.8vh,0.6rem)]"
                >
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                    <span className="font-mono text-sm text-[var(--color-leaf)]">{beat.num}</span>
                    <h3 className="display text-lg md:text-xl">{beat.title}</h3>
                    <span className="font-mono text-[0.62rem] tracking-[0.16em] text-[rgb(216_243_220/0.45)]">
                      {beat.point}
                    </span>
                  </div>
                  <p className="mt-1 max-w-[58ch] text-[0.8rem] leading-snug muted md:text-[0.82rem]">
                    {beat.desc}
                  </p>
                  <div className="mt-1.5 font-mono text-[0.7rem] leading-[1.6] md:text-[0.72rem]">
                    {beat.lines.map((line, j) => (
                      <p
                        key={j}
                        data-beat-line
                        data-beat-index={i}
                        className={lineToneClass(line.tone)}
                      >
                        {line.text}
                      </p>
                    ))}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ============ Scaffold footer (Part 1 of 3) ============ */}
      <footer className="tone-dark border-t border-[color:var(--line)]" data-tone="dark">
        <div className="mx-auto flex max-w-[88rem] flex-wrap items-center justify-between gap-4 px-[var(--pad-x)] py-10">
          <p className="font-mono text-[0.7rem] tracking-[0.12em] text-[rgb(216_243_220/0.5)]">
            PART 1 / 3 · S0–S2 SHIPPED · S3–S10 PENDING · SELF-DIRECTED SHOWCASE, NOT IN PRODUCTION
          </p>
          <Link
            to="/"
            className="font-mono text-[0.7rem] tracking-[0.12em] text-[var(--color-leaf)] hover:text-[var(--color-sage)]"
          >
            ← BACK TO HOME
          </Link>
        </div>
      </footer>
    </main>
  );
};

export default LabFlowCaseStudy;
