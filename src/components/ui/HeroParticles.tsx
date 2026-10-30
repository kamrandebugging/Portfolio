import React, { useEffect, useRef } from 'react';

const GREEN: [number, number, number][] = [
  [82, 183, 136],
  [116, 198, 157],
  [149, 213, 178],
  [64, 145, 108],
  [45, 106, 79],
];

interface P {
  x: number; y: number;
  vx: number; vy: number;
  r: number; alpha: number;
  ci: number;
}

export const HeroParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduced =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      document.documentElement.dataset.motion === 'reduced';
    if (reduced) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = 0, H = 0;
    let pts: P[] = [];
    let rafId: number | null = null;
    let live = false;
    let mx = -9999, my = -9999;
    const REPEL = 120;

    const fill = () => {
      const n = Math.min(80, Math.max(16, Math.floor((W * H) / 11000)));
      pts = Array.from({ length: n }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.32,
        vy: (Math.random() - 0.5) * 0.32,
        r: Math.random() * 1.6 + 0.5,
        alpha: Math.random() * 0.32 + 0.07,
        ci: Math.floor(Math.random() * GREEN.length),
      }));
    };

    const resize = () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W;
      canvas.height = H;
      if (W > 0 && H > 0) fill();
    };

    const draw = () => {
      if (!live) { rafId = null; return; }
      ctx.clearRect(0, 0, W, H);
      for (const p of pts) {
        const dx = p.x - mx, dy = p.y - my;
        const d2 = dx * dx + dy * dy;
        if (d2 < REPEL * REPEL && d2 > 1) {
          const d = Math.sqrt(d2);
          const f = (1 - d / REPEL) * 0.38;
          p.vx += (dx / d) * f;
          p.vy += (dy / d) * f;
        }
        p.vx *= 0.97; p.vy *= 0.97;
        const spd = Math.hypot(p.vx, p.vy);
        if (spd > 1.3) { p.vx = (p.vx / spd) * 1.3; p.vy = (p.vy / spd) * 1.3; }
        p.x = ((p.x + p.vx) % W + W) % W;
        p.y = ((p.y + p.vy) % H + H) % H;
        const [r, g, b] = GREEN[p.ci];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, 6.28318);
        ctx.fillStyle = `rgba(${r},${g},${b},${p.alpha})`;
        ctx.fill();
      }
      rafId = requestAnimationFrame(draw);
    };

    const go = () => { if (live && !rafId) rafId = requestAnimationFrame(draw); };
    const stop = () => { if (rafId) { cancelAnimationFrame(rafId); rafId = null; } };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const io = new IntersectionObserver(
      ([e]) => { live = e.isIntersecting; live ? go() : stop(); },
      { threshold: 0.01 },
    );
    io.observe(canvas);

    const onVis = () => { document.hidden ? stop() : go(); };
    document.addEventListener('visibilitychange', onVis);

    const section = canvas.parentElement;
    const onPtr = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mx = e.clientX - r.left;
      my = e.clientY - r.top;
    };
    const onOff = () => { mx = -9999; my = -9999; };
    section?.addEventListener('pointermove', onPtr, { passive: true });
    section?.addEventListener('pointerleave', onOff, { passive: true });

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      section?.removeEventListener('pointermove', onPtr);
      section?.removeEventListener('pointerleave', onOff);
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-particles" aria-hidden="true" />;
};

export default HeroParticles;
