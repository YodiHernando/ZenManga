import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Global QueryClient configuration
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000,        // Data tetap "fresh" 5 menit
            gcTime: 10 * 60 * 1000,           // Cache disimpan 10 menit di memori
            retry: 2,                         // 2x retry (api.js tidak lagi double-retry)
            retryDelay: (attempt) =>
                Math.min(3000 * attempt, 9000), // 3s, 6s
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
        },
    },
});

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <QueryClientProvider client={queryClient}>
                <App />
                {/* DevTools — hanya muncul di development mode */}
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </BrowserRouter>
    </React.StrictMode>,
);
