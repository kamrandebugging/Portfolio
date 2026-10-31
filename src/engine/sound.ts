// Tiny WebAudio sound kit — no audio assets needed. Every sound is synthesized
// at call time. Browsers block audio before the first user gesture, so the
// AudioContext unlocks on first pointerdown/keydown/touchstart; calls before
// that are silently ignored. Everything also respects a persisted mute toggle.

const STORAGE_KEY = 'kd-sound-enabled';

let ctx: AudioContext | null = null;

function readStored(): boolean {
  try {
    return typeof window !== 'undefined'
      ? window.localStorage?.getItem(STORAGE_KEY) !== '0'
      : true;
  } catch {
    return true;
  }
}

let enabled = readStored();

export function isSoundEnabled(): boolean {
  return enabled;
}

export function setSoundEnabled(v: boolean): void {
  enabled = v;
  try {
    if (typeof window !== 'undefined') window.localStorage?.setItem(STORAGE_KEY, v ? '1' : '0');
  } catch {
    /* storage unavailable — keep in-memory */
  }
}

export function toggleSound(): boolean {
  setSoundEnabled(!enabled);
  return enabled;
}

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

/** Crisp pop (680→240Hz blip + click). Use for: landed results, confirmations. */
export function playPop(volume = 0.4): void {
  if (!enabled) return;
  const ac = ensureCtx();
  if (!ac || ac.state !== 'running') return;
  const t = ac.currentTime;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(680, t);
  osc.frequency.exponentialRampToValueAtTime(240, t + 0.07);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(Math.max(volume, 0.0002), t + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
  osc.connect(g);
  g.connect(ac.destination);
  osc.start(t);
  osc.stop(t + 0.1);
  noiseBurst(ac, t, { durationMs: 20, hpHz: 2500, volume: volume * 0.5 });
}

/** Near-silent 8ms click, nothing tonal. Use for: hover, list nav — anything fast/repeating. */
export function playTick(volume = 0.12): void {
  if (!enabled) return;
  const ac = ensureCtx();
  if (!ac || ac.state !== 'running') return;
  noiseBurst(ac, ac.currentTime, { durationMs: 8, hpHz: 3200, volume });
}

/** Single soft keystroke, frequency jitters ±8% so a run doesn't sound robotic. Use for: terminal typing. */
export function playKey(volume = 0.08): void {
  if (!enabled) return;
  const ac = ensureCtx();
  if (!ac || ac.state !== 'running') return;
  const t = ac.currentTime;
  const jitter = 1 + (Math.random() * 0.16 - 0.08);
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = 'square';
  osc.frequency.setValueAtTime(1400 * jitter, t);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(Math.max(volume, 0.0002), t + 0.004);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.025);
  osc.connect(g);
  g.connect(ac.destination);
  osc.start(t);
  osc.stop(t + 0.03);
  noiseBurst(ac, t, { durationMs: 6, hpHz: 4000, volume: volume * 0.6 });
}

/** Rising ~90ms swell. Use for: an overlay opening (palette, Index menu). */
export function playOpen(volume = 0.18): void {
  if (!enabled) return;
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

/** Falling ~70ms swell. Use for: closing the same overlay. */
export function playClose(volume = 0.14): void {
  if (!enabled) return;
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
