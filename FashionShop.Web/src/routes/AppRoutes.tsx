import { Navigate, useRoutes } from "react-router-dom"

import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import AuthLayout from "../layouts/AuthLayout";
import LoginPage from "../pages/auth/LoginPage"
import RegisterPage from "../pages/auth/RegisterPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import ResetPasswordForm from "../features/auth/components/ResetPasswordForm";

import MainLayout from "../layouts/MainLayout";
import DashboardPage from "../pages/admin/dashboard/DashboardPage";
import CategoryPage from "../pages/admin/categories/CategoryPage";
import BrandPage from "../pages/admin/brands/BrandPage";
import ColorPage from "../pages/admin/colors/ColorPage";
import SizePage from "../pages/admin/sizes/SizePage";
import ProductPage from "../pages/admin/products/ProductPage";
import VoucherPage from "../pages/admin/vouchers/VoucherPage";

export const AppRoutes = () => {
    const elements = useRoutes([
        {
            path: "/",
            element: <Navigate to="/auth/login" replace/>
        },
        {
            element: <PublicRoute />, 
            children: [
                {
                    path: "/auth",
                    element: <AuthLayout />,
                    children: [
                        {
                            index: true,
                            element: <Navigate to="/auth/login" replace />
                        },
                        {
                            path: "login",
                            element: <LoginPage />
                        },
                        {
                            path: "register",
                            element: <RegisterPage />
                        },
                        {
                            path: "forgot-password",
                            element: <ForgotPasswordPage />
                        },
                        {
                            path: "reset-password",
                            element: <ResetPasswordForm />
                        }
                    ]
                }
            ]
        },
        {
            element: <PrivateRoute allowedRoles={["Admin"]} />, // Chỉ cho Role 0 (Admin) vào
            children: [
                {
                    path: "/admin",
                    element: <MainLayout />,
                    children: [
                        {
                            index: true,
                            element: <DashboardPage />
                        },
                        {
                            path: "categories",
                            element: <CategoryPage />
                        },
                        {
                            path: "brands",
                            element: <BrandPage />
                        },
                        {
                            path: "colors",
                            element: <ColorPage />
                        },
                        {
                            path: "sizes",
                            element: <SizePage />
                        }, 
                        {
                            path: "products",
                            element: <ProductPage />
                        },
                        {
                            path: "vouchers",
                            element: <VoucherPage />
                        }
                    ]
                }
            ]
        },
    ]);

    return elements;
}