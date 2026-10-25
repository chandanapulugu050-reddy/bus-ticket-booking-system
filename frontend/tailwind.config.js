/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0B2046', // Deep Blue / Navy
        secondary: '#2563EB', // Blue
        accent: '#F97316', // Orange
      }
    },
  },
  plugins: [],
}
