import { useMemo } from 'react';

/**
 * Heuristika pro slabší zařízení (bez uživatelského zásahu).
 * - deviceMemory <= 2 GB
 * - nebo hardwareConcurrency <= 4
 *
 * Cíl: vypnout náročnější animace (Framer Motion / efekty) a držet FPS.
 */
export default function useIsLowEndDevice() {
  return useMemo(() => {
    try {
      const dm = navigator?.deviceMemory;
      const hc = navigator?.hardwareConcurrency;
      return (typeof dm === 'number' && dm <= 2) || (typeof hc === 'number' && hc <= 4);
    } catch (_e) {
      return false;
    }
  }, []);
}

