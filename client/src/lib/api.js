import { API_URL } from './config';

export async function fetchLatestData() {
  const res = await fetch(`${API_URL}/data`);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  return res.json();
}
