// Procedural WebAudio interaction sounds — the "terminal + editorial" palette.
// No audio assets. Every cue routes through one master gain node (mute +
// headroom), and simultaneous voices are capped so rapid interactions can't
// stack into noise. Browsers block audio before the first user gesture, so
// the AudioContext unlocks on the first pointerdown/keydown/touchstart;
// calls before that are silently ignored.

const STORE_KEY = 'portfolio-sound'; // 'on' | 'off'

function readMuted(): boolean {
  try {
    return typeof window !== 'undefined' && window.localStorage.getItem(STORE_KEY) === 'off';
  } catch {
    return false;
  }
}

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let muted = readMuted();
let activeVoices = 0;
const MAX_VOICES = 4;
let lastNavTickAt = 0;

function ensureCtx(): { ac: AudioContext; out: GainNode } | null {
  if (typeof window === 'undefined') return null;
  try {
    if (!ctx) {
      const AC =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = muted ? 0 : 1;
      master.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') void ctx.resume().catch(() => undefined);
    if (!master) return null;
    return { ac: ctx, out: master };
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

/**
 * Mute preference — persisted in localStorage, independent of any motion
 * preference. Sound stays on by default so the existing Index menu audio
 * keeps working; the navbar toggle flips it.
 */
export function isMuted(): boolean {
  return muted;
}

export function setMuted(m: boolean): void {
  muted = m;
  try {
    window.localStorage.setItem(STORE_KEY, m ? 'off' : 'on');
  } catch {
    /* private mode etc. — the preference just won't persist */
  }
  const c = ensureCtx();
  if (c) c.out.gain.setTargetAtTime(m ? 0 : 1, c.ac.currentTime, 0.02);
}

/** Drop the cue when too many voices already play; each cue frees its slot. */
function takeVoice(ms: number): boolean {
  if (typeof window === 'undefined') return false;
  if (activeVoices >= MAX_VOICES) return false;
  activeVoices += 1;
  window.setTimeout(() => {
    activeVoices = Math.max(0, activeVoices - 1);
  }, ms + 80);
  return true;
}

function noiseBurst(
  ac: AudioContext,
  out: GainNode,
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
  g.connect(out);
  src.start(t);
}

/**
 * Soft tonal swell mixed with a whisper of filtered noise — the shared
 * "open/close family". Narrow pitch movement keeps it editorial, not sci-fi.
 */
function swell(
  ac: AudioContext,
  out: GainNode,
  t: number,
  { from, to, dur, vol }: { from: number; to: number; dur: number; vol: number }
): void {
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(from, t);
  osc.frequency.exponentialRampToValueAtTime(to, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + dur * 0.35);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.04);
  osc.connect(g);
  g.connect(out);
  osc.start(t);
  osc.stop(t + dur + 0.05);
  noiseBurst(ac, out, t, {
    durationMs: Math.min(40, dur * 1000 * 0.4),
    hpHz: 1200,
    volume: vol * 0.22,
  });
}

/** Quiet 8ms click, nothing tonal. Use for: the Index menu panel riffle. */
export function playTick(volume = 0.05): void {
  const c = ensureCtx();
  if (!c || c.ac.state !== 'running' || muted || !takeVoice(30)) return;
  noiseBurst(c.ac, c.out, c.ac.currentTime, { durationMs: 8, hpHz: 2000, volume });
}

/** Soft rising swell. Use for: the Index menu opening. */
export function playOpen(volume = 0.1): void {
  const c = ensureCtx();
  if (!c || c.ac.state !== 'running' || muted || !takeVoice(220)) return;
  swell(c.ac, c.out, c.ac.currentTime, { from: 300, to: 520, dur: 0.12, vol: volume });
}

/** Soft falling swell. Use for: the Index menu closing. */
export function playClose(volume = 0.1): void {
  const c = ensureCtx();
  if (!c || c.ac.state !== 'running' || muted || !takeVoice(200)) return;
  swell(c.ac, c.out, c.ac.currentTime, { from: 520, to: 300, dur: 0.1, vol: volume });
}

/** Command palette open — reuses the Index open family for consistency. */
export function playPaletteOpen(volume = 0.1): void {
  playOpen(volume);
}

/** Command palette close — reuses the Index close family for consistency. */
export function playPaletteClose(volume = 0.1): void {
  playClose(volume);
}

/** Muted paper tap. Use for: project / case-study dialogs opening. */
export function playDialogOpen(): void {
  const c = ensureCtx();
  if (!c || c.ac.state !== 'running' || muted || !takeVoice(140)) return;
  swell(c.ac, c.out, c.ac.currentTime, { from: 260, to: 430, dur: 0.07, vol: 0.07 });
}

/** Muted paper tap, falling. Use for: project / case-study dialogs closing. */
export function playDialogClose(): void {
  const c = ensureCtx();
  if (!c || c.ac.state !== 'running' || muted || !takeVoice(120)) return;
  swell(c.ac, c.out, c.ac.currentTime, { from: 430, to: 260, dur: 0.06, vol: 0.06 });
}

/**
 * Very quiet dry click for palette arrow-key navigation and dialog paging.
 * Throttled so held keys don't rattle; `up` nudges the click's brightness
 * for a hint of direction.
 */
export function playNavTick(up = false): void {
  const now = typeof performance !== 'undefined' ? performance.now() : 0;
  if (now - lastNavTickAt < 70) return;
  lastNavTickAt = now;
  const c = ensureCtx();
  if (!c || c.ac.state !== 'running' || muted || !takeVoice(40)) return;
  noiseBurst(c.ac, c.out, c.ac.currentTime, {
    durationMs: 12,
    hpHz: up ? 2400 : 1700,
    volume: 0.035,
  });
}

/** Two restrained notes, no reverb tail. Use for: copy-email confirmation. */
export function playConfirm(): void {
  const c = ensureCtx();
  if (!c || c.ac.state !== 'running' || muted || !takeVoice(300)) return;
  const t = c.ac.currentTime;
  const notes: Array<[number, number]> = [
    [660, 0],
    [880, 0.09],
  ];
  for (const [freq, dt] of notes) {
    const osc = c.ac.createOscillator();
    const g = c.ac.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, t + dt);
    g.gain.exponentialRampToValueAtTime(0.09, t + dt + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dt + 0.14);
    osc.connect(g);
    g.connect(c.out);
    osc.start(t + dt);
    osc.stop(t + dt + 0.15);
  }
}
