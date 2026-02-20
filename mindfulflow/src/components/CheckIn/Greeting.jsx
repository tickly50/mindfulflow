import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { getDailyQuote } from '../../utils/quotes';
import { variants } from '../../utils/animations';

/**
 * Dynamic greeting based on time of day – animated hero entrance
 */
const Greeting = memo(function Greeting() {
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12)
      return { text: 'Dobré ráno', emoji: '🌅', gradient: 'from-amber-300 via-orange-400 to-rose-500' };
    else if (hour >= 12 && hour < 17)
      return { text: 'Dobré odpoledne', emoji: '☀️', gradient: 'from-yellow-300 via-amber-400 to-orange-500' };
    else if (hour >= 17 && hour < 22)
      return { text: 'Dobrý večer', emoji: '🌆', gradient: 'from-violet-300 via-purple-400 to-indigo-500' };
    else
      return { text: 'Dobrá noc', emoji: '🌙', gradient: 'from-indigo-300 via-violet-400 to-purple-500' };
  }, []);

  const quote = useMemo(() => getDailyQuote(), []);

  return (
    <motion.div
      className="text-center mb-12 relative z-10"
      variants={variants.container}
      initial="hidden"
      animate="show"
    >
      {/* Emoji – bounces in from above */}
      <motion.div
        variants={variants.heroEmoji}
        className="inline-block mb-4"
      >
        <span className="text-6xl md:text-7xl filter drop-shadow-lg select-none">
          {greeting.emoji}
        </span>
      </motion.div>

      {/* Title */}
      <motion.div variants={variants.heroTitle} className="relative mb-3">
        <h2
          className={`text-4xl md:text-6xl font-black tracking-tight bg-gradient-to-r ${greeting.gradient} bg-clip-text text-transparent`}
          style={{ lineHeight: 1.2 }}
        >
          {greeting.text}
        </h2>
        {/* ambient glow */}
        <div
          className={`absolute inset-0 blur-3xl opacity-25 bg-gradient-to-r ${greeting.gradient} -z-10 rounded-full scale-150 pointer-events-none`}
        />
      </motion.div>

      {/* Subtitle */}
      <motion.p
        variants={variants.heroSubtitle}
        className="text-white/70 text-xl font-light tracking-wide mb-8"
      >
        Jak se dnes cítíš?
      </motion.p>

      {/* Daily Quote Card */}
      <motion.div
        variants={variants.heroQuote}
        className="max-w-xl mx-auto"
      >
        <div className="relative">
          <div className="relative glass px-8 py-6 rounded-3xl border border-white/10 shadow-2xl hover:bg-white/5 transition-colors duration-300">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />
            <p className="text-white/90 text-lg italic font-medium leading-relaxed font-serif tracking-wide">
              "{quote}"
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
});

export default Greeting;
