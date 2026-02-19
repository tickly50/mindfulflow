import { Flame, BarChart3, TrendingUp, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { variants } from '../../utils/animations';
import { MOOD_LABELS, MOOD_ADJECTIVES } from '../../utils/moodCalculations';

const formatDays = (count) => {
  if (count === 1) return '1 den';
  if (count >= 2 && count <= 4) return `${count} dny`;
  return `${count} dní`;
};

/**
 * Stats Overview Component
 * Displays key metrics in a grid of glass cards
 */
export default function StatsOverview({ stats, streak, longestStreak }) {
  if (!stats) return null;

  const cards = [
    {
      label: 'Aktuální Série',
      value: formatDays(streak),
      icon: Flame,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/20',
      desc: `Rekord: ${formatDays(longestStreak || 0)}`
    },
    {
      label: 'Celkem Záznamů',
      value: stats.total,
      icon: BarChart3,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      desc: 'Tvoje cesta v číslech'
    },
    {
      label: 'Průměrná Nálada',
      value: MOOD_ADJECTIVES[Math.round(stats.average)] || stats.average,
      icon: TrendingUp,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      desc: 'Celková pohoda'
    },
    {
      label: 'Stabilita',
      value: `${stats.stability}%`,
      icon: Activity,
      color: 'text-violet-400',
      bg: 'bg-violet-500/10',
      border: 'border-violet-500/20',
      desc: 'Emoční vyrovnanost'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`glass p-4 rounded-2xl border ${card.border} relative overflow-hidden group`}
        >
          {/* Background decoration */}
          <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full ${card.bg} blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-500`} />

          <div className="relative z-10">
            <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center mb-3 ${card.color}`}>
              <card.icon className="w-5 h-5" />
            </div>
            
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
        </div>
      ))}
    </div>
  );
}
