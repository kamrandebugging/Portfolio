import React, { useEffect, useRef, useState } from 'react';
import { Lock, Timer, ShieldCheck } from 'lucide-react';
import { useReveals } from '../../hooks/useReveals';

/** Architecture diagram — animated beam mechanism, demo-labelled stats. */

const LEDGER: [string, string, string][] = [
  ['Delivery, sample to WhatsApp', '21 min', 'demo walkthrough'],
  ['Tenant isolation', '0 leaks', 'schema-per-tenant'],
  ['PDF render', '420ms', 'WeasyPrint, headless'],
  ['Link validity', '7 days', 'signed, then expires'],
];

const DEEP_DIVE: { icon: React.ElementType; title: string; body: string }[] = [
  {
    icon: Lock,
    title: 'Tenant isolation',
    body: 'Every query is scoped to one lab’s schema by construction — there is no code path that can accidentally cross a tenant boundary.',
  },
  {
    icon: Timer,
    title: 'Caching for the render',
    body: 'WeasyPrint stylesheets and report templates are cached, so a PDF compiles in under half a second without spinning up a headless browser.',
  },
  {
    icon: ShieldCheck,
    title: 'Links expire',
    body: 'WhatsApp delivers a signed link to the PDF, not the file itself. It stops resolving after 7 days.',
  },
];

export const CaseStudyArchitecture: React.FC = () => {
  const root = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [paths, setPaths] = useState<string[]>([]);
  const [dims, setDims] = useState({ width: 0, height: 0 });
  useReveals(root);

  const EDGES: [string, string][] = [
    ['react', 'django'],
    ['django', 'postgres'],
    ['django', 'redis'],
    ['redis', 'weasy'],
    ['weasy', 'whatsapp'],
  ];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const measure = () => {
      const rect = container.getBoundingClientRect();
      setDims({ width: rect.width, height: rect.height });
      setPaths(
        EDGES.map(([fromId, toId]) => {
          const a = nodeRefs.current[fromId]?.getBoundingClientRect();
          const b = nodeRefs.current[toId]?.getBoundingClientRect();
          if (!a || !b) return '';
          const x1 = a.left - rect.left + a.width / 2;
          const y1 = a.top - rect.top + a.height / 2;
          const x2 = b.left - rect.left + b.width / 2;
          const y2 = b.top - rect.top + b.height / 2;
          return `M ${x1},${y1} Q ${(x1 + x2) / 2},${(y1 + y2) / 2} ${x2},${y2}`;
        })
      );
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(container);
    window.addEventListener('resize', measure);
    document.fonts?.ready.then(measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const nodes: { id: string; label: string; caption: string }[] = [
    { id: 'react', label: 'React 18', caption: 'Registration + billing UI' },
    { id: 'django', label: 'Django 5 / DRF', caption: 'API, validation, tenant routing' },
    { id: 'postgres', label: 'PostgreSQL 16', caption: 'One schema per tenant' },
    { id: 'redis', label: 'Redis / Celery', caption: 'Queues the report job' },
    { id: 'weasy', label: 'WeasyPrint', caption: 'HTML → signed PDF' },
    { id: 'whatsapp', label: 'WhatsApp', caption: '7-day link, then expires' },
  ];

  return (
    <section ref={root} className="labflow-cs tone-dark border-t border-[color:var(--line)]" data-tone="dark">
      <div className="mx-auto max-w-[72rem] px-[var(--pad-x)] py-20 md:py-28">
        <h2 data-split className="display max-w-[20ch] text-[clamp(2rem,4vw,3.25rem)]">
          How a request becomes a signed report.
        </h2>
        <p data-fade className="mt-4 max-w-[56ch] text-lg leading-relaxed muted">
          React talks to Django, which writes to Postgres and queues the report job — Celery renders the
          PDF and WhatsApp delivers the link.
        </p>

        <div data-fade className="mt-10 grid grid-cols-2 gap-3 rounded-xl border border-[color:var(--line)] p-3 md:grid-cols-4">
          {LEDGER.map(([label, value, sub]) => (
            <div key={label} className="rounded-lg p-3">
              <p className="text-xs uppercase tracking-wide text-[rgb(216_243_220/0.45)]">{label}</p>
              <p className="display mt-1 text-2xl text-[var(--color-leaf)]">{value}</p>
              <p className="font-mono text-[11px] text-[rgb(216_243_220/0.4)]">{sub} (demo)</p>
            </div>
          ))}
        </div>

        <div ref={containerRef} className="relative mt-10 rounded-xl border border-[color:var(--line)] p-6 md:p-10">
          <svg className="lf-arch-svg" width={dims.width || undefined} height={dims.height || undefined} aria-hidden="true">
            {paths.map((d, i) =>
              d ? <path key={i} className="lf-conduit-stream" d={d} fill="none" /> : null
            )}
          </svg>

          <div className="relative z-20 flex flex-col gap-8 md:gap-12">
            <div className="flex justify-center">
              <div
                ref={(el) => {
                  nodeRefs.current.react = el;
                }}
                className="w-full max-w-xs rounded-lg border border-[color:var(--line)] bg-[rgb(8_28_21/0.5)] p-4 text-center"
              >
                <p className="display text-lg">{nodes[0].label}</p>
                <p className="mt-1 text-sm muted">{nodes[0].caption}</p>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {[nodes[2], nodes[1], nodes[3]].map((node) => (
                <div
                  key={node.id}
                  ref={(el) => {
                    nodeRefs.current[node.id] = el;
                  }}
                  className={`rounded-lg border p-4 text-center ${node.id === 'django' ? 'border-[var(--color-leaf)] bg-[rgb(82_183_136/0.08)]' : 'border-[color:var(--line)] bg-[rgb(8_28_21/0.5)]'}`}
                >
                  <p className="display text-lg">{node.label}</p>
                  <p className="mt-1 text-sm muted">{node.caption}</p>
                </div>
              ))}
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="hidden md:block" />
              {[nodes[4], nodes[5]].map((node) => (
                <div
                  key={node.id}
                  ref={(el) => {
                    nodeRefs.current[node.id] = el;
                  }}
                  className="rounded-lg border border-[color:var(--line)] bg-[rgb(8_28_21/0.5)] p-4 text-center"
                >
                  <p className="display text-lg">{node.label}</p>
                  <p className="mt-1 text-sm muted">{node.caption}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {DEEP_DIVE.map((card) => (
            <div key={card.title} data-fade className="rounded-xl border border-[color:var(--line)] p-5">
              <card.icon className="h-5 w-5 text-[var(--color-leaf)]" aria-hidden="true" />
              <p className="display mt-3 text-lg">{card.title}</p>
              <p className="mt-1.5 text-sm leading-relaxed muted">{card.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CaseStudyArchitecture;
