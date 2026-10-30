import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ScrollTrigger } from '../engine/gsap';
import { ProgressPill } from '../components/ProgressPill';
import { Hero } from '../components/Hero';
import { About } from '../components/About';
import { Projects } from '../components/Projects';
import { Proof } from '../components/Proof';
import { Experience } from '../components/Experience';
import { Contact } from '../components/Contact';
import { scrollToTarget } from '../engine/scroll';

export const Home: React.FC = () => {
  const { hash } = useLocation();

  // Layout shifts (web fonts, images) move every trigger; re-measure once they settle.
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener('load', refresh);
    return () => window.removeEventListener('load', refresh);
  }, []);

  // Arriving from another page with a section hash (e.g. navigated from a
  // project page's "Back to home" via #contact) — scroll once ready.
  useEffect(() => {
    if (!hash) return;
    const id = window.requestAnimationFrame(() => scrollToTarget(hash));
    return () => window.cancelAnimationFrame(id);
  }, [hash]);

  return (
    <>
      <ProgressPill />

      <main className="relative z-[1]">
        <div className="stack">
          <Hero />
          <About />
        </div>
                <Projects />
                <Proof />
                <Experience />
      </main>

      <div id="contact-sentinel" className="footer-sentinel" aria-hidden="true" />
      <Contact />
    </>
  );
};

export default Home;
