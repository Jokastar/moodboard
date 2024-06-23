/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'reckless-neue': ['RecklessNeue', 'serif'],
        "favorit-c" : ["FavoritC", "sans-serif"],
        "favorit-light-c": ["FavoritLightC", "sans-serif"],
        "reckless-neue-book" : ["RecklessNeueBook", "serif"]
      },
     
    },
  },

  plugins: [require("daisyui")],

};
