import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ScrollTrigger } from '../engine/gsap';
import { Loader } from '../components/Loader';
import { ProgressPill } from '../components/ProgressPill';
import { Hero } from '../components/Hero';
import { About } from '../components/About';
import { Projects } from '../components/Projects';
import { Proof } from '../components/Proof';
import { Experience } from '../components/Experience';
import { Contact } from '../components/Contact';
import { scrollToTarget } from '../engine/scroll';

export const Home: React.FC = () => {
  const [ready, setReady] = useState(false);
  const { hash } = useLocation();

  // Layout shifts (web fonts, images) move every trigger; re-measure once they settle.
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener('load', refresh);
    return () => window.removeEventListener('load', refresh);
  }, []);

  // Never leave the hero hidden if the loader somehow stalls.
  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), 7000);
    return () => window.clearTimeout(id);
  }, []);

  // Arriving from another page with a section hash (e.g. navigated from a
  // project page's "Back to home" via #contact) — scroll once ready.
  useEffect(() => {
    if (!hash || !ready) return;
    const id = window.requestAnimationFrame(() => scrollToTarget(hash));
    return () => window.cancelAnimationFrame(id);
  }, [hash, ready]);

  return (
    <>
      <Loader onDone={() => setReady(true)} />
      <ProgressPill />

      <main className="relative z-[1]">
        <div className="stack">
          <Hero ready={ready} />
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
