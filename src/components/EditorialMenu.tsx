import React, { useEffect, useRef } from 'react';
import { ArrowUpRight, X } from 'lucide-react';
import { gsap, useGSAP } from '../engine/gsap';
import { getLenis } from '../engine/scroll';
import { isReduced, setMotionPref, systemReducesMotion } from '../engine/motion';
import { portfolioData } from '../data/portfolio';

interface EditorialMenuProps {
  open: boolean;
  onClose: () => void;
  /** Route-aware section navigation (home page sections only exist on "/"). */
  go: (href: string) => void;
}

/** Each panel is one palette step, so the open menu reads as the swatch itself. */
const PANEL_TONES = [
  'bg-forest text-paper',
  'bg-pine text-paper',
  'bg-fern text-ink',
  'bg-leaf text-ink',
  'bg-sage text-ink',
  'bg-mint text-ink',
];

/**
 * Full-screen index in the "magazine covers side by side" pattern: six
 * panels unfold in a stagger. Desktop columns, phone rows.
 */
export const EditorialMenu: React.FC<EditorialMenuProps> = ({ open, onClose, go: goToSection }) => {
  const root = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const k = isReduced() ? 0 : 1;
      const panels = el.querySelectorAll('.menu-panel');
      const words = el.querySelectorAll('.menu-rise');

      gsap.killTweensOf([panels, words, el]);

      if (open) {
        gsap.set(el, { autoAlpha: 1 });
        gsap.fromTo(
          panels,
          { clipPath: 'inset(100% 0% 0% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9 * k, ease: 'expo.out', stagger: 0.07 * k }
        );
        gsap.fromTo(
          words,
          { yPercent: 115 },
          { yPercent: 0, duration: 0.9 * k, ease: 'expo.out', stagger: 0.05 * k, delay: 0.3 * k }
        );
        closeBtn.current?.focus();
      } else {
        gsap.to(panels, {
          clipPath: 'inset(0% 0% 100% 0%)',
          duration: 0.6 * k,
          ease: 'expo.inOut',
          stagger: 0.04 * k,
          onComplete: () => {
            gsap.set(el, { autoAlpha: 0 });
          },
        });
      }
    },
    { scope: root, dependencies: [open] }
  );

  useEffect(() => {
    if (!open) return;
    const lenis = getLenis();
    const previousOverflow = document.body.style.overflow;
    if (lenis) lenis.stop();
    else document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);

    return () => {
      window.removeEventListener('keydown', onKey);
      if (lenis) lenis.start();
      else document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  const go = (href: string) => {
    onClose();
    window.setTimeout(() => goToSection(href), 350);
  };

  return (
    <div
      ref={root}
      className="menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site index"
      aria-hidden={!open}
      style={{ visibility: 'hidden' }}
    >
      <div className="menu-top">
        <span className="font-sans text-xs uppercase tracking-wider text-paper/70">
          Index · {portfolioData.personal.name}
        </span>
        <button
          ref={closeBtn}
          type="button"
          onClick={onClose}
          className="btn !py-2.5"
          tabIndex={open ? 0 : -1}
        >
          <span>Close</span>
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <nav className="menu-panels" aria-label="Sections">
        {portfolioData.navLinks.map((link, i) => (
          <a
            key={link.href}
            href={link.href}
            onClick={(e) => {
              e.preventDefault();
              go(link.href);
            }}
            tabIndex={open ? 0 : -1}
            data-cursor="Go"
            className={`menu-panel ${PANEL_TONES[i % PANEL_TONES.length]}`}
          >
                        <span>
              <span className="block overflow-hidden">
                <span className="menu-rise display block text-[clamp(2rem,4.2vw,4.25rem)]">
                  {link.label}
                </span>
              </span>
              <span className="mt-3 flex items-end justify-between gap-3 text-sm opacity-80">
                <span className="max-w-[16ch]">{link.blurb}</span>
                <ArrowUpRight className="menu-arrow h-5 w-5 shrink-0" aria-hidden="true" />
              </span>
            </span>
          </a>
        ))}
      </nav>

      <div className="menu-bottom">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                    <button
            type="button"
            className="motion-toggle"
            tabIndex={open ? 0 : -1}
            aria-pressed={!isReduced()}
            onClick={() => setMotionPref(isReduced() ? 'on' : 'off')}
          >
            <span className="motion-dot" data-on={!isReduced()} aria-hidden="true" />
            Animations {isReduced() ? 'off' : 'on'}
            {isReduced() && systemReducesMotion() ? ' (device setting)' : ''}
          </button>
        </div>
        <a
          href={`mailto:${portfolioData.contact.email}`}
          className="text-sm text-paper/80 underline decoration-paper/30 underline-offset-4 hover:decoration-paper"
          tabIndex={open ? 0 : -1}
        >
          {portfolioData.contact.email}
        </a>
      </div>
    </div>
  );
};
