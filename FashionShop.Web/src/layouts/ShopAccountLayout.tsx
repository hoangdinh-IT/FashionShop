import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../contexts';
import SidebarAccount from '../components/layout/shop/SidebarAccount';

const ShopAccountLayout: React.FC = () => {
    const { logout } = useAuth();

    return (
        <div className="w-full font-sans bg-white">
            <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-16 xl:px-24">
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
                    
                    {/* Sidebar: Đóng băng tại đây */}
                    <aside className="hidden lg:block w-64 xl:w-72 shrink-0 sticky top-24">
                        <SidebarAccount onLogout={logout} />
                    </aside>

                    {/* Mobile Sidebar: Hiện trên cùng nếu là mobile */}
                    <div className="lg:hidden w-full">
                        <SidebarAccount onLogout={logout} />
                    </div>

                    {/* Nội dung bên phải */}
                    <div className="flex-1 min-w-0">
                        <Outlet />
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ShopAccountLayout;