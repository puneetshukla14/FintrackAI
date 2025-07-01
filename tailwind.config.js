module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
extend: {
  fontFamily: {
    mono: ['Courier New', 'monospace'],
  },
  animation: {
    typewriter: 'typing 3.5s steps(40, end) 1 normal both, blink 1s step-end infinite',
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
  },
}

  },
  plugins: [require('tailwind-scrollbar')],
}
