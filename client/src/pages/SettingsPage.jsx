import { Server, Palette, Bell } from 'lucide-react';

export default function SettingsPage({ isDark, onToggleTheme }) {
  return (
    <div className="p-6 animate-fade-in">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-text-primary">Settings</h2>
        <p className="text-sm text-text-muted mt-1">Configure your dashboard preferences</p>
      </div>

      <div className="max-w-2xl space-y-4">
        {/* Appearance */}
        <div className="glass-card p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-7 w-7 flex items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
              <Palette className="h-3.5 w-3.5 text-primary" />
            </div>
            <h3 className="text-sm font-semibold text-text-primary">Appearance</h3>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-text-primary">Theme</div>
              <div className="text-xs text-text-muted mt-0.5">{isDark ? 'Dark mode active' : 'Light mode active'}</div>
            </div>
            <button
              id="settings-theme-toggle"
              onClick={onToggleTheme}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${isDark ? 'bg-primary' : 'bg-text-muted/40'}`}
            >
              <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ${isDark ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>

        {/* Connection */}
        <div className="glass-card p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-7 w-7 flex items-center justify-center rounded-lg bg-success/10 ring-1 ring-success/20">
              <Server className="h-3.5 w-3.5 text-success" />
            </div>
            <h3 className="text-sm font-semibold text-text-primary">Server Connection</h3>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-text-secondary">API URL</span>
              <span className="text-text-muted font-mono text-xs">localhost:3001</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Transport</span>
              <span className="text-text-muted text-xs">WebSocket + REST polling</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Poll interval</span>
              <span className="text-text-muted text-xs">1s (fallback)</span>
            </div>
          </div>
        </div>

        {/* Notifications (placeholder) */}
        <div className="glass-card p-5 opacity-60">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-7 w-7 flex items-center justify-center rounded-lg bg-warning/10 ring-1 ring-warning/20">
              <Bell className="h-3.5 w-3.5 text-warning" />
            </div>
            <h3 className="text-sm font-semibold text-text-primary">Notifications</h3>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-theme-hover text-text-muted">Coming soon</span>
          </div>
          <p className="text-xs text-text-muted">Alert threshold configuration will be available in a future update.</p>
        </div>
      </div>
    </div>
  );
}
