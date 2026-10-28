import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { portfolioData } from '../data/portfolio';
import { goToSection } from '../engine/scroll';
import { EditorialMenu } from './EditorialMenu';
import { LocalTime } from './ui/LocalTime';

export const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);
  const close = useCallback(() => setOpen(false), []);
  const navigate = useNavigate();
  const onHome = useLocation().pathname === '/';
  const go = useCallback((href: string) => goToSection(navigate, onHome, href), [navigate, onHome]);

  // Return focus to the Index button after the menu closes.
  useEffect(() => {
    if (wasOpen.current && !open) trigger.current?.focus();
    wasOpen.current = open;
  }, [open]);

  return (
    <>
      <header className="nav">
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            go('#top');
          }}
          className="flex items-center gap-3"
          aria-label={`${portfolioData.personal.name}, back to top`}
        >
          <span className="nav-mark">{portfolioData.personal.initials}</span>
          <span className="nav-name hidden sm:inline">{portfolioData.personal.name}</span>
        </a>

        <div className="flex items-center gap-6 lg:gap-9">
          <ul className="hidden items-center gap-7 xl:flex">
            {portfolioData.navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="nav-link"
                  onClick={(e) => {
                    e.preventDefault();
                    go(link.href);
                  }}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <LocalTime className="hidden text-[var(--ui-fg-muted)] md:inline" />

          <button
            ref={trigger}
            type="button"
            onClick={() => setOpen(true)}
            className="nav-index"
            aria-haspopup="dialog"
            aria-expanded={open}
            data-cursor="Open"
          >
            <span>Index</span>
            <span className="nav-burger" aria-hidden="true" />
          </button>
        </div>
      </header>

      <EditorialMenu open={open} onClose={close} go={go} />
    </>
  );
};
