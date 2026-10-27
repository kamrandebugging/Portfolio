import React, { useEffect, useState } from 'react';
import { ScrollTrigger } from './engine/gsap';
import { initScroll } from './engine/scroll';
import { Loader } from './components/Loader';
import { Navbar } from './components/Navbar';
import { ProgressPill } from './components/ProgressPill';
import { Cursor } from './components/ui/Cursor';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Pipeline } from './components/Pipeline';
import { Projects } from './components/Projects';
import { Proof } from './components/Proof';
import { Experience } from './components/Experience';
import { Contact } from './components/Contact';

export const App: React.FC = () => {
  const [ready, setReady] = useState(false);

  useEffect(() => initScroll(), []);

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

  return (
    <>
      <Loader onDone={() => setReady(true)} />
      <Cursor />
      <Navbar />
      <ProgressPill />

      <main className="relative z-[1]">
        <div className="stack">
          <Hero ready={ready} />
          <About />
        </div>
        <Pipeline />
        <Projects />
        <Proof />
        <Experience />
      </main>

      <div id="contact-sentinel" className="footer-sentinel" aria-hidden="true" />
      <Contact />
    </>
  );
};

export default App;
