/**
 * Application entry point for Bandan Studio frontend.
 * Renders the root React component into the DOM.
 * StrictMode helps catch potential problems in development.
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Mount the App component to the #root element
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
