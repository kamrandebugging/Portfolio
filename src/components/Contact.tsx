import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ArrowUpRight, Copy, Check } from 'lucide-react';
import {
  gsap,
  ScrollTrigger,
  SplitText,
  useGSAP,
  MOTION_OK,
  SCENES_ON,
  motionMatchMedia,
} from '../engine/gsap';
import { portfolioData } from '../data/portfolio';
import { Magnetic } from './ui/Magnetic';

interface Social { name: string; url: string; }

const ContactTerminal: React.FC<{ email: string; socials: Social[] }> = ({ email, socials }) => {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(() => {
    navigator.clipboard.writeText(email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [email]);

  const urlLabel = (url: string) => url.replace(/^https?:\/\//, '');

  return (
    <div data-contact-fade className="contact-terminal mt-14">
      <div className="contact-terminal-bar" aria-hidden="true">
        <span className="contact-terminal-dot" />
        <span className="contact-terminal-dot" />
        <span className="contact-terminal-dot" />
        <span className="contact-terminal-name">bash ~ kamran</span>
      </div>
      <div className="contact-terminal-body">
        <div className="contact-terminal-row">
          <span className="contact-terminal-prompt">$</span>
          <span className="contact-terminal-cmd">contact --email</span>
        </div>
        <div className="contact-terminal-row contact-terminal-output">
          <span className="contact-terminal-arrow">→</span>
          <span className="contact-terminal-val">{email}</span>
          <button
            type="button"
            className="contact-terminal-copy"
            onClick={copy}
            aria-label={copied ? 'Copied!' : 'Copy email address'}
          >
            {copied
              ? <Check className="h-3.5 w-3.5" aria-hidden="true" />
              : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
            <span>{copied ? 'copied' : 'copy'}</span>
          </button>
        </div>

        <div className="contact-terminal-row contact-terminal-spacer">
          <span className="contact-terminal-prompt">$</span>
          <span className="contact-terminal-cmd">contact --socials</span>
        </div>
        {socials.map((s) => (
          <div key={s.name} className="contact-terminal-row contact-terminal-output">
            <span className="contact-terminal-arrow">→</span>
            <a
              href={s.url}
              target="_blank"
              rel="noreferrer noopener"
              className="contact-terminal-val contact-terminal-link"
            >
              {urlLabel(s.url)}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Footer reveal: on desktop this sits fixed behind the page and is uncovered
 * as the last section scrolls away (the spacer below <main> provides the
 * scroll distance). Phones and reduced-motion get a normal footer.
 */
export const Contact: React.FC = () => {
  const root = useRef<HTMLElement>(null);
  const { contact, personal } = portfolioData;

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
          // Progress-based (not active-based): a trigger is inactive at progress 1, which is
          // exactly the end of the page, and a jump straight to the end skips the toggle.
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
        const heading = el.querySelector<HTMLElement>('[data-contact-title]');
        const fades = gsap.utils.toArray<HTMLElement>('[data-contact-fade]', el);
        const start = target === spacer ? 'top 62%' : 'top 82%';

        const split = heading
          ? SplitText.create(heading, {
              type: 'lines',
              mask: 'lines',
              autoSplit: true,
              onSplit: (self) =>
                gsap.from(self.lines, {
                  yPercent: 112,
                  duration: 1.2,
                  ease: 'expo.out',
                  stagger: 0.1,
                  scrollTrigger: { trigger: target, start, once: true },
                }),
            })
          : null;

        gsap.from(fades, {
          y: 30,
          autoAlpha: 0,
          duration: 1,
          ease: 'expo.out',
          stagger: 0.08,
          delay: 0.35,
          scrollTrigger: { trigger: target, start, once: true },
        });

        return () => split?.revert();
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
      className="footer-reveal tone-dark"
    >
      <div className="mx-auto flex min-h-[inherit] max-w-[88rem] flex-col justify-between gap-16 px-[var(--pad-x)] pb-10 pt-28">
        <div>
          <h2
            data-contact-title
            className="display text-[clamp(3rem,8.4vw,9rem)]"
          >
            {contact.heading[0]} {contact.heading[1]} <em>{contact.heading[2]}</em>
          </h2>
          <p data-contact-fade className="muted mt-8 max-w-[30rem] text-lg leading-relaxed">
            {contact.lead}
          </p>

          <div data-contact-fade className="mt-10">
            <Magnetic strength={0.15}>
              <a
                href={`mailto:${contact.email}`}
                className="group inline-flex items-center gap-4 font-display text-[clamp(1.5rem,4.4vw,4.5rem)] leading-none tracking-tight"
                data-cursor="Email"
              >
                <span className="underline decoration-leaf/40 decoration-1 underline-offset-[0.18em] transition-[text-decoration-color] duration-500 group-hover:decoration-leaf">
                  {contact.email}
                </span>
                <ArrowUpRight
                  className="h-[0.8em] w-[0.8em] shrink-0 text-leaf transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </a>
            </Magnetic>
          </div>

          <ContactTerminal email={contact.email} socials={contact.socials} />
        </div>

        <div
          data-contact-fade
          className="grid items-end gap-8 border-t border-[var(--line)] pt-8 md:grid-cols-12"
        >
          <div className="md:col-span-5">
            <p className="display text-3xl">{personal.name}</p>
            <p className="muted mt-2 text-sm">{personal.tagline}</p>
                      </div>

          <nav className="md:col-span-4" aria-label="Social profiles">
            <ul className="flex flex-col gap-1">
              {[
                ...contact.socials,
                ...(personal.resumeUrl ? [{ name: 'Résumé', url: personal.resumeUrl }] : []),
              ].map((social) => (
                <li key={social.name}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="nav-link inline-block !text-base !normal-case !tracking-normal"
                  >
                    {social.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <p className="muted font-sans text-xs md:col-span-3 md:text-right">
            {personal.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Contact;
