import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    IoPersonOutline,
    IoReceiptOutline,
    IoLocationOutline,
    IoChatbubblesOutline,
    IoLogOutOutline,
    IoMenuOutline,
    IoCloseOutline,
} from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";

const MENU_ITEMS = [
    {
        path: "/shop/account/information",
        label: "Thông tin tài khoản",
        icon: IoPersonOutline,
    },
    {
        path: "/shop/account/purchase-histories",
        label: "Lịch sử mua hàng",
        icon: IoReceiptOutline,
    },
    {
        path: "/shop/account/address",
        label: "Sổ địa chỉ",
        icon: IoLocationOutline,
    },
    {
        path: "/shop/account/reviews",
        label: "Đánh giá & phản hồi",
        icon: IoChatbubblesOutline,
    },
];

interface SidebarAccountProps {
    onLogout: () => void;
}

const SidebarAccount: React.FC<SidebarAccountProps> = ({ onLogout }) => {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Tự động đóng Menu Drawer khi chuyển trang
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    // Khóa cuộn trang chính khi đang mở Mobile Menu Drawer
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isMobileMenuOpen]);

    return (
        <aside className="w-full lg:w-[280px] shrink-0 font-sans select-none">
            
            {/* ========================================================= */}
            {/* 1. MOBILE & TABLET (< lg) - CHỈ CÓ NÚT 3 GẠCH NGANG       */}
            {/* ========================================================= */}
            <div className="lg:hidden mb-4">
                {/* Thanh hiển thị tối giản chỉ có icon 3 gạch và tiêu đề */}
                <div className="flex items-center justify-start py-1">
                    {/* NÚT 3 GẠCH NGANG TỐI GIẢN */}
                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="flex items-center justify-center h-10 w-10 rounded-xl bg-zinc-900 text-white shrink-0 active:scale-95 transition-transform cursor-pointer shadow-xs hover:bg-black"
                        aria-label="Mở menu tài khoản"
                    >
                        <IoMenuOutline className="text-2xl" />
                    </button>
                </div>

                {/* Drawer Menu trượt từ bên trái */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <>
                            {/* Backdrop mờ nền */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs"
                            />

                            {/* Bảng Drawer Menu */}
                            <motion.div
                                initial={{ x: "-100%" }}
                                animate={{ x: 0 }}
                                exit={{ x: "-100%" }}
                                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                className="fixed top-0 left-0 bottom-0 z-50 w-[82%] max-w-[320px] bg-white p-5 shadow-2xl flex flex-col justify-between overflow-y-auto"
                            >
                                <div>
                                    {/* Header Drawer */}
                                    <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-100">
                                        <div>
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block">
                                                Cài đặt tài khoản
                                            </span>
                                            <h3 className="text-base font-bold text-zinc-900">
                                                Danh mục
                                            </h3>
                                        </div>
                                        <button
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="p-2 rounded-full hover:bg-zinc-100 text-zinc-500 transition-colors cursor-pointer"
                                        >
                                            <IoCloseOutline className="text-2xl" />
                                        </button>
                                    </div>

                                    {/* Danh sách Menu Items trong Drawer */}
                                    <nav className="space-y-1.5">
                                        {MENU_ITEMS.map((item) => {
                                            const Icon = item.icon;
                                            const isActive = location.pathname.includes(item.path);

                                            return (
                                                <Link
                                                    key={item.path}
                                                    to={item.path}
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                    className={`flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-200 cursor-pointer ${
                                                        isActive
                                                            ? "bg-zinc-900 text-white font-semibold shadow-xs"
                                                            : "text-zinc-600 hover:bg-zinc-100/80 active:bg-zinc-100"
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <Icon
                                                            className={`text-lg shrink-0 ${
                                                                isActive ? "text-white" : "text-zinc-400"
                                                            }`}
                                                        />
                                                        <span className="text-xs tracking-tight">
                                                            {item.label}
                                                        </span>
                                                    </div>
                                                    {isActive && (
                                                        <span className="w-1.5 h-1.5 rounded-full bg-white" />
                                                    )}
                                                </Link>
                                            );
                                        })}
                                    </nav>
                                </div>

                                {/* Nút đăng xuất ở dưới cùng Drawer */}
                                <div className="pt-4 border-t border-zinc-100 mt-6">
                                    <button
                                        onClick={() => {
                                            setIsMobileMenuOpen(false);
                                            onLogout();
                                        }}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-rose-600 bg-rose-50 hover:bg-rose-100 font-semibold text-xs transition-colors cursor-pointer"
                                    >
                                        <IoLogOutOutline className="text-lg" />
                                        <span>Đăng xuất</span>
                                    </button>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>

            {/* ========================================================= */}
            {/* 2. DESKTOP & LAPTOP (>= lg) - SIDEBAR CỐ ĐỊNH             */}
            {/* ========================================================= */}
            <div className="hidden lg:block sticky top-28 z-30 rounded-3xl bg-white/80 p-3 border border-zinc-200/80 shadow-xs backdrop-blur-md">
                
                {/* Section Title */}
                <div className="px-3 py-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                        Cài đặt tài khoản
                    </span>
                </div>

                {/* Navigation Menu */}
                <nav className="flex flex-col gap-1 relative">
                    {MENU_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname.includes(item.path);

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`relative flex items-center justify-between shrink-0 px-3.5 py-3 rounded-2xl transition-all duration-200 group cursor-pointer overflow-hidden ${
                                    isActive
                                        ? "bg-zinc-900 text-white shadow-xs"
                                        : "hover:bg-zinc-100/80 text-zinc-600"
                                }`}
                            >
                                {/* Content */}
                                <div className="relative z-10 flex items-center gap-3">
                                    <Icon
                                        className={`text-lg shrink-0 transition-colors duration-200 ${
                                            isActive
                                                ? "text-white"
                                                : "text-zinc-400 group-hover:text-zinc-900"
                                        }`}
                                    />
                                    <span
                                        className={`text-xs font-semibold tracking-tight whitespace-nowrap transition-colors duration-200 ${
                                            isActive
                                                ? "text-white"
                                                : "text-zinc-600 group-hover:text-zinc-900"
                                        }`}
                                    >
                                        {item.label}
                                    </span>
                                </div>

                                {/* Minimal Indicator Dot */}
                                {isActive && (
                                    <span className="relative z-10 w-1.5 h-1.5 rounded-full bg-white animate-in fade-in zoom-in duration-200" />
                                )}
                            </Link>
                        );
                    })}

                    {/* Divider */}
                    <div className="pt-2">
                        <div className="h-px w-full bg-zinc-100" />
                    </div>

                    {/* Logout Button */}
                    <motion.button
                        whileTap={{ scale: 0.96 }}
                        onClick={onLogout}
                        className="flex shrink-0 items-center gap-3 px-3.5 py-3 rounded-2xl text-left transition-colors duration-200 hover:bg-rose-50 group cursor-pointer"
                    >
                        <IoLogOutOutline className="text-lg text-zinc-400 group-hover:text-rose-600 transition-colors duration-200 shrink-0" />
                        <span className="text-xs font-semibold tracking-tight whitespace-nowrap text-zinc-600 group-hover:text-rose-600 transition-colors duration-200">
                            Đăng xuất
                        </span>
                    </motion.button>
                </nav>
            </div>

        </aside>
    );
};

export default SidebarAccount;