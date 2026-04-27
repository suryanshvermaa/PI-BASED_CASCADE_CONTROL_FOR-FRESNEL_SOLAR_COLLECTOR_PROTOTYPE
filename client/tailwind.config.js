/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        /* Semantic text colors — driven by CSS vars, supports opacity modifiers */
        text: {
          primary:   'rgb(var(--text-primary)   / <alpha-value>)',
          secondary: 'rgb(var(--text-secondary) / <alpha-value>)',
          muted:     'rgb(var(--text-muted)     / <alpha-value>)',
        },
        /* Semantic background colors — driven by CSS vars */
        bg: {
          base:     'rgb(var(--bg-base)     / <alpha-value>)',
          card:     'rgb(var(--bg-card)     / <alpha-value>)',
          elevated: 'rgb(var(--bg-elevated) / <alpha-value>)',
          sidebar:  'rgb(var(--bg-sidebar)  / <alpha-value>)',
        },
        /* Brand / status colors (fixed, not theme-dependent) */
        primary: {
          DEFAULT: '#6366F1',
          hover:   '#4f52d4',
          muted:   'rgba(99,102,241,0.15)',
        },
        success: { DEFAULT: '#22C55E', muted: 'rgba(34,197,94,0.15)'  },
        warning: { DEFAULT: '#F59E0B', muted: 'rgba(245,158,11,0.15)' },
        danger:  { DEFAULT: '#EF4444', muted: 'rgba(239,68,68,0.15)'  },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        glow: '0 0 20px rgba(99,102,241,0.3)',
      },
      animation: {
        'fade-in':    'fadeIn 0.3s ease-out',
        'slide-in':   'slideIn 0.25s ease-out',
        'pulse-dot':  'pulseDot 2s ease-in-out infinite',
        'skeleton':   'skeleton 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
