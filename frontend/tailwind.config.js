/**
 * Tailwind CSS Configuration
 * Defines template paths, theme customization, and plugins
 */
/** @type {import('tailwindcss').Config} */
export default {
  // Paths to files containing Tailwind class names
  content: [
    "./index.html",                    // Include HTML template
    "./src/**/*.{js,ts,jsx,tsx}",      // Include all React components
  ],
  theme: {
    // Extend default Tailwind theme
    extend: {},
  },
  // List of Tailwind plugins
  plugins: [],
}