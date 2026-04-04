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
    <div className="max-w-app mx-auto w-full min-w-0 pb-16 md:pb-24">
      <motion.div
        variants={variants.slideUp}
        initial="hidden"
        animate="show"
        className="mb-8"
      >
        <h2 className="text-fluid-3xl font-semibold text-theme-text flex flex-wrap items-center gap-3 mb-2 tracking-tight">
          <Award className="w-8 h-8 text-[var(--accent-soft)]" />
          Tvé Úspěchy
        </h2>
        <p className="text-theme-muted text-fluid-base max-w-prose leading-relaxed">Sbírej odznaky za plnění svých cílů a péči o zdraví.</p>
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 min-[380px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-[clamp(1rem,3vw,1.5rem)]"
        variants={variants.staggerContainer}
        initial="hidden"
        animate="show"
      >
        {ACHIEVEMENTS.map((achievement) => {
          const isUnlocked = unlockedIds.has(achievement.id);
          const iconMap = { Sun, BookOpen, Flame, Wind, Award, Moon, Trophy, Star, Heart, Crown, Coffee, Activity, Sparkles, Smile, Users, Briefcase };
          const Icon = iconMap[achievement.icon] || Award;

          return (
            <motion.div
              key={achievement.id}
              layout
              whileHover={isUnlocked ? { scale: 1.035, y: -4 } : undefined}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              className={`relative flex flex-col items-center p-6 sm:p-8 rounded-[2.5rem] border overflow-hidden transition-[background-color,border-color] duration-theme ${
                isUnlocked 
                  ? 'bg-theme-card border-theme-border shadow-depth-lg'
                  : 'bg-theme-elevated/50 border-theme-border opacity-50 grayscale'
              }`}
            >
              {isUnlocked && (
                 <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none rounded-[2.5rem]" />
              )}
              <div 
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mb-4 ${
                  isUnlocked ? `bg-gradient-to-br ${achievement.gradient} shadow-lg` : 'bg-theme-elevated'
                }`}
              >
                <Icon className={`w-8 h-8 sm:w-10 sm:h-10 ${isUnlocked ? 'text-white' : 'text-theme-muted'}`} />
              </div>
              <h4 className={`text-lg font-bold text-center leading-tight mb-2 ${isUnlocked ? 'text-white' : 'text-theme-text'}`}>
                {achievement.title}
              </h4>
              <p className={`text-sm text-center leading-snug mb-2 ${isUnlocked ? 'text-white/75' : 'text-theme-muted'}`}>
                {achievement.description}
              </p>
              {isUnlocked && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[var(--accent-soft)] bg-[var(--accent-glow)] border border-[var(--accent)]/25 px-2.5 py-1 rounded-full">
                  ✓ Odemčeno
                </span>
              )}
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
});

export default AchievementsView;
