import { useEffect, useRef, useState } from 'react';

function formatNumber(value, decimals) {
  if (value === null || value === undefined) return '--';
  const num = Number(value);
  if (!Number.isFinite(num)) return '--';
  // When decimals is null we want an integer-like display (e.g. PWM) without
  // leaking long floats during animated transitions.
  return decimals === null ? String(Math.round(num)) : num.toFixed(decimals);
}

export default function MetricCard({ label, value, unit, decimals, theme, tone = 'neutral' }) {
  const prevValueRef = useRef(value);
  const [flash, setFlash] = useState(false);
  const [displayValue, setDisplayValue] = useState(value);
  const rafRef = useRef(null);

  useEffect(() => {
    const prev = prevValueRef.current;
    prevValueRef.current = value;

    // Avoid flashing on first render.
    if (prev === undefined) return;

    if (prev !== value) {
      setFlash(true);
      const t = setTimeout(() => setFlash(false), 200);
      return () => clearTimeout(t);
    }
  }, [value]);

  useEffect(() => {
    // Animate numeric transitions for a more "real dashboard" feel.
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    // Preserve null/undefined so the card can show "--".
    if (value === null || value === undefined) {
      setDisplayValue(value);
      return;
    }

    const from = Number(displayValue);
    const to = Number(value);

    if (!Number.isFinite(to)) {
      setDisplayValue(value);
      return;
    }

    if (displayValue === null || displayValue === undefined || !Number.isFinite(from)) {
      setDisplayValue(to);
      return;
    }

    const start = performance.now();
    const durationMs = 350;

    const tick = (now) => {
      const t = Math.min(1, (now - start) / durationMs);
      // Ease-out
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayValue(from + (to - from) * eased);

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        rafRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const isDark = theme === 'dark';

  const toneStyles = (() => {
    if (tone === 'success') {
      return isDark
        ? 'border-emerald-300/20 bg-emerald-300/10'
        : 'border-emerald-600/25 bg-emerald-500/10';
    }

    if (tone === 'danger') {
      return isDark
        ? 'border-red-300/25 bg-red-300/10'
        : 'border-red-600/25 bg-red-500/10';
    }

    return isDark ? 'border-white/10 bg-white/5' : 'border-black/10 bg-black/5';
  })();

  return (
    <div
      className={
        'rounded-2xl border p-5 backdrop-blur transition-all duration-300 shadow-sm hover:-translate-y-0.5 hover:shadow-md ' +
        toneStyles +
        (flash ? ' scale-[1.01]' : '')
      }
    >
      <div className={"text-sm opacity-80 truncate"}>{label}</div>
      <div className={"mt-2 flex min-w-0 items-baseline gap-2"}>
        <div className={"min-w-0 truncate text-3xl font-semibold tabular-nums tracking-tight leading-none sm:text-4xl"}>
          {formatNumber(displayValue, decimals)}
        </div>
        {unit ? <div className={"shrink-0 text-sm opacity-70"}>{unit}</div> : null}
      </div>
    </div>
  );
}
