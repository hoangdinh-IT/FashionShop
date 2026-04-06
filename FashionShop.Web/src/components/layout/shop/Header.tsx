import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
    return (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm font-sans transition-all duration-300">
            <div className="w-full px-6 lg:px-12 h-20 flex items-center justify-between">
                
                {/* 1. Trái: Nút Danh mục (Giữ nguyên khung nhưng làm thanh lịch hơn) */}
                <div className="flex-1 flex justify-start">
                    <button className="flex items-center gap-2.5 border border-gray-200 rounded-full px-5 py-2 text-sm font-medium text-gray-700 hover:border-black hover:text-black hover:bg-gray-50 transition-all duration-300">
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
                        rKA Shop
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

                    {/* Giỏ hàng (Túi xách nét mảnh) */}
                    <button className="text-gray-800 hover:text-black hover:-translate-y-0.5 transition-all duration-300 relative">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </button>

                    {/* Tài khoản */}
                    <Link to="/profile" className="flex items-center gap-2 text-gray-800 hover:text-black group transition-colors">
                        <svg className="w-6 h-6 group-hover:-translate-y-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="font-medium text-sm hidden sm:block tracking-wide">Hoàng</span>
                    </Link>
                </div>

            </div>
        </header>
    );
};

export default Header;