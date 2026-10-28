import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { initScroll } from './engine/scroll';
import { Navbar } from './components/Navbar';
import { Cursor } from './components/ui/Cursor';
import { Home } from './pages/Home';
import { ProjectPage } from './pages/ProjectPage';

export const App: React.FC = () => {
  useEffect(() => initScroll(), []);

  // A route change doesn't reset scroll on its own; land new pages at the top.
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) return;
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return (
    <>
      <Cursor />
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects/:slug" element={<ProjectPage />} />
      </Routes>
    </>
  );
};

export default App;
