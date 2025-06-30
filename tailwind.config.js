// tailwind.config.js
module.exports = {
  darkMode: 'class', // future use
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily:{
        inter:['Inter', 'sans-serif'],
      
      colors: {
        primary: '#0ea5e9',
        surface: '#1e293b',
        background: '#0f172a',
      }
      },
    },
  },
  plugins: [],
}
