import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    IoPersonOutline,
    IoReceiptOutline,
    IoLocationOutline,
    IoChatbubblesOutline,
    IoLogOutOutline
} from "react-icons/io5";

// Khai báo menu tĩnh gọn gàng như Admin
const MENU_ITEMS = [
    { path: '/shop/account/information', label: 'Thông tin tài khoản', icon: IoPersonOutline },
    { path: '/shop/account/orders', label: 'Lịch sử đơn hàng', icon: IoReceiptOutline },
    { path: '/shop/account/address', label: 'Sổ địa chỉ', icon: IoLocationOutline },
    { path: '/shop/account/reviews', label: 'Đánh giá và phản hồi', icon: IoChatbubblesOutline },
];

interface SidebarAccountProps {
    onLogout: () => void;
}

const SidebarAccount: React.FC<SidebarAccountProps> = ({ onLogout }) => {
    // Dùng useLocation để check active giống hệt Admin Sidebar
    const location = useLocation();

    return (
        <aside className="w-full lg:w-[320px] flex-shrink-0 flex flex-col gap-2">
            
            <nav className="flex flex-col gap-2">
                {MENU_ITEMS.map((item) => {
                    const Icon = item.icon;
                    // Check xem URL hiện tại có chứa path của menu không
                    const isActive = location.pathname.includes(item.path);

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`
                                group flex items-center justify-between px-5 py-4 rounded-2xl font-medium transition-all duration-300 border
                                ${isActive 
                                    ? 'bg-zinc-900 text-white border-zinc-900 shadow-lg shadow-zinc-900/20' 
                                    : 'bg-white text-zinc-600 border-zinc-100 hover:border-zinc-300 hover:text-zinc-900 hover:shadow-sm'
                                }
                            `}
                        >
                            <div className="flex items-center gap-4">
                                {/* Khối bọc Icon */}
                                <div className={`flex items-center justify-center w-9 h-9 rounded-full transition-colors duration-300 ${
                                    isActive ? 'bg-zinc-800 text-white' : 'bg-zinc-50 text-zinc-500 group-hover:bg-zinc-100 group-hover:text-zinc-900'
                                }`}>
                                    <Icon className="text-[18px]" />
                                </div>
                                <span className={isActive ? 'tracking-wide' : ''}>
                                    {item.label}
                                </span>
                            </div>
                            
                            {/* Mũi tên nhỏ bên phải */}
                            <svg className={`w-4 h-4 transition-transform duration-300 ${isActive ? 'translate-x-1 text-white' : 'text-zinc-300 group-hover:text-zinc-500 group-hover:translate-x-1'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    );
                })}
            </nav>

            <div className="h-px bg-zinc-200/60 my-2 mx-4"></div>

            {/* Nút Đăng xuất */}
            <button
                onClick={onLogout}
                className="group flex items-center gap-4 px-5 py-4 rounded-2xl bg-white text-zinc-600 border border-zinc-100 hover:border-red-100 hover:bg-red-50 hover:text-red-600 transition-all duration-300 w-full text-left font-medium"
            >
                <div className="flex items-center justify-center w-9 h-9 rounded-full bg-zinc-50 text-zinc-500 group-hover:bg-red-100 group-hover:text-red-600 transition-colors duration-300">
                    <IoLogOutOutline className="text-[18px]" />
                </div>
                <span>Đăng xuất</span>
            </button>
            
        </aside>
    );
};

export default SidebarAccount;