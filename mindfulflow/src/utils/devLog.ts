/** Dev-only diagnostics; stripped in production builds via Vite esbuild `drop`. */
export function devError(...args: unknown[]): void {
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console -- intentional dev-only sink
    console.error(...args);
  }
}
