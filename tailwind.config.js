/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cleopatra: {
          gold: '#D4AF37',
          paleGold: '#F3E5AB',
          deepSea: '#0A1128',
          cardDark: '#121C38',
          gildedBrown: '#8B5A2B',
        }
      },
      fontFamily: {
        sans: ['"Tajawal"', 'sans-serif'],
        serif: ['"Playfair Display"', '"Amiri"', 'serif'],
      },
    },
  },
  plugins: [],
}
