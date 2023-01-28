/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./modules/**/*.{js,ts,jsx,tsx}",
    "./common/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      sans: ["Montserrat", "sans-serif"],
      serif: ["Merriweather", "serif"],
    },
    extend: {},
  },
  plugins: [require("@tailwindcss/typography")],
}
