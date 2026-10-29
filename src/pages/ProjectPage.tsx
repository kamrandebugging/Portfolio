import React, { useEffect, useRef } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Mail } from 'lucide-react';
import { caseStudies, type CaseStudy } from '../data/caseStudies';
import { portfolioData } from '../data/portfolio';
import { useReveals } from '../hooks/useReveals';
import { gsap, ScrollTrigger, useGSAP, MOTION_OK, motionMatchMedia } from '../engine/gsap';
import { LabFlowProblemCards } from '../components/LabFlowProblemCards';
import { LabFlowFlowStage } from '../components/LabFlowFlowStage';
import { TiltCard } from '../components/ui/TiltCard';

const isSlug = (value: string | undefined): value is CaseStudy['slug'] =>
  value === 'labflow' || value === 'fbr' || value === 'fundoraglobal';

export const ProjectPage: React.FC = () => {
  const { slug } = useParams();
  const root = useRef<HTMLElement>(null);
  const hero = useRef<HTMLDivElement>(null);
  useReveals(root);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => window.cancelAnimationFrame(id);
  }, [slug]);

  // Hero entrance: the background punches in first (big scale-down slam),
  // headline/copy/buttons rise in hard and fast right behind it. Then a
  // slow scroll-linked drift on the image for the rest of the section.
  useGSAP(
    () => {
      const el = hero.current;
      if (!el) return;
      const mm = motionMatchMedia();
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
        tl.from(el.querySelector('.hero-cs-media'), {
          scale: 1.35,
          autoAlpha: 0,
          duration: 1,
          ease: 'power4.out',
        })
          .from(
            el.querySelectorAll('.hero-rise'),
            { y: 60, scale: 0.92, autoAlpha: 0, duration: 0.65, stagger: 0.07 },
            '-=0.55'
          )
          .from(
            el.querySelectorAll('.hero-btn'),
            { y: 20, autoAlpha: 0, scale: 0.8, duration: 0.5, stagger: 0.08, ease: 'back.out(2.2)' },
            '-=0.3'
          );

        const img = el.querySelector<HTMLElement>('.hero-cs-bg');
        if (img) {
          gsap.to(img, {
            yPercent: 10,
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
          });
        }
      });
    },
    { scope: hero, dependencies: [slug] }
  );

  // ProgressPill (the component that normally drives --ui-fg per section)
  // only lives on Home; without it the nav keeps whatever colour Home last
  // left it in. Each [data-tone] section here takes over that job itself.
  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const docEl = document.documentElement;
      docEl.dataset.navTone = 'dark';
      const triggers = gsap.utils.toArray<HTMLElement>('[data-tone]', el).map((section) =>
        ScrollTrigger.create({
          trigger: section,
          start: 'top 6%',
          end: 'bottom 6%',
          onToggle: (self) => {
            if (self.isActive) docEl.dataset.navTone = section.dataset.tone;
          },
        })
      );
      return () => {
        triggers.forEach((t) => t.kill());
        docEl.dataset.navTone = 'dark';
      };
    },
    { scope: root, dependencies: [slug] }
  );

  if (!isSlug(slug)) return <Navigate to="/" replace />;
  const study = caseStudies[slug];

  return (
    <main ref={root}>
      {/* ---------- Hero ---------- */}
      <section ref={hero} className="hero-cs tone-dark" data-tone="dark">
        <TiltCard max={4} className="hero-cs-media">
          <img className="hero-cs-bg" src={study.image} alt="" aria-hidden="true" loading="eager" />
        </TiltCard>
        <div className="hero-cs-scrim" aria-hidden="true" />

        <div className="hero-cs-content px-[var(--pad-x)]">
          <div className="mx-auto max-w-[72rem]">
            <Link
              to="/"
              className="hero-rise inline-flex items-center gap-2 text-base font-medium transition-colors hover:text-[var(--accent)]"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to home
            </Link>

            <h1 className="hero-rise display mt-8 text-[clamp(3rem,8vw,7.5rem)]">{study.name}</h1>
            <p className="hero-rise mt-6 max-w-[48ch] text-lg leading-relaxed muted md:text-xl">
              {study.tagline}
            </p>
            <p className="hero-rise mt-6 max-w-[56ch] text-base leading-relaxed">
              <strong className="text-[var(--accent)]">Status.</strong> {study.status}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              {study.links.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="hero-btn btn"
                  data-cursor="Open"
                >
                  <span>{link.label}</span>
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </a>
              ))}
              <a href="#contact-cta" className="hero-btn btn btn-solid" data-cursor="Email">
                <span>Get in touch</span>
                <Mail className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- The problem / Why LabFlow exists ---------- */}
      {slug === 'labflow' ? (
        <LabFlowProblemCards />
      ) : (
        <section className="tone-light px-[var(--pad-x)] py-24 md:py-32" data-tone="light">
          <div className="mx-auto grid max-w-[72rem] gap-10 md:grid-cols-[1fr_1.4fr]">
            <h2 data-split className="display text-[clamp(2rem,4vw,3.25rem)]">
              The problem.
            </h2>
            <p data-fade className="text-lg leading-relaxed md:text-xl">
              {study.problem}
            </p>
          </div>
        </section>
      )}

      {/* ---------- What was built (other case studies) ---------- */}
      {slug !== 'labflow' && study.built && (
        <section className="tone-forest px-[var(--pad-x)] py-24 md:py-32" data-tone="dark">
          <div className="mx-auto max-w-[72rem]">
            <h2 data-split className="display max-w-[20ch] text-[clamp(2.25rem,5vw,4rem)]">
              What was built.
            </h2>
            <ul className="mt-14 grid gap-10 md:grid-cols-2 md:gap-x-14 md:gap-y-12">
              {study.built.map((item) => (
                <li key={item} data-fade className="text-lg leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ---------- Architecture / flow ---------- */}
      {slug === 'labflow' ? (
        <section className="px-[var(--pad-x)] py-24 md:py-32">
          <div className="mx-auto max-w-[88rem]">
            <h2 data-split className="display max-w-[22ch] text-[clamp(2.25rem,5vw,4rem)]">
              How it fits together.
            </h2>
            <p data-fade className="mt-5 max-w-[60ch] text-lg leading-relaxed muted">
              The patient-to-report flow, exactly as it&rsquo;s modelled in the schema.
            </p>
          </div>
          <div className="mx-auto mt-14 max-w-[88rem]">
            <LabFlowFlowStage />
          </div>
        </section>
      ) : (
        <section className="tone-dark px-[var(--pad-x)] py-24 md:py-32" data-tone="dark">
          <div className="mx-auto max-w-[72rem]">
            <h2 data-split className="display max-w-[22ch] text-[clamp(2.25rem,5vw,4rem)]">
              How it fits together.
            </h2>
            <ol className="mt-14 grid gap-x-12 gap-y-10 md:grid-cols-2">
              {study.architecture.map((step) => (
                <li key={step.title} data-fade className="list-decimal pl-6 marker:text-[var(--accent)]">
                  <h3 className="display text-[clamp(1.3rem,2.2vw,1.8rem)]">{step.title}</h3>
                  <p className="mt-3 leading-relaxed muted">{step.desc}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* ---------- Stack ---------- */}
      <section className="tone-light px-[var(--pad-x)] py-20 md:py-28" data-tone="light">
        <div className="mx-auto max-w-[72rem]">
          <h2 data-split className="display text-[clamp(1.8rem,3.4vw,2.6rem)]">
            Real stack.
          </h2>
          <div data-fade className="mt-8 flex flex-wrap gap-3">
            {study.stack.map((tech) => (
              <span
                key={tech}
                className="rounded-full px-4 py-2 text-sm"
                style={{ background: 'color-mix(in srgb, var(--accent) 16%, transparent)' }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Key features ---------- */}
      {study.features && study.features.length > 0 && (
        <section className="tone-forest px-[var(--pad-x)] py-24 md:py-32" data-tone="dark">
          <div className="mx-auto max-w-[72rem]">
            <h2 data-split className="display max-w-[20ch] text-[clamp(2.25rem,5vw,4rem)]">
              Key features.
            </h2>
            <div className="mt-14 flex flex-col gap-3">
              {study.features.map((feature, i) => (
                <div
                  key={feature.title}
                  data-fade
                  className="grid gap-3 rounded-[1.25rem] px-7 py-9 md:grid-cols-[1fr_1.6fr] md:gap-10"
                  style={
                    i % 2 === 1
                      ? { background: 'color-mix(in srgb, var(--color-paper) 6%, transparent)' }
                      : undefined
                  }
                >
                  <h3 className="display text-[clamp(1.4rem,2.4vw,2rem)]">{feature.title}</h3>
                  <p className="leading-relaxed muted">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------- Close ---------- */}
      <section id="contact-cta" className="tone-dark px-[var(--pad-x)] py-28 md:py-36" data-tone="dark">
        <div className="mx-auto flex max-w-[72rem] flex-col items-start gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 data-split className="display max-w-[16ch] text-[clamp(2.5rem,6vw,5rem)]">
              Have a project like this?
            </h2>
            <p data-fade className="mt-6 max-w-[48ch] text-lg leading-relaxed muted">
              {portfolioData.contact.lead}
            </p>
          </div>
          <div data-fade className="flex flex-wrap items-center gap-3">
            <a href={`mailto:${portfolioData.contact.email}`} className="btn btn-solid" data-cursor="Email">
              <span>{portfolioData.contact.email}</span>
              <Mail className="h-4 w-4" aria-hidden="true" />
            </a>
            <Link to="/" className="btn" data-cursor="Open">
              <span>Back to home</span>
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ProjectPage;
