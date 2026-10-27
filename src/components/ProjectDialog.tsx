import React, { useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import type { ProjectItem } from '../data/portfolio';
import { getLenis } from '../engine/scroll';
import { ProjectCard } from './ProjectCard';

interface ProjectDialogProps {
  project: ProjectItem | null;
  /** 1-based position among the projects the dialog can page through. */
  position: number;
  total: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

/** Sheet tones echo the stacked cards above (paper, mist, mint). */
const TONES = ['psheet-1', 'psheet-2', 'psheet-3'];

/**
 * Opens a "more work" project as the same card used for the three featured
 * projects. Arrow keys page between projects, Escape closes, focus returns
 * to the row that opened it.
 */
export const ProjectDialog: React.FC<ProjectDialogProps> = ({
  project,
  position,
  total,
  onClose,
  onPrev,
  onNext,
}) => {
  const closeBtn = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const isOpen = project !== null;

  useEffect(() => {
    if (!isOpen) return;

    opener.current = document.activeElement as HTMLElement | null;
    closeBtn.current?.focus();

    const lenis = getLenis();
    const previousOverflow = document.body.style.overflow;
    if (lenis) lenis.stop();
    else document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') onNext();
      else if (e.key === 'ArrowLeft') onPrev();
    };
    window.addEventListener('keydown', onKey);

    return () => {
      window.removeEventListener('keydown', onKey);
      if (lenis) lenis.start();
      else document.body.style.overflow = previousOverflow;
      opener.current?.focus();
    };
  }, [isOpen, onClose, onNext, onPrev]);

  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-[85] flex items-center justify-center overflow-y-auto p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-dialog-title"
      data-lenis-prevent
    >
      <div
        className="dialog-backdrop fixed inset-0 bg-ink/80 backdrop-blur-md"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="dialog-panel relative z-10 w-full max-w-[72rem]">
        <div className="mb-4 flex items-center justify-between gap-4 text-paper">
          <span className="font-mono text-xs uppercase tracking-[0.16em] text-paper/70">
            {String(position).padStart(2, '0')} / {String(total).padStart(2, '0')} · More work
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="btn !p-3"
              onClick={onPrev}
              aria-label="Previous project"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <button type="button" className="btn !p-3" onClick={onNext} aria-label="Next project">
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              ref={closeBtn}
              type="button"
              className="btn !py-3"
              onClick={onClose}
              aria-label="Close project"
            >
              Close
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        <article
          key={project.id}
          className={`psheet psheet--dialog ${TONES[(position - 1) % TONES.length]}`}
        >
          <ProjectCard project={project} eager headingId="project-dialog-title" />
        </article>
      </div>
    </div>
  );
};

export default ProjectDialog;
