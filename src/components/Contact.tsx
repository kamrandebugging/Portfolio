import React, { useEffect, useRef } from 'react';
import {
  gsap,
  ScrollTrigger,
  useGSAP,
  MOTION_OK,
  SCENES_ON,
  motionMatchMedia,
} from '../engine/gsap';

export const Contact: React.FC = () => {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const sync = () =>
      document.documentElement.style.setProperty('--footer-h', `${el.offsetHeight}px`);
    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useGSAP(
    () => {
      const el = root.current;
      const spacer = document.getElementById('contact-sentinel');
      if (!el) return;

      const mm = motionMatchMedia();

      mm.add(SCENES_ON, () => {
        const trigger = ScrollTrigger.create({
          trigger: spacer,
          start: 'top bottom',
          end: 'max',
          onUpdate: (self) => {
            el.style.visibility = self.progress > 0 ? 'visible' : 'hidden';
          },
        });
        return () => {
          trigger.kill();
          el.style.visibility = '';
        };
      });

      mm.add(MOTION_OK, () => {
        const target = spacer && spacer.offsetHeight > 0 ? spacer : el;
        const words = gsap.utils.toArray<HTMLElement>('.footer-word', el);
        const subline = el.querySelector<HTMLElement>('.footer-subline');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: target,
            start: 'top 70%',
            once: true,
          },
        });

        tl.fromTo(
          words,
          {
            opacity: 0,
            yPercent: -100,
            rotationX: 90,
            transformOrigin: '50% 100%',
          },
          {
            opacity: 1,
            yPercent: 0,
            rotationX: 0,
            duration: 0.3,
            ease: 'back.out(1.7)',
            stagger: 0.1,
            delay: 0.3,
          }
        );

        if (subline) {
          tl.fromTo(
            subline,
            {
              opacity: 0,
              yPercent: -100,
              rotationX: 90,
              transformOrigin: '50% 100%',
            },
            {
              opacity: 1,
              yPercent: 0,
              rotationX: 0,
              duration: 0.3,
              ease: 'back.out(1.7)',
            },
            '+=0.05'
          );
        }

        // Native IntersectionObserver backup to guarantee trigger on mobile touch
        let observer: IntersectionObserver | null = null;
        if (typeof IntersectionObserver !== 'undefined') {
          observer = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting) {
                  observer?.disconnect();
                  if (tl.progress() === 0) {
                    tl.play();
                  }
                }
              });
            },
            { threshold: 0.25 }
          );
          observer.observe(target);
        }

        return () => {
          tl.kill();
          observer?.disconnect();
        };
      });
    },
    { scope: root }
  );

  return (
    <footer
      id="contact"
      ref={root}
      data-chapter="07"
      data-chapter-title="Contact"
      data-tone="dark"
      data-trigger="#contact-sentinel"
      className="footer-reveal tone-dark relative flex min-h-screen w-full flex-col items-center justify-center bg-[#081c15] text-[#d8f3dc] px-[var(--pad-x)] py-16 sm:py-20 select-none"
    >
      <div className="mx-auto flex w-full max-w-[72rem] flex-col items-center justify-center text-center gap-8 sm:gap-10 md:gap-12">
        {/* Monumental Headline: "Code. Ship. Repeat." */}
        <div style={{ perspective: '900px' }} className="w-full">
          <h2 className="font-display font-semibold text-[clamp(3rem,9vw,8.5rem)] leading-[1.1] sm:leading-[0.95] tracking-tight text-[#d8f3dc]">
            <span className="footer-word inline-block mx-1">Code.</span>
            <span className="footer-word inline-block mx-1">Ship.</span>
            <span className="footer-word inline-block mx-1">Repeat.</span>
          </h2>
        </div>

        {/* CTA: One big white pill "Get in touch" */}
        <div>
          <a
            href="mailto:kamrandebugging@gmail.com"
            className="inline-flex items-center justify-center rounded-full bg-white px-8 sm:px-10 py-4 sm:py-4.5 font-sans text-base sm:text-lg font-medium text-[#081c15] shadow-[0_0_35px_rgba(255,255,255,0.25)] transition-transform duration-300 hover:scale-[1.03]"
            data-cursor="Email"
          >
            Get in touch
          </a>
        </div>

        {/* Email row */}
        <div>
          <a
            href="mailto:kamrandebugging@gmail.com"
            className="font-mono text-sm sm:text-base text-[var(--fg-muted)] opacity-60 transition-opacity duration-200 hover:opacity-100"
          >
            kamrandebugging@gmail.com
          </a>
        </div>

        {/* Socials: GitHub + LinkedIn icons, opacity-30 -> 100, no movement */}
        <div className="flex items-center justify-center gap-5">
          <a
            href="https://github.com/kamrandebugging"
            target="_blank"
            rel="noreferrer noopener"
            className="text-[#d8f3dc] opacity-30 transition-opacity duration-200 hover:opacity-100"
            aria-label="GitHub profile"
          >
            <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>
          <a
            href="https://linkedin.com/in/kamran-debug"
            target="_blank"
            rel="noreferrer noopener"
            className="text-[#d8f3dc] opacity-30 transition-opacity duration-200 hover:opacity-100"
            aria-label="LinkedIn profile"
          >
            <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.79v8.37H6.46v-8.37M7.86 6.35a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28z" />
            </svg>
          </a>
        </div>

        {/* Subline with smaller 3D flip */}
        <div style={{ perspective: '900px' }} className="w-full">
          <p className="footer-subline inline-block font-mono text-xs sm:text-sm text-[var(--fg-muted)] tracking-wider">
            © 2026 Muhammad Kamran · Lahore, Pakistan
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Contact;
