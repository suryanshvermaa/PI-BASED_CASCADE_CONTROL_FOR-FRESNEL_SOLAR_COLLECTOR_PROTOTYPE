import TemperatureChart from '../components/charts/TemperatureChart';
import FlowRateChart from '../components/charts/FlowRateChart';
import MotorSpeedChart from '../components/charts/MotorSpeedChart';

export default function AnalyticsPage({ history, isDark }) {
  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="mb-2">
        <h2 className="text-lg font-semibold text-text-primary">Analytics</h2>
        <p className="text-sm text-text-muted mt-1">Detailed sensor trends — last {history.length} readings</p>
      </div>
      <TemperatureChart data={history} isDark={isDark} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FlowRateChart data={history} isDark={isDark} />
        <MotorSpeedChart data={history} isDark={isDark} />
      </div>
    </div>
  );
}
