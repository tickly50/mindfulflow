import { memo, useMemo, useState, useCallback, useRef } from 'react';
import GlassCard from '../../components/common/GlassCard';

const W = 600;
const H = 220;
const PAD = { top: 16, right: 16, bottom: 36, left: 32 };
const CHART_W = W - PAD.left - PAD.right;
const CHART_H = H - PAD.top - PAD.bottom;

const MOOD_COLORS_MAP = {
  1: '#ef4444',
  2: '#f59e0b',
  3: '#94a3b8',
  4: '#10b981',
  5: '#8b5cf6',
};

/** Convert data points to SVG smooth bezier path */
function buildPath(points) {
  if (points.length < 2) return '';
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cpx = (prev.x + curr.x) / 2;
    d += ` C ${cpx} ${prev.y}, ${cpx} ${curr.y}, ${curr.x} ${curr.y}`;
  }
  return d;
}

/** Build closed fill path (line + bottom-close) */
function buildFill(points) {
  if (points.length < 2) return '';
  const line = buildPath(points);
  const last = points[points.length - 1];
  const first = points[0];
  return `${line} L ${last.x} ${H - PAD.bottom} L ${first.x} ${H - PAD.bottom} Z`;
}

const MoodTrendChart = memo(function MoodTrendChart({ chartData }) {
  const [tooltip, setTooltip] = useState(null);
  const svgRef = useRef(null);
  const rectRef = useRef(null);
  const rafRef = useRef(0);
  const pendingIndexRef = useRef(null);
  const lastIndexRef = useRef(-1);

  const { points, xLabels, yTicks } = useMemo(() => {
    if (!chartData || chartData.length === 0) return { points: [], xLabels: [], yTicks: [] };

    const n = chartData.length;
    const pts = chartData.map((d, i) => ({
      x: PAD.left + (i / Math.max(n - 1, 1)) * CHART_W,
      y: PAD.top + ((5 - d.mood) / 4) * CHART_H,
      data: d,
    }));

    // Show up to 8 evenly-spaced x labels
    const maxLabels = 8;
    const step = Math.max(1, Math.floor(n / maxLabels));
    const xLabels = pts
      .filter((_, i) => i % step === 0 || i === n - 1)
      .map((p) => ({ x: p.x, label: p.data.date }));

    const yTicks = [1, 2, 3, 4, 5].map((v) => ({
      y: PAD.top + ((5 - v) / 4) * CHART_H,
      label: v,
    }));

    return { points: pts, xLabels, yTicks };
  }, [chartData]);

  const linePath = useMemo(() => buildPath(points), [points]);
  const fillPath = useMemo(() => buildFill(points), [points]);

  const handleMouseEnter = useCallback(() => {
    if (!svgRef.current) return;
    rectRef.current = svgRef.current.getBoundingClientRect();
  }, []);

  const handleMouseMove = useCallback(
    (e) => {
      if (!svgRef.current) return;
      const n = points.length;
      if (n === 0) return;

      const rect = rectRef.current ?? svgRef.current.getBoundingClientRect();
      rectRef.current = rect;

      const svgX = ((e.clientX - rect.left) / rect.width) * W;

      // points[i].x = PAD.left + (i/(n-1))*CHART_W
      const denom = Math.max(CHART_W, 1);
      const raw = ((svgX - PAD.left) / denom) * Math.max(n - 1, 1);
      const idx = Math.max(0, Math.min(n - 1, Math.round(raw)));

      if (idx === lastIndexRef.current) return;
      pendingIndexRef.current = idx;

      // Only commit tooltip once per animation frame.
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0;
        const targetIdx = pendingIndexRef.current;
        pendingIndexRef.current = null;
        if (targetIdx == null) return;
        if (targetIdx === lastIndexRef.current) return;

        lastIndexRef.current = targetIdx;
        const p = points[targetIdx];
        setTooltip({ x: p.x, y: p.y, data: p.data });
      });
    },
    [points]
  );

  const handleMouseLeave = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = 0;
    rectRef.current = null;
    pendingIndexRef.current = null;
    lastIndexRef.current = -1;
    setTooltip(null);
  }, []);

  if (!chartData || chartData.length === 0) return null;

  const tooltipColor = tooltip ? MOOD_COLORS_MAP[tooltip.data.mood] || '#8b5cf6' : '#8b5cf6';

  return (
    <GlassCard className="p-5 sm:p-6 min-w-0">
      <div className="mb-4">
        <h3 className="text-fluid-xl font-bold text-white">Vývoj nálady</h3>
        <p className="text-white/50 text-fluid-sm">Emoční křivka v čase</p>
      </div>

      <div className="w-full overflow-hidden">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          className="w-full max-w-full block h-[clamp(11rem,42vw,14rem)]"
          onPointerEnter={handleMouseEnter}
          onPointerMove={handleMouseMove}
          onPointerLeave={handleMouseLeave}
        >
          <defs>
            <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Y-axis grid lines */}
          {yTicks.map(({ y, label }) => (
            <g key={label}>
              <line
                x1={PAD.left} y1={y} x2={W - PAD.right} y2={y}
                stroke="rgba(255,255,255,0.06)" strokeWidth="1"
              />
              <text
                x={PAD.left - 6} y={y + 4}
                textAnchor="end" fill="rgba(255,255,255,0.35)" fontSize="11"
              >
                {label}
              </text>
            </g>
          ))}

          {/* Fill under the curve */}
          <path d={fillPath} fill="url(#trendFill)" />

          {/* Line */}
          <path
            d={linePath}
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* X-axis labels */}
          {xLabels.map(({ x, label }, i) => (
            <text
              key={i}
              x={x} y={H - 6}
              textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="11"
            >
              {label}
            </text>
          ))}

          {/* Hover dot */}
          {tooltip && (
            <circle
              cx={tooltip.x} cy={tooltip.y} r={5}
              fill={tooltipColor}
              stroke="rgba(255,255,255,0.8)"
              strokeWidth="2"
              style={{ filter: `drop-shadow(0 0 6px ${tooltipColor})` }}
            />
          )}
        </svg>
      </div>

      {/* Tooltip box */}
      {tooltip && (
        <div
          className="mt-2 px-3 py-2 rounded-xl text-sm"
          style={{
            background: 'rgba(15,23,42,0.85)',
            border: `1px solid ${tooltipColor}40`,
            backdropFilter: 'blur(8px)',
          }}
        >
          <span className="text-white/50 text-xs">{tooltip.data.fullDate} · </span>
          <span className="font-semibold" style={{ color: tooltipColor }}>
            {tooltip.data.moodLabel}
          </span>
          <span className="text-white/40 text-xs ml-1">({tooltip.data.mood}/5)</span>
          {tooltip.data.note && (
            <p className="text-white/70 text-xs mt-1 italic">"{tooltip.data.note}"</p>
          )}
        </div>
      )}
    </GlassCard>
  );
});

export default MoodTrendChart;
