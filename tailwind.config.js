// tailwind.config.js
module.exports = {
  darkMode: 'class', // Enable dark mode with class strategy
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: '#0ea5e9',
        surface: '#1e293b',
        background: '#0f172a',
      },
      animation: {
        shine: 'shine 4s ease-in-out infinite',
      },
      keyframes: {
        shine: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(200%)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      dropShadow: {
        glow: '0 0 8px rgba(14, 165, 233, 0.8)',
      },
    },
  },
  plugins: [],
}
