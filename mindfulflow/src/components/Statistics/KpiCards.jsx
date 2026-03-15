import { memo } from 'react';
import { Flame, BarChart3, TrendingUp, Activity, Moon } from 'lucide-react';
import { MOOD_ADJECTIVES } from '../../utils/moodConstants';

const formatDays = (n) => {
  if (n === 1) return '1 den';
  if (n >= 2 && n <= 4) return `${n} dny`;
  return `${n} dní`;
};

const CARDS = [
  {
    key: 'streak',
    label: 'Série',
    Icon: Flame,
    color: '#f97316',
    bg: 'rgba(249,115,22,0.12)',
    border: 'rgba(249,115,22,0.25)',
  },
  {
    key: 'total',
    label: 'Záznamy',
    Icon: BarChart3,
    color: '#60a5fa',
    bg: 'rgba(96,165,250,0.12)',
    border: 'rgba(96,165,250,0.25)',
  },
  {
    key: 'mood',
    label: 'Průměrná nálada',
    Icon: TrendingUp,
    color: '#34d399',
    bg: 'rgba(52,211,153,0.12)',
    border: 'rgba(52,211,153,0.25)',
  },
  {
    key: 'stability',
    label: 'Stabilita',
    Icon: Activity,
    color: '#a78bfa',
    bg: 'rgba(167,139,250,0.12)',
    border: 'rgba(167,139,250,0.25)',
  },
  {
    key: 'sleep',
    label: 'Spánek / noc',
    Icon: Moon,
    color: '#818cf8',
    bg: 'rgba(129,140,248,0.12)',
    border: 'rgba(129,140,248,0.25)',
  },
];

const KpiCards = memo(function KpiCards({ stats, streak, longestStreak, avgSleep }) {
  if (!stats) return null;

  const values = {
    streak: formatDays(streak),
    total: stats.total,
    mood: MOOD_ADJECTIVES[Math.round(stats.average)] || '—',
    stability: `${stats.stability}%`,
    sleep: avgSleep ? `${avgSleep}h` : '—',
  };

  const descs = {
    streak: `Rekord: ${formatDays(longestStreak || 0)}`,
    total: 'Tvoje cesta v číslech',
    mood: 'Celková pohoda',
    stability: 'Emoční vyrovnanost',
    sleep: 'Průměr za vybrané období',
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8">
      {CARDS.map(({ key, label, Icon, color, bg, border }, i) => (
        <div
          key={key}
          className="relative rounded-2xl p-4 sm:p-5 flex flex-col justify-between overflow-hidden stats-card"
          style={{
            background: 'rgba(15,23,42,0.55)',
            border: `1px solid ${border}`,
            backdropFilter: 'blur(16px)',
            animationDelay: `${i * 60}ms`,
          }}
        >
          <div
            className="absolute -right-5 -top-5 w-24 h-24 rounded-full pointer-events-none"
            style={{ background: bg, filter: 'blur(24px)', opacity: 0.7 }}
          />
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center mb-3 relative z-10"
            style={{ background: bg }}
          >
            <Icon size={18} style={{ color }} />
          </div>
          <div className="relative z-10">
            <div className="text-xl sm:text-2xl font-bold text-white leading-none mb-1">
              {values[key]}
            </div>
            <div className="text-xs sm:text-sm text-white/60 font-medium mb-0.5">{label}</div>
            <div className="text-[10px] sm:text-xs text-white/40 leading-tight">{descs[key]}</div>
          </div>
        </div>
      ))}
    </div>
  );
});

export default KpiCards;
