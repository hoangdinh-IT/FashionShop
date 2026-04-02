import React, { createContext, useContext, useState, type ReactNode, useEffect } from 'react';
import type { UserInfo } from '../features/auth/types/user';

// 2. Định nghĩa kiểu dữ liệu cho Context
interface AuthContextType {
    user: UserInfo | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    login: (accessToken: string, refreshToken: string, user: UserInfo) => void;
    logout: () => void;
    isLoading: boolean; // Để hiển thị loading khi đang check localStorage lúc F5
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Tạo Provider
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserInfo | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Khi app vừa chạy (F5), check localStorage để khôi phục user
    useEffect(() => {
        const storedAccessToken = localStorage.getItem('accessToken');
        const storedRefreshToken = localStorage.getItem('refreshToken');
        const storedUser = localStorage.getItem('user');

        if (storedAccessToken && storedRefreshToken && storedUser) {
            setAccessToken(storedAccessToken);
            setRefreshToken(storedRefreshToken);
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    // Hàm Login: Lưu vào State và LocalStorage
    const login = (newAccessToken: string, newRefreshToken: string, newUser: UserInfo) => {
        setAccessToken(newAccessToken);
        setRefreshToken(newRefreshToken);
        setUser(newUser);
        
        localStorage.setItem('accessToken', newAccessToken);
        localStorage.setItem('refreshToken', newRefreshToken);
        localStorage.setItem('user', JSON.stringify(newUser));
    };

    // Hàm Logout: Xóa hết
    const logout = () => {
        setAccessToken(null);
        setRefreshToken(null);
        setUser(null);
        
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
    };

    const contextValue = React.useMemo(() => ({
        user,
        accessToken,
        refreshToken,
        isAuthenticated: !!accessToken,
        login,
        logout,
        isLoading
    }), [user, accessToken, refreshToken, isLoading]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

// 4. Hook để dùng nhanh ở các component khác
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};