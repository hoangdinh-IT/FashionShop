import React, { createContext, useContext, useState, type ReactNode, useEffect } from 'react';
import type { UserInfo } from '../features/auth/types/user';

// 2. Định nghĩa kiểu dữ liệu cho Context
interface AuthContextType {
    user: UserInfo | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (token: string, user: UserInfo) => void;
    logout: () => void;
    isLoading: boolean; // Để hiển thị loading khi đang check localStorage lúc F5
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Tạo Provider
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserInfo | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Khi app vừa chạy (F5), check localStorage để khôi phục user
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    // Hàm Login: Lưu vào State và LocalStorage
    const login = (newToken: string, newUser: UserInfo) => {
        setToken(newToken);
        setUser(newUser);
        
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(newUser));
    };

    // Hàm Logout: Xóa hết
    const logout = () => {
        setToken(null);
        setUser(null);
        
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    const contextValue = React.useMemo(() => ({
        user,
        token,
        isAuthenticated: !!token,
        login,
        logout,
        isLoading
    }), [user, token, isLoading]); // Chỉ tạo lại object khi 3 biến này đổi

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