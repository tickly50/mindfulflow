import { memo, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { getDailyQuote } from '../../utils/quotes';
import { variants, reducedMotionVariants } from '../../utils/animations';

/** Jednoduchý pozdrav — bez gradientů a paralaxy */
const Greeting = memo(function Greeting() {
  const prefersReduced = useReducedMotion();

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return { text: 'Dobré ráno', emoji: '🌅' };
    if (hour >= 12 && hour < 17) return { text: 'Dobré odpoledne', emoji: '☀️' };
    if (hour >= 17 && hour < 22) return { text: 'Dobrý večer', emoji: '🌆' };
    return { text: 'Dobrá noc', emoji: '🌙' };
  }, []);

  const quote = useMemo(() => getDailyQuote(), []);

  return (
    <motion.div
      className="text-center mb-10 md:mb-12 relative z-10 px-1"
      variants={prefersReduced ? reducedMotionVariants.container : variants.container}
      initial="hidden"
      animate="show"
    >
      <motion.div
        variants={prefersReduced ? reducedMotionVariants.item : variants.fadeIn}
        className="inline-block mb-3"
      >
        <span className="text-[clamp(2rem,8vw,3rem)] select-none leading-none block opacity-90">
          {greeting.emoji}
        </span>
      </motion.div>

      <motion.h2
        variants={prefersReduced ? reducedMotionVariants.item : variants.fadeIn}
        className="text-fluid-3xl md:text-4xl font-semibold text-theme-text tracking-tight mb-2"
        style={{ lineHeight: 1.2 }}
      >
        {greeting.text}
      </motion.h2>

      <motion.p
        variants={prefersReduced ? reducedMotionVariants.item : variants.fadeIn}
        className="text-theme-muted text-fluid-base font-normal mb-8"
      >
        Jak se dnes cítíš?
      </motion.p>

      <motion.div
        role="blockquote"
        variants={prefersReduced ? reducedMotionVariants.item : variants.fadeIn}
        className="max-w-prose-narrow mx-auto text-left border-l border-theme-border pl-4 py-1"
      >
        <p className="text-theme-muted text-fluid-sm leading-relaxed">&ldquo;{quote}&rdquo;</p>
      </motion.div>
    </motion.div>
  );
});

export default Greeting;
