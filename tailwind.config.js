// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}"
    ],
    darkMode: "class",
    theme: {
      extend: {},
    },
    plugins: [],
    corePlugins: {
      textDecoration: false,
    },
  }
  