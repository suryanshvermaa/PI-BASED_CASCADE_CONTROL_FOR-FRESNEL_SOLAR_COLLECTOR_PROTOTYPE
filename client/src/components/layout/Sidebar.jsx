import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Cpu, BarChart2, Bell, Settings,
  ChevronLeft, ChevronRight, Radio,
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/',          label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/devices',   label: 'Devices',   icon: Cpu },
  { to: '/analytics', label: 'Analytics', icon: BarChart2 },
  { to: '/alerts',    label: 'Alerts',    icon: Bell },
  { to: '/settings',  label: 'Settings',  icon: Settings },
];

export default function Sidebar({ collapsed, onToggle }) {
  return (
    <aside
      className={`
        relative flex flex-col h-screen bg-theme-sidebar border-r border-theme-subtle
        transition-all duration-300 ease-in-out flex-shrink-0 z-40
        ${collapsed ? 'w-16' : 'w-60'}
      `}
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-theme-subtle ${collapsed ? 'justify-center px-0' : ''}`}>
        <div className="flex-shrink-0 h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center ring-1 ring-primary/30">
          <Radio className="h-4 w-4 text-primary" />
        </div>
        {!collapsed && (
          <div className="min-w-0 animate-fade-in">
            <div className="text-sm font-semibold text-text-primary truncate">IoT Sentinel</div>
            <div className="text-[10px] text-text-muted tracking-wider uppercase">Monitoring System</div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => `
              group flex items-center gap-3 mx-2 px-3 py-2.5 rounded-lg text-sm
              transition-all duration-150 relative
              ${isActive
                ? 'bg-primary/15 text-primary font-medium'
                : 'text-text-secondary hover:text-text-primary hover:bg-theme-hover'}
              ${collapsed ? 'justify-center px-0 mx-1' : ''}
            `}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-r-full" />
                )}
                <Icon className={`flex-shrink-0 transition-colors duration-150 ${collapsed ? 'h-5 w-5' : 'h-4 w-4'}`} />
                {!collapsed && <span className="truncate animate-fade-in">{label}</span>}
                {collapsed && (
                  <span className="
                    absolute left-full ml-3 px-2 py-1 rounded-md text-xs
                    bg-bg-card text-text-primary border border-theme-subtle
                    opacity-0 group-hover:opacity-100 pointer-events-none
                    transition-opacity duration-150 whitespace-nowrap z-50 shadow-lg
                  ">
                    {label}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Collapse toggle */}
      <div className="p-3 border-t border-theme-subtle">
        <button
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={`
            w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-text-secondary
            hover:text-text-primary hover:bg-theme-hover transition-all duration-150
            ${collapsed ? 'justify-center px-0' : ''}
          `}
        >
          {collapsed
            ? <ChevronRight className="h-4 w-4" />
            : <><ChevronLeft className="h-4 w-4 flex-shrink-0" /><span>Collapse</span></>
          }
        </button>
      </div>
    </aside>
  );
}
