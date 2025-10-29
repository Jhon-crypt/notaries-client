import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { initGoogleMaps } from './utils/loadGoogleMaps'
import { LanguageProvider } from './context/LanguageContext'

// Initialize Google Maps API
initGoogleMaps();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>,
)
