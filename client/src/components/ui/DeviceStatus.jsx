import { Cpu, Wifi, WifiOff, Clock } from 'lucide-react';
import { formatRelativeTime } from '../../utils/formatters';

/**
 * DeviceStatus card showing online/offline state and last data timestamp.
 */
export default function DeviceStatus({ mode, socketConnected, isLiveMode, overallConnected, lastReceivedAt }) {
  const statusLabel = !socketConnected
    ? 'Disconnected'
    : isLiveMode
    ? overallConnected
      ? 'Arduino Online'
      : 'Arduino Offline'
    : 'Mock Mode Active';

  const statusColor = !socketConnected
    ? 'text-danger'
    : isLiveMode
    ? overallConnected
      ? 'text-success'
      : 'text-danger'
    : 'text-warning';

  const dotColor = !socketConnected
    ? 'bg-danger'
    : isLiveMode
    ? overallConnected
      ? 'bg-success animate-pulse-dot'
      : 'bg-danger'
    : 'bg-warning animate-pulse-dot';

  const ConnectionIcon = socketConnected ? Wifi : WifiOff;

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-text-primary">Device Status</h2>
        <div className="h-7 w-7 flex items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
          <Cpu className="h-3.5 w-3.5 text-primary" />
        </div>
      </div>

      <div className="space-y-3">
        {/* Connection row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <ConnectionIcon className="h-3.5 w-3.5" />
            <span>WebSocket</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
            <span className={`text-xs font-medium ${statusColor}`}>{statusLabel}</span>
          </div>
        </div>

        {/* Mode row */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-secondary">Data Source</span>
          <span
            className={`
              text-xs font-medium px-2 py-0.5 rounded-full border
              ${
                isLiveMode
                  ? 'bg-success/10 border-success/25 text-success'
                  : 'bg-warning/10 border-warning/25 text-warning'
              }
            `}
          >
            {isLiveMode ? 'LIVE (Arduino)' : 'MOCK Data'}
          </span>
        </div>

        {/* Last updated */}
        <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <Clock className="h-3 w-3" />
            <span>Last update</span>
          </div>
          <span className="text-xs text-text-secondary">
            {formatRelativeTime(lastReceivedAt)}
          </span>
        </div>
      </div>
    </div>
  );
}
