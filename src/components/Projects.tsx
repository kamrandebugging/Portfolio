import React, { useCallback, useRef, useState } from 'react';
import {
  gsap,
  ScrollTrigger,
  useGSAP,
  SCENES_ON,
  MOBILE_SCENES,
  MOTION_OK,
  motionMatchMedia,
} from '../engine/gsap';
import { portfolioData } from '../data/portfolio';
import { useReveals } from '../hooks/useReveals';
import { CaseStudyDialog } from './CaseStudyDialog';
import { ProjectCard } from './ProjectCard';
import { ProjectDialog } from './ProjectDialog';

type CSSVars = React.CSSProperties & Record<`--${string}`, string | number>;

const FEATURED = ['labflow', 'fbr-invoicing', 'fundora-global'];
type CaseStudyId = 'labflow' | 'fbr-invoicing';

export const Projects: React.FC = () => {
  const root = useRef<HTMLElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const previewImg = useRef<HTMLImageElement>(null);
  const labFlowBtn = useRef<HTMLButtonElement>(null);
  const fbrBtn = useRef<HTMLButtonElement>(null);
  const [caseStudy, setCaseStudy] = useState<CaseStudyId | null>(null);
  const [openMore, setOpenMore] = useState<number | null>(null);

  const { projects } = portfolioData;
  const featured = projects.filter((p) => FEATURED.includes(p.id));
  const more = projects.filter((p) => !FEATURED.includes(p.id));

  const closeMore = useCallback(() => setOpenMore(null), []);
  const prevMore = useCallback(
    () => setOpenMore((i) => (i === null ? i : (i - 1 + more.length) % more.length)),
    [more.length]
  );
  const nextMore = useCallback(
    () => setOpenMore((i) => (i === null ? i : (i + 1) % more.length)),
    [more.length]
  );

  useReveals(root);

  // Phones: no pinning (cards are taller than the screen), so each card is
  // scrubbed instead: it rises and settles as it enters, and its image drifts.
  useGSAP(
    () => {
      const mm = motionMatchMedia();
      mm.add(MOBILE_SCENES, () => {
        const sheets = gsap.utils.toArray<HTMLElement>('.psheet:not(.psheet--dialog)', root.current);
        sheets.forEach((sheet) => {
          gsap.fromTo(
            sheet,
            { y: 64, scale: 0.94, autoAlpha: 0.35 },
            {
              y: 0,
              scale: 1,
              autoAlpha: 1,
              ease: 'none',
              scrollTrigger: { trigger: sheet, start: 'top 97%', end: 'top 55%', scrub: true },
            }
          );
          const frame = sheet.querySelector<HTMLElement>('.pframe');
          const img = frame?.querySelector('img');
          if (frame && img) {
            gsap.fromTo(
              img,
              { yPercent: -5 },
              {
                yPercent: 5,
                ease: 'none',
                scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: true },
              }
            );
          }
        });
      });
    },
    { scope: root }
  );

  // The compact list rises in as a group, on every screen size.
  useGSAP(
    () => {
      const mm = motionMatchMedia();
      mm.add(MOTION_OK, () => {
        ScrollTrigger.batch('.mrow', {
          start: 'top 94%',
          once: true,
          onEnter: (rows) =>
            gsap.from(rows, { y: 26, autoAlpha: 0, duration: 0.9, ease: 'expo.out', stagger: 0.09 }),
        });
      });
    },
    { scope: root }
  );

  // Each stacked sheet recedes as the next one rises over it.
  useGSAP(
    () => {
      const mm = motionMatchMedia();
      mm.add(SCENES_ON, () => {
        const sheets = gsap.utils.toArray<HTMLElement>('.psheet');
        const triggers = sheets.slice(0, -1).map((sheet, i) =>
          ScrollTrigger.create({
            trigger: sheets[i + 1],
            start: 'top 85%',
            end: 'top 18%',
            onUpdate: (self) => sheet.style.setProperty('--cover', self.progress.toFixed(4)),
          })
        );
        return () => {
          triggers.forEach((t) => t.kill());
          sheets.forEach((s) => s.style.removeProperty('--cover'));
        };
      });
    },
    { scope: root }
  );

  // Cursor-following preview for the compact list (pointer devices only).
  useGSAP(
    () => {
      const mm = motionMatchMedia();
      mm.add('(hover: hover) and (pointer: fine)', () => {
        const box = preview.current;
        const img = previewImg.current;
        if (!box || !img) return;

        const xTo = gsap.quickTo(box, 'x', { duration: 0.55, ease: 'power3' });
        const yTo = gsap.quickTo(box, 'y', { duration: 0.55, ease: 'power3' });
        const rows = gsap.utils.toArray<HTMLElement>('.mrow');

        const onMove = (e: PointerEvent) => {
          xTo(e.clientX + 28);
          yTo(e.clientY - 90);
        };
        const onEnter = (e: PointerEvent) => {
          const src = (e.currentTarget as HTMLElement).dataset.image;
          if (!src) return;
          img.src = src;
          box.dataset.on = 'true';
        };
        const onLeave = () => {
          box.dataset.on = 'false';
        };

        rows.forEach((row) => {
          row.addEventListener('pointermove', onMove);
          row.addEventListener('pointerenter', onEnter);
          row.addEventListener('pointerleave', onLeave);
        });
        return () => {
          rows.forEach((row) => {
            row.removeEventListener('pointermove', onMove);
            row.removeEventListener('pointerenter', onEnter);
            row.removeEventListener('pointerleave', onLeave);
          });
          box.dataset.on = 'false';
        };
      });
    },
    { scope: root }
  );

  const openRow = (index: number) => {
    if (preview.current) preview.current.dataset.on = 'false';
    setOpenMore(index);
  };

  return (
    <section
      id="projects"
      ref={root}
      data-chapter="04"
      data-chapter-title="Projects"
      data-tone="dark"
      className="tone-forest px-[var(--pad-x)] pb-24 pt-28 md:pt-36"
    >
      <div className="mx-auto max-w-[88rem]">
        <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2 data-split className="display text-[clamp(3.25rem,8vw,8rem)]">
              Featured <em>Projects.</em>
            </h2>
          </div>
          <span data-fade className="font-sans text-xs tracking-wider muted">
            {projects.length} projects · 3 featured
          </span>
        </div>

        <div>
          {featured.map((project, index) => {
            const caseStudyUrl =
              project.id === 'labflow'
                ? '/projects/labflow'
                : project.id === 'fbr-invoicing'
                ? '/projects/fbr'
                : project.id === 'fundora-global'
                ? '/projects/fundoraglobal'
                : null;
            return (
              <article
                key={project.id}
                className={`psheet psheet-${index + 1}`}
                style={{ '--n': index } as CSSVars}
              >
                <ProjectCard
                  project={project}
                  eager={index === 0}
                  caseStudyUrl={caseStudyUrl}
                  onCaseStudy={
                    project.id === 'labflow' || project.id === 'fbr-invoicing'
                      ? () => setCaseStudy(project.id as CaseStudyId)
                      : undefined
                  }
                  caseStudyRef={
                    project.id === 'labflow' ? labFlowBtn : project.id === 'fbr-invoicing' ? fbrBtn : undefined
                  }
                />
              </article>
            );
          })}
        </div>

        <div className="mt-24">
          <div className="mb-6 flex items-center justify-between" data-fade>
            <h3 className="display text-2xl">More work</h3>
            <span className="font-sans text-xs tracking-wider muted">
              Hover to preview · click to open
            </span>
          </div>
          <ul>
            {more.map((project, i) => (
              <li key={project.id}>
                <button
                  type="button"
                  className="mrow"
                  data-image={project.image ?? ''}
                  data-cursor="Open"
                  aria-haspopup="dialog"
                  onClick={() => openRow(i)}
                >
                                    <span className="display text-[clamp(1.6rem,3vw,2.6rem)]">{project.name}</span>
                  <span className="text-sm muted">{project.cat}</span>
                  <span className="font-sans text-sm muted">
                    {project.outcome}
                  </span>
                </button>
              </li>
            ))}
            <li className="border-t border-[var(--line)]" aria-hidden="true" />
          </ul>
        </div>
      </div>

      <div ref={preview} className="mpreview" data-on="false" aria-hidden="true">
        <img ref={previewImg} alt="" />
      </div>

      <ProjectDialog
        project={openMore === null ? null : more[openMore]}
        position={(openMore ?? 0) + 1}
        total={more.length}
        onClose={closeMore}
        onPrev={prevMore}
        onNext={nextMore}
      />

      <CaseStudyDialog
        projectId={caseStudy}
        onClose={() => setCaseStudy(null)}
        triggerElementRef={caseStudy === 'labflow' ? labFlowBtn : fbrBtn}
      />
    </section>
  );
};

export default Projects;
