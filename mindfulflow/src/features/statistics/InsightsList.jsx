import { memo } from 'react';
import { Lightbulb, TrendingUp, TrendingDown, Briefcase, Moon, Users, Heart, DollarSign, MessageCircle } from 'lucide-react';
import GlassCard from '../../components/common/GlassCard';

const ICON_MAP = { Briefcase, Moon, Users, Heart, DollarSign, MessageCircle };

const InsightsList = memo(function InsightsList({ insights }) {
  if (!insights || insights.length === 0) return null;

  return (
    <GlassCard className="p-5 sm:p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-violet-800 flex items-center justify-center flex-shrink-0">
          <Lightbulb size={18} className="text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Chytré postřehy</h3>
          <p className="text-white/50 text-xs">Analýza tvých dat</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {insights.map((insight, i) => {
          const isPositive = insight.type === 'positive';
          const Icon = ICON_MAP[insight.icon] || (isPositive ? TrendingUp : TrendingDown);
          return (
            <div
              key={insight.id}
              className="flex gap-3 p-4 rounded-xl insight-item"
              style={{
                background: isPositive ? 'rgba(52,211,153,0.08)' : 'rgba(249,115,22,0.08)',
                border: `1px solid ${isPositive ? 'rgba(52,211,153,0.2)' : 'rgba(249,115,22,0.2)'}`,
                animationDelay: `${i * 80}ms`,
              }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{
                  background: isPositive ? 'rgba(52,211,153,0.15)' : 'rgba(249,115,22,0.15)',
                  color: isPositive ? '#34d399' : '#f97316',
                }}
              >
                <Icon size={15} />
              </div>
              <div>
                <h4
                  className="font-semibold text-sm mb-1"
                  style={{ color: isPositive ? '#34d399' : '#f97316' }}
                >
                  {insight.title}
                </h4>
                <p className="text-white/70 text-sm leading-relaxed">{insight.text}</p>
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
});

export default InsightsList;
