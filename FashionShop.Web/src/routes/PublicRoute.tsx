import { Navigate, Outlet } from 'react-router-dom';

const PublicRoute = () => {
    const token = localStorage.getItem("token");
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;
    const role = user?.role;
    
    // Nếu ĐÃ đăng nhập
    if (token) {
        if (role === "Admin") {
            return <Navigate to="/admin" replace />;
        } else {
            return <Navigate to="/profile" replace />;
        }
    }

    return <Outlet />;
};

export default PublicRoute;