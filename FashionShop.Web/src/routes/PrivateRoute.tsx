import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Import đường dẫn cho đúng với dự án của bạn
import type { RoleUser } from '../features/shop/users/types/user';

interface PrivateRouteProps {
    allowedRoles?: RoleUser[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowedRoles }) => {
    const { isAuthenticated, user, isLoading } = useAuth();

    // 1. QUAN TRỌNG: Đợi Context load dữ liệu từ localStorage lên State
    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    // 2. Chưa đăng nhập -> Đá về Login
    if (!isAuthenticated) {
        return <Navigate to="/auth/login" replace />;
    }

    // 3. Đã đăng nhập nhưng sai quyền (VD: Customer cố tình vào route Admin)
    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />; 
    }

    // 4. Hợp lệ toàn bộ -> Cho phép xem trang
    return <Outlet />;
};

export default PrivateRoute;