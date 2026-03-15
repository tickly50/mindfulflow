import { useEffect, useRef, memo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { motion } from 'framer-motion';

import { db } from '../../utils/db';
import { ACHIEVEMENTS, checkAndUnlockAchievements } from '../../utils/achievements';
import { variants } from '../../utils/animations';
import { useMoodEntries } from '../../utils/queries';
import { Award, Sun, BookOpen, Flame, Wind, Moon, Trophy, Star, Heart, Crown, Coffee, Activity, Sparkles, Smile, Users, Briefcase } from 'lucide-react';

const AchievementsView = memo(function AchievementsView() {
  const entries = useMoodEntries(false);

  // Reactive read of the achievements table — re-renders only when rows are added
  const unlockedAchievements = useLiveQuery(() => db.achievements.toArray(), []);
  const unlockedIds = unlockedAchievements
    ? new Set(unlockedAchievements.map(a => a.id))
    : new Set();

  // Track the last entry count we ran the check for so we only pay the O(n×m)
  // cost when a genuinely new mood entry has been added, not on every DB write.
  const lastCheckedCountRef = useRef(-1);

  useEffect(() => {
    if (!entries) return;
    const count = entries.length;
    if (count === lastCheckedCountRef.current) return;
    lastCheckedCountRef.current = count;

    if (count > 0) {
      checkAndUnlockAchievements(entries).catch(() => {});
    }
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
          <Award className="w-8 h-8 text-amber-400" />
          Tvé Úspěchy
        </h2>
        <p className="text-white/60">Sbírej odznaky za plnění svých cílů a péči o zdraví.</p>
      </motion.div>

      <motion.div 
        className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
        variants={variants.staggerContainer}
        initial="hidden"
        animate="show"
      >
        {ACHIEVEMENTS.map((achievement) => {
          const isUnlocked = unlockedIds.has(achievement.id);
          const iconMap = { Sun, BookOpen, Flame, Wind, Award, Moon, Trophy, Star, Heart, Crown, Coffee, Activity, Sparkles, Smile, Users, Briefcase };
          const Icon = iconMap[achievement.icon] || Award;

          return (
            <div
              key={achievement.id}
              className={`relative flex flex-col items-center p-6 sm:p-8 rounded-[2.5rem] border overflow-hidden ${
                isUnlocked 
                  ? 'bg-white/10 border-white/20'
                  : 'bg-black/40 border-white/5 opacity-50 grayscale'
              }`}
              style={isUnlocked ? { transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)' } : undefined}
              onMouseEnter={isUnlocked ? e => e.currentTarget.style.transform = 'scale(1.04)' : undefined}
              onMouseLeave={isUnlocked ? e => e.currentTarget.style.transform = 'scale(1)' : undefined}
            >
              {isUnlocked && (
                 <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none rounded-[2.5rem]" />
              )}
              <div 
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mb-4 ${
                  isUnlocked ? `bg-gradient-to-br ${achievement.gradient} shadow-lg` : 'bg-white/10'
                }`}
              >
                <Icon className={`w-8 h-8 sm:w-10 sm:h-10 ${isUnlocked ? 'text-white' : 'text-white/60'}`} />
              </div>
              <h4 className="text-lg font-bold text-white text-center leading-tight mb-2">
                {achievement.title}
              </h4>
              <p className="text-sm text-center text-white/60 leading-snug mb-2">
                {achievement.description}
              </p>
              {isUnlocked && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400/90 bg-amber-400/10 border border-amber-400/20 px-2.5 py-1 rounded-full">
                  ✓ Odemčeno
                </span>
              )}
            </div>
          );
        })}
      </motion.div>
    </div>
  );
});

export default AchievementsView;
