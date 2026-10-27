import React, { useEffect, useRef } from 'react';
import { X, ExternalLink, CheckCircle2, Layers } from 'lucide-react';
import { getLenis } from '../engine/scroll';

interface CaseStudyDialogProps {
  projectId: 'labflow' | 'fbr-invoicing' | null;
  onClose: () => void;
  triggerElementRef?: React.RefObject<HTMLElement | null>;
}

const LABFLOW_FLOWS = [
  'Patient registration and invoicing',
  'Samples with accession IDs',
  'Result entry validated against reference ranges',
  'Pathologist approval',
  'PDF reports',
  'Partner revenue-share',
];

export const CaseStudyDialog: React.FC<CaseStudyDialogProps> = ({
  projectId,
  onClose,
  triggerElementRef,
}) => {
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!projectId) return;

    const previousActive = document.activeElement as HTMLElement | null;
    closeBtnRef.current?.focus();

    const lenis = getLenis();
    const originalOverflow = document.body.style.overflow;
    if (lenis) lenis.stop();
    else document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      if (lenis) lenis.start();
      else document.body.style.overflow = originalOverflow;
      (triggerElementRef?.current ?? previousActive)?.focus();
    };
  }, [projectId, onClose, triggerElementRef]);

  if (!projectId) return null;
  const isLabFlow = projectId === 'labflow';

  return (
    <div
      className="fixed inset-0 z-[85] flex items-center justify-center overflow-y-auto p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-study-title"
      data-lenis-prevent
    >
      <div
        className="dialog-backdrop fixed inset-0 bg-ink/80 backdrop-blur-md"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="dialog-panel tone-light relative z-10 w-full max-w-2xl rounded-3xl p-6 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.8)] sm:p-9">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="eyebrow">Case study</span>
            <h3 id="case-study-title" className="display mt-3 text-[clamp(2rem,4vw,3rem)]">
              {isLabFlow ? 'LabFlow' : 'FBR-Integrated Invoicing System'}
            </h3>
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            className="rounded-full p-2 transition-colors hover:bg-ink/10"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-7 space-y-7">
          {isLabFlow ? (
            <>
              <p className="muted text-lg leading-relaxed">
                Multi-tenant SaaS for diagnostic labs in Pakistan. Built end-to-end covering patient
                registration, laboratory test validation workflows, and automated reporting.
              </p>

              <div>
                <h4 className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em]">
                  <CheckCircle2 className="h-4 w-4 text-pine" aria-hidden="true" />
                  Real system flows
                </h4>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {LABFLOW_FLOWS.map((flow) => (
                    <li
                      key={flow}
                      className="flex items-center gap-2.5 rounded-xl border border-ink/10 bg-ink/[0.03] px-3 py-2 text-sm"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-pine" />
                      {flow}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-ink/10 pt-6">
                <h4 className="mb-2 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em]">
                  <Layers className="h-4 w-4 text-pine" aria-hidden="true" />
                  Technical architecture
                </h4>
                <p className="rounded-xl bg-ink p-3.5 font-mono text-xs leading-relaxed text-paper sm:text-sm">
                  Django 5 · DRF · React 18 + TypeScript · PostgreSQL 16 · Redis · Celery · Docker ·
                  Caddy · GitHub Actions
                </p>
              </div>

              <div className="flex justify-end">
                <a
                  href="https://github.com/kamrandebugging/LabFlow"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-2 text-sm font-medium underline underline-offset-4"
                >
                  View LabFlow repository <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </>
          ) : (
            <>
              <p className="muted text-lg leading-relaxed">
                Full-stack development on a live digital invoicing system integrated with FBR, in
                production use since 2025.
              </p>

              <div>
                <h4 className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em]">
                  <CheckCircle2 className="h-4 w-4 text-pine" aria-hidden="true" />
                  Scope of work
                </h4>
                <p className="rounded-xl border border-ink/10 bg-ink/[0.03] p-4 text-sm leading-relaxed">
                  Integrated digital invoicing workflows compliant with regulatory standards,
                  ensuring reliable real-time transaction processing and invoice validation.
                </p>
              </div>

              <div className="border-t border-ink/10 pt-6">
                <h4 className="mb-2 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em]">
                  <Layers className="h-4 w-4 text-pine" aria-hidden="true" />
                  Technical architecture
                </h4>
                <p className="rounded-xl bg-ink p-3.5 font-mono text-xs text-paper sm:text-sm">
                  Laravel · PHP · MySQL
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaseStudyDialog;
