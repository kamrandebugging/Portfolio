import React, { useState, useEffect, useRef } from 'react';
import { ArrowDown } from 'lucide-react';
import { HeroParticles } from './ui/HeroParticles';
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

interface TerminalStep {
  cmd: string;
  output: string;
}

const TERMINAL_STEPS: TerminalStep[] = [
  {
    cmd: 'whoami',
    output: 'Muhammad Kamran — Full-Stack Developer',
  },
  {
    cmd: 'kamran --now',
    output: 'LabFlow (Django + React) · FBR invoicing (Laravel, live since 2025)',
  },
  {
    cmd: 'kamran --open-to',
    output: 'internships + junior roles',
  },
];

const Cursor: React.FC = () => (
  <span
    aria-hidden="true"
    className="ml-1 inline-block h-[1.05em] w-1.5 sm:w-2 translate-y-[2px] bg-[#52b788] animate-pulse"
    style={{ animationDuration: '0.8s' }}
  />
);

const HeroTerminal: React.FC = () => {
  const [isReducedMotion] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  const [stepIndex, setStepIndex] = useState(isReducedMotion ? TERMINAL_STEPS.length : 0);
  const [phase, setPhase] = useState<'cmd' | 'output'>(isReducedMotion ? 'output' : 'cmd');
  const [charCount, setCharCount] = useState(isReducedMotion ? 999 : 0);

  useEffect(() => {
    if (isReducedMotion) return;
    if (stepIndex >= TERMINAL_STEPS.length) return;

    const currentItem = TERMINAL_STEPS[stepIndex];
    let timer: ReturnType<typeof setTimeout>;

    if (phase === 'cmd') {
      if (charCount < currentItem.cmd.length) {
        timer = setTimeout(() => {
          setCharCount((prev) => prev + 1);
        }, 36);
      } else {
        timer = setTimeout(() => {
          setPhase('output');
          setCharCount(0);
        }, 200);
      }
    } else {
      if (charCount < currentItem.output.length) {
        timer = setTimeout(() => {
          setCharCount((prev) => prev + 1);
        }, 16);
      } else {
        timer = setTimeout(() => {
          setStepIndex((prev) => prev + 1);
          setPhase('cmd');
          setCharCount(0);
        }, 280);
      }
    }

    return () => clearTimeout(timer);
  }, [stepIndex, phase, charCount, isReducedMotion]);

  const handleFastForward = () => {
    setStepIndex(TERMINAL_STEPS.length);
    setPhase('output');
    setCharCount(999);
  };

  const isCompleted = stepIndex >= TERMINAL_STEPS.length;

  return (
    <div
      data-intro
      onClick={handleFastForward}
      title={isCompleted ? undefined : 'Click to complete'}
      className="w-full max-w-[34rem] overflow-hidden rounded-lg border border-[rgb(216_243_220/0.14)] bg-[#081c15]/95 text-[#d8f3dc] shadow-xl backdrop-blur-sm cursor-default"
      role="region"
      aria-label="Interactive Terminal Profile"
    >
      {/* Terminal Titlebar Chrome */}
      <div className="flex items-center justify-between border-b border-[rgb(216_243_220/0.12)] bg-[#1b4332]/40 px-3 py-1.5 select-none">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="h-2 w-2 rounded-full bg-[#2d6a4f]" />
          <span className="h-2 w-2 rounded-full bg-[#40916c]" />
          <span className="h-2 w-2 rounded-full bg-[#52b788]" />
        </div>
        <span className="font-mono text-[11px] text-[#95d5b2]/80">bash ~ kamran</span>
        <span className="w-10 text-right font-mono text-[10px] text-[#74c69d]/60">80×24</span>
      </div>

      {/* Terminal Output */}
      <div className="p-3 sm:px-3.5 sm:py-2.5 font-mono text-xs sm:text-[13px] leading-snug space-y-1.5 min-h-[7.5rem] max-h-[10.5rem] overflow-y-auto">
        {TERMINAL_STEPS.map((step, idx) => {
          const isPastStep = idx < stepIndex;
          const isCurrentStep = idx === stepIndex;

          if (!isPastStep && !isCurrentStep) return null;

          const displayCmd = isPastStep
            ? step.cmd
            : isCurrentStep && phase === 'cmd'
            ? step.cmd.slice(0, charCount)
            : step.cmd;

          const showOutput = isPastStep || (isCurrentStep && phase === 'output');
          const displayOutput = isPastStep
            ? step.output
            : isCurrentStep && phase === 'output'
            ? step.output.slice(0, charCount)
            : '';

          const isLastItem = idx === TERMINAL_STEPS.length - 1;
          const showCursorOnOutput =
            (isCurrentStep && phase === 'output') || (isCompleted && isLastItem);

          return (
            <div key={step.cmd} className="space-y-0.5">
              {/* Command row */}
              <div className="flex items-center gap-1.5">
                <span className="text-[#52b788] select-none font-bold">$</span>
                <span className="text-[#d8f3dc]">{displayCmd}</span>
                {isCurrentStep && phase === 'cmd' && <Cursor />}
              </div>

              {/* Output row */}
              {showOutput && (
                <div className="flex items-start gap-1.5 pl-2 text-[#95d5b2]">
                  <span className="text-[#74c69d] select-none font-bold">→</span>
                  <span className="text-[#b7e4c7] break-words">
                    {displayOutput}
                    {showCursorOnOutput && <Cursor />}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ROT_WORDS = ['software', 'APIs', 'dashboards', 'SaaS'];
const ROT_INTERVAL = 2600;
const ROT_FADE = 200;

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

  useEffect(() => {
    const reduced =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      document.documentElement.dataset.motion === 'reduced';
    if (reduced) return;

    let idx = 0;
    const rotate = () => {
      const span = root.current?.querySelector<HTMLElement>('[data-rotword]');
      if (!span) return;
      span.style.opacity = '0';
      setTimeout(() => {
        idx = (idx + 1) % ROT_WORDS.length;
        if (span.isConnected) {
          span.textContent = ROT_WORDS[idx];
          span.style.opacity = '';
        }
      }, ROT_FADE);
    };

    const id = setInterval(rotate, ROT_INTERVAL);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      id="top"
      ref={root}
      data-chapter="01"
      data-chapter-title="Intro"
      data-tone="dark"
      className="hero tone-dark"
    >
      <HeroParticles />
      <div className="hero-veil" aria-hidden="true" />

      <div className="hero-grid">
        <div className="hero-copy relative z-10 flex flex-col items-start gap-3 sm:gap-4 lg:gap-4 justify-center">
          <div className="hero-header flex flex-col items-start gap-2.5 sm:gap-3 w-full">
            <div data-intro className="status-pill font-semibold text-xs sm:text-sm tracking-wide bg-[#1b4332]/60 border border-[#52b788]/40 shadow-md px-3.5 py-1.5 rounded-full inline-flex items-center gap-2">
              <span className="status-dot animate-pulse" aria-hidden="true" />
              Open to internships + junior roles
            </div>

            <h1
              data-title
              className="display hero-title"
              aria-label={personal.headline.join(' ').replace(/<[^>]+>/g, '')}
              dangerouslySetInnerHTML={{ __html: personal.headline.join('<br />') }}
            />

            <div
              data-intro
              className="font-mono text-sm sm:text-base text-[#95d5b2] tracking-wide flex items-center gap-1.5 select-none"
            >
              <span className="text-[#52b788]">&gt;</span>
              <span>I build</span>
              <span
                data-rotword
                className="text-[#d8f3dc] font-bold transition-opacity duration-200 inline-block min-w-[5.5rem]"
              >
                software
              </span>
            </div>
          </div>

          <div className="hero-terminal-wrap w-full">
            <HeroTerminal />
          </div>

          <div className="hero-actions flex flex-col items-start gap-3 sm:gap-3.5 w-full">
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

            <div data-intro className="flex items-center gap-4 text-paper/60">
              <span className="scroll-cue" aria-hidden="true" />
                          </div>
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
