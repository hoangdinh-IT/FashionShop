import './assets/styles/index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from 'react-router-dom';

import App from './App.tsx'
import { AppContextProvider } from './contexts';

const queryClient = new QueryClient();

// Thiết lập môi trường (Config & Providers)
createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <AppContextProvider>
                    <App />
                </AppContextProvider>
            </BrowserRouter>
        </QueryClientProvider>
    </StrictMode>
)