import { Navigate, useRoutes } from "react-router-dom"

import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import AuthLayout from "../layouts/AuthLayout";
import LoginPage from "../pages/auth/LoginPage"
import RegisterPage from "../pages/auth/RegisterPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import ResetPasswordForm from "../features/auth/components/ResetPasswordForm";

import AdminMainLayout from "../layouts/AdminMainLayout";
import DashboardPage from "../pages/admin/dashboard/DashboardPage";
import CategoryPage from "../pages/admin/categories/CategoryPage";
import BrandPage from "../pages/admin/brands/BrandPage";
import ColorPage from "../pages/admin/colors/ColorPage";
import SizePage from "../pages/admin/sizes/SizePage";
import AdminProductPage from "../pages/admin/products/ProductPage";
import VoucherPage from "../pages/admin/vouchers/VoucherPage";

import ShopMainLayout from "../layouts/ShopMainLayout";
import ShopAccountLayout from "../layouts/ShopAccountLayout";
import InformationPage from "../pages/shop/users/InformationPage";
import AddressPage from "../pages/shop/addresses/AddressPage";
import ShopProductPage from "../pages/shop/products/ProductPage";

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
                    element: <AdminMainLayout />,
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
                            element: <AdminProductPage />
                        },
                        {
                            path: "vouchers",
                            element: <VoucherPage />
                        }
                    ]
                }
            ]
        },
        {
            element: <PrivateRoute allowedRoles={["Customer"]} />, // Chỉ cho Role 0 (Admin) vào
            children: [
                {
                    path: "/shop",
                    element: <ShopMainLayout />,
                    children: [
                        {
                            path: "account",
                            element: <ShopAccountLayout />,
                            children: [
                                {
                                    index: true,
                                    element: <Navigate to="information" replace /> // Mặc định vào thẳng information
                                },
                                {
                                    path: "information", // URL: /shop/account/information
                                    element: <InformationPage /> 
                                },
                                {
                                    path: "address", // URL: /shop/account/address
                                    element: <AddressPage />
                                }
                            ]
                        },
                        {
                            path: "collection/:brandSlug?/:categorySlug?",
                            element: <ShopProductPage />
                        }
                    ]
                }
            ]
        },
    ]);

    return elements;
}