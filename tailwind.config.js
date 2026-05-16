/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#FAF9F5',
          50: '#FDFCFA',
          100: '#FAF9F5',
          200: '#F3F1EA',
          300: '#E8E5DA',
        },
        ink: {
          DEFAULT: '#2D2A26',
          muted: '#6B6660',
          subtle: '#8B857D',
        },
        terracotta: {
          DEFAULT: '#CC785C',
          hover: '#B66A50',
          subtle: '#E8C1B0',
        },
        line: '#E4E0D6',
      },
      fontFamily: {
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      fontSize: {
        display: ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
      },
    },
  },
  plugins: [],
}
