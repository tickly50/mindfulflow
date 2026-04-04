import { memo, useMemo, useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { getDailyQuote } from '../../utils/quotes';
import { variants, reducedMotionVariants } from '../../utils/animations';

/**
 * Dynamic greeting based on time of day – animated hero entrance
 */
const Greeting = memo(function Greeting() {
  const prefersReduced = useReducedMotion();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, prefersReduced ? 0 : 72]);
  const glowScale = useTransform(scrollYProgress, [0, 1], [1, prefersReduced ? 1 : 1.12]);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12)
      return { text: 'Dobré ráno', emoji: '🌅', gradient: 'from-amber-300 via-orange-400 to-rose-500' };
    else if (hour >= 12 && hour < 17)
      return { text: 'Dobré odpoledne', emoji: '☀️', gradient: 'from-yellow-300 via-amber-400 to-orange-500' };
    else if (hour >= 17 && hour < 22)
      return { text: 'Dobrý večer', emoji: '🌆', gradient: 'from-amber-200 via-rose-400 to-teal-500' };
    else
      return { text: 'Dobrá noc', emoji: '🌙', gradient: 'from-slate-300 via-teal-500 to-amber-600' };
  }, []);

  const quote = useMemo(() => getDailyQuote(), []);

  return (
    <motion.div
      ref={heroRef}
      className="text-center mb-8 md:mb-12 relative z-10 px-1"
      variants={prefersReduced ? reducedMotionVariants.container : variants.container}
      initial="hidden"
      animate="show"
    >
      {/* Emoji – bounces in from above */}
      <motion.div
        variants={prefersReduced ? reducedMotionVariants.item : variants.heroEmoji}
        className="inline-block mb-4"
      >
        <span className="text-[clamp(2.75rem,12vw,4.5rem)] md:text-7xl filter drop-shadow-lg select-none leading-none block">
          {greeting.emoji}
        </span>
      </motion.div>

      {/* Title */}
      <motion.div
        variants={prefersReduced ? reducedMotionVariants.item : variants.heroTitle}
        className="relative mb-3"
      >
        <motion.h2
          className={`font-display text-fluid-4xl md:text-6xl font-black tracking-tight bg-gradient-to-r ${greeting.gradient} bg-clip-text text-transparent drop-shadow-[0_0_52px_rgba(45,212,191,0.22)]`}
          style={{ lineHeight: 1.12, letterSpacing: '-0.03em' }}
          y={parallaxY}
        >
          {greeting.text}
        </motion.h2>
        {/* ambient glow — subtle parallax depth */}
        <motion.div
          className={`absolute inset-0 blur-3xl opacity-30 bg-gradient-to-r ${greeting.gradient} -z-10 rounded-full scale-150 pointer-events-none`}
          style={{ scale: glowScale }}
        />
      </motion.div>

      {/* Subtitle */}
      <motion.p
        variants={prefersReduced ? reducedMotionVariants.item : variants.heroSubtitle}
        className="text-white/75 text-fluid-xl font-medium tracking-wide mb-6 md:mb-8 font-sans px-2"
      >
        Jak se dnes cítíš?
      </motion.p>

      {/* Daily Quote Card */}
      <motion.div
        variants={prefersReduced ? reducedMotionVariants.item : variants.heroQuote}
        className="max-w-xl mx-auto"
      >
        <div className="relative w-full max-w-prose-narrow mx-auto -rotate-1 sm:rotate-0">
          <div className="relative glass px-[clamp(1rem,4vw,2rem)] py-[clamp(1rem,3vw,1.5rem)] rounded-3xl border border-white/12 shadow-2xl hover:border-teal-400/25 hover:bg-white/[0.06] transition-all duration-300">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-teal-300/35 to-transparent opacity-70" />
            <div className="absolute -left-px top-6 bottom-6 w-px bg-gradient-to-b from-teal-400/40 via-transparent to-amber-400/30 opacity-80" aria-hidden />
            <p className="text-white/90 text-fluid-lg italic font-medium leading-relaxed font-serif-body tracking-wide pl-2">
              "{quote}"
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
});

export default Greeting;
