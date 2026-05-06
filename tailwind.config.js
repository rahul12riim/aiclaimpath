/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        serif: ['DM Serif Display', 'Georgia', 'serif'],
      },
      colors: {
        navy: {
          50: '#e8edf5', 100: '#c5d0e0', 200: '#9eb0cb',
          300: '#6e8bb0', 400: '#4a6f9a', 500: '#2e5585',
          600: '#1e3a5f', 700: '#152a47', 800: '#0e1e33', 900: '#0B1829',
        },
        mint: {
          50: '#e6f7f0', 100: '#b3e8d1', 200: '#7dd9b1',
          300: '#3dc98b', 400: '#1ab876', 500: '#0EA572',
          600: '#0b8a5f', 700: '#086e4b', 800: '#045236', 900: '#023522',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-up': 'fadeUp 0.5s ease both',
        'slide-in': 'slideIn 0.3s ease both',
      },
      keyframes: {
        fadeUp: { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideIn: { from: { opacity: '0', transform: 'translateX(-8px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
      },
    },
  },
  plugins: [],
}
