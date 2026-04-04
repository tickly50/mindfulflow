import { memo, useMemo } from "react";
import { useReducedMotion } from "framer-motion";
import useIsLowEndDevice from "../../hooks/useIsLowEndDevice";

/**
 * Soft bokeh-style particles — pure CSS animation, respects reduced motion & low-end.
 */
const FloatingParticles = memo(function FloatingParticles({ className = "" }) {
  const reduced = useReducedMotion();
  const lowEnd = useIsLowEndDevice();

  const particles = useMemo(() => {
    const count = lowEnd ? 18 : 42;
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${(Math.sin(i * 1.7) * 0.5 + 0.5) * 92 + 4}%`,
      top: `${(Math.cos(i * 2.3) * 0.5 + 0.5) * 88 + 6}%`,
      size: 2 + (i % 5) * 1.2,
      duration: 14 + (i % 9) * 2,
      delay: -(i * 0.7) % 12,
      opacity: 0.12 + (i % 7) * 0.04,
      /* Teal → amber band — avoids generic rainbow */
      hue: 160 + ((i * 37) % 80),
    }));
  }, [lowEnd]);

  if (reduced) return null;

  return (
    <div
      className={`fixed inset-0 -z-[45] overflow-hidden pointer-events-none ${className}`}
      aria-hidden="true"
    >
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full particle-drift"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            background: `hsla(${p.hue}, 85%, 72%, 0.85)`,
            boxShadow: `0 0 ${p.size * 4}px hsla(${p.hue}, 90%, 60%, 0.35)`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
});

export default FloatingParticles;
