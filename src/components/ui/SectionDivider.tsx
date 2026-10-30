import React from 'react';

interface SectionDividerProps {
  index: string;
  label: string;
}

const DASHES = '─'.repeat(120);

export const SectionDivider: React.FC<SectionDividerProps> = ({ index, label }) => (
  <div className="section-divider" aria-hidden="true">
    {`// ── §${index} ─── ${label.toUpperCase()} ── ${DASHES}`}
  </div>
);

export default SectionDivider;
