/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: { DEFAULT: '#b8985a', light: '#d4b378', dim: 'rgba(184,152,90,0.12)' },
        sauzule: {
          bg: '#080808', card: '#111111', card2: '#161616',
          border: '#1e1e1e', text: '#f5f1ea', muted: '#aba395',
        },
      },
      fontFamily: {
        cormorant: ['Cormorant Garamond', 'Georgia', 'serif'],
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Outfit', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
