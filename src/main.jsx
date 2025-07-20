import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { registerServiceWorker, addResourceHints } from './utils/performance'

// Initialize performance optimizations AFTER React mounts
const initializePerformanceOptimizations = () => {
  addResourceHints();
  registerServiceWorker();
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Initialize performance optimizations after render
setTimeout(initializePerformanceOptimizations, 0);
