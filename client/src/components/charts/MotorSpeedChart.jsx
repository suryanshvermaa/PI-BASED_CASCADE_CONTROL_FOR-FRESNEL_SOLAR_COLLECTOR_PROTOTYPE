import ChartWrapper, { CHART_COLORS } from './ChartWrapper';

const PWM_LINES = {
  pwm: { label: 'PWM', color: CHART_COLORS.pwm, unit: '', decimals: 0, strokeWidth: 2 },
};

export default function MotorSpeedChart({ data, isDark }) {
  return (
    <ChartWrapper
      title="Motor Speed (PWM)" subtitle="PWM duty cycle over time"
      data={data} lines={PWM_LINES} height={200} isDark={isDark}
    />
  );
}
