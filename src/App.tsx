import React, { useEffect } from 'react';
import { initLenis } from './utils/scroll';
import { useScrollChapter } from './hooks/useScrollChapter';
import { Navbar } from './components/Navbar';
import { ChapterIndicator } from './components/ChapterIndicator';
import { FloatingCTA } from './components/FloatingCTA';
import { SheetLift } from './components/motion/SheetLift';
import { Hero } from './components/Hero';
import { FlowExplorer } from './components/FlowExplorer';
import { Story } from './components/Story';
import { Projects } from './components/Projects';
import { Achievements } from './components/Achievements';
import { Impact } from './components/Impact';
import { Experience } from './components/Experience';
import { Contact } from './components/Contact';

export const App: React.FC = () => {
  const { activeChapter, scrollProgress, isContactVisible } = useScrollChapter();

  useEffect(() => {
    const cleanup = initLenis();
    return () => {
      cleanup();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#08080a] text-[#f3f1ea] font-sans antialiased selection:bg-[#ff3b1d] selection:text-[#08080a]">
      <Navbar isContactVisible={isContactVisible} />
      <ChapterIndicator
        activeChapter={activeChapter}
        scrollProgress={scrollProgress}
        isContactVisible={isContactVisible}
      />
      <FloatingCTA isContactVisible={isContactVisible} />

      <main>
        <Hero />
        <SheetLift>
          <Story />
        </SheetLift>
        <SheetLift>
          <FlowExplorer />
        </SheetLift>
        <SheetLift>
          <Projects />
        </SheetLift>
        <Achievements />
        <Impact />
        <Experience />
        <Contact />
      </main>
    </div>
  );
};

export default App;
