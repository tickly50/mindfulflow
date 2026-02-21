import { Flame, BarChart3, TrendingUp, Activity, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { MOOD_ADJECTIVES } from '../../utils/moodCalculations';

const formatDays = (count) => {
  if (count === 1) return '1 den';
  if (count >= 2 && count <= 4) return `${count} dny`;
  return `${count} dní`;
};

// Stagger container for stat cards
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.09, delayChildren: 0.05 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.94 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 260, damping: 24, mass: 0.5 },
  },
};

export default function StatsOverview({ stats, streak, longestStreak, avgSleep }) {
  if (!stats) return null;

  const cards = [
    {
      label: 'Aktuální Série',
      value: formatDays(streak),
      icon: Flame,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/20',
      desc: `Rekord: ${formatDays(longestStreak || 0)}`,
    },
    {
      label: 'Celkem Záznamů',
      value: stats.total,
      icon: BarChart3,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      desc: 'Tvoje cesta v číslech',
    },
    {
      label: 'Průměrná Nálada',
      value: MOOD_ADJECTIVES[Math.round(stats.average)] || stats.average,
      icon: TrendingUp,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      desc: 'Celková pohoda',
    },
    {
      label: 'Stabilita',
      value: `${stats.stability}%`,
      icon: Activity,
      color: 'text-violet-400',
      bg: 'bg-violet-500/10',
      border: 'border-violet-500/20',
      desc: 'Emoční vyrovnanost',
    },
    {
      label: 'Spánek',
      value: avgSleep ? `${avgSleep}h` : '—',
      icon: Moon,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/20',
      desc: 'Průměr / noc',
    },
  ];

  return (
    <motion.div
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {cards.map((card) => (
        <motion.div
          key={card.label}
          variants={cardVariants}
          whileHover={{
            y: -4,
            scale: 1.02,
            transition: { type: 'spring', stiffness: 300, damping: 20 },
          }}
          className={`glass p-4 rounded-2xl border ${card.border} relative overflow-hidden group cursor-default`}
          style={{ willChange: 'transform' }}
        >
          {/* Background glow */}
          <div
            className={`absolute -right-4 -top-4 w-24 h-24 rounded-full ${card.bg} blur-2xl opacity-50 group-hover:opacity-100`}
            style={{ transition: 'opacity 0.4s ease' }}
          />

          <div className="relative z-10">
            <motion.div
              className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center mb-3 ${card.color}`}
              whileHover={{ rotate: 10, scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 360, damping: 16 }}
            >
              <card.icon className="w-5 h-5" />
            </motion.div>

            <div className="text-2xl font-bold text-white mb-1">
              {card.value}
            </div>

            <div className="text-sm text-white/60 font-medium mb-1">
              {card.label}
            </div>

            <div className="text-xs text-white/40">
              {card.desc}
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
