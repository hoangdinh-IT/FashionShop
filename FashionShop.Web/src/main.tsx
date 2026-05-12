import './assets/styles/index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

import App from './App.tsx'
import { AppContextProvider } from './contexts';

const queryClient = new QueryClient();

// Thiết lập môi trường (Config & Providers)
createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <GoogleOAuthProvider clientId="1002098911051-q6cohq1ltgcj1jb35r1klgv3f08q5man.apps.googleusercontent.com">
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <AppContextProvider>
                        <App />
                    </AppContextProvider>
                </BrowserRouter>
            </QueryClientProvider>
        </GoogleOAuthProvider>
    </StrictMode>
)