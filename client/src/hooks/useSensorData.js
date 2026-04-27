/**
 * Centralized sensor data store using a custom hook pattern.
 * Provides a single source of truth for all sensor state.
 * Ready for WebSocket + REST polling with easy API layer swap.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createSocket } from '../services/socket';
import { fetchLatestData } from '../services/api';

const HISTORY_POINTS = 60; // 60 seconds of rolling history

function formatTime(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

const INITIAL_SENSOR_DATA = {
  flowRate: null,
  inletTemp: null,
  outletTemp: null,
  deltaTemp: null,
  pwm: null,
  sensorError: false,
  sensorErrorMessage: null,
  mode: 'MOCK',
  connected: true,
};

/**
 * Central hook for all sensor state management.
 * Encapsulates WebSocket connection, REST polling fallback, and history tracking.
 */
export function useSensorData() {
  const [sensorData, setSensorData] = useState(INITIAL_SENSOR_DATA);
  const [history, setHistory] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const lastDataAtRef = useRef(0);
  const socket = useMemo(() => createSocket(), []);

  const applyPayload = useCallback((payload) => {
    const isSensorError = Boolean(payload?.sensorError);

    if (isSensorError) {
      setSensorData((prev) => ({
        ...prev,
        ...payload,
        flowRate: null,
        inletTemp: null,
        outletTemp: null,
        deltaTemp: null,
        pwm: null,
      }));
      setHistory([]);
    } else {
      setSensorData((prev) => ({
        ...prev,
        ...payload,
        sensorError: false,
        sensorErrorMessage: null,
      }));
    }

    setIsLoading(false);

    const now = Date.now();
    lastDataAtRef.current = now;

    const inlet = Number(payload?.inletTemp);
    const outlet = Number(payload?.outletTemp);
    const flow = Number(payload?.flowRate);
    const pwm = Number(payload?.pwm);
    const deltaTemp = Number(payload?.deltaTemp);

    if (
      !isSensorError &&
      Number.isFinite(inlet) &&
      Number.isFinite(outlet) &&
      Number.isFinite(deltaTemp)
    ) {
      setHistory((prev) => {
        const next = [
          ...prev,
          {
            time: formatTime(now),
            inletTemp: inlet,
            outletTemp: outlet,
            deltaTemp,
            flowRate: Number.isFinite(flow) ? flow : null,
            pwm: Number.isFinite(pwm) ? pwm : null,
          },
        ];
        return next.slice(-HISTORY_POINTS);
      });
    }
  }, []);

  // Initial REST snapshot (populates UI before first WS tick)
  useEffect(() => {
    fetchLatestData()
      .then((data) => applyPayload(data))
      .catch(() => setIsLoading(false));
  }, [applyPayload]);

  // Socket connection state tracking
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

  // Main socket data listener
  useEffect(() => {
    const onSensorData = (payload) => applyPayload(payload);
    socket.on('sensorData', onSensorData);

    return () => {
      socket.off('sensorData', onSensorData);
      socket.disconnect();
    };
  }, [socket, applyPayload]);

  // Fallback REST polling when WebSocket is stale
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const msSinceLast = now - (lastDataAtRef.current || 0);

      if (socketConnected && msSinceLast < 2500) return;

      fetchLatestData()
        .then((data) => applyPayload(data))
        .catch(() => {});
    }, 1000);

    return () => clearInterval(interval);
  }, [socketConnected, applyPayload]);

  // Derived state
  const isLiveMode = sensorData?.mode === 'REAL';
  const sourceConnected = isLiveMode ? Boolean(sensorData?.connected) : true;
  const overallConnected = socketConnected && sourceConnected;

  const deltaTempValue = Number(sensorData?.deltaTemp);
  const deltaTone = !Number.isFinite(deltaTempValue)
    ? 'neutral'
    : deltaTempValue >= 10
    ? 'danger'
    : deltaTempValue <= 3
    ? 'success'
    : 'neutral';

  const stabilityLabel = !Number.isFinite(deltaTempValue)
    ? null
    : deltaTempValue < 5
    ? 'Stable'
    : 'Unstable';

  const stabilityTone = !Number.isFinite(deltaTempValue)
    ? 'neutral'
    : deltaTempValue < 5
    ? 'success'
    : 'danger';

  return {
    sensorData,
    history,
    socketConnected,
    isLoading,
    isLiveMode,
    overallConnected,
    deltaTone,
    stabilityLabel,
    stabilityTone,
  };
}
