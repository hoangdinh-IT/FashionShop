import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/admin/Sidebar';
import Header from '../components/layout/admin/Header';

const MainLayout: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isHovered, setIsHovered] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const isExpanded = isSidebarOpen || isHovered;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar nằm bên trái */}
            <Sidebar 
                onHover={setIsHovered}
                isExpanded={isExpanded}
            />

            {/* Phần nội dung bên phải */}
            <div
                className={`
                    flex flex-col min-h-screen transition-all duration-300 ease-in-out
                    ${isExpanded ? 'ml-64' : 'ml-20'}
                `}
            >
                <Header toggleSidebar={toggleSidebar} />

                <main className="flex-1 p-2">
                    <Outlet />
                </main>

                <footer className="p-4 text-center text-xs text-gray-400">
                    © 2026 Design by FashionShop 
                </footer>
            </div>
        </div>
    );
};

export default MainLayout;