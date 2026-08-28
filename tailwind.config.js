/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--color-background) / <alpha-value>)',
        overlay: 'rgb(var(--color-overlay) / <alpha-value>)',
        ink: 'rgb(var(--color-text-primary) / <alpha-value>)',
        paper: 'rgb(var(--color-card) / <alpha-value>)',
        offwhite: 'rgb(var(--color-background-secondary) / <alpha-value>)',
        line: 'rgb(var(--color-border) / <alpha-value>)',
        'line-dark': 'rgb(var(--color-border) / <alpha-value>)',
        graphite: 'rgb(var(--color-input) / <alpha-value>)',
        muted: 'rgb(var(--color-text-muted) / <alpha-value>)',
        action: 'rgb(var(--color-primary) / <alpha-value>)',
        success: 'rgb(var(--color-success) / <alpha-value>)',
        urgent: 'rgb(var(--color-danger) / <alpha-value>)',
        info: 'rgb(var(--color-info) / <alpha-value>)',
        premium: 'rgb(var(--color-premium) / <alpha-value>)',
        footer: 'rgb(var(--color-footer) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        display: ['"Neue Montreal"', '"Inter"', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.04em',
      },
      transitionTimingFunction: {
        editorial: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      boxShadow: {
        card: '0 2px 8px rgba(17, 24, 39, 0.06)',
        'card-hover': '0 4px 12px rgba(17, 24, 39, 0.08)',
      },
    },
  },
  corePlugins: {
    preflight: true,
  },
  plugins: [],
};
