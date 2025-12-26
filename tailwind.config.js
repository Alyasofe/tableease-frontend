/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#050505',    // Rich Black
        secondary: '#111111',  // Deep Charcoal
        accent: '#C5A059',     // Premium Gold
        highlight: '#D4AF37',  // Vibrant Gold
        cream: '#F8F7F4',      // Luxury Pearl White
        gold: {
          50: '#FDFCF7',
          100: '#FAF7EA',
          200: '#F1E9CB',
          300: '#E7D9A4',
          400: '#D9C579',
          500: '#C5A059',
          600: '#B28E4C',
          700: '#947441',
          800: '#775C37',
          900: '#624C30',
        }
      },
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
        heading: ['"Outfit"', 'sans-serif'],
        arabic: ['"Alexandria"', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fade-in 0.8s ease-out',
        'slide-up': 'slide-up 0.8s ease-out',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      }
    },
  },
  plugins: [],
}
