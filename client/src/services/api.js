import { API_URL } from './config';

/**
 * Fetch the latest sensor data snapshot from the REST endpoint.
 * Used as initial hydration and as a fallback when WebSocket is stale.
 */
export async function fetchLatestData() {
  const res = await fetch(`${API_URL}/data`);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  return res.json();
}

/**
 * Future: fetch historical data for a given time range.
 * Uncomment and wire up once the server exposes the endpoint.
 */
// export async function fetchHistory({ from, to, limit = 500 } = {}) {
//   const params = new URLSearchParams({ from, to, limit });
//   const res = await fetch(`${API_URL}/history?${params}`);
//   if (!res.ok) throw new Error(`HTTP ${res.status}`);
//   return res.json();
// }
