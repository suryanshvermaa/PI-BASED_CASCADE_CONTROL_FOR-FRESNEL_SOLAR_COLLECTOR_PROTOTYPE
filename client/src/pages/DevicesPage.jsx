import { Cpu } from 'lucide-react';

export default function DevicesPage({ sensorData, socketConnected, isLiveMode, overallConnected }) {
  return (
    <div className="p-6 animate-fade-in">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-text-primary">Devices</h2>
        <p className="text-sm text-text-muted mt-1">Manage and monitor your connected IoT devices</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Arduino card */}
        <div className="glass-card p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="h-10 w-10 rounded-xl bg-primary/15 flex items-center justify-center ring-1 ring-primary/25">
              <Cpu className="h-5 w-5 text-primary" />
            </div>
            <div className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border
              ${overallConnected ? 'bg-success/10 border-success/25 text-success' : 'bg-danger/10 border-danger/25 text-danger'}
            `}>
              <span className={`h-1.5 w-1.5 rounded-full ${overallConnected ? 'bg-success animate-pulse-dot' : 'bg-danger'}`} />
              {overallConnected ? 'Online' : 'Offline'}
            </div>
          </div>
          <div className="font-medium text-text-primary">Arduino Sensor Node</div>
          <div className="text-xs text-text-muted mt-1">Flow + Temperature sensor array</div>
          <div className="mt-4 pt-4 border-t border-theme-subtle grid grid-cols-2 gap-3 text-xs">
            <div>
              <div className="text-text-muted">Mode</div>
              <div className="font-medium text-text-secondary mt-0.5">{isLiveMode ? 'REAL' : 'MOCK'}</div>
            </div>
            <div>
              <div className="text-text-muted">Protocol</div>
              <div className="font-medium text-text-secondary mt-0.5">WebSocket + REST</div>
            </div>
            <div>
              <div className="text-text-muted">Sensors</div>
              <div className="font-medium text-text-secondary mt-0.5">Flow, Temp, PWM</div>
            </div>
            <div>
              <div className="text-text-muted">Update Rate</div>
              <div className="font-medium text-text-secondary mt-0.5">1 Hz</div>
            </div>
          </div>
        </div>

        {/* Add Device placeholder */}
        <div className="glass-card p-5 flex flex-col items-center justify-center min-h-[180px] text-center
          hover:border-primary/30 hover:bg-primary/[0.03] transition-all duration-200 cursor-pointer group"
          style={{ borderStyle: 'dashed' }}
        >
          <div className="h-10 w-10 rounded-xl bg-theme-hover group-hover:bg-primary/10 flex items-center justify-center ring-1 border-theme-subtle group-hover:ring-primary/25 transition-all duration-200 mb-3">
            <span className="text-xl text-text-muted group-hover:text-primary transition-colors">+</span>
          </div>
          <div className="text-sm font-medium text-text-secondary group-hover:text-text-primary transition-colors">Add Device</div>
          <div className="text-xs text-text-muted mt-1">Connect a new sensor node</div>
        </div>
      </div>
    </div>
  );
}
