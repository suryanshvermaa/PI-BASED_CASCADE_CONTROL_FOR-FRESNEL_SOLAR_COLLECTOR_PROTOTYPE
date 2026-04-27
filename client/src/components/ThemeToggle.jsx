export default function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={onToggle}
      className={
        'rounded-xl border px-3 py-2 text-sm transition-colors duration-300 ' +
        (isDark
          ? 'border-white/10 bg-white/5 hover:bg-white/10'
          : 'border-black/10 bg-black/5 hover:bg-black/10')
      }
      aria-label="Toggle theme"
    >
      {isDark ? 'Light' : 'Dark'}
    </button>
  );
}
