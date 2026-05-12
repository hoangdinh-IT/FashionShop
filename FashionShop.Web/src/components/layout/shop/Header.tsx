import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MegaMenu from '../../../features/shop/brands/components/MegaMenu';
import { useUsers } from '../../../features/shop/users/hooks/useUsers';

const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const { user, isLoading } = useUsers();

    return (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm font-sans transition-all duration-300">
            <div className="w-full px-6 lg:px-12 h-20 flex items-center justify-between">
                
                {/* 1. Trái: Nút Danh mục (Giữ nguyên khung nhưng làm thanh lịch hơn) */}
                <div className="flex-1 flex justify-start">
                    <button 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="flex items-center gap-2.5 border border-gray-200 rounded-full px-5 py-2 text-sm font-medium text-gray-700 hover:border-black hover:text-black hover:bg-gray-50 transition-all duration-300 cursor-pointer"
                    >
                        {/* Icon Menu cách điệu (các đường line không bằng nhau tạo sự hiện đại) */}
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7h16M4 12h16M4 17h10" />
                        </svg>
                        <span className="tracking-wide">Danh mục</span>
                    </button>
                </div>

                {/* 2. Giữa: Logo rKA Shop (Đổi sang phong cách Luxury: Chữ in hoa, khoảng cách rộng, màu đen tuyền) */}
                <div className="flex-1 flex justify-center">
                    <Link 
                        to="/" 
                        className="text-2xl md:text-3xl font-bold uppercase tracking-[0.15em] text-black hover:opacity-60 transition-opacity"
                    >
                        RKA Shop
                    </Link>
                </div>

                {/* 3. Phải: Tìm kiếm, Giỏ hàng & User (Icon nét mảnh, bỏ màu rực rỡ) */}
                <div className="flex-1 flex justify-end items-center gap-5 md:gap-7">
                    
                    {/* Ô tìm kiếm */}
                    <div className="relative hidden lg:block w-full max-w-[260px] group">
                        <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 group-focus-within:text-black transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </span>
                        <input
                            type="text"
                            placeholder="Tìm kiếm..." 
                            className="w-full border border-gray-200 rounded-full pl-11 pr-4 py-2 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all bg-transparent text-gray-800 placeholder-gray-400"
                        />
                    </div>

                    {/* Giỏ hàng */}
                    <Link 
                        to="/shop/cart" 
                        className="group relative flex items-center justify-center"
                    >
                        {/* Glow effect */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-zinc-100 to-zinc-200 opacity-0 group-hover:opacity-100 blur-md transition-all duration-500 scale-110" />

                        {/* Cart Container */}
                        <div className="relative w-11 h-11 rounded-full border border-zinc-200 bg-white flex items-center justify-center overflow-hidden shadow-[0_4px_18px_rgba(0,0,0,0.06)] group-hover:shadow-[0_8px_28px_rgba(0,0,0,0.12)] transition-all duration-300 group-hover:-translate-y-0.5">
                            
                            {/* subtle gradient */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white via-zinc-50 to-zinc-100 opacity-80" />

                            {/* Icon */}
                            <svg 
                                className="relative w-[22px] h-[22px] text-zinc-700 transition-all duration-300 group-hover:scale-110 group-hover:text-black" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={1.5} 
                                    d="M3 5h2l2.2 10.2a1 1 0 00.98.8h8.9a1 1 0 00.98-.8L21 8H7" 
                                />
                                <circle cx="10" cy="19" r="1.7" fill="currentColor" stroke="none" />
                                <circle cx="18" cy="19" r="1.7" fill="currentColor" stroke="none" />
                            </svg>

                        </div>
                    </Link>

                    {/* Tài khoản */}
                    <Link 
                        to="/shop/account/information" 
                        className="group relative flex items-center justify-center"
                    >
                        {/* Glow nền nhẹ */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-zinc-100 to-zinc-200 opacity-0 group-hover:opacity-100 blur-md transition-all duration-500 scale-110" />

                        {/* Avatar Container */}
                        <div className="relative w-11 h-11 rounded-full overflow-hidden border border-zinc-200 bg-white shadow-[0_4px_18px_rgba(0,0,0,0.06)] group-hover:shadow-[0_8px_28px_rgba(0,0,0,0.12)] transition-all duration-300 group-hover:-translate-y-0.5">
                            
                            {isLoading ? (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100">
                                    <svg 
                                        className="w-5 h-5 text-zinc-400" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            strokeWidth={1.4} 
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                                        />
                                    </svg>
                                </div>
                            ) : user?.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt={user.fullName || "User Avatar"}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100">
                                    <svg 
                                        className="w-5 h-5 text-zinc-500" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            strokeWidth={1.4} 
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                                        />
                                    </svg>
                                </div>
                            )}

                            {/* Online Dot */}
                            <div className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white shadow-sm" />
                        </div>
                    </Link>
                </div>

            </div>

            <MegaMenu 
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
            />
        </header>
    );
};

export default Header;