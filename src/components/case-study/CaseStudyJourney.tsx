import React, { useRef } from 'react';
import { CheckCircle2, MessageCircle } from 'lucide-react';
import { gsap, ScrollTrigger, useGSAP } from '../../engine/gsap';
import { systemReducesMotion } from '../../engine/motion';
import { useReveals } from '../../hooks/useReveals';

/**
 * S0-S2 journey. One ScrollTrigger progress value pins the section and
 * drives the rail, the active step, and the document card mutating
 * (intake -> invoice -> signed PDF), with the WhatsApp bubble arriving
 * last. No pin on mobile — plain stacked flow.
 */

interface Step {
  id: string;
  title: string;
  desc: string;
}

const STEPS: Step[] = [
  { id: 'S0', title: 'Registration', desc: 'Patient and sample intake — one row, written into one tenant schema.' },
  { id: 'S1', title: 'Billing', desc: 'An invoice is raised against the same sample; payment status tracks alongside it.' },
  { id: 'S2', title: 'Report → WhatsApp', desc: 'Result validated, approved, rendered to PDF, and sent on WhatsApp.' },
];

const RAIL: [string, string][] = [
  ['09:41', 'Sample received'],
  ['09:43', 'Billed'],
  ['10:02', 'PDF rendered'],
  ['10:02', 'WhatsApp sent'],
];

const FACE_IDS = ['intake', 'invoice', 'report'] as const;
type FaceId = (typeof FACE_IDS)[number];
const SEGMENT_TO_STEP = [0, 1, 2, 2];

const field = (label: string, value: string) => (
  <div key={label}>
    <p className="font-mono text-[10px] uppercase tracking-wide text-[rgb(8_28_21/0.45)]">{label}</p>
    <p className="mt-0.5 font-semibold">{value}</p>
  </div>
);

const DocFace: React.FC<{ id: FaceId }> = ({ id }) => {
  if (id === 'intake') {
    return (
      <>
        <p className="display text-lg font-semibold text-[var(--color-forest)]">LabFlow</p>
        <p className="font-mono text-xs text-[rgb(8_28_21/0.5)]">New registration</p>
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          {field('Patient', 'Ayesha Khan (demo)')}
          {field('Sample', 'A-4821 · Blood (EDTA)')}
          {field('Tenant', 'citylab (demo)')}
          {field('Collected', '09:41')}
        </div>
      </>
    );
  }
  if (id === 'invoice') {
    return (
      <>
        <p className="display text-lg font-semibold text-[var(--color-forest)]">LabFlow</p>
        <p className="font-mono text-xs text-[rgb(8_28_21/0.5)]">Invoice · demo</p>
        <div className="mt-4 rounded bg-[rgb(8_28_21/0.04)] p-3 text-sm">
          <div className="flex items-center justify-between border-b border-dashed border-[rgb(8_28_21/0.12)] pb-2">
            <span>CBC panel — sample A-4821</span>
            <span className="font-semibold">Rs. 2,500</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[rgb(8_28_21/0.5)]">Status</span>
            <span className="font-semibold text-[var(--color-forest)]">Paid (demo)</span>
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      <p className="display text-lg font-semibold text-[var(--color-forest)]">LabFlow</p>
      <p className="font-mono text-xs text-[rgb(8_28_21/0.5)]">Signed report · demo</p>
      <div className="mt-4 flex flex-col gap-2 text-sm">
        {[
          ['Hemoglobin', '13.8 g/dL · normal'],
          ['WBC', '6.4 ×10⁹/L · normal'],
        ].map(([k, v]) => (
          <div key={k} className="flex items-center justify-between rounded bg-white/70 px-3 py-2">
            <span className="font-semibold">{k}</span>
            <span className="font-mono text-xs text-[rgb(8_28_21/0.6)]">{v}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-2 border-t border-[rgb(8_28_21/0.1)] pt-3">
        <CheckCircle2 className="h-5 w-5 text-[var(--color-forest)]" aria-hidden="true" />
        <span className="font-mono text-xs text-[var(--color-forest)]">Approved · pathologist on record (demo)</span>
      </div>
    </>
  );
};

export const CaseStudyJourney: React.FC = () => {
  const root = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<HTMLDivElement[]>([]);
  const dotRefs = useRef<HTMLSpanElement[]>([]);
  const faceIntake = useRef<HTMLDivElement>(null);
  const faceInvoice = useRef<HTMLDivElement>(null);
  const faceReport = useRef<HTMLDivElement>(null);
  const whatsapp = useRef<HTMLDivElement>(null);
  useReveals(root);

  useGSAP(
    () => {
      const rootEl = root.current;
      const pinEl = pin.current;
      const fillEl = fill.current;
      const faces = [faceIntake.current, faceInvoice.current, faceReport.current];
      const whatsappEl = whatsapp.current;
      if (!rootEl || !pinEl || !fillEl || faces.some((f) => !f) || !whatsappEl) return;

      gsap.set(fillEl, { xPercent: -50, scaleY: 0, transformOrigin: 'top center' });
      gsap.set(whatsappEl, { autoAlpha: 0, y: 24 });

      const setStage = (segment: number) => {
        const stepIdx = SEGMENT_TO_STEP[segment];
        stepRefs.current.forEach((el, i) => {
          if (el) el.dataset.active = String(i === stepIdx);
        });
        dotRefs.current.forEach((el, i) => {
          if (el) el.dataset.active = String(i <= segment);
        });
        const faceIdx = segment === 0 ? 0 : segment === 1 ? 1 : 2;
        faces.forEach((el, i) => {
          if (el) el.dataset.active = String(i === faceIdx);
        });
        gsap.to(whatsappEl, {
          autoAlpha: segment === 3 ? 1 : 0,
          y: segment === 3 ? 0 : 24,
          duration: 0.4,
          ease: 'power2.out',
        });
      };

      const mm = gsap.matchMedia();

      mm.add('(min-width: 1024px)', () => {
        if (systemReducesMotion()) {
          setStage(3);
          gsap.set(fillEl, { scaleY: 1 });
          return;
        }
        setStage(0);
        const st = ScrollTrigger.create({
          trigger: rootEl,
          start: 'top top',
          end: '+=280%',
          scrub: 0.6,
          pin: pinEl,
          pinSpacing: true,
          onUpdate: (self) => {
            gsap.set(fillEl, { scaleY: self.progress });
            setStage(Math.min(3, Math.floor(self.progress * 4)));
          },
        });
        return () => st.kill();
      });

      mm.add('(max-width: 1023px)', () => {
        setStage(3);
        gsap.set(fillEl, { scaleY: 1 });
        gsap.set(whatsappEl, { autoAlpha: 1, y: 0 });
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section ref={root} className="labflow-cs tone-dark border-t border-[color:var(--line)]" data-tone="dark">
      <div ref={pin} className="mx-auto max-w-[88rem] px-[var(--pad-x)] py-20 md:py-24">
        <h2 data-split className="display text-[clamp(2rem,4vw,3.25rem)]">
          Sample to signed report.
        </h2>
        <p data-fade className="mt-4 max-w-[52ch] text-lg leading-relaxed muted">
          A sample moves through three stages — registration, billing, and a signed report delivered on
          WhatsApp.
        </p>

        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:items-start">
          {/* Left column */}
          <div className="flex flex-col gap-3 lg:col-span-5">
            {STEPS.map((step, i) => (
              <div
                key={step.id}
                ref={(el) => {
                  if (el) stepRefs.current[i] = el;
                }}
                data-active={i === 0 ? 'true' : 'false'}
                className="relative border-t border-[color:var(--line)] py-4 opacity-40 transition-opacity duration-500 data-[active=true]:opacity-100"
              >
                <span className="block h-0.5 w-0 bg-[var(--color-leaf)] transition-[width] duration-500 data-[active=true]:w-9" />
                <span className="font-mono text-xs tracking-wide text-[var(--color-sage)]">{step.id}</span>
                <h3 className="display mt-1 text-xl md:text-2xl">{step.title}</h3>
                <p className="mt-1.5 max-w-[34ch] text-sm leading-relaxed muted">{step.desc}</p>
              </div>
            ))}

            <div className="relative mt-2 border-t border-[color:var(--line)] pb-1 pl-5 pt-4">
              <span className="absolute left-[3px] top-5 bottom-1 w-px bg-[rgb(216_243_220/0.15)]" aria-hidden="true" />
              <div
                ref={fill}
                className="absolute left-[3px] top-5 h-[calc(100%-1.25rem)] w-px bg-[var(--color-leaf)]"
                aria-hidden="true"
              />
              <div className="flex flex-col gap-3">
                {RAIL.map(([time, label], i) => (
                  <div key={time + label} className="relative flex items-center gap-3">
                    <span
                      ref={(el) => {
                        if (el) dotRefs.current[i] = el;
                      }}
                      data-active={i === 0 ? 'true' : 'false'}
                      className="absolute -left-5 h-1.5 w-1.5 rounded-full bg-[rgb(216_243_220/0.2)] transition-colors duration-300 data-[active=true]:bg-[var(--color-leaf)]"
                    />
                    <span className="font-mono text-xs text-[rgb(216_243_220/0.5)]">{time}</span>
                    <span className="text-sm muted">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column — mutating document card */}
          <div className="lg:col-span-7">
            <div className="lf-doc-card relative min-h-[22rem] rounded-xl">
              {FACE_IDS.map((id, i) => (
                <div
                  key={id}
                  ref={i === 0 ? faceIntake : i === 1 ? faceInvoice : faceReport}
                  data-active={i === 0 ? 'true' : 'false'}
                  className="absolute inset-0 p-6 opacity-0 transition-opacity duration-500 data-[active=true]:relative data-[active=true]:opacity-100 sm:p-8"
                >
                  <DocFace id={id} />
                </div>
              ))}
            </div>

            <div ref={whatsapp} className="mt-4 rounded-lg bg-[rgb(216_243_220/0.05)] p-5">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-[var(--color-leaf)]" aria-hidden="true" />
                <span className="font-mono text-xs text-[var(--color-sage)]">WhatsApp · demo</span>
              </div>
              <p className="mt-2 text-sm">
                Assalam-o-Alaikum <span className="font-semibold text-[var(--color-leaf)]">Ayesha Khan</span>.
                Your verified lab report is ready.
              </p>
              <p className="mt-1 font-mono text-xs text-[rgb(216_243_220/0.5)]">
                Signed link, valid 7 days — delivered 10:02
              </p>
            </div>

            <p className="mt-3 text-center font-mono text-[11px] uppercase tracking-wide text-[rgb(216_243_220/0.35)]">
              Mockup — demo data, not a live product screen
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CaseStudyJourney;
