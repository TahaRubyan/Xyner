/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'black-forest': '#0a1c11',
        'india-green': '#3e8914',
        'medium-jungle': '#3da35d',
        'light-green': '#96e072',
        'frosted-mint': '#e8fccc',
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
}
