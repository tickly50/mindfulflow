import { useEffect } from 'react';

/**
 * Lock body scroll when `active` is true.
 * Always locks both body and html to prevent scroll transfer between them.
 * @param {boolean} active - Whether to lock scroll
 * @param {boolean} [blockTouch=false] - Also block touchmove events (for iOS Safari)
 */
const useScrollLock = (active, blockTouch = false) => {
  useEffect(() => {
    if (!active) return;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    let preventTouch;
    if (blockTouch) {
      preventTouch = (e) => e.preventDefault();
      document.addEventListener('touchmove', preventTouch, { passive: false });
    }

    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      if (blockTouch && preventTouch) {
        document.removeEventListener('touchmove', preventTouch);
      }
    };
  }, [active, blockTouch]);
};

export default useScrollLock;
