import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../contexts';
import SidebarAccount from '../components/layout/shop/SidebarAccount';

const ShopAccountLayout: React.FC = () => {
    const { logout } = useAuth();

    return (
        <div className="w-full py-10 font-sans">
            <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-16 xl:px-24">
                
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                    
                    {/* Component Bên Trái (Sidebar) */}
                    <SidebarAccount 
                        onLogout={logout}
                    />

                    {/* Component Bên Phải (Nội dung thay đổi theo URL) */}
                    <div className="flex-1">
                        <Outlet />
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ShopAccountLayout;