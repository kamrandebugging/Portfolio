import React, { useEffect } from 'react';
import { ScrollTrigger } from '../engine/gsap';
import { CaseStudyHero } from '../components/case-study/CaseStudyHero';
import { CaseStudyJourney } from '../components/case-study/CaseStudyJourney';
import { CaseStudyArchitecture } from '../components/case-study/CaseStudyArchitecture';
import { CaseStudyWorkflowDelta } from '../components/case-study/CaseStudyWorkflowDelta';

/**
 * LabFlow case study. Self-directed showcase build, not in production —
 * every number and screen is labelled demo. Uses the site's own Navbar
 * and design tokens throughout — no separate palette, no page-specific
 * chrome.
 */
export const LabFlowCaseStudy: React.FC = () => {
  useEffect(() => {
    document.documentElement.dataset.navTone = 'dark';
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener('load', refresh);
    return () => window.removeEventListener('load', refresh);
  }, []);

  return (
    <main className="labflow-cs bg-[var(--color-ink)] text-[var(--color-paper)]">
      <CaseStudyHero />
      <CaseStudyJourney />
      <CaseStudyArchitecture />
      <CaseStudyWorkflowDelta />
    </main>
  );
};

export default LabFlowCaseStudy;
