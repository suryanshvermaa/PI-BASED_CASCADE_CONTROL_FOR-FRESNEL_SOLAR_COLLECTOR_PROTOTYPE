import {
  Thermometer,
  Droplets,
  Zap,
  Activity,
} from 'lucide-react';

import StatsCard from '../components/ui/StatsCard';
import AlertsPanel from '../components/ui/AlertsPanel';
import DeviceStatus from '../components/ui/DeviceStatus';
import DataTable from '../components/ui/DataTable';
import TemperatureChart from '../components/charts/TemperatureChart';
import FlowRateChart from '../components/charts/FlowRateChart';
import MotorSpeedChart from '../components/charts/MotorSpeedChart';

/**
 * Main Dashboard page.
 * Receives sensor state from the App-level hook via props.
 */
export default function DashboardPage({
  sensorData,
  history,
  socketConnected,
  isLoading,
  isLiveMode,
  overallConnected,
  deltaTone,
  stabilityLabel,
  stabilityTone,
}) {
  const { flowRate, inletTemp, outletTemp, deltaTemp, pwm, sensorError, sensorErrorMessage } =
    sensorData || {};

  // Compute simple trend from last two history points
  const last = history[history.length - 1];
  const prev = history[history.length - 2];
  const inletTrend = last && prev ? last.inletTemp - prev.inletTemp : undefined;
  const outletTrend = last && prev ? last.outletTemp - prev.outletTemp : undefined;
  const flowTrend = last && prev ? last.flowRate - prev.flowRate : undefined;
  const deltaTrend = last && prev ? last.deltaTemp - prev.deltaTemp : undefined;

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatsCard
          title="Flow Rate"
          value={flowRate}
          unit="L/min"
          decimals={2}
          icon={Droplets}
          tone="primary"
          trend={flowTrend}
          isLoading={isLoading}
        />
        <StatsCard
          title="Inlet Temp"
          value={inletTemp}
          unit="°C"
          decimals={1}
          icon={Thermometer}
          tone="neutral"
          trend={inletTrend}
          isLoading={isLoading}
        />
        <StatsCard
          title="Outlet Temp"
          value={outletTemp}
          unit="°C"
          decimals={1}
          icon={Thermometer}
          tone="neutral"
          trend={outletTrend}
          isLoading={isLoading}
        />
        <StatsCard
          title="Delta Temp"
          value={deltaTemp}
          unit="°C"
          decimals={1}
          icon={Activity}
          tone={deltaTone}
          trend={deltaTrend}
          isLoading={isLoading}
        />
        <StatsCard
          title="PWM"
          value={pwm}
          unit={null}
          decimals={0}
          icon={Zap}
          tone="neutral"
          isLoading={isLoading}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="lg:col-span-2">
          <TemperatureChart data={history} />
        </div>
        <FlowRateChart data={history} />
        <MotorSpeedChart data={history} />
      </div>

      {/* Bottom row: Alerts + Device Status + Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <DataTable history={history} />
        </div>
        <div className="space-y-4">
          <DeviceStatus
            mode={sensorData?.mode}
            socketConnected={socketConnected}
            isLiveMode={isLiveMode}
            overallConnected={overallConnected}
            lastReceivedAt={sensorData?.receivedAt}
          />
          <AlertsPanel
            sensorError={sensorError}
            sensorErrorMessage={sensorErrorMessage}
            alerts={
              stabilityLabel === 'Unstable'
                ? [
                    {
                      id: 'stability-warning',
                      severity: 'warning',
                      title: 'Temperature Instability',
                      message: `ΔTemp is ${Number(deltaTemp).toFixed(1)}°C — system is running warm.`,
                    },
                  ]
                : []
            }
          />
        </div>
      </div>
    </div>
  );
}
