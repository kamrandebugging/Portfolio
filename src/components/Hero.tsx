import React, { useRef } from 'react';
import { ArrowDown } from 'lucide-react';
import {
  gsap,
  ScrollTrigger,
  SplitText,
  useGSAP,
  MOTION_OK,
  SCENES_ON,
  MOBILE_SCENES,
  motionMatchMedia,
} from '../engine/gsap';
import { scrollToTarget } from '../engine/scroll';
import { portfolioData } from '../data/portfolio';
import { Magnetic } from './ui/Magnetic';
import { LocalTime } from './ui/LocalTime';

export const Hero: React.FC = () => {
  const root = useRef<HTMLElement>(null);
  const { personal } = portfolioData;

  // --cover drives the hero's recede. Tablets and up: the About sheet slides
  // over the pinned hero. Phones: the hero itself scrolls away, so the cover
  // is its own exit progress and the portrait/copy drift apart.
  useGSAP(
    () => {
      const hero = root.current;
      if (!hero) return;
      const mm = motionMatchMedia();

      mm.add(SCENES_ON, () => {
        const about = document.getElementById('about');
        if (!about) return;
        const trigger = ScrollTrigger.create({
          trigger: about,
          start: 'top bottom',
          end: 'top top',
          onUpdate: (self) => hero.style.setProperty('--cover', self.progress.toFixed(4)),
        });
        return () => {
          trigger.kill();
          hero.style.removeProperty('--cover');
        };
      });

      mm.add(MOBILE_SCENES, () => {
        const trigger = ScrollTrigger.create({
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          onUpdate: (self) => hero.style.setProperty('--cover', self.progress.toFixed(4)),
        });
        return () => {
          trigger.kill();
          hero.style.removeProperty('--cover');
        };
      });
    },
    { scope: root }
  );

  // Immediate hero choreography on load
  useGSAP(
    () => {
      const mm = motionMatchMedia();
      mm.add(MOTION_OK, () => {
        const q = gsap.utils.selector(root);
        const title = q('[data-title]')[0];
        const parts = q('[data-intro]');
        const portrait = q('[data-portrait]');

        gsap.set(title, { autoAlpha: 1 });
        const split = SplitText.create(title, {
          type: 'lines',
          mask: 'lines',
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, { yPercent: 115, duration: 1.1, ease: 'expo.out', stagger: 0.1 }),
        });
        gsap.fromTo(
          parts,
          { y: 20, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.8, ease: 'expo.out', stagger: 0.06, delay: 0.2 }
        );
        gsap.fromTo(
          portrait,
          { scale: 1.05, autoAlpha: 0 },
          { scale: 1, autoAlpha: 1, duration: 1.2, ease: 'expo.out', delay: 0.1 }
        );

        return () => split.revert();
      });
    },
    { scope: root }
  );

  return (
    <section
      id="top"
      ref={root}
      data-chapter="01"
      data-chapter-title="Intro"
      data-tone="dark"
      className="hero tone-dark"
    >
      <div className="hero-veil" aria-hidden="true" />

      <div className="hero-grid">
        <div className="hero-copy relative z-10 flex flex-col items-start gap-7">
          <div data-intro className="status-pill">
            <span className="status-dot" aria-hidden="true" />
            Open to paid remote internships
          </div>

          <h1
            data-title
            className="display hero-title"
            aria-label={personal.headline.join(' ').replace(/<[^>]+>/g, '')}
            dangerouslySetInnerHTML={{ __html: personal.headline.join('<br />') }}
          />

          <p data-intro className="muted max-w-[34rem] text-lg leading-relaxed">
            <span className="text-paper">{personal.role}.</span> {personal.heroDesc}
          </p>

          <div data-intro className="flex flex-wrap items-center gap-3">
            <Magnetic>
              <button
                type="button"
                className="btn btn-solid"
                onClick={() => scrollToTarget('#projects')}
                data-cursor="Scroll"
              >
                View projects
                <ArrowDown className="h-4 w-4" aria-hidden="true" />
              </button>
            </Magnetic>
            <a className="btn" href={`mailto:${personal.email}`}>
              Email me
            </a>
            {personal.resumeUrl && (
              <a className="btn" href={personal.resumeUrl} download>
                Résumé
              </a>
            )}
          </div>

          <div data-intro className="mt-2 flex items-center gap-4 text-paper/60">
            <span className="scroll-cue" aria-hidden="true" />
            <LocalTime />
          </div>
        </div>

        <div className="hero-portrait" data-portrait>
          <div className="hero-glow" aria-hidden="true" />
          <div className="hero-ring" aria-hidden="true" />
          <img
            src={personal.heroImage}
            alt={personal.heroImageAlt}
            width={1000}
            height={1500}
            fetchPriority="high"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
