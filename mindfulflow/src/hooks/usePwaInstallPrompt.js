import { useCallback, useEffect, useState } from "react";

/**
 * Captures beforeinstallprompt (Chromium) so the UI can call prompt() from a user gesture.
 */
export function usePwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const onBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstall);
  }, []);

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) return { outcome: "unavailable", success: false };
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    return { outcome, success: outcome === "accepted" };
  }, [deferredPrompt]);

  return { canPromptInstall: !!deferredPrompt, promptInstall };
}
