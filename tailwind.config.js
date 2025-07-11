/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
// tailwind.config.js
theme: {
  extend: {
    fontFamily: {
      sans: ['Satoshi', 'sans-serif'], // or 'Inter', 'Space Grotesk'
      mono: ['JetBrains Mono', 'monospace'],
    },

      animation: {
        typewriter: 'typing 3.5s steps(40, end) 1 normal both, blink 1s step-end infinite',
        pulseBackground: 'pulseBackground 15s ease infinite',
      },
      keyframes: {
        typing: {
          from: { width: '0%' },
          to: { width: '100%' },
        },
        blink: {
          '0%, 100%': { borderColor: 'transparent' },
          '50%': { borderColor: '#22c55e' },
        },
        pulseBackground: {
          '0%, 100%': {
            backgroundPosition: '0% 50%',
          },
          '50%': {
            backgroundPosition: '100% 50%',
          },
        },
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}
