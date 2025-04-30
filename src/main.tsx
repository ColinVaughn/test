
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { HelmetProvider } from 'react-helmet-async';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/hooks/useAuth';
import { CartProvider } from '@/hooks/use-cart';

// Function to handle non-critical initialization
const initializeNonCriticalFeatures = () => {
  // This could include analytics, non-critical scripts, etc.
  console.info('Non-critical features initialized');
};

// Render the app as quickly as possible
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <TooltipProvider>
        <AuthProvider>
          <CartProvider>
            <Router>
              <App />
            </Router>
          </CartProvider>
        </AuthProvider>
      </TooltipProvider>
    </HelmetProvider>
  </React.StrictMode>
);

// Defer non-critical initialization
if (window.requestIdleCallback) {
  window.requestIdleCallback(initializeNonCriticalFeatures);
} else {
  // Fallback for browsers that don't support requestIdleCallback
  setTimeout(initializeNonCriticalFeatures, 200);
}
