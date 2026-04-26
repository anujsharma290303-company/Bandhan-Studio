/**
 * Vite Configuration
 * Defines build tool settings, plugins, and optimization rules
 */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Enable React plugin for JSX transformation and Fast Refresh (HMR)
  plugins: [react()],
})
