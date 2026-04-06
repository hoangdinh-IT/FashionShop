import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/layout/shop/Header';

const ShopMainLayout: React.FC = () => {
    return (
        // Chuyển màu nền chung của web sang #f4f5f6 để đồng bộ với trang Account
        <div className="min-h-screen bg-[#f4f5f6] flex flex-col font-sans">
            
            {/* Header luôn nằm trên cùng */}
            <Header />

            {/* ĐÃ SỬA: Loại bỏ max-w-7xl và padding. Để class w-full để các trang con có thể tràn ra full màn hình */}
            <main className="flex-1 w-full flex flex-col">
                <Outlet />
            </main>

            {/* Footer tối giản cho giao diện hiện đại */}
            <footer className="py-8 text-center text-sm text-gray-400 border-t border-gray-200 bg-white">
                © 2026 FashionShop. All rights reserved.
            </footer>
            
        </div>
    );
};

export default ShopMainLayout;