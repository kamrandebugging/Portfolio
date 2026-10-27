import React, { useState, useRef } from 'react';
import { ExternalLink, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';
import { portfolioData, ProjectItem } from '../data/portfolio';
import { MagicCard } from './magicui/MagicCard';
import { CaseStudyDialog } from './CaseStudyDialog';
import { ScrollHeading } from './motion/ScrollReveal';

const FILTER_CHIPS = [
  'All',
  'Laravel',
  'Django / React',
  'Next.js / NestJS',
  'Vue',
  'GSAP / Three.js',
  'Python / ML',
] as const;

type FilterChip = (typeof FILTER_CHIPS)[number];

export const Projects: React.FC = () => {
  const { projects } = portfolioData;
  const [activeFilter, setActiveFilter] = useState<FilterChip>('All');
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<'labflow' | 'fbr-invoicing' | null>(null);

  // References for keyboard focus restoration
  const labFlowBtnRef = useRef<HTMLButtonElement>(null);
  const fbrBtnRef = useRef<HTMLButtonElement>(null);

  const matchesFilter = (project: ProjectItem, filter: FilterChip): boolean => {
    if (filter === 'All') return true;
    if (filter === 'Laravel') return project.id === 'fbr-invoicing' || project.id === 'examcraft-pro';
    if (filter === 'Django / React') return project.id === 'labflow';
    if (filter === 'Next.js / NestJS') return project.id === 'fundora-global';
    if (filter === 'Vue') return project.id === 'examcraft-pro';
    if (filter === 'GSAP / Three.js') return project.id === 'edgenexus-it';
    if (filter === 'Python / ML') return project.id === 'neuroscan-ai';
    return false;
  };

  const filteredProjects = projects.filter((p) => matchesFilter(p, activeFilter));

  const getFilterCount = (filter: FilterChip): number => {
    return projects.filter((p) => matchesFilter(p, filter)).length;
  };

  return (
    <section id="projects" className="relative px-6 sm:px-10 md:px-14 py-20 sm:py-28 border-b border-white/5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10 sm:mb-12">
        <div>
          <span className="eyebrow">Selected Projects</span>
          <ScrollHeading
            text={['Real work,', 'not demos.']}
            className="font-display uppercase tracking-tight text-4xl sm:text-6xl text-[#f3f1ea] mt-4 leading-[0.95]"
          />
        </div>
        <div className="text-[0.8125rem] font-mono uppercase tracking-[0.22em] text-[#807f78]">
          07 / Projects
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="mb-10 sm:mb-14 flex flex-wrap items-center gap-2 sm:gap-2.5" role="toolbar" aria-label="Project filter categories">
        {FILTER_CHIPS.map((chip) => {
          const isActive = activeFilter === chip;
          const count = getFilterCount(chip);
          return (
            <button
              key={chip}
              type="button"
              onClick={() => setActiveFilter(chip)}
              className={`rounded-full px-4 py-1.5 text-xs sm:text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                isActive
                  ? 'bg-[#ff3b1d] text-white shadow-[0_0_15px_rgba(255,59,29,0.45)]'
                  : 'bg-white/[0.03] text-[#807f78] border border-white/10 hover:border-white/25 hover:text-[#f3f1ea]'
              }`}
            >
              <span>{chip}</span>
              <span
                className={`text-[0.7rem] px-1.5 py-0.2 rounded-full font-mono ${
                  isActive ? 'bg-black/25 text-white' : 'bg-white/5 text-[#807f78]'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Bento Grid: LabFlow is FIRST and LARGEST (spanning grid), other 6 in exact order */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 items-stretch">
        {filteredProjects.map((project: ProjectItem) => {
          const isLabFlow = project.id === 'labflow';
          const isFBR = project.id === 'fbr-invoicing';
          const hasCaseStudy = isLabFlow || isFBR;

          return (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className={`h-full ${
                isLabFlow
                  ? 'col-span-1 md:col-span-2 lg:col-span-12'
                  : 'col-span-1 md:col-span-1 lg:col-span-6'
              }`}
            >
              <MagicCard className="h-full p-6 sm:p-8 flex flex-col justify-between">
                {isLabFlow ? (
                  /* Featured LabFlow Layout (spanning grid) */
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center h-full">
                    {/* Left text column */}
                    <div className="lg:col-span-7 flex flex-col justify-between h-full">
                      <div>
                        <div className="flex flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-[0.18em] text-[#807f78] mb-3">
                          <span className="px-2.5 py-0.5 rounded bg-[#ff3b1d]/15 text-[#ff3b1d] font-semibold border border-[#ff3b1d]/30">
                            {project.cat}
                          </span>
                          <div className="flex items-center gap-2 font-mono">
                            {project.year && <span>{project.year}</span>}
                            {project.year && <span className="text-white/20">·</span>}
                            <span className="text-[#ff3b1d]">{project.outcome}</span>
                          </div>
                        </div>

                        <h3 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[#f3f1ea] group-hover:text-[#ff3b1d] transition-colors duration-300">
                          {project.link ? (
                            <a
                              href={project.link}
                              target="_blank"
                              rel="noreferrer noopener"
                              className="inline-flex items-center gap-2.5 hover:underline"
                            >
                              {project.name}
                              <ExternalLink className="w-5 h-5 text-[#ff3b1d] inline-block opacity-80 group-hover:opacity-100" />
                            </a>
                          ) : (
                            project.name
                          )}
                        </h3>

                        <p className="mt-4 text-base sm:text-lg text-[#807f78] leading-relaxed max-w-2xl">
                          {project.blurb}
                        </p>
                      </div>

                      <div className="mt-8 pt-6 border-t border-white/10 space-y-4">
                        <p className="text-xs sm:text-sm font-mono text-[#f3f1ea]/90 leading-relaxed">
                          <span className="text-[#807f78] uppercase text-xs tracking-wider mr-2 font-sans font-semibold">
                            Stack:
                          </span>
                          {project.stack}
                        </p>

                        <div className="flex items-center gap-4 pt-1">
                          <button
                            ref={labFlowBtnRef}
                            type="button"
                            onClick={() => setSelectedCaseStudy('labflow')}
                            className="inline-flex items-center gap-2 rounded-lg bg-[#ff3b1d]/15 hover:bg-[#ff3b1d]/25 border border-[#ff3b1d]/40 px-4 py-2 text-xs sm:text-sm font-medium text-[#ff3b1d] transition-all duration-300"
                          >
                            <BookOpen className="w-4 h-4" />
                            <span>View case study</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Right image column: eager load for featured card */}
                    <div className="lg:col-span-5 w-full">
                      <div className="overflow-hidden rounded-lg border border-white/10 bg-[#08080a] aspect-[16/9] w-full transition-all duration-300 group-hover:border-[#ff3b1d]/40 group-hover:shadow-[0_0_25px_rgba(255,59,29,0.18)]">
                        {project.image && (
                          <img
                            src={project.image}
                            alt={`${project.name} preview`}
                            loading="eager"
                            className="w-full h-full object-contain object-center transition-all duration-300 group-hover:brightness-105"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Standard Bento Card Layout (other 6 projects in exact order) */
                  <div className="flex flex-col justify-between h-full">
                    <div>
                      {/* Category & Status */}
                      <div className="flex flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-[0.18em] text-[#807f78] mb-3">
                        <span>{project.cat}</span>
                        <div className="flex items-center gap-2 font-mono">
                          {project.year && <span>{project.year}</span>}
                          {project.year && <span className="text-white/20">·</span>}
                          <span className="text-[#ff3b1d]">{project.outcome}</span>
                        </div>
                      </div>

                      {/* Title & Initials Badge if FG */}
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#f3f1ea] group-hover:text-[#ff3b1d] transition-colors duration-300">
                          {project.link ? (
                            <a
                              href={project.link}
                              target="_blank"
                              rel="noreferrer noopener"
                              className="inline-flex items-center gap-2 hover:underline"
                            >
                              {project.name}
                              <ExternalLink className="w-4 h-4 text-[#ff3b1d] opacity-80 group-hover:opacity-100" />
                            </a>
                          ) : (
                            project.name
                          )}
                        </h3>
                        {project.initials === 'FG' && (
                          <span className="inline-flex items-center justify-center px-2 py-0.5 rounded text-xs font-semibold bg-[#ff3b1d]/15 text-[#ff3b1d] border border-[#ff3b1d]/30 font-mono tracking-wider">
                            FG
                          </span>
                        )}
                      </div>

                      {/* Image Preview with glow hover effect (no cropping) */}
                      {project.image && (
                        <div className="my-5 overflow-hidden rounded-lg border border-white/10 bg-[#08080a] aspect-[16/9] w-full transition-all duration-300 group-hover:border-[#ff3b1d]/40 group-hover:shadow-[0_0_25px_rgba(255,59,29,0.15)]">
                          <img
                            src={project.image}
                            alt={`${project.name} preview`}
                            loading="lazy"
                            className="w-full h-full object-contain object-center transition-all duration-300 group-hover:brightness-105"
                          />
                        </div>
                      )}

                      {/* Blurb */}
                      <p className="mt-3 text-sm sm:text-base text-[#807f78] leading-relaxed">
                        {project.blurb}
                      </p>
                    </div>

                    {/* Stack & Optional Case Study Button */}
                    <div className="mt-6 pt-5 border-t border-white/10 space-y-4">
                      <p className="text-xs sm:text-sm font-mono text-[#f3f1ea]/90 leading-relaxed">
                        <span className="text-[#807f78] uppercase text-xs tracking-wider mr-2 font-sans font-semibold">
                          Stack:
                        </span>
                        {project.stack}
                      </p>

                      {hasCaseStudy && (
                        <div className="pt-1">
                          <button
                            ref={fbrBtnRef}
                            type="button"
                            onClick={() => setSelectedCaseStudy('fbr-invoicing')}
                            className="inline-flex items-center gap-2 rounded-lg bg-[#ff3b1d]/15 hover:bg-[#ff3b1d]/25 border border-[#ff3b1d]/40 px-3.5 py-1.5 text-xs sm:text-sm font-medium text-[#ff3b1d] transition-all duration-300"
                          >
                            <BookOpen className="w-4 h-4" />
                            <span>View case study</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </MagicCard>
            </motion.div>
          );
        })}
      </div>

      {/* Case Study Dialog Modal */}
      <CaseStudyDialog
        projectId={selectedCaseStudy}
        onClose={() => setSelectedCaseStudy(null)}
        triggerElementRef={selectedCaseStudy === 'labflow' ? labFlowBtnRef : fbrBtnRef}
      />
    </section>
  );
};

export default Projects;
