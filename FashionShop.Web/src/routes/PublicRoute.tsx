import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts';

const PublicRoute = () => {
    const { isAuthenticated, user, isLoading } = useAuth();
    
    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    // 2. Nếu ĐÃ đăng nhập rồi mà cố tình vào trang Login/Register -> Đá đi chỗ khác
    if (isAuthenticated && user) {
        if (user.role === "Admin") {
            return <Navigate to="/admin" replace />;
        } else {
            // Đá về trang chủ hoặc profile
            return <Navigate to="/" replace />; 
        }
    }

    return <Outlet />;
};

export default PublicRoute;