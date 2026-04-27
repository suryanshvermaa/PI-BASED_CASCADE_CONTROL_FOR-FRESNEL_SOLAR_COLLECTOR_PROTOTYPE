import ChartWrapper, { CHART_COLORS } from './ChartWrapper';

const TEMP_LINES = {
  inletTemp:  { label: 'Inlet',  color: CHART_COLORS.inlet,  unit: '°C', decimals: 1, strokeWidth: 2 },
  outletTemp: { label: 'Outlet', color: CHART_COLORS.outlet, unit: '°C', decimals: 1, strokeWidth: 2 },
  deltaTemp:  { label: 'ΔTemp', color: CHART_COLORS.delta,  unit: '°C', decimals: 1, dashed: true, strokeWidth: 1.5 },
};

export default function TemperatureChart({ data, isDark }) {
  return (
    <ChartWrapper
      title="Temperature Trend"
      subtitle="Inlet · Outlet · Delta over time"
      data={data} lines={TEMP_LINES} height={240} isDark={isDark}
    />
  );
}
