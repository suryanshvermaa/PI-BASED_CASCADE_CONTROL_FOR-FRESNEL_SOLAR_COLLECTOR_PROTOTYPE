import ChartWrapper, { CHART_COLORS } from './ChartWrapper';

const FLOW_LINES = {
  flowRate: { label: 'Flow Rate', color: CHART_COLORS.flow, unit: 'L/min', decimals: 2, strokeWidth: 2 },
};

export default function FlowRateChart({ data }) {
  return (
    <ChartWrapper
      title="Flow Rate"
      subtitle="Litres per minute over time"
      data={data}
      lines={FLOW_LINES}
      height={200}
    />
  );
}
