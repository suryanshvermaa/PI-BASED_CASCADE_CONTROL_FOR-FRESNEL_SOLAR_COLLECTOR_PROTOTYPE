import { Bell, Search, Sun, Moon, User, Wifi, WifiOff } from 'lucide-react';

export default function Topbar({ title, socketConnected, modeLabel, onToggleTheme, isDark }) {
  return (
    <header className="h-14 flex items-center justify-between px-6 border-b border-white/[0.07] bg-[#0d1117]/80 backdrop-blur-sm sticky top-0 z-30">
      {/* Left: Page title */}
      <div className="flex items-center gap-3">
        <h1 className="text-base font-semibold text-text-primary">{title}</h1>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        {/* Connection status badge */}
        <div
          className={`
            hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
            border transition-all duration-300
            ${
              socketConnected
                ? 'border-success/25 bg-success/10 text-success'
                : 'border-danger/25 bg-danger/10 text-danger'
            }
          `}
          title={socketConnected ? 'WebSocket connected' : 'WebSocket disconnected'}
        >
          {socketConnected ? (
            <Wifi className="h-3 w-3" />
          ) : (
            <WifiOff className="h-3 w-3" />
          )}
          <span>{modeLabel}</span>
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              socketConnected ? 'bg-success animate-pulse-dot' : 'bg-danger'
            }`}
          />
        </div>

        {/* Notifications */}
        <button
          id="topbar-notifications"
          aria-label="Notifications"
          className="relative h-8 w-8 flex items-center justify-center rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/[0.07] transition-all duration-150"
        >
          <Bell className="h-4 w-4" />
          {/* Unread dot */}
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
        </button>

        {/* Theme toggle */}
        <button
          id="topbar-theme-toggle"
          onClick={onToggleTheme}
          aria-label="Toggle theme"
          className="h-8 w-8 flex items-center justify-center rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/[0.07] transition-all duration-150"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* User avatar */}
        <button
          id="topbar-user"
          aria-label="User profile"
          className="h-8 w-8 flex items-center justify-center rounded-lg bg-primary/20 hover:bg-primary/30 transition-all duration-150 ring-1 ring-primary/25"
        >
          <User className="h-4 w-4 text-primary" />
        </button>
      </div>
    </header>
  );
}
