import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, BookOpen } from 'lucide-react';
import type { ProjectItem } from '../data/portfolio';
import { Magnetic } from './ui/Magnetic';
import SkelImage from './ui/SkelImage';

interface ProjectCardProps {
  project: ProjectItem;
  /** First card loads its image eagerly. */
  eager?: boolean;
  /** Dedicated route link e.g. /projects/labflow */
  caseStudyUrl?: string | null;
  /** Present only for projects that have a case study (LabFlow, FBR). */
  onCaseStudy?: () => void;
  caseStudyRef?: React.Ref<HTMLButtonElement | HTMLAnchorElement>;
  /** Heading element id, used by dialogs for aria-labelledby. */
  headingId?: string;
}

/**
 * The two-column body shared by the stacked sheets and the "more work"
 * dialog: text on the left, image on the right. The parent supplies the
 * `.psheet` grid and background.
 */
export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  eager = false,
  caseStudyUrl,
  onCaseStudy,
  caseStudyRef,
  headingId,
}) => (
  <>
    <div className="flex h-full flex-col justify-between gap-8">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-[var(--fg-muted)]">
          <span>{project.cat}</span>
          <span>
            {project.year} · {project.outcome}
          </span>
        </div>
        <h3 id={headingId} className="display mt-6 text-[clamp(2.2rem,4.4vw,4.4rem)]">
          {project.name}
        </h3>
        <p className="mt-5 max-w-[34rem] leading-relaxed text-[var(--fg-muted)]">
          {project.blurb}
        </p>
      </div>

      <div>
        <ul className="flex flex-wrap gap-2">
          {project.stack.split(' · ').map((tech) => (
            <li key={tech} className="chip">
              {tech}
            </li>
          ))}
        </ul>
        {(caseStudyUrl || onCaseStudy || project.link) && (
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {caseStudyUrl ? (
              <Magnetic>
                <Link
                  ref={caseStudyRef as React.Ref<HTMLAnchorElement>}
                  to={caseStudyUrl}
                  className="btn btn-solid"
                  data-cursor="Open"
                >
                  <BookOpen className="h-4 w-4" aria-hidden="true" />
                  View case study
                </Link>
              </Magnetic>
            ) : onCaseStudy ? (
              <Magnetic>
                <button
                  ref={caseStudyRef as React.Ref<HTMLButtonElement>}
                  type="button"
                  className="btn btn-solid"
                  onClick={onCaseStudy}
                  data-cursor="Open"
                >
                  <BookOpen className="h-4 w-4" aria-hidden="true" />
                  View case study
                </button>
              </Magnetic>
            ) : null}
            {project.link && (
              <a
                className="btn"
                href={project.link}
                target="_blank"
                rel="noreferrer noopener"
                data-cursor="GitHub"
              >
                Repository
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            )}
          </div>
        )}
      </div>
    </div>

    {project.image && (
      <div className="pframe">
        <SkelImage
          src={project.image}
          alt={`${project.name} preview`}
          loading={eager ? 'eager' : 'lazy'}
          wrapperClassName="h-full w-full"
        />
      </div>
    )}
  </>
);

export default ProjectCard;
