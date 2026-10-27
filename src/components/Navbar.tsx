import React, { useState, useEffect } from 'react';
import { portfolioData } from '../data/portfolio';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (href: string) => {
    setIsOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 pointer-events-none transition-all duration-300">
      <nav
        className={`pointer-events-auto flex items-center justify-between px-6 sm:px-10 md:px-14 py-4 md:py-6 transition-all duration-300 ${
          scrolled ? 'bg-[#08080a]/85 backdrop-blur-md border-b border-white/5 py-4' : 'bg-transparent'
        }`}
      >
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            handleLinkClick('#top');
          }}
          className="group flex items-center gap-3 text-[#f3f1ea]"
          aria-label="Muhammad Kamran - Back to top"
        >
          <span className="grid place-items-center w-10 h-10 rounded-full border border-white/20 font-semibold tracking-tight text-sm group-hover:border-[#ff3b1d] group-hover:text-[#ff3b1d] transition-colors duration-300">
            {portfolioData.personal.initials}
          </span>
          <span className="hidden sm:inline-block text-[0.8125rem] font-medium uppercase tracking-[0.22em] text-[#807f78] group-hover:text-[#f3f1ea] transition-colors duration-300">
            {portfolioData.personal.name}
          </span>
        </a>

        {/* Desktop nav links */}
        <ul className="hidden md:flex items-center gap-8 lg:gap-10">
          {portfolioData.navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link.href);
                }}
                className="relative text-[0.8125rem] font-medium uppercase tracking-[0.18em] text-[#807f78] hover:text-[#f3f1ea] transition-colors duration-300 py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 hover:after:w-full after:bg-[#ff3b1d] after:transition-all after:duration-300"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile menu hamburger button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 focus:outline-none"
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
        >
          <span
            className={`block h-0.5 w-6 bg-[#f3f1ea] transition-transform duration-300 ${
              isOpen ? 'translate-y-2 rotate-45' : ''
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-[#f3f1ea] transition-opacity duration-300 ${
              isOpen ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-[#f3f1ea] transition-transform duration-300 ${
              isOpen ? '-translate-y-2 -rotate-45' : ''
            }`}
          />
        </button>
      </nav>

      {/* Mobile Drawer */}
      <div
        className={`md:hidden fixed inset-0 z-40 bg-[#08080a] flex flex-col justify-center px-8 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col gap-6">
          {portfolioData.navLinks.map((link, idx) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick(link.href);
              }}
              style={{ transitionDelay: `${idx * 60}ms` }}
              className={`font-display text-4xl sm:text-5xl uppercase tracking-tight text-[#807f78] hover:text-[#ff3b1d] transition-all duration-300 ${
                isOpen ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
};
