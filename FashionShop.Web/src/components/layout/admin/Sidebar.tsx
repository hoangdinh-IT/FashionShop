import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    IoGridOutline,
    IoLogOutOutline,
    IoDiamondOutline,
    IoListOutline,
    IoPricetagsOutline,
    IoColorPaletteOutline,
    IoScanOutline,
    IoCubeOutline,
    IoTicketOutline
} from "react-icons/io5";
import { useAuth } from '../../../contexts/AuthContext';



interface SidebarProps {
    onHover: (value: boolean) => void;
    isExpanded: boolean;
}

const MENU_ITEMS = [
    { path: '/admin', label: 'Tổng quan', icon: IoGridOutline },
    { path: '/admin/categories', label: 'Danh mục', icon: IoListOutline },
    { path: '/admin/brands', label: 'Thương hiệu', icon: IoPricetagsOutline },
    { path: '/admin/colors', label: 'Màu sắc', icon: IoColorPaletteOutline },
    { path: '/admin/sizes', label: 'Kích thước', icon: IoScanOutline },
    { path: '/admin/products', label: 'Sản phẩm', icon: IoCubeOutline },
    { path: '/admin/vouchers', label: 'Phiếu giảm giá', icon: IoTicketOutline },
];

const Sidebar: React.FC<SidebarProps> = ({ onHover, isExpanded }) => {
    const location = useLocation();
    const { logout } = useAuth();

    return (
        <aside
            // ✅ Gọi hàm từ cha khi di chuột
            onMouseEnter={() => onHover(true)}
            onMouseLeave={() => onHover(false)}
            
            className={`
                fixed left-0 top-0 z-20 h-screen bg-white border-r border-gray-100 shadow-sm
                transition-all duration-300 ease-in-out
                ${isExpanded ? 'w-64' : 'w-20 hover:w-64'} 
            `}
        >

            <div className="group flex h-16 items-center border-b border-gray-50 px-6 overflow-hidden">
                <div className="flex items-center gap-3 text-indigo-600 font-bold text-xl whitespace-nowrap">
                    <IoDiamondOutline className="text-2xl min-w-[24px]" />
                    <span 
                        className={`
                            whitespace-nowrap transition-all ease-in-out
                            /* 1. Sửa duration-300 thành duration-200 để đồng bộ tốc độ với Menu */
                            duration-200
                            ${isExpanded 
                                ? 'opacity-100 translate-x-0' 
                                : 'opacity-0 -translate-x-4 w-0 overflow-hidden'}
                        `}
                    >
                        FashionShop
                    </span>
                </div>
            </div>

            {/* 2. Menu Items */}
            <nav className="mt-6 flex flex-col gap-2 px-3">
                {MENU_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`
                                group flex items-center gap-3 rounded-xl px-3 py-3 font-medium transition-colors overflow-hidden
                                ${isActive ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500 hover:bg-gray-50 hover:text-indigo-500'}
                            `}
                        >
                            <Icon className="text-xl min-w-[20px]" />
                            <span className={`whitespace-nowrap transition-all duration-200 ${isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 w-0 group-hover:opacity-100 group-hover:translate-x-0 group-hover:w-auto'}`}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </nav>

             {/* Footer ... */}
             <div className="absolute bottom-4 left-0 w-full px-3">
                <button 
                    className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors overflow-hidden"
                    onClick={logout}
                >
                    <IoLogOutOutline className="text-xl min-w-[20px]" />
                    <span className={`whitespace-nowrap transition-all duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0 w-0 group-hover:opacity-100 group-hover:w-auto'}`}>
                        Đăng xuất
                    </span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;