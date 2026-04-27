/**
 * Utility functions for the IoT dashboard.
 */

/**
 * Format a numeric sensor value for display.
 * Returns '--' for null/undefined/non-finite values.
 */
export function formatNumber(value, decimals) {
  if (value === null || value === undefined) return '--';
  const num = Number(value);
  if (!Number.isFinite(num)) return '--';
  if (decimals === null || decimals === 0) return String(Math.round(num));
  return num.toFixed(decimals);
}

/**
 * Format a timestamp to a locale time string.
 */
export function formatTime(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

/**
 * Format a date to a relative string (e.g., "2 minutes ago").
 */
export function formatRelativeTime(ts) {
  if (!ts) return 'Never';
  const diff = Date.now() - ts;
  const secs = Math.floor(diff / 1000);
  if (secs < 5) return 'Just now';
  if (secs < 60) return `${secs}s ago`;
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h ago`;
}

/**
 * Clamp a number between min and max.
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Return a Tailwind color class pair based on tone.
 */
export function toneToClasses(tone) {
  switch (tone) {
    case 'success':
      return {
        bg: 'bg-success/10',
        border: 'border-success/20',
        text: 'text-success',
        dot: 'bg-success',
      };
    case 'danger':
      return {
        bg: 'bg-danger/10',
        border: 'border-danger/20',
        text: 'text-danger',
        dot: 'bg-danger',
      };
    case 'warning':
      return {
        bg: 'bg-warning/10',
        border: 'border-warning/20',
        text: 'text-warning',
        dot: 'bg-warning',
      };
    case 'primary':
      return {
        bg: 'bg-primary/10',
        border: 'border-primary/20',
        text: 'text-primary',
        dot: 'bg-primary',
      };
    default:
      return {
        bg: 'bg-white/[0.03]',
        border: 'border-white/[0.07]',
        text: 'text-text-secondary',
        dot: 'bg-text-muted',
      };
  }
}
