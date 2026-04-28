import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import DashboardPage from './pages/DashboardPage';
import DevicesPage from './pages/DevicesPage';
import AnalyticsPage from './pages/AnalyticsPage';
import AlertsPage from './pages/AlertsPage';
import SettingsPage from './pages/SettingsPage';
import { useSensorData } from './hooks/useSensorData';

const PAGE_TITLES = {
  '/':          'Dashboard',
  '/devices':   'Devices',
  '/analytics': 'Analytics',
  '/alerts':    'Alerts',
  '/settings':  'Settings',
};

function AppShell() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Apply .dark class to <html> — CSS variables handle the rest
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const handleToggleTheme = () => setIsDark((d) => !d);

  const location = useLocation();
  const pageTitle = PAGE_TITLES[location.pathname] ?? 'Dashboard';

  const sensorState = useSensorData();
  const { sensorData, overallConnected, socketConnected } = sensorState;
  const modeLabel = sensorData?.mode === 'REAL' ? 'LIVE' : 'MOCK';

  return (
    <div className="flex h-screen overflow-hidden bg-theme-base text-text-primary">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((c) => !c)}
      />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar
          title={pageTitle}
          overallConnected={overallConnected}
          modeLabel={modeLabel}
          onToggleTheme={handleToggleTheme}
          isDark={isDark}
        />
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/"          element={<DashboardPage {...sensorState} isDark={isDark} />} />
            <Route path="/devices"   element={<DevicesPage sensorData={sensorData} socketConnected={socketConnected} isLiveMode={sensorState.isLiveMode} overallConnected={sensorState.overallConnected} />} />
            <Route path="/analytics" element={<AnalyticsPage history={sensorState.history} isDark={isDark} />} />
            <Route path="/alerts"    element={<AlertsPage sensorData={sensorData} stabilityLabel={sensorState.stabilityLabel} stabilityTone={sensorState.stabilityTone} />} />
            <Route path="/settings"  element={<SettingsPage isDark={isDark} onToggleTheme={handleToggleTheme} />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
