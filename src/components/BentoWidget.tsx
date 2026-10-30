import React, { useEffect, useRef, useState } from 'react';

const isReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
  document.documentElement.dataset.motion === 'reduced';

/* ─────────────────────────────────────────────────────────────────
   CI Pipeline — LabFlow
   phase: 0=build running, 1=test running, 2=deploy running, 3=all done
───────────────────────────────────────────────────────────────── */
const STAGES = ['build', 'test', 'deploy'] as const;
const STAGE_DURATIONS = [1500, 1800, 1300];
const DONE_PAUSE = 2000;

const CIPipeline: React.FC = () => {
  const [phase, setPhase] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const visible = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const runStage = (stage: number) => {
      if (!visible.current) return;
      setPhase(stage);
      const dur = stage < STAGES.length ? STAGE_DURATIONS[stage] : DONE_PAUSE;
      timer.current = setTimeout(() => {
        if (!visible.current) return;
        const next = stage < STAGES.length ? stage + 1 : 0;
        runStage(next);
      }, dur);
    };

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          visible.current = true;
          if (isReducedMotion()) {
            setPhase(STAGES.length);
          } else {
            runStage(0);
          }
        } else {
          visible.current = false;
          if (timer.current) clearTimeout(timer.current);
        }
      },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => {
      visible.current = false;
      obs.disconnect();
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const stageStatus = (i: number) => {
    if (phase === STAGES.length) return 'done';
    if (phase > i) return 'done';
    if (phase === i) return 'running';
    return 'pending';
  };

  return (
    <div ref={ref} className="bento-pipeline" aria-hidden="true">
      <span className="bento-pipeline-label">CI / CD</span>
      <div className="bento-pipeline-track">
        {STAGES.map((stage, i) => {
          const status = stageStatus(i);
          return (
            <React.Fragment key={stage}>
              <div className={`bento-stage bento-stage--${status}`}>
                <span className={`bento-dot bento-dot--${status}`} />
                <span className="bento-stage-name">{stage}</span>
              </div>
              {i < STAGES.length - 1 && (
                <span
                  className={`bento-connector${stageStatus(i) === 'done' ? ' bento-connector--done' : ''}`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────
   Mini Terminal — FBR Invoicing
───────────────────────────────────────────────────────────────── */
const TERMINAL_LINES = [
  '$ deploy invoicing-api --env production',
  '> connected to FBR endpoint',
  '> status: live since 2025',
];

const Terminal: React.FC = () => {
  const [displayed, setDisplayed] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const active = useRef(false);
  const frame = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const tick = (li: number, ci: number, acc: string) => {
      if (!active.current) return;
      const line = TERMINAL_LINES[li];
      if (ci < line.length) {
        const next = acc + line[ci];
        setDisplayed(next);
        frame.current = setTimeout(() => tick(li, ci + 1, next), 32 + Math.random() * 24);
      } else if (li < TERMINAL_LINES.length - 1) {
        frame.current = setTimeout(() => {
          const withNL = acc + '\n';
          setDisplayed(withNL);
          tick(li + 1, 0, withNL);
        }, 520);
      } else {
        frame.current = setTimeout(() => {
          setDisplayed('');
          tick(0, 0, '');
        }, 3200);
      }
    };

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          active.current = true;
          if (isReducedMotion()) {
            setDisplayed(TERMINAL_LINES.join('\n'));
          } else {
            tick(0, 0, '');
          }
        } else {
          active.current = false;
          if (frame.current) clearTimeout(frame.current);
        }
      },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => {
      active.current = false;
      obs.disconnect();
      if (frame.current) clearTimeout(frame.current);
    };
  }, []);

  return (
    <div ref={ref} className="bento-terminal" aria-hidden="true">
      <div className="bento-terminal-bar">
        <span className="bento-wdot bento-wdot--r" />
        <span className="bento-wdot bento-wdot--y" />
        <span className="bento-wdot bento-wdot--g" />
        <span className="bento-terminal-title">deploy.sh</span>
      </div>
      <pre className="bento-terminal-body">
        {displayed}
        <span className="bento-cursor" aria-hidden="true">_</span>
      </pre>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────
   Count-up Stats — FundoraGlobal
   Numbers sourced directly from portfolio.ts:
     6  = stack count (Next.js · NestJS · TypeScript · PostgreSQL · Redis · Socket.IO)
     4  = modules count (onboarding, trading adapter, payments, admin dashboard)
───────────────────────────────────────────────────────────────── */
const FUNDORA_STATS = [
  { value: 6, label: 'technologies', suffix: '' },
  { value: 4, label: 'core modules', suffix: '' },
] as const;

const useCountUp = (target: number, active: boolean) => {
  const [val, setVal] = useState(0);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    if (!active) return;
    if (isReducedMotion()) { setVal(target); return; }
    const duration = 900;
    let start: number | null = null;
    const step = (ts: number) => {
      if (start === null) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(eased * target));
      if (p < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [active, target]);

  return val;
};

const StatCell: React.FC<{ value: number; label: string; suffix: string; active: boolean }> = ({
  value,
  label,
  suffix,
  active,
}) => {
  const n = useCountUp(value, active);
  return (
    <div className="bento-stat">
      <span className="bento-stat-value">
        {n}
        {suffix}
      </span>
      <span className="bento-stat-label">{label}</span>
    </div>
  );
};

const CountUpStats: React.FC = () => {
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setActive(true); },
      { threshold: 0.25 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="bento-stats" aria-hidden="true">
      {FUNDORA_STATS.map((s) => (
        <StatCell key={s.label} value={s.value} label={s.label} suffix={s.suffix} active={active} />
      ))}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────
   Export
───────────────────────────────────────────────────────────────── */
export type BentoId = 'labflow' | 'fbr-invoicing' | 'fundora-global';

export const BentoWidget: React.FC<{ id: BentoId }> = ({ id }) => {
  if (id === 'labflow') return <CIPipeline />;
  if (id === 'fbr-invoicing') return <Terminal />;
  if (id === 'fundora-global') return <CountUpStats />;
  return null;
};
