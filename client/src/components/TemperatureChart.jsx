import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';

function TooltipContent({ active, payload, label, theme }) {
  if (!active || !payload || payload.length === 0) return null;

  const isDark = theme === 'dark';

  const inlet = payload.find((p) => p.dataKey === 'inletTemp')?.value;
  const outlet = payload.find((p) => p.dataKey === 'outletTemp')?.value;
  const deltaTemp = payload.find((p) => p.dataKey === 'deltaTemp')?.value;

  return (
    <div
      className={
        'rounded-xl border px-3 py-2 text-sm backdrop-blur ' +
        (isDark
          ? 'border-white/10 bg-gray-950/70 text-white'
          : 'border-black/10 bg-white/80 text-black')
      }
    >
      <div className="opacity-80">{label}</div>
      <div className="mt-1">
        <div>Inlet: {inlet ?? '--'} °C</div>
        <div>Outlet: {outlet ?? '--'} °C</div>
        <div>Delta: {deltaTemp ?? '--'} °C</div>
      </div>
    </div>
  );
}

export default function TemperatureChart({ data, theme }) {
  const isDark = theme === 'dark';

  return (
    <div
      className={
        'rounded-2xl border p-5 backdrop-blur transition-colors duration-300 ' +
        (isDark
          ? 'border-white/10 bg-white/5'
          : 'border-black/10 bg-black/5')
      }
    >
      <div className="text-sm opacity-80">Temperature Trend</div>
      <div className="mt-3 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="currentColor" strokeOpacity={0.12} />
            <XAxis
              dataKey="time"
              tick={{ fill: 'currentColor', opacity: 0.7, fontSize: 12 }}
              axisLine={{ stroke: 'currentColor', opacity: 0.2 }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: 'currentColor', opacity: 0.7, fontSize: 12 }}
              axisLine={{ stroke: 'currentColor', opacity: 0.2 }}
              tickLine={false}
              width={35}
            />
            <Tooltip content={(props) => <TooltipContent {...props} theme={theme} />} />
            <Line
              type="monotone"
              dataKey="inletTemp"
              stroke="currentColor"
              strokeOpacity={0.9}
              dot={false}
              isAnimationActive
              animationDuration={350}
            />
            <Line
              type="monotone"
              dataKey="outletTemp"
              stroke="currentColor"
              strokeOpacity={0.45}
              strokeDasharray="4 4"
              dot={false}
              isAnimationActive
              animationDuration={350}
            />
            <Line
              type="monotone"
              dataKey="deltaTemp"
              stroke="currentColor"
              strokeOpacity={0.25}
              strokeDasharray="2 6"
              dot={false}
              isAnimationActive
              animationDuration={350}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
