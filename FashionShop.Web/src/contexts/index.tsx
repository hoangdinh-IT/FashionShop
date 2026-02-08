import React from 'react';

import { DialogProvider } from './DialogProvider';
import { SnackbarProvider } from './SnackbarProvider';
import { AuthProvider } from './AuthContext';

export { DialogProvider, useDialog } from './DialogProvider';
export { SnackbarProvider, useSnackbar } from './SnackbarProvider';
export { AuthProvider, useAuth } from './AuthContext';

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <SnackbarProvider>
            <DialogProvider>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </DialogProvider>
        </SnackbarProvider>
    );
};