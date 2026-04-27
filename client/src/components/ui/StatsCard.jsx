import { useEffect, useRef, useState } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatNumber, toneToClasses } from '../../utils/formatters';

export default function StatsCard({ title, value, unit, decimals = 1, tone = 'neutral', icon: Icon, trend, isLoading = false }) {
  const prevValueRef = useRef(value);
  const [displayValue, setDisplayValue] = useState(value);
  const [flash, setFlash] = useState(false);
  const rafRef = useRef(null);

  useEffect(() => {
    const prev = prevValueRef.current;
    prevValueRef.current = value;
    if (prev === undefined) return;
    if (prev !== value) {
      setFlash(true);
      const t = setTimeout(() => setFlash(false), 300);
      return () => clearTimeout(t);
    }
  }, [value]);

  useEffect(() => {
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    if (value === null || value === undefined) { setDisplayValue(value); return; }
    const from = Number(displayValue);
    const to = Number(value);
    if (!Number.isFinite(to)) { setDisplayValue(value); return; }
    if (displayValue === null || displayValue === undefined || !Number.isFinite(from)) { setDisplayValue(to); return; }
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / 350);
      setDisplayValue(from + (to - from) * (1 - Math.pow(1 - t, 3)));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
      else rafRef.current = null;
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const { bg, border, text } = toneToClasses(tone);
  const trendColor = trend > 0 ? 'text-success' : trend < 0 ? 'text-danger' : 'text-text-muted';
  const TrendIcon = trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Minus;

  if (isLoading) return (
    <div className={`glass-card p-5 ${bg} ${border} border`}>
      <div className="skeleton h-3 w-20 rounded mb-4" />
      <div className="skeleton h-8 w-28 rounded mb-2" />
      <div className="skeleton h-3 w-12 rounded" />
    </div>
  );

  return (
    <div className={`glass-card p-5 border ${bg} ${border} hover:-translate-y-0.5 hover:shadow-lg ${flash ? 'scale-[1.02]' : ''} transition-all duration-200 animate-fade-in`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">{title}</span>
        {Icon && (
          <div className={`h-7 w-7 flex items-center justify-center rounded-lg ${bg} ring-1 ${border}`}>
            <Icon className={`h-3.5 w-3.5 ${text}`} />
          </div>
        )}
      </div>
      <div className="flex items-baseline gap-1.5 min-w-0">
        <span className="text-3xl font-semibold metric-value text-text-primary truncate">
          {formatNumber(displayValue, decimals)}
        </span>
        {unit && <span className="text-sm text-text-muted flex-shrink-0">{unit}</span>}
      </div>
      {trend !== undefined && trend !== null && (
        <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${trendColor}`}>
          <TrendIcon className="h-3 w-3" />
          <span>{Math.abs(trend).toFixed(1)} from last</span>
        </div>
      )}
    </div>
  );
}
