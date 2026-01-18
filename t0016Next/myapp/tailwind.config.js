/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: true, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: "#66a962",
        secondary: "#776D5C",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
