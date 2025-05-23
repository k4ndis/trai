// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#00f5cc",             // Hauptfarbe (Logo-Grün)
        "primary-dark": "#00c9a9",      // dunklere Version (optional, z. B. Hover oder Dark Mode)
      },
    },
  },
  plugins: [],
  corePlugins: {
    textDecoration: false,
  },
}
