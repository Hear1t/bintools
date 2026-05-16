/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Backgrounds (was cream/warm) → now dark surfaces
        cream: {
          DEFAULT: '#0A0A0A',
          50: '#141414',
          100: '#0F0F0F',
          200: '#1F1F1F',
          300: '#2A2A2A',
        },
        // Text (was warm dark) → now light
        ink: {
          DEFAULT: '#FAFAFA',
          muted: '#A1A1AA',
          subtle: '#71717A',
        },
        // Accent (was terracotta) → now vibrant orange
        terracotta: {
          DEFAULT: '#F97316',
          hover: '#FB923C',
          subtle: 'rgba(249,115,22,0.15)',
        },
        line: '#27272A',
      },
      fontFamily: {
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: [
          'ui-monospace',
          '"JetBrains Mono"',
          '"SF Mono"',
          'Menlo',
          'monospace',
        ],
      },
      fontSize: {
        display: ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
      },
    },
  },
  plugins: [],
}
