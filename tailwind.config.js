/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0A0A0A',
        paper: '#FFFFFF',
        offwhite: '#F7F7F5',
        line: '#E4E4E1',
        'line-dark': '#2A2A2A',
        graphite: '#1C1C1C',
        muted: '#6B6B6B',
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
    },
  },
  corePlugins: {
    preflight: true,
  },
  plugins: [],
};
