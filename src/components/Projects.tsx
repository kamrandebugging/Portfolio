import React from 'react';
import { ExternalLink } from 'lucide-react';
import { portfolioData, ProjectItem } from '../data/portfolio';

export const Projects: React.FC = () => {
  const { projects } = portfolioData;

  return (
    <section id="projects" className="relative px-6 sm:px-10 md:px-14 py-20 sm:py-28 border-b border-white/5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-16 sm:mb-20">
        <div>
          <span className="eyebrow">Selected Projects</span>
          <h2 className="font-display uppercase tracking-tight text-4xl sm:text-6xl text-[#f3f1ea] mt-4 leading-[0.95]">
            Real work, <br />
            not demos.
          </h2>
        </div>
        <div className="text-[0.8125rem] font-mono uppercase tracking-[0.22em] text-[#807f78]">
          07 / Projects
        </div>
      </div>

      {/* Projects List: Consistent Row Rhythm */}
      <div className="space-y-12 sm:space-y-16">
        {projects.map((project: ProjectItem) => (
          <article
            key={project.id}
            className="group relative rounded-lg border border-white/10 bg-[#111114]/40 p-6 sm:p-8 md:p-10 transition-all duration-300 hover:border-white/20 hover:bg-[#111114]/70"
          >
            {project.image ? (
              /* Projects WITH real image: 2-column layout on desktop, stacked on mobile */
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
                {/* Text column */}
                <div className="md:col-span-7 flex flex-col justify-between">
                  <div>
                    {/* Category & Status */}
                    <div className="flex flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-[0.18em] text-[#807f78] mb-3">
                      <span>{project.cat}</span>
                      <div className="flex items-center gap-2">
                        {project.year && <span>{project.year}</span>}
                        {project.year && <span className="text-white/20">·</span>}
                        <span className="font-medium text-[#ff3b1d]">{project.outcome}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-[#f3f1ea] group-hover:text-[#ff3b1d] transition-colors duration-300">
                        {project.link ? (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="inline-flex items-center gap-2 hover:underline"
                          >
                            {project.name}
                            <ExternalLink className="w-5 h-5 text-[#ff3b1d] inline-block opacity-80 group-hover:opacity-100 transition-opacity" />
                          </a>
                        ) : (
                          project.name
                        )}
                      </h3>
                      {project.initials === 'FG' && (
                        <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded text-xs font-semibold bg-[#ff3b1d]/15 text-[#ff3b1d] border border-[#ff3b1d]/30 font-mono tracking-wider">
                          FG
                        </span>
                      )}
                    </div>

                    {/* Blurb */}
                    <p className="mt-4 text-base sm:text-lg text-[#807f78] leading-relaxed">
                      {project.blurb}
                    </p>
                  </div>

                  {/* Stack */}
                  <div className="mt-6 pt-5 border-t border-white/10">
                    <p className="text-xs sm:text-sm font-mono text-[#f3f1ea]/90 leading-relaxed">
                      <span className="text-[#807f78] uppercase text-xs tracking-wider mr-2 font-sans font-semibold">
                        Stack:
                      </span>
                      {project.stack}
                    </p>
                  </div>
                </div>

                {/* Image column */}
                <div className="md:col-span-5 w-full">
                  <div className="image-glow-container aspect-[16/10] w-full">
                    <img
                      src={project.image}
                      alt={`${project.name} preview`}
                      loading="lazy"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                </div>
              </div>
            ) : (
              /* Project WITHOUT image (FundoraGlobal): Collapses image area completely! Card height equals text height! */
              <div className="w-full flex flex-col justify-between">
                <div>
                  {/* Category & Status */}
                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-[0.18em] text-[#807f78] mb-3">
                    <span>{project.cat}</span>
                    <span className="font-medium text-[#ff3b1d]">{project.outcome}</span>
                  </div>

                  {/* Title with inline FG badge */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-[#f3f1ea] group-hover:text-[#ff3b1d] transition-colors duration-300">
                      {project.name}
                    </h3>
                    <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-md text-xs font-semibold bg-[#ff3b1d]/15 text-[#ff3b1d] border border-[#ff3b1d]/30 font-mono tracking-wider">
                      {project.initials}
                    </span>
                  </div>

                  {/* Blurb */}
                  <p className="mt-4 text-base sm:text-lg text-[#807f78] leading-relaxed max-w-4xl">
                    {project.blurb}
                  </p>
                </div>

                {/* Stack */}
                <div className="mt-6 pt-5 border-t border-white/10">
                  <p className="text-xs sm:text-sm font-mono text-[#f3f1ea]/90 leading-relaxed">
                    <span className="text-[#807f78] uppercase text-xs tracking-wider mr-2 font-sans font-semibold">
                      Stack:
                    </span>
                    {project.stack}
                  </p>
                </div>
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
};
