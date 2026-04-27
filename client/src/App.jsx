import { useState } from 'react';
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
  '/': 'Dashboard',
  '/devices': 'Devices',
  '/analytics': 'Analytics',
  '/alerts': 'Alerts',
  '/settings': 'Settings',
};

function AppShell() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  const location = useLocation();
  const pageTitle = PAGE_TITLES[location.pathname] ?? 'Dashboard';
  const isDark = theme === 'dark';

  const handleToggleTheme = () => {
    setTheme((t) => {
      const next = t === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', next);
      return next;
    });
  };

  const sensorState = useSensorData();
  const { sensorData, socketConnected, isLiveMode } = sensorState;
  const modeLabel = sensorData?.mode === 'REAL' ? 'LIVE' : 'MOCK';

  return (
    <div className={`flex h-screen overflow-hidden bg-[#0B0F19] text-[#E5E7EB] ${isDark ? '' : 'brightness-110'}`}>
      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((c) => !c)}
      />

      {/* Main content area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar
          title={pageTitle}
          socketConnected={socketConnected}
          modeLabel={modeLabel}
          onToggleTheme={handleToggleTheme}
          isDark={isDark}
        />

        {/* Scrollable page content */}
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<DashboardPage {...sensorState} />} />
            <Route
              path="/devices"
              element={
                <DevicesPage
                  sensorData={sensorData}
                  socketConnected={socketConnected}
                  isLiveMode={isLiveMode}
                  overallConnected={sensorState.overallConnected}
                />
              }
            />
            <Route
              path="/analytics"
              element={<AnalyticsPage history={sensorState.history} />}
            />
            <Route
              path="/alerts"
              element={
                <AlertsPage
                  sensorData={sensorData}
                  stabilityLabel={sensorState.stabilityLabel}
                  stabilityTone={sensorState.stabilityTone}
                />
              }
            />
            <Route
              path="/settings"
              element={
                <SettingsPage isDark={isDark} onToggleTheme={handleToggleTheme} />
              }
            />
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
