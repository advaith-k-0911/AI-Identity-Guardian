/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          darkest: '#070a13',
          darker: '#0c1222',
          card: '#111a2e',
          cardBorder: '#1e293b',
          cyan: '#06b6d4',
          cyanGlow: '#22d3ee',
          emerald: '#10b981',
          danger: '#ef4444',
          warning: '#f59e0b',
          muted: '#94a3b8',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-cyan': '0 0 20px -3px rgba(6, 182, 212, 0.3)',
        'glow-emerald': '0 0 20px -3px rgba(16, 185, 129, 0.3)',
        'glow-danger': '0 0 20px -3px rgba(239, 68, 68, 0.3)',
      }
    },
  },
  plugins: [],
}
