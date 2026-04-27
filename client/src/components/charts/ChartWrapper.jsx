import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';

// Shared chart color tokens
export const CHART_COLORS = {
  inlet: '#6366F1',      // primary/indigo
  outlet: '#22C55E',     // success/green
  delta: '#F59E0B',      // warning/amber
  flow: '#06B6D4',       // cyan
  pwm: '#A78BFA',        // violet
};

// Shared grid / axis styles
export const AXIS_STYLE = {
  tick: { fill: '#6B7280', fontSize: 11, fontFamily: 'Inter' },
  axisLine: { stroke: 'rgba(255,255,255,0.07)' },
};

/**
 * Custom tooltip for all chart types.
 */
export function ChartTooltip({ active, payload, label, lines }) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="rounded-xl border border-white/10 bg-[#111827]/95 px-3 py-2.5 text-xs shadow-xl backdrop-blur-sm min-w-[130px]">
      <div className="text-text-muted mb-1.5 font-medium">{label}</div>
      <div className="space-y-1">
        {payload.map((entry) => (
          <div key={entry.dataKey} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-1.5">
              <span
                className="h-1.5 w-1.5 rounded-full flex-shrink-0"
                style={{ background: entry.stroke }}
              />
              <span className="text-text-secondary">
                {lines?.[entry.dataKey]?.label ?? entry.dataKey}
              </span>
            </div>
            <span className="font-mono font-medium text-text-primary tabular-nums">
              {entry.value !== null && entry.value !== undefined
                ? Number(entry.value).toFixed(lines?.[entry.dataKey]?.decimals ?? 1)
                : '--'}
              {lines?.[entry.dataKey]?.unit ? ` ${lines[entry.dataKey].unit}` : ''}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Reusable chart wrapper component.
 * Renders a labeled glass card with a ResponsiveContainer inside.
 */
export default function ChartWrapper({
  title,
  subtitle,
  data,
  lines,
  emptyMessage = 'Waiting for data…',
  height = 220,
}) {
  const isEmpty = !data || data.length === 0;

  return (
    <div className="glass-card p-5">
      {/* Chart header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-text-primary">{title}</h2>
          {subtitle && (
            <p className="text-xs text-text-muted mt-0.5">{subtitle}</p>
          )}
        </div>
        {/* Legend dots */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {Object.entries(lines).map(([key, cfg]) => (
            <div key={key} className="flex items-center gap-1.5">
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: cfg.color }}
              />
              <span className="text-[10px] text-text-muted">{cfg.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Chart area */}
      <div style={{ height }}>
        {isEmpty ? (
          <div className="h-full flex flex-col items-center justify-center">
            <div className="h-8 w-8 rounded-full bg-white/[0.04] flex items-center justify-center mb-2">
              <span className="text-base">📈</span>
            </div>
            <p className="text-xs text-text-muted">{emptyMessage}</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 4, right: 8, left: -8, bottom: 0 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="0" vertical={false} />
              <XAxis
                dataKey="time"
                tick={AXIS_STYLE.tick}
                axisLine={AXIS_STYLE.axisLine}
                tickLine={false}
                interval="preserveStartEnd"
                minTickGap={60}
              />
              <YAxis
                tick={AXIS_STYLE.tick}
                axisLine={AXIS_STYLE.axisLine}
                tickLine={false}
                width={32}
              />
              <Tooltip
                content={(props) => <ChartTooltip {...props} lines={lines} />}
                cursor={{ stroke: 'rgba(255,255,255,0.08)', strokeWidth: 1 }}
              />
              {Object.entries(lines).map(([key, cfg]) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={cfg.color}
                  strokeWidth={cfg.strokeWidth ?? 2}
                  strokeDasharray={cfg.dashed ? '4 4' : undefined}
                  dot={false}
                  isAnimationActive
                  animationDuration={300}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
