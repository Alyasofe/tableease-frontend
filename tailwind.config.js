/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0D1B2A',    // Dark Blue (Navbar, Headings)
        secondary: '#1B263B',  // Secondary Blue (Section Backgrounds)
        accent: '#415A77',     // Sky Blue (Buttons, Links)
        highlight: '#778DA9',  // Light Blue (Highlights)
        cream: '#E0E1DD',      // White Cream (Main Background)
      },
      fontFamily: {
        sans: ['"Open Sans"', 'sans-serif'],
        heading: ['"Montserrat"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
