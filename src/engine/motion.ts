/**
 * Motion preference: follows the device's "reduce motion" setting by default,
 * and a visible toggle (in the menu) can override it either way. The result
 * is mirrored to <html data-motion="full|reduced"> so CSS can react too.
 */
const KEY = 'mk-motion';
export type MotionPref = 'auto' | 'on' | 'off';

export const getMotionPref = (): MotionPref => {
  try {
    const stored = localStorage.getItem(KEY);
    return stored === 'on' || stored === 'off' ? stored : 'auto';
  } catch {
    return 'auto';
  }
};

export const systemReducesMotion = (): boolean =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const isReduced = (): boolean => {
  const pref = getMotionPref();
  return pref === 'off' || (pref === 'auto' && systemReducesMotion());
};

export const applyMotionAttribute = (): void => {
  document.documentElement.dataset.motion = isReduced() ? 'reduced' : 'full';
};

/** Scenes are built once at load, so changing the preference reloads the page. */
export const setMotionPref = (pref: MotionPref): void => {
  try {
    if (pref === 'auto') localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, pref);
  } catch {
    /* storage blocked: the toggle simply will not persist */
  }
  window.location.reload();
};
