import React, { useEffect } from 'react';
import Lenis from 'lenis';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Marquee } from './components/Marquee';
import { Story } from './components/Story';
import { Projects } from './components/Projects';
import { Achievements } from './components/Achievements';
import { Impact } from './components/Impact';
import { Experience } from './components/Experience';
import { Contact } from './components/Contact';

export const App: React.FC = () => {
  useEffect(() => {
    // Only enable Lenis smooth scrolling if user has not enabled reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#08080a] text-[#f3f1ea] font-sans antialiased selection:bg-[#ff3b1d] selection:text-[#08080a]">
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <Story />
        <Projects />
        <Achievements />
        <Impact />
        <Experience />
        <Contact />
      </main>
    </div>
  );
};

export default App;
