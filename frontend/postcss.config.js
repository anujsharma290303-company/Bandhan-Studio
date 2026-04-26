/**
 * PostCSS Configuration - CSS Processing Pipeline
 * Adds vendor prefixes and processes Tailwind CSS classes
 */
export default {
  plugins: {
    tailwindcss: {},  // Process Tailwind CSS utility classes
    autoprefixer: {}, // Add vendor prefixes for cross-browser compatibility
  },
}
