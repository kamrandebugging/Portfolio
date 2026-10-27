import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { portfolioData } from '../data/portfolio';

export const Contact: React.FC = () => {
  const { contact, personal } = portfolioData;

  return (
    <footer id="contact" className="relative px-6 sm:px-10 md:px-14 pt-20 sm:pt-28 pb-12">
      {/* Top CTA */}
      <div className="max-w-4xl">
        <span className="eyebrow">{contact.eyebrow}</span>
        <h2 className="font-display uppercase tracking-tight text-5xl sm:text-7xl lg:text-8xl text-[#f3f1ea] mt-5 leading-[0.9]">
          {contact.heading.map((line, idx) => (
            <span key={idx} className="block">
              {line}
            </span>
          ))}
        </h2>
        <p className="mt-8 text-lg sm:text-2xl text-[#807f78] leading-relaxed max-w-xl">
          {contact.lead}
        </p>

        {/* Email link with hover animation */}
        <div className="mt-8 sm:mt-12">
          <a
            href={`mailto:${contact.email}`}
            className="group inline-flex items-center gap-3 sm:gap-4 text-2xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-[#f3f1ea] hover:text-[#ff3b1d] transition-colors duration-300 break-all"
          >
            <span>{contact.email}</span>
            <ArrowUpRight className="w-6 h-6 sm:w-12 sm:h-12 text-[#ff3b1d] group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-300 flex-shrink-0" />
          </a>
        </div>
      </div>

      {/* Footer bar */}
      <div className="mt-20 sm:mt-24 pt-10 border-t border-white/10 grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
        <div className="md:col-span-6">
          <p className="font-display text-3xl sm:text-4xl uppercase tracking-tight text-[#f3f1ea]">
            {personal.name}
          </p>
          <p className="mt-2 text-xs uppercase tracking-[0.22em] text-[#807f78]">
            {personal.tagline}
          </p>
        </div>

        <nav className="md:col-span-3" aria-label="Social Profiles">
          <ul className="flex flex-col gap-2">
            {contact.socials.map((social) => (
              <li key={social.name}>
                <a
                  href={social.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group relative inline-flex items-center text-sm sm:text-base text-[#807f78] hover:text-[#f3f1ea] transition-all duration-300 py-1"
                >
                  <span className="w-0 h-[1px] bg-[#ff3b1d] transition-all duration-300 group-hover:w-4 group-hover:mr-2" />
                  {social.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-3 md:text-right">
          <p className="text-xs uppercase tracking-[0.18em] text-[#807f78]">
            {personal.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
};
