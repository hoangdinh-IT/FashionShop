import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
    IoPersonOutline,
    IoReceiptOutline,
    IoLocationOutline,
    IoChatbubblesOutline,
    IoLogOutOutline,
} from "react-icons/io5";
import { motion } from "framer-motion";

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
        label: "Đánh giá và phản hồi",
        icon: IoChatbubblesOutline,
    },
];

interface SidebarAccountProps {
    onLogout: () => void;
}

// Custom Easing cho hiệu ứng trượt cao cấp
const customEase = [0.16, 1, 0.3, 1] as const;

const SidebarAccount: React.FC<SidebarAccountProps> = ({ onLogout }) => {
    const location = useLocation();

    return (
        <aside className="w-full lg:w-[280px] shrink-0 font-sans select-none">
            {/* Sticky Container */}
            <div className="sticky top-28 rounded-3xl bg-white/80 p-3 border border-zinc-200/60 shadow-xs backdrop-blur-md space-y-2">
                
                {/* Section Title */}
                <div className="px-3 py-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                        Cài đặt tài khoản
                    </span>
                </div>

                {/* Navigation Menu */}
                <nav className="space-y-1 relative">
                    {MENU_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname.includes(item.path);

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className="relative flex items-center justify-between px-3.5 py-3 rounded-2xl transition-colors duration-200 group cursor-pointer"
                            >
                                {/* Active Background Sliding Pill */}
                                {isActive && (
                                    <motion.div
                                        layoutId="activePill"
                                        transition={{ duration: 0.35, ease: customEase }}
                                        className="absolute inset-0 bg-zinc-900 rounded-2xl shadow-xs"
                                    />
                                )}

                                {/* Content */}
                                <div className="relative z-10 flex items-center gap-3">
                                    <Icon
                                        className={`text-lg transition-colors duration-200 ${
                                            isActive
                                                ? "text-white"
                                                : "text-zinc-400 group-hover:text-zinc-900"
                                        }`}
                                    />
                                    <span
                                        className={`text-xs font-semibold tracking-tight transition-colors duration-200 ${
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
                                    <motion.div 
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ duration: 0.2 }}
                                        className="relative z-10 w-1.5 h-1.5 rounded-full bg-white"
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Divider */}
                <div className="pt-2">
                    <div className="h-px w-full bg-zinc-100" />
                </div>

                {/* Logout Button */}
                <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-left transition-colors duration-200 hover:bg-rose-50/80 group cursor-pointer"
                >
                    <IoLogOutOutline className="text-lg text-zinc-400 group-hover:text-rose-600 transition-colors duration-200" />
                    <span className="text-xs font-semibold tracking-tight text-zinc-600 group-hover:text-rose-600 transition-colors duration-200">
                        Đăng xuất
                    </span>
                </motion.button>

            </div>
        </aside>
    );
};

export default SidebarAccount;