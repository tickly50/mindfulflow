import { memo } from 'react';
import GlassCard from '../../components/common/GlassCard';

const MOOD_EMOJIS = { 5: '😄', 4: '😌', 3: '😐', 2: '😰', 1: '😞' };

const MoodDistributionBar = memo(function MoodDistributionBar({ distributionData }) {
  if (!distributionData || distributionData.length === 0) return null;

  return (
    <GlassCard className="p-5 sm:p-6 flex flex-col">
      <h3 className="text-lg font-bold text-white mb-1">Rozložení nálad</h3>
      <p className="text-white/50 text-sm mb-5">Jak často jsi byl v jaké náladě</p>

      <div className="flex flex-col gap-3 flex-1 justify-center">
        {distributionData.map(({ mood, label, count, pct, color }) => (
          <div key={mood} className="flex items-center gap-3">
            <span className="text-lg w-7 text-center flex-shrink-0">{MOOD_EMOJIS[mood]}</span>
            <div className="flex-1">
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-white/80 text-xs font-medium">{label}</span>
                <span className="text-white/40 text-xs">{count}×</span>
              </div>
              <div className="h-2 rounded-full bg-white/8 overflow-hidden">
                <div
                  className="h-full rounded-full bar-fill"
                  style={{
                    width: `${pct}%`,
                    background: color,
                    boxShadow: `0 0 8px ${color}60`,
                  }}
                />
              </div>
            </div>
            <span className="text-white/50 text-xs w-9 text-right flex-shrink-0">{pct}%</span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
});

export default MoodDistributionBar;
