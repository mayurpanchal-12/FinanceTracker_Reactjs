import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { registerSW } from 'virtual:pwa-register'
import { AuthProvider } from './context/AuthContext';

registerSW({ immediate: true })
window.__installPromptEvent = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  window.__installPromptEvent = e;
});

import { Toaster } from 'react-hot-toast';
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
       <Toaster position="bottom-right" toastOptions={{ duration: 3000 }} />
    </AuthProvider>
  </React.StrictMode>
);