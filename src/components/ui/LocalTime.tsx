import React, { useEffect, useState } from 'react';
import { portfolioData } from '../../data/portfolio';

const format = (timeZone: string): string =>
  new Intl.DateTimeFormat('en-GB', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date());

/** Live local time. Useful to a remote hiring team deciding on overlap. */
export const LocalTime: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { timezone, location } = portfolioData.personal;
  const [time, setTime] = useState(() => format(timezone));

  useEffect(() => {
    const id = window.setInterval(() => setTime(format(timezone)), 15_000);
    return () => window.clearInterval(id);
  }, [timezone]);

  return (
    <span className={`font-mono text-xs tabular-nums ${className}`}>
      {location.split(',')[0]} · {time} PKT
    </span>
  );
};
