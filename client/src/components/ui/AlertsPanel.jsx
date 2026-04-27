import { AlertTriangle, CheckCircle, XCircle, Info } from 'lucide-react';

const SEVERITY_CONFIG = {
  error: {
    icon: XCircle,
    bg: 'bg-danger/10',
    border: 'border-danger/25',
    text: 'text-danger',
    label: 'Error',
  },
  warning: {
    icon: AlertTriangle,
    bg: 'bg-warning/10',
    border: 'border-warning/25',
    text: 'text-warning',
    label: 'Warning',
  },
  info: {
    icon: Info,
    bg: 'bg-primary/10',
    border: 'border-primary/25',
    text: 'text-primary',
    label: 'Info',
  },
  success: {
    icon: CheckCircle,
    bg: 'bg-success/10',
    border: 'border-success/25',
    text: 'text-success',
    label: 'OK',
  },
};

function AlertItem({ severity = 'info', title, message, time }) {
  const cfg = SEVERITY_CONFIG[severity] || SEVERITY_CONFIG.info;
  const Icon = cfg.icon;

  return (
    <div
      className={`flex gap-3 p-3.5 rounded-lg border ${cfg.bg} ${cfg.border} animate-fade-in`}
      role="alert"
    >
      <Icon className={`h-4 w-4 mt-0.5 flex-shrink-0 ${cfg.text}`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <span className={`text-xs font-semibold ${cfg.text} uppercase tracking-wide`}>
            {cfg.label}
          </span>
          {time && <span className="text-[10px] text-text-muted flex-shrink-0">{time}</span>}
        </div>
        {title && <div className="mt-0.5 text-sm font-medium text-text-primary">{title}</div>}
        {message && <div className="mt-0.5 text-xs text-text-secondary">{message}</div>}
      </div>
    </div>
  );
}

/**
 * Alerts Panel — displays a list of severity-coded alerts.
 * Accepts a sensorError prop that converts to an error alert automatically.
 */
export default function AlertsPanel({ sensorError, sensorErrorMessage, alerts = [] }) {
  const allAlerts = [];

  if (sensorError) {
    allAlerts.unshift({
      id: 'sensor-error',
      severity: 'error',
      title: 'Sensor Error',
      message: sensorErrorMessage || 'sensor_not_detected — check hardware connection.',
    });
  }

  allAlerts.push(...alerts);

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-text-primary">System Alerts</h2>
        {allAlerts.length > 0 && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-danger/15 text-danger border border-danger/25 font-medium">
            {allAlerts.length}
          </span>
        )}
      </div>

      {allAlerts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <CheckCircle className="h-8 w-8 text-success mb-2 opacity-60" />
          <p className="text-sm text-text-muted">All systems operational</p>
        </div>
      ) : (
        <div className="space-y-2">
          {allAlerts.map((alert) => (
            <AlertItem key={alert.id} {...alert} />
          ))}
        </div>
      )}
    </div>
  );
}
