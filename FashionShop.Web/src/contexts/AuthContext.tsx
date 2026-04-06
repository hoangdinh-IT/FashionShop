import React, { createContext, useContext, useState, type ReactNode, useEffect } from 'react';
import type { User } from '../features/shop/users/types/user';

// 2. Định nghĩa kiểu dữ liệu cho Context
interface AuthContextType {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    login: (user: User, accessToken: string, refreshToken: string) => void;
    logout: () => void;
    isLoading: boolean; // Để hiển thị loading khi đang check localStorage lúc F5
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Tạo Provider
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Khi app vừa chạy (F5), check localStorage để khôi phục user
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedAccessToken = localStorage.getItem('accessToken');
        const storedRefreshToken = localStorage.getItem('refreshToken');

        if (storedAccessToken && storedRefreshToken && storedUser) {
            setUser(JSON.parse(storedUser));
            setAccessToken(storedAccessToken);
            setRefreshToken(storedRefreshToken);
        }
        setIsLoading(false);
    }, []);

    // Hàm Login: Lưu vào State và LocalStorage
    const login = (newUser: User, newAccessToken: string, newRefreshToken: string) => {
        setUser(newUser);
        setAccessToken(newAccessToken);
        setRefreshToken(newRefreshToken);
        
        localStorage.setItem('user', JSON.stringify(newUser));
        localStorage.setItem('accessToken', newAccessToken);
        localStorage.setItem('refreshToken', newRefreshToken);
    };

    // Hàm Logout: Xóa hết
    const logout = () => {
        setUser(null);
        setAccessToken(null);
        setRefreshToken(null);
        
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
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