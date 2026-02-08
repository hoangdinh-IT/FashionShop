import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { RoleUser } from '../features/auth/types/user';

interface PrivateRouteProps {
    allowedRoles?: RoleUser[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowedRoles }) => {
    const { isAuthenticated, user, isLoading } = useAuth();

    // 1. QUAN TRỌNG: Nếu đang load thì Return Loading (hoặc null)
    // Không được return Navigate ở bước này!
    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    // 2. Chưa đăng nhập -> Đá về Login
    if (!isAuthenticated) {
        return <Navigate to="/auth/login" replace />;
    }

    // 3. Sai quyền -> Đá về trang "Unauthorized" hoặc trang chủ đích thực (ví dụ /profile)
    // ĐỪNG đá về "/" nếu "/" đang redirect ngược lại login
    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        // Nếu là user thường, cho về trang Profile hoặc Dashboard của họ
        return <Navigate to="/" replace />; 
    }

    return <Outlet />;
};

export default PrivateRoute;