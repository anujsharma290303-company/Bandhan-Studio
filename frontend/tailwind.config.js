/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50:  '#E8EDF5',
          100: '#C5D0E6',
          500: '#254F7A',
          600: '#1E3A5F',
          700: '#162B47',
          900: '#0D1B2E',
        },
        brand: {
          green:  '#059669',
          amber:  '#D97706',
          red:    '#DC2626',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}