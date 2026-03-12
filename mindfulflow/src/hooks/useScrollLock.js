import { useEffect } from 'react';

/**
 * Lock body scroll when `active` is true.
 * @param {boolean} active - Whether to lock scroll
 * @param {boolean} [fullLock=false] - Also lock documentElement and block touchmove (for iOS Safari)
 */
const useScrollLock = (active, fullLock = false) => {
  useEffect(() => {
    if (!active) return;

    document.body.style.overflow = 'hidden';
    if (fullLock) {
      document.documentElement.style.overflow = 'hidden';
    }

    let preventTouch;
    if (fullLock) {
      preventTouch = (e) => e.preventDefault();
      document.addEventListener('touchmove', preventTouch, { passive: false });
    }

    return () => {
      document.body.style.overflow = '';
      if (fullLock) {
        document.documentElement.style.overflow = '';
        document.removeEventListener('touchmove', preventTouch);
      }
    };
  }, [active, fullLock]);
};

export default useScrollLock;
