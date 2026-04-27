import {
  ResponsiveContainer, LineChart, Line,
  CartesianGrid, XAxis, YAxis, Tooltip,
} from 'recharts';

export const CHART_COLORS = {
  inlet:  '#6366F1',
  outlet: '#22C55E',
  delta:  '#F59E0B',
  flow:   '#06B6D4',
  pwm:    '#A78BFA',
};

function getAxisStyle(isDark) {
  return {
    tick:     { fill: isDark ? '#6B7280' : '#94A3B8', fontSize: 11, fontFamily: 'Inter' },
    axisLine: { stroke: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)' },
    grid:     isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)',
  };
}

function ChartTooltip({ active, payload, label, lines, isDark }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card px-3 py-2.5 text-xs min-w-[130px] shadow-xl">
      <div className="text-text-muted mb-1.5 font-medium">{label}</div>
      <div className="space-y-1">
        {payload.map((entry) => (
          <div key={entry.dataKey} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ background: entry.stroke }} />
              <span className="text-text-secondary">{lines?.[entry.dataKey]?.label ?? entry.dataKey}</span>
            </div>
            <span className="font-mono font-medium text-text-primary tabular-nums">
              {entry.value != null
                ? `${Number(entry.value).toFixed(lines?.[entry.dataKey]?.decimals ?? 1)}${lines?.[entry.dataKey]?.unit ? ` ${lines[entry.dataKey].unit}` : ''}`
                : '--'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ChartWrapper({ title, subtitle, data, lines, emptyMessage = 'Waiting for data…', height = 220, isDark = true }) {
  const axis = getAxisStyle(isDark);
  const isEmpty = !data || data.length === 0;

  return (
    <div className="glass-card p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-text-primary">{title}</h2>
          {subtitle && <p className="text-xs text-text-muted mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          {Object.entries(lines).map(([key, cfg]) => (
            <div key={key} className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ background: cfg.color }} />
              <span className="text-[10px] text-text-muted">{cfg.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ height }}>
        {isEmpty ? (
          <div className="h-full flex flex-col items-center justify-center">
            <div className="h-8 w-8 rounded-full bg-theme-hover flex items-center justify-center mb-2">
              <span className="text-base">📈</span>
            </div>
            <p className="text-xs text-text-muted">{emptyMessage}</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 4, right: 8, left: -8, bottom: 0 }}>
              <CartesianGrid stroke={axis.grid} strokeDasharray="0" vertical={false} />
              <XAxis dataKey="time" tick={axis.tick} axisLine={axis.axisLine} tickLine={false} interval="preserveStartEnd" minTickGap={60} />
              <YAxis tick={axis.tick} axisLine={axis.axisLine} tickLine={false} width={32} />
              <Tooltip
                content={(props) => <ChartTooltip {...props} lines={lines} isDark={isDark} />}
                cursor={{ stroke: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)', strokeWidth: 1 }}
              />
              {Object.entries(lines).map(([key, cfg]) => (
                <Line key={key} type="monotone" dataKey={key} stroke={cfg.color}
                  strokeWidth={cfg.strokeWidth ?? 2} strokeDasharray={cfg.dashed ? '4 4' : undefined}
                  dot={false} isAnimationActive animationDuration={300}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
