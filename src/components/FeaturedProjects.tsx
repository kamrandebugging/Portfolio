import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { portfolioData, type ProjectItem } from '../data/portfolio';
import { useReveals } from '../hooks/useReveals';
import { ScrollTrigger, useGSAP } from '../engine/gsap';
import SkelImage from './ui/SkelImage';

/** Maps a homepage project id to its dedicated case-study route. */
const ROUTES: Partial<Record<ProjectItem['id'], string>> = {
  labflow: '/projects/labflow',
  'fbr-invoicing': '/projects/fbr',
  'fundora-global': '/projects/fundoraglobal',
};

const ORDER: ProjectItem['id'][] = ['labflow', 'fbr-invoicing', 'fundora-global'];

export const FeaturedProjects: React.FC = () => {
  const root = useRef<HTMLElement>(null);
  useReveals(root);

  // Not registered with ProgressPill's chapter system (no data-chapter — this
  // site's existing 01/02/03 chapter numbers are a pre-existing pattern this
  // new section deliberately doesn't repeat); it still hands the nav/pill
  // their light tone while in view, the same way a chaptered section would.
  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const docEl = document.documentElement;
      const navTrigger = ScrollTrigger.create({
        trigger: el,
        start: 'top 6%',
        end: 'bottom 6%',
        onToggle: (self) => {
          if (self.isActive) docEl.dataset.navTone = 'light';
        },
      });
      const pillTrigger = ScrollTrigger.create({
        trigger: el,
        start: 'top 92%',
        end: 'bottom 92%',
        onToggle: (self) => {
          if (self.isActive) docEl.dataset.pillTone = 'light';
        },
      });
      return () => {
        navTrigger.kill();
        pillTrigger.kill();
      };
    },
    { scope: root }
  );

  const featured = ORDER.map((id) => portfolioData.projects.find((p) => p.id === id)).filter(
    (p): p is ProjectItem => Boolean(p)
  );

  return (
    <section
      ref={root}
      id="featured-projects"
      data-tone="light"
      className="tone-light px-[var(--pad-x)] py-28 md:py-36"
    >
      <div className="mx-auto max-w-[88rem]">
        <h2 data-split className="display max-w-[14ch] text-[clamp(3rem,7vw,7rem)]">
          Featured Projects.
        </h2>

        <div className="mt-16 flex flex-col gap-6">
          {featured.map((project, i) => {
            const to = ROUTES[project.id];
            if (!to) return null;
            const reverse = i % 2 === 1;
            return (
              <Link
                key={project.id}
                to={to}
                data-fade
                data-cursor="View"
                className="group grid items-center gap-10 rounded-[1.5rem] px-6 py-14 md:grid-cols-2 md:gap-16"
                style={
                  i % 2 === 1
                    ? { background: 'color-mix(in srgb, var(--color-ink) 4%, transparent)' }
                    : undefined
                }
              >
                {project.image && (
                  <div
                    className={`overflow-hidden rounded-[1.25rem] ${reverse ? 'md:order-2' : ''}`}
                  >
                    <SkelImage
                      src={project.image}
                      alt={`${project.name} preview`}
                      loading={i === 0 ? 'eager' : 'lazy'}
                      wrapperClassName="aspect-[4/3] w-full"
                      imgClassName="transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>
                )}
                <div className={reverse ? 'md:order-1' : ''}>
                  <span className="text-sm muted">{project.cat}</span>
                  <h3 className="display mt-4 text-[clamp(2rem,4vw,3.25rem)]">{project.name}</h3>
                  <p className="mt-5 max-w-[42ch] text-lg leading-relaxed muted">{project.blurb}</p>
                  <span className="mt-7 inline-flex items-center gap-2 text-base font-medium text-[var(--accent)]">
                    View case study
                    <ArrowUpRight
                      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                      aria-hidden="true"
                    />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects;
