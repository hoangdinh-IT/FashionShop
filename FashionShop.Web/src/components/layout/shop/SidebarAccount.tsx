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

const SidebarAccount: React.FC<SidebarAccountProps> = ({
    onLogout,
}) => {
    const location = useLocation();

    return (
        <aside className="w-full lg:w-[310px] shrink-0">

            {/* Container */}
            <div className="sticky top-28 overflow-hidden rounded-[34px] border border-black/5 bg-white/70 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.04)] backdrop-blur-xl">

                {/* Menu */}
                <nav className="flex flex-col gap-2">
                    {MENU_ITEMS.map((item, index) => {
                        const Icon = item.icon;

                        const isActive =
                            location.pathname.includes(item.path);

                        return (
                            <motion.div
                                key={item.path}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.35,
                                    delay: index * 0.05,
                                }}
                            >
                                <Link
                                    to={item.path}
                                    className={`
                                        group relative flex items-center gap-4 overflow-hidden rounded-2xl px-4 py-4 transition-all duration-300
                                        ${
                                            isActive
                                                ? "bg-black text-white"
                                                : "bg-transparent text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
                                        }
                                    `}
                                >
                                    {/* Active glow */}
                                    {isActive && (
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_55%)]" />
                                    )}

                                    {/* Icon */}
                                    <div
                                        className={`
                                            relative flex h-11 w-11 items-center justify-center rounded-2xl transition-all duration-300
                                            ${
                                                isActive
                                                    ? "bg-white/10 text-white"
                                                    : "bg-zinc-100 text-zinc-600 group-hover:bg-white"
                                            }
                                        `}
                                    >
                                        <Icon className="text-[19px]" />
                                    </div>

                                    {/* Text */}
                                    <div className="relative flex flex-1 items-center justify-between">
                                        <div>
                                            <p
                                                className={`
                                                    text-sm font-semibold
                                                    ${
                                                        isActive
                                                            ? "tracking-[0.02em]"
                                                            : ""
                                                    }
                                                `}
                                            >
                                                {item.label}
                                            </p>
                                        </div>

                                        {/* Arrow */}
                                        <svg
                                            className={`
                                                h-4 w-4 transition-all duration-300
                                                ${
                                                    isActive
                                                        ? "translate-x-1 text-white"
                                                        : "text-zinc-300 group-hover:translate-x-1 group-hover:text-zinc-500"
                                                }
                                            `}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1.8}
                                                d="M9 5l7 7-7 7"
                                            />
                                        </svg>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </nav>

                {/* Divider */}
                <div className="my-5 h-px bg-gradient-to-r from-transparent via-zinc-200 to-transparent" />

                {/* Logout */}
                <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onLogout}
                    className="group flex w-full items-center gap-4 rounded-2xl px-4 py-4 text-left transition-all duration-300 hover:bg-red-50"
                >
                    {/* Icon */}
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-500 transition-all duration-300 group-hover:bg-red-100 group-hover:text-red-500">
                        <IoLogOutOutline className="text-[19px]" />
                    </div>

                    {/* Text */}
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-zinc-700 transition-colors duration-300 group-hover:text-red-600">
                            Đăng xuất
                        </p>
                    </div>

                    {/* Arrow */}
                    <svg
                        className="h-4 w-4 text-zinc-300 transition-all duration-300 group-hover:translate-x-1 group-hover:text-red-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.8}
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                </motion.button>
            </div>
        </aside>
    );
};

export default SidebarAccount;