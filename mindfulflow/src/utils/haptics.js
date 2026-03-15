/**
 * Safe wrapper for the Navigation Vibration API.
 * Provides consistent, pre-defined haptic patterns for the app.
 * Respects the user's haptics setting from localStorage.
 * Degrades gracefully if the device does not support it.
 */

const isSupported = typeof navigator !== 'undefined' && 'vibrate' in navigator;

const isHapticsEnabled = () => {
  try {
    const s = JSON.parse(localStorage.getItem('mindfulflow_settings') || '{}');
    return s.hapticsEnabled !== false;
  } catch {
    return true;
  }
};

const vibrate = (pattern) => {
  if (isSupported && isHapticsEnabled()) navigator.vibrate(pattern);
};

export const haptics = {
  /** Extremely light tap. Best for minor interactions (button hover/focus, scrolling ticks). */
  light: () => vibrate(10),

  /** Standard medium tap. Best for button presses, tab switches. */
  medium: () => vibrate(25),

  /** Heavy tap. Best for destructive actions or major state changes. */
  heavy: () => vibrate(50),

  /** Two rapid taps (Success/Completion). */
  success: () => vibrate([20, 40, 30]),

  /** Distinct warning/error pattern. */
  error: () => vibrate([40, 50, 40, 50, 40]),

  /** Inhale breathing sync start. */
  breathingIn: () => vibrate([10, 30, 10, 30, 10]),

  /** Exhale breathing sync start. */
  breathingOut: () => vibrate([30, 20, 30]),
};
