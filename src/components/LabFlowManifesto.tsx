import React, { useRef } from 'react';
import schemaImg from '../assets/labflow/manifesto-schema.jpg';
import { useSceneProgress } from '../hooks/useSceneProgress';
import { TiltCard } from './ui/TiltCard';

/**
 * A pinned line that swaps under the reader as they scroll — the device
 * from the Forge reference (fixed stage, a word struck through, the real
 * claim revealed underneath), over a tilting full-bleed schema render.
 * Pure CSS choreography off --p; see src/styles/scenes.css "Manifesto".
 * Phones and reduced-motion get both lines shown at once over no image.
 */
export const LabFlowManifesto: React.FC = () => {
  const root = useRef<HTMLElement>(null);
  useSceneProgress(root);

  return (
    <section ref={root} className="manifesto tone-dark" data-tone="dark">
      <div className="manifesto-stage">
        <TiltCard className="manifesto-media" max={6}>
          <img className="manifesto-bg" src={schemaImg} alt="" aria-hidden="true" loading="lazy" />
        </TiltCard>
        <div className="manifesto-scrim" aria-hidden="true" />

        <div className="manifesto-text">
          <p className="manifesto-line manifesto-line--1 display">
            This isn&rsquo;t a <span className="manifesto-strike">UI mockup</span>.
          </p>
          <p className="manifesto-line manifesto-line--2 display">
            It&rsquo;s the schema patient data actually lives in.
          </p>
        </div>
      </div>
    </section>
  );
};

export default LabFlowManifesto;
