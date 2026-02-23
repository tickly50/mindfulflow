import { useState, useEffect, memo } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { db } from '../../utils/db';
import { ACHIEVEMENTS, checkAndUnlockAchievements } from '../../utils/achievements';
import { microInteractions, variants } from '../../utils/animations';
import { useMoodEntries } from '../../utils/queries';

const AchievementsView = memo(function AchievementsView() {
  const [unlockedIds, setUnlockedIds] = useState(new Set());
  const entries = useMoodEntries(false);

  useEffect(() => {
    const loadAchievements = async () => {
      // First, check if any new ones should be unlocked
      if (entries && entries.length > 0) {
        await checkAndUnlockAchievements(entries);
      }
      // Then load all unlocked ones
      const existing = await db.achievements.toArray();
      setUnlockedIds(new Set(existing.map(a => a.id)));
    };
    loadAchievements();
  }, [entries]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
      <motion.div
        variants={variants.slideUp}
        initial="hidden"
        animate="show"
        className="mb-8"
      >
        <h2 className="text-3xl font-bold text-white flex items-center gap-3 mb-2">
          <Icons.Award className="w-8 h-8 text-amber-400" />
          Tvé Úspěchy
        </h2>
        <p className="text-white/60">Sbírej odznaky za plnění milníků a péči o své zdraví</p>
      </motion.div>

      <motion.div 
        className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
        variants={variants.staggerContainer}
        initial="hidden"
        animate="show"
      >
        {ACHIEVEMENTS.map((achievement, i) => {
          const isUnlocked = unlockedIds.has(achievement.id);
          const Icon = Icons[achievement.icon] || Icons.Award;

          return (
            <motion.div
              key={achievement.id}
              variants={variants.item}
              whileHover={isUnlocked ? { scale: 1.05, y: -5, transition: { type: "spring", stiffness: 300, damping: 20 } } : {}}
              className={`relative flex flex-col items-center p-6 rounded-[2rem] border transition-colors duration-300 transform-gpu ${
                isUnlocked 
                  ? 'bg-white/10 border-white/20 shadow-lg ' + (achievement.shadow || 'shadow-glow-violet')
                  : 'bg-black/20 border-white/5 opacity-50 grayscale hover:opacity-100 hover:grayscale-0'
              }`}
              style={{ willChange: 'transform, opacity' }}
            >
              <motion.div 
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mb-4 ${
                  isUnlocked ? `bg-gradient-to-br ${achievement.gradient} shadow-lg` : 'bg-white/10'
                }`}
                initial={isUnlocked ? { scale: 0.5, rotate: -45 } : false}
                animate={isUnlocked ? { scale: 1, rotate: 0 } : false}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: i * 0.05 + 0.2 }}
                whileHover={isUnlocked ? { rotate: [0, -10, 10, -10, 0], scale: 1.1, transition: { duration: 0.5 } } : {}}
              >
                <Icon className={`w-8 h-8 sm:w-10 sm:h-10 ${isUnlocked ? 'text-white' : 'text-white/40'}`} />
              </motion.div>
              <h4 className="text-lg font-bold text-white text-center leading-tight mb-2">
                {achievement.title}
              </h4>
              <p className="text-sm text-center text-white/60 leading-snug">
                {isUnlocked ? 'Odemčeno!' : achievement.description}
              </p>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
});

export default AchievementsView;
