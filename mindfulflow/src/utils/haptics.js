/**
 * Safe wrapper for the Navigation Vibration API.
 * Provides consistent, pre-defined haptic patterns for the app.
 * Degrades gracefully if the device does not support it.
 */

// Check if vibration is supported
const isSupported = typeof navigator !== 'undefined' && 'vibrate' in navigator;

export const haptics = {
  /**
   * Extremely light tap. Best for minor interactions (button hover/focus, scrolling ticks)
   */
  light: () => {
    if (isSupported) navigator.vibrate(10);
  },

  /**
   * Standard medium tap. Best for button presses, tab switches.
   */
  medium: () => {
    if (isSupported) navigator.vibrate(25);
  },

  /**
   * Heavy tap. Best for destructive actions or major state changes.
   */
  heavy: () => {
    if (isSupported) navigator.vibrate(50);
  },

  /**
   * Two rapid taps (Success/Completion)
   */
  success: () => {
    if (isSupported) navigator.vibrate([20, 40, 30]);
  },

  /**
   * Distinct warning/error pattern
   */
  error: () => {
    if (isSupported) navigator.vibrate([40, 50, 40, 50, 40]);
  },

  /**
   * Inhale breathing sync start
   */
  breathingIn: () => {
    if (isSupported) navigator.vibrate([10, 30, 10, 30, 10]);
  },
  
  /**
   * Exhale breathing sync start
   */
  breathingOut: () => {
      if (isSupported) navigator.vibrate([30, 20, 30]);
  }
};
