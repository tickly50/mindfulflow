import { motion, useReducedMotion } from 'framer-motion';

/**
 * Scroll-triggered section reveal (viewport once). Respects reduced motion.
 */
export default function RevealOnScroll({
  children,
  className = '',
  delay = 0,
  y = 32,
}) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-48px 0px -48px 0px', amount: 0.15 }}
      transition={{
        duration: 0.62,
        ease: [0.16, 1, 0.3, 1],
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}
