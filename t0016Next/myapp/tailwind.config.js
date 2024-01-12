/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}",],
  // content: [
  //   "./app/**/*.{js,ts,jsx,tsx,mdx}",
  //   "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  //   "./components/**/*.{js,ts,jsx,tsx,mdx}",
  //   "./styles/**/*.{js,ts,jsx,tsx,mdx}",

  //   // Or if using `src` directory:
  //   "./src/**/*.{js,ts,jsx,tsx,mdx}",
  //   // "./components/layput/Layout.js",

  // ],
  // purge: {
  //   content: [
  //     // "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
  //     // "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  //     // "./src/**/**/*.{js,ts,jsx,tsx,mdx}",
  //     // "./app/**/*.{js,ts,jsx,tsx,mdx}",
  //     // "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  //     // "./components/**/*.{js,ts,jsx,tsx,mdx}",
  //     // "./styles/**/*.{js,ts,jsx,tsx,mdx}",

  //     // Or if using `src` directory:
  //     "./src/**/*.{js,ts,jsx,tsx,mdx}",
  //     // "./components/layput/Layout.js",
  //   ],
  //   options: {
  //     // https://purgecss.com/safelisting.html#patterns
  //     safelist: {
  //       standard: [/^bg-/, /^text-/],
  //     },
  //   },
  // },
  // content: [
  //   "./app/**/*.{js,ts,jsx,tsx,mdx}",
  //   "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  //   "./components/**/*.{js,ts,jsx,tsx,mdx}",
  //   "./styles/**/*.{js,ts,jsx,tsx,mdx}",

  //   // Or if using `src` directory:
  //   "./src/**/*.{js,ts,jsx,tsx,mdx}",
  //   // "./components/layput/Layout.js",

  // ],
  // purge: {
  //   content: [
  //     "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
  //     "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  //     "./src/**/**/*.{js,ts,jsx,tsx,mdx}",
  //   ],
  //   options: {
  //     // https://purgecss.com/safelisting.html#patterns
  //     safelist: {
  //       standard: [/^bg-/, /^text-/],
  //     },
  //   },
  // },

  darkMode: true, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}

