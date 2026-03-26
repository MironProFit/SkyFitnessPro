import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './app/styles/index.css';
import App from './app/App';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import '@/app/styles/global.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <AppProvider>
        <App />
      </AppProvider>
    </AuthProvider>
   </StrictMode>
);
