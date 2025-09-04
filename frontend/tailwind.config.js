/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        metropolis: ['"Metropolis"', 'sans-serif'],
      },
      colors: {
        primaryBlue: '#094363',
        primaryGreen: '#026530',
        // tu peux ajouter d'autres variantes ici
      },
    },
  },
  plugins: [],
};
