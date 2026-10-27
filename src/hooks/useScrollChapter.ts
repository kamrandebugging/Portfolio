import { useState, useEffect } from 'react';

export interface Chapter {
  id: string;
  num: string;
  title: string;
}

export const CHAPTERS: Chapter[] = [
  { id: 'top', num: '01', title: 'Hero' },
  { id: 'story', num: '02', title: 'About Me' },
  { id: 'flow-explorer', num: '03', title: 'Architecture' },
  { id: 'projects', num: '04', title: 'Projects' },
  { id: 'achievements', num: '05', title: 'Recognition' },
  { id: 'impact', num: '06', title: 'By The Numbers' },
  { id: 'experience', num: '07', title: 'Experience' },
  { id: 'contact', num: '08', title: 'Contact' },
];

export const useScrollChapter = () => {
  const [activeChapter, setActiveChapter] = useState<Chapter>(CHAPTERS[0]);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [isContactVisible, setIsContactVisible] = useState<boolean>(false);

  useEffect(() => {
    // 1. Scroll progress listener
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        const progress = Math.min(1, Math.max(0, window.scrollY / scrollHeight));
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // 2. IntersectionObserver for chapter tracking
    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const matched = CHAPTERS.find((c) => c.id === entry.target.id);
          if (matched) {
            setActiveChapter(matched);
          }
          if (entry.target.id === 'contact') {
            setIsContactVisible(true);
          }
        } else {
          if (entry.target.id === 'contact') {
            setIsContactVisible(false);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: '-20% 0px -35% 0px',
      threshold: [0, 0.2, 0.5],
    });

    CHAPTERS.forEach((chapter) => {
      const el = document.getElementById(chapter.id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  return { activeChapter, scrollProgress, isContactVisible };
};
