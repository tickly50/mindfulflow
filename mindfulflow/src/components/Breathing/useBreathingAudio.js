import { useRef, useCallback, useEffect } from 'react';

const PHASE_CONFIGS = {
  inhale: { startHz: 256, endHz: 320, rampSec: 0.65 },
  hold:   { startHz: 320, endHz: 320, rampSec: 0 },
  hold1:  { startHz: 320, endHz: 320, rampSec: 0 },
  exhale: { startHz: 320, endHz: 220, rampSec: 0.65 },
  hold2:  { startHz: 220, endHz: 220, rampSec: 0 },
};

export function useBreathingAudio() {
  const ctxRef     = useRef(null);
  const enabledRef = useRef(true);

  const getCtx = useCallback(() => {
    if (!ctxRef.current || ctxRef.current.state === 'closed') {
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return ctxRef.current;
  }, []);

  const playTone = useCallback((phaseName) => {
    if (!enabledRef.current) return;
    const cfg = PHASE_CONFIGS[phaseName];
    if (!cfg) return;

    try {
      const ctx = getCtx();
      if (ctx.state === 'suspended') ctx.resume();

      const now = ctx.currentTime;
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(cfg.startHz, now);
      if (cfg.endHz !== cfg.startHz && cfg.rampSec > 0) {
        osc.frequency.exponentialRampToValueAtTime(cfg.endHz, now + cfg.rampSec);
      }

      gain.gain.setValueAtTime(0,    now);
      gain.gain.linearRampToValueAtTime(0.07, now + 0.04);
      gain.gain.setValueAtTime(0.07, now + 0.48);
      gain.gain.linearRampToValueAtTime(0,    now + 0.95);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 1.05);
    } catch (_) {
      // AudioContext may be unavailable in some environments
    }
  }, [getCtx]);

  const setEnabled = useCallback((val) => {
    enabledRef.current = val;
  }, []);

  useEffect(() => {
    return () => {
      if (ctxRef.current) {
        ctxRef.current.close().catch(() => {});
        ctxRef.current = null;
      }
    };
  }, []);

  return { playTone, setEnabled };
}
