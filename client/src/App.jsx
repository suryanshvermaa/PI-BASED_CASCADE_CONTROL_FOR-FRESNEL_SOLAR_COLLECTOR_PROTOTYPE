import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import MetricCard from './components/MetricCard.jsx';
import ThemeToggle from './components/ThemeToggle.jsx';
import TemperatureChart from './components/TemperatureChart.jsx';
import { createSocket } from './lib/socket.js';
import { fetchLatestData } from './lib/api.js';

const HISTORY_POINTS = 30;

function formatTime(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export default function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  const [sensorData, setSensorData] = useState({
    flowRate: null,
    inletTemp: null,
    outletTemp: null,
    deltaTemp: null,
    pwm: null,
    sensorError: false,
    sensorErrorMessage: null,
    mode: 'MOCK',
    connected: true
  });

  const [history, setHistory] = useState([]);

  const [socketConnected, setSocketConnected] = useState(false);
  const lastDataAtRef = useRef(0);

  const socket = useMemo(() => createSocket(), []);

  const applyPayload = useCallback((payload) => {
    const isSensorError = Boolean(payload?.sensorError);

    if (isSensorError) {
      // Disable normal readings display by clearing values.
      setSensorData((prev) => ({
        ...prev,
        ...payload,
        flowRate: null,
        inletTemp: null,
        outletTemp: null,
        deltaTemp: null,
        pwm: null
      }));
      setHistory([]);
    } else {
      setSensorData((prev) => ({ ...prev, ...payload, sensorError: false, sensorErrorMessage: null }));
    }

    const now = Date.now();
    lastDataAtRef.current = now;

    const inlet = Number(payload?.inletTemp);
    const outlet = Number(payload?.outletTemp);
    const deltaTemp = Number(payload?.deltaTemp);

    if (!isSensorError && Number.isFinite(inlet) && Number.isFinite(outlet) && Number.isFinite(deltaTemp)) {
      setHistory((prev) => {
        const next = [
          ...prev,
          { time: formatTime(now), inletTemp: inlet, outletTemp: outlet, deltaTemp }
        ];
        return next.slice(-HISTORY_POINTS);
      });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    // Initial REST snapshot (helps populate UI before first WS tick)
    fetchLatestData()
      .then((data) => applyPayload(data))
      .catch(() => {
        // Keep defaults; websocket will populate when server is available.
      });
  }, [applyPayload]);

  useEffect(() => {
    const onConnect = () => setSocketConnected(true);
    const onDisconnect = () => setSocketConnected(false);
    const onConnectError = () => setSocketConnected(false);

    setSocketConnected(Boolean(socket.connected));

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', onConnectError);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connect_error', onConnectError);
    };
  }, [socket]);

  useEffect(() => {
    function onSensorData(payload) {
      applyPayload(payload);
    }

    socket.on('sensorData', onSensorData);

    return () => {
      socket.off('sensorData', onSensorData);
      socket.disconnect();
    };
  }, [socket, applyPayload]);

  useEffect(() => {
    // Fallback: if realtime transport is down (or stalled), poll REST every second.
    const interval = setInterval(() => {
      const now = Date.now();
      const msSinceLast = now - (lastDataAtRef.current || 0);

      // If websocket is healthy and we received data recently, skip polling.
      if (socketConnected && msSinceLast < 2500) {
        return;
      }

      fetchLatestData()
        .then((data) => applyPayload(data))
        .catch(() => {
          // ignore
        });
    }, 1000);

    return () => clearInterval(interval);
  }, [socketConnected, applyPayload]);

  const isDark = theme === 'dark';
  const modeLabel = sensorData?.mode === 'REAL' ? 'LIVE (Arduino)' : 'MOCK MODE';

  const isLiveMode = sensorData?.mode === 'REAL';
  const sourceConnected = isLiveMode ? Boolean(sensorData?.connected) : true;
  const overallConnected = socketConnected && sourceConnected;

  const statusDotClass = !socketConnected
    ? 'bg-red-400'
    : isLiveMode
      ? sourceConnected
        ? 'bg-emerald-400'
        : 'bg-red-400'
      : 'bg-amber-400';

  const statusDotAnim = overallConnected ? 'animate-pulse' : '';

  const deltaTempValue = Number(sensorData?.deltaTemp);
  const deltaTone =
    !Number.isFinite(deltaTempValue) ? 'neutral' : deltaTempValue >= 10 ? 'danger' : deltaTempValue <= 3 ? 'success' : 'neutral';

  const stabilityLabel =
    !Number.isFinite(deltaTempValue) ? null : deltaTempValue < 5 ? 'Stable' : 'Unstable';
  const stabilityTone = !Number.isFinite(deltaTempValue) ? 'neutral' : deltaTempValue < 5 ? 'success' : 'danger';

  return (
    <div
      className={
        'min-h-screen transition-colors duration-300 ' +
        (isDark
          ? 'bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white'
          : 'bg-gradient-to-br from-white via-gray-50 to-gray-100 text-black')
      }
    >
      <div className="mx-auto max-w-6xl px-4 py-8">
        <header className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight">IoT Dashboard</h1>
              <span
                className={
                  'rounded-full border px-3 py-1 text-xs transition-colors duration-300 ' +
                  (isDark
                    ? 'border-white/10 bg-white/5'
                    : 'border-black/10 bg-black/5')
                }
              >
                <span className="inline-flex items-center gap-2">
                  <span
                    className={
                      'h-2 w-2 rounded-full transition-colors duration-300 ' +
                      statusDotClass +
                      ' ' +
                      statusDotAnim
                    }
                    aria-hidden="true"
                  />
                  {modeLabel}
                </span>
              </span>

              {stabilityLabel && !sensorData?.sensorError ? (
                <span
                  className={
                    'rounded-full border px-3 py-1 text-xs transition-colors duration-300 ' +
                    (stabilityTone === 'success'
                      ? isDark
                        ? 'border-emerald-300/20 bg-emerald-300/10'
                        : 'border-emerald-600/25 bg-emerald-500/10'
                      : stabilityTone === 'danger'
                        ? isDark
                          ? 'border-red-300/25 bg-red-300/10'
                          : 'border-red-600/25 bg-red-500/10'
                        : isDark
                          ? 'border-white/10 bg-white/5'
                          : 'border-black/10 bg-black/5')
                  }
                >
                  {stabilityLabel}
                </span>
              ) : null}
            </div>
            <p className="mt-1 text-sm opacity-70">Live sensor updates every second</p>
          </div>

          <ThemeToggle
            theme={theme}
            onToggle={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
          />
        </header>

        <main className="mt-8">
          {sensorData?.sensorError ? (
            <div
              className={
                'mb-4 rounded-2xl border px-4 py-3 text-sm backdrop-blur transition-colors duration-300 ' +
                (isDark
                  ? 'border-red-300/25 bg-red-300/10 text-white'
                  : 'border-red-600/25 bg-red-500/10 text-black')
              }
              role="alert"
            >
              <div className="font-semibold">Sensor Error</div>
              <div className="mt-1 opacity-80">
                {sensorData?.sensorErrorMessage || 'sensor_not_detected'}
              </div>
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <MetricCard
              label="Flow Rate"
              value={sensorData?.flowRate}
              unit="L/min"
              decimals={2}
              theme={theme}
            />
            <MetricCard
              label="Inlet Temp"
              value={sensorData?.inletTemp}
              unit="°C"
              decimals={1}
              theme={theme}
            />
            <MetricCard
              label="Outlet Temp"
              value={sensorData?.outletTemp}
              unit="°C"
              decimals={1}
              theme={theme}
            />
            <MetricCard
              label="Delta Temp"
              value={sensorData?.deltaTemp}
              unit="°C"
              decimals={1}
              theme={theme}
              tone={deltaTone}
            />
            <MetricCard
              label="PWM"
              value={sensorData?.pwm}
              unit={null}
              decimals={0}
              theme={theme}
            />
          </div>

          <div className="mt-6">
            <TemperatureChart data={history} theme={theme} />
          </div>
        </main>
      </div>
    </div>
  );
}
