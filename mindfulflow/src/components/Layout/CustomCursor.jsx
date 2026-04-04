import { useEffect, useState, memo } from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * Editorial dot + ring cursor — fine pointers only, hidden for reduced motion / touch.
 */
const CustomCursor = memo(function CustomCursor() {
  const reduced = useReducedMotion();
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const [finePointer, setFinePointer] = useState(false);

  useEffect(() => {
    if (reduced) {
      document.documentElement.classList.remove('has-studio-cursor');
      return undefined;
    }

    const mq = window.matchMedia('(pointer: fine)');

    const syncPointerMode = () => {
      const ok = mq.matches;
      setFinePointer(ok);
      document.documentElement.classList.toggle('has-studio-cursor', ok);
    };

    syncPointerMode();
    mq.addEventListener('change', syncPointerMode);

    const onMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
      setVisible(true);
    };
    const onLeave = () => setVisible(false);
    const onDown = () => document.documentElement.classList.add('cursor-press');
    const onUp = () => document.documentElement.classList.remove('cursor-press');

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);

    return () => {
      mq.removeEventListener('change', syncPointerMode);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.documentElement.classList.remove('has-studio-cursor', 'cursor-press');
    };
  }, [reduced]);

  if (reduced || !finePointer || !visible) return null;

  return (
    <div
      className="pointer-events-none fixed left-0 top-0 z-[9999] w-0 h-0"
      style={{ left: pos.x, top: pos.y }}
      aria-hidden
    >
      <span className="custom-cursor-dot" />
      <span className="custom-cursor-ring" />
    </div>
  );
});

export default CustomCursor;
