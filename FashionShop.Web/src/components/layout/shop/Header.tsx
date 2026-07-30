import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
    HiOutlineMenuAlt3,
    HiOutlineSearch,
    HiOutlineShoppingBag,
    HiOutlineUser,
} from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";

import MegaMenu from "../../../features/shop/brands/components/MegaMenu";
import { useUser } from "../../../features/shop/users/hooks/useUser";

const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, isLoading } = useUser();

    return (
        <>
            <header className="sticky top-0 z-50 border-b border-black/5 bg-[#f6f6f4]/90 backdrop-blur-md">
                <div className="mx-auto flex h-20 max-w-[1200px] items-center justify-between px-4 sm:px-6">

                    {/* BÊN TRÁI: Nút Danh mục tối giản */}
                    <div className="flex flex-1 items-center">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="group flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-zinc-700 hover:text-black transition-colors cursor-pointer"
                        >
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white transition-transform group-hover:scale-105">
                                <HiOutlineMenuAlt3 className="text-base" />
                            </div>
                            <span className="hidden sm:inline-block">Danh mục</span>
                        </button>
                    </div>

                    {/* Ở GIỮA: Tên cửa hàng (Giữ nguyên format) */}
                    <div className="flex flex-1 justify-center">
                        <Link to="/" className="text-center group">
                            <span className="block text-[9px] font-bold uppercase tracking-[0.45em] text-zinc-400 group-hover:text-zinc-600 transition-colors">
                                Expressive
                            </span>
                            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-[-0.05em] text-black">
                                RKA
                            </h1>
                        </Link>
                    </div>

                    {/* BÊN PHẢI: Search, Cart, User */}
                    <div className="flex flex-1 items-center justify-end gap-2 sm:gap-3">

                        {/* Ô TÌM KIẾM TỐI GIẢN */}
                        <div className="relative hidden md:block">
                            <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 text-sm" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm..."
                                className="h-9 w-44 rounded-full border border-black/10 bg-white/60 pl-9 pr-4 text-xs text-zinc-800 outline-none transition-all placeholder:text-zinc-400 focus:w-56 focus:border-black focus:bg-white"
                            />
                        </div>

                        {/* GIỎ HÀNG */}
                        <Link
                            to="/shop/cart"
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white/60 text-zinc-700 hover:border-black hover:text-black transition-all"
                            title="Giỏ hàng"
                        >
                            <HiOutlineShoppingBag className="text-lg" />
                        </Link>

                        {/* TÀI KHOẢN / AVATAR */}
                        <Link
                            to="/shop/account/information"
                            className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-black/10 bg-white hover:border-black transition-all"
                            title="Tài khoản"
                        >
                            {isLoading ? (
                                <div className="h-3.5 w-3.5 animate-spin rounded-full border border-zinc-300 border-t-black" />
                            ) : user?.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt={user.fullName || "User Avatar"}
                                    className="h-full w-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.style.display = "none";
                                    }}
                                />
                            ) : (
                                <HiOutlineUser className="text-lg text-zinc-600" />
                            )}

                            {/* DẤU CHẤM TRẠNG THÁI */}
                            <AnimatePresence>
                                {!isLoading && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white"
                                    />
                                )}
                            </AnimatePresence>
                        </Link>

                    </div>

                </div>
            </header>

            {/* MEGA MENU */}
            <MegaMenu
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
            />
        </>
    );
};

export default Header;