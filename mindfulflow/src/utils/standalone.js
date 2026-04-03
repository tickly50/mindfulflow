/**
 * Returns true when the app runs as an installed PWA (home screen / app window).
 * Pouze `standalone` (+ iOS `navigator.standalone`). Režimy `fullscreen` a `minimal-ui`
 * v některých prohlížečích/webview lživě matchují i běžnou kartu → bez úvodní stránky.
 */
export function isStandaloneDisplay() {
  if (typeof window === "undefined") return false;
  if (window.navigator.standalone === true) return true;
  return window.matchMedia("(display-mode: standalone)").matches;
}
