import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './app/styles/index.css';
import App from './app/App';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import '@/app/styles/global.css';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <AppProvider>
        <QueryClientProvider client={queryClient}>
          <Toaster position="top-right" />
          <App />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </AppProvider>
    </AuthProvider>
  </StrictMode>
);
