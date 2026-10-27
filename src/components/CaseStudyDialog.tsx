import React, { useEffect, useRef } from 'react';
import { X, ExternalLink, CheckCircle2, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CaseStudyDialogProps {
  projectId: 'labflow' | 'fbr-invoicing' | null;
  onClose: () => void;
  triggerElementRef?: React.RefObject<HTMLElement | null>;
}

export const CaseStudyDialog: React.FC<CaseStudyDialogProps> = ({
  projectId,
  onClose,
  triggerElementRef,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!projectId) return;

    // Save previous active element to restore focus on close
    const previousActiveElement = document.activeElement as HTMLElement | null;

    // Trap focus inside modal
    closeBtnRef.current?.focus();

    // Prevent background scrolling
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
      if (triggerElementRef?.current) {
        triggerElementRef.current.focus();
      } else if (previousActiveElement) {
        previousActiveElement.focus();
      }
    };
  }, [projectId, onClose, triggerElementRef]);

  if (!projectId) return null;

  const isLabFlow = projectId === 'labflow';

  const labFlowFlows = [
    'Patient registration and invoicing',
    'Samples with accession IDs',
    'Result entry validated against reference ranges',
    'Pathologist approval',
    'PDF reports',
    'Partner revenue-share',
  ];

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="case-study-title"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#08080a]/80 backdrop-blur-md"
          aria-hidden="true"
        />

        {/* Dialog Content */}
        <motion.div
          ref={dialogRef}
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-white/15 bg-[#111114] p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_30px_rgba(255,59,29,0.15)] text-[#f3f1ea]"
        >
          {/* Top accent glow */}
          <div
            className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#ff3b1d] to-transparent"
            aria-hidden="true"
          />

          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-[0.22em] text-[#ff3b1d] font-semibold">
                Case Study
              </span>
              <h3
                id="case-study-title"
                className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight text-[#f3f1ea]"
              >
                {isLabFlow ? 'LabFlow' : 'FBR-Integrated Invoicing System'}
              </h3>
            </div>

            <button
              ref={closeBtnRef}
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-[#807f78] hover:text-[#f3f1ea] hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-[#ff3b1d]"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="mt-6 space-y-6">
            {isLabFlow ? (
              <>
                <p className="text-base sm:text-lg text-[#807f78] leading-relaxed">
                  Multi-tenant SaaS for diagnostic labs in Pakistan. Built end-to-end covering patient registration, laboratory test validation workflows, and automated reporting.
                </p>

                {/* Real flows from live text */}
                <div>
                  <h4 className="text-xs uppercase tracking-[0.18em] text-[#f3f1ea] font-medium flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-4 h-4 text-[#ff3b1d]" />
                    Real System Flows:
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {labFlowFlows.map((flow, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-2.5 text-sm text-[#807f78] bg-white/[0.03] border border-white/5 rounded-lg px-3 py-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ff3b1d]" />
                        <span>{flow}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Stack */}
                <div className="pt-4 border-t border-white/10">
                  <h4 className="text-xs uppercase tracking-[0.18em] text-[#f3f1ea] font-medium flex items-center gap-2 mb-2">
                    <Layers className="w-4 h-4 text-[#ff3b1d]" />
                    Technical Architecture:
                  </h4>
                  <p className="font-mono text-xs sm:text-sm text-[#807f78] bg-[#08080a] p-3 rounded-lg border border-white/10 leading-relaxed">
                    Django 5 · DRF · React 18 + TypeScript · PostgreSQL 16 · Redis · Celery · Docker · Caddy · GitHub Actions
                  </p>
                </div>

                <div className="flex justify-end pt-2">
                  <a
                    href="https://github.com/kamrandebugging/LabFlow"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-2 text-sm font-medium text-[#ff3b1d] hover:underline"
                  >
                    View LabFlow Repository <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </>
            ) : (
              <>
                <p className="text-base sm:text-lg text-[#807f78] leading-relaxed">
                  Full-stack development on a live digital invoicing system integrated with FBR, in production use since 2025.
                </p>

                {/* Real scope from live text */}
                <div>
                  <h4 className="text-xs uppercase tracking-[0.18em] text-[#f3f1ea] font-medium flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-4 h-4 text-[#ff3b1d]" />
                    Scope of Work:
                  </h4>
                  <div className="bg-white/[0.03] border border-white/5 rounded-lg p-4 space-y-2">
                    <p className="text-sm text-[#807f78] leading-relaxed">
                      Integrated digital invoicing workflows compliant with regulatory standards, ensuring reliable real-time transaction processing and invoice validation.
                    </p>
                  </div>
                </div>

                {/* Stack */}
                <div className="pt-4 border-t border-white/10">
                  <h4 className="text-xs uppercase tracking-[0.18em] text-[#f3f1ea] font-medium flex items-center gap-2 mb-2">
                    <Layers className="w-4 h-4 text-[#ff3b1d]" />
                    Technical Architecture:
                  </h4>
                  <p className="font-mono text-xs sm:text-sm text-[#807f78] bg-[#08080a] p-3 rounded-lg border border-white/10 leading-relaxed">
                    Laravel · PHP · MySQL
                  </p>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CaseStudyDialog;
