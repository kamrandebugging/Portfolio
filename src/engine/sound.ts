// Tiny WebAudio "pop" synth — no audio assets needed.
//
// Browsers block audio before the first user gesture, so the AudioContext
// unlocks on the first pointerdown/keydown/touchstart. Calls to playPop()
// before that are silently ignored — motion still runs, sound joins in
// after the user's first tap.

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

/**
 * Crisp UI "pop": a short pitched blip (triangle 680→240 Hz, ~70ms)
 * layered with a 20ms high-passed noise click transient.
 */
export function playPop(volume = 0.4): void {
  const ac = ensureCtx();
  if (!ac || ac.state !== 'running') return;
  const t = ac.currentTime;

  // Body: quick pitched blip
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

  // Click transient: 20ms decaying noise burst, high-passed
  const len = Math.max(1, Math.floor(ac.sampleRate * 0.02));
  const buf = ac.createBuffer(1, len, ac.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const src = ac.createBufferSource();
  src.buffer = buf;
  const hp = ac.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.value = 2500;
  const g2 = ac.createGain();
  g2.gain.value = volume * 0.5;
  src.connect(hp);
  hp.connect(g2);
  g2.connect(ac.destination);
  src.start(t);
}
