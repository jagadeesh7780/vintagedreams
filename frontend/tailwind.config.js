/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fdf4f5',
          100: '#fbe8eb',
          200: '#f7d5da',
          300: '#f0b5bf',
          400: '#e48a9b',
          500: '#d35c73',
          600: '#ba3e58',
          700: '#9c2f46',
          800: '#83293d',
          900: '#702637',
          950: '#3e101b',
        },
        vintage: {
          gold: '#D4AF37',
          dark: '#121212',
          card: '#1e1e1e',
          accent: '#c5a059',
          cream: '#FDFBF7',
          charcoal: '#2B2D42'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      }
    },
  },
  plugins: [],
}
