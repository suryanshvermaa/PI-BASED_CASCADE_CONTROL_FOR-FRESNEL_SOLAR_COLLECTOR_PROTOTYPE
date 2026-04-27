import AlertsPanel from '../components/ui/AlertsPanel';

export default function AlertsPage({ sensorData, stabilityLabel, stabilityTone }) {
  const { sensorError, sensorErrorMessage, deltaTemp } = sensorData || {};

  const extraAlerts = [];
  if (stabilityLabel === 'Unstable') {
    extraAlerts.push({
      id: 'stability-warning',
      severity: 'warning',
      title: 'Temperature Instability Detected',
      message: `ΔTemp is ${Number(deltaTemp).toFixed(1)}°C. Threshold: 5°C. Check coolant flow.`,
    });
  }
  if (sensorError) {
    // Already handled inside AlertsPanel
  }

  return (
    <div className="p-6 animate-fade-in">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-text-primary">Alerts</h2>
        <p className="text-sm text-text-muted mt-1">System notifications and sensor warnings</p>
      </div>

      <div className="max-w-2xl">
        <AlertsPanel
          sensorError={sensorError}
          sensorErrorMessage={sensorErrorMessage}
          alerts={extraAlerts}
        />
      </div>
    </div>
  );
}
