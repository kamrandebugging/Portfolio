// Tiny WebAudio sounds for the Index menu — no audio assets needed.
// Browsers block audio before the first user gesture, so the AudioContext
// unlocks on the first pointerdown/keydown/touchstart; calls before that
// are silently ignored.

let ctx: AudioContext | null = null;

function ensureCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    if (!ctx) {
      const AC =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') void ctx.resume().catch(() => undefined);
    return ctx;
  } catch {
    return null;
  }
}

if (typeof window !== 'undefined') {
  const unlock = () => ensureCtx();
  window.addEventListener('pointerdown', unlock, { once: true, passive: true });
  window.addEventListener('touchstart', unlock, { once: true, passive: true });
  window.addEventListener('keydown', unlock, { once: true });
}

function noiseBurst(
  ac: AudioContext,
  t: number,
  { durationMs, hpHz, volume }: { durationMs: number; hpHz: number; volume: number }
): void {
  const len = Math.max(1, Math.floor(ac.sampleRate * (durationMs / 1000)));
  const buf = ac.createBuffer(1, len, ac.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const src = ac.createBufferSource();
  src.buffer = buf;
  const hp = ac.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.value = hpHz;
  const g = ac.createGain();
  g.gain.value = volume;
  src.connect(hp);
  hp.connect(g);
  g.connect(ac.destination);
  src.start(t);
}

/** Near-silent 8ms click, nothing tonal. Use for: the Index menu panel riffle. */
export function playTick(volume = 0.07): void {
  const ac = ensureCtx();
  if (!ac || ac.state !== 'running') return;
  noiseBurst(ac, ac.currentTime, { durationMs: 8, hpHz: 3200, volume });
}

/** Rising ~90ms swell. Use for: the Index menu opening. */
export function playOpen(volume = 0.12): void {
  const ac = ensureCtx();
  if (!ac || ac.state !== 'running') return;
  const t = ac.currentTime;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(220, t);
  osc.frequency.exponentialRampToValueAtTime(880, t + 0.09);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(volume, t + 0.03);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
  osc.connect(g);
  g.connect(ac.destination);
  osc.start(t);
  osc.stop(t + 0.13);
}

/** Falling ~70ms swell. Use for: the Index menu closing. */
export function playClose(volume = 0.12): void {
  const ac = ensureCtx();
  if (!ac || ac.state !== 'running') return;
  const t = ac.currentTime;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(700, t);
  osc.frequency.exponentialRampToValueAtTime(180, t + 0.07);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(volume, t + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
  osc.connect(g);
  g.connect(ac.destination);
  osc.start(t);
  osc.stop(t + 0.1);
}
