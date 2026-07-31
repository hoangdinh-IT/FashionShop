import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
    HiOutlineMenuAlt3,
    HiOutlineSearch,
    HiOutlineShoppingBag,
    HiOutlineUser,
    HiX
} from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";

import MegaMenu from "../../../features/shop/brands/components/MegaMenu";
import { useUser } from "../../../features/shop/users/hooks/useUser";

const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    const { user, isLoading } = useUser();

    return (
        <>
            <header className="sticky top-0 z-50 border-b border-black/5 bg-[#f6f6f4]/90 backdrop-blur-md transition-all">
                <div className="mx-auto flex h-16 sm:h-20 max-w-[1200px] items-center justify-between px-3 sm:px-6 gap-2">

                    {/* BÊN TRÁI: Nút Danh mục */}
                    <div className="flex flex-1 items-center min-w-0">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="group flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-700 hover:text-black transition-colors cursor-pointer shrink-0"
                            aria-label="Mở danh mục"
                        >
                            <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-black text-white transition-transform group-hover:scale-105 shrink-0">
                                <HiOutlineMenuAlt3 className="text-sm sm:text-base" />
                            </div>
                            <span className="hidden sm:inline-block truncate">Danh mục</span>
                        </button>
                    </div>

                    {/* Ở GIỮA: Tên cửa hàng */}
                    <div className="flex flex-1 justify-center shrink-0">
                        <Link to="/" className="text-center group block">
                            <span className="block text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.35em] sm:tracking-[0.45em] text-zinc-400 group-hover:text-zinc-600 transition-colors">
                                Expressive
                            </span>
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-[-0.05em] text-black leading-none mt-0.5">
                                RKA
                            </h1>
                        </Link>
                    </div>

                    {/* BÊN PHẢI: Search, Cart, User */}
                    <div className="flex flex-1 items-center justify-end gap-1.5 sm:gap-3 min-w-0">

                        {/* TÌM KIẾM - DESKTOP & TABLET */}
                        <div className="relative hidden md:block">
                            <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 text-sm" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm..."
                                className="h-9 w-36 lg:w-48 xl:w-56 rounded-full border border-black/10 bg-white/60 pl-9 pr-4 text-xs text-zinc-800 outline-none transition-all placeholder:text-zinc-400 focus:w-48 lg:focus:w-64 focus:border-black focus:bg-white"
                            />
                        </div>

                        {/* NÚT TÌM KIẾM MOBILE (Bật/Tắt khung search mobile) */}
                        <button
                            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                            className="flex md:hidden h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-black/10 bg-white/60 text-zinc-700 hover:border-black hover:text-black transition-all shrink-0 cursor-pointer"
                            aria-label="Tìm kiếm"
                        >
                            {isMobileSearchOpen ? (
                                <HiX className="text-base" />
                            ) : (
                                <HiOutlineSearch className="text-base" />
                            )}
                        </button>

                        {/* GIỎ HÀNG */}
                        <Link
                            to="/shop/cart"
                            className="relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-black/10 bg-white/60 text-zinc-700 hover:border-black hover:text-black transition-all shrink-0"
                            title="Giỏ hàng"
                        >
                            <HiOutlineShoppingBag className="text-base sm:text-lg" />
                        </Link>

                        {/* TÀI KHOẢN / AVATAR */}
                        <Link
                            to="/shop/account/information"
                            className="relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center overflow-hidden rounded-full border border-black/10 bg-white hover:border-black transition-all shrink-0"
                            title="Tài khoản"
                        >
                            {isLoading ? (
                                <div className="h-3 w-3 sm:h-3.5 sm:w-3.5 animate-spin rounded-full border border-zinc-300 border-t-black" />
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
                                <HiOutlineUser className="text-base sm:text-lg text-zinc-600" />
                            )}

                            {/* DẤU CHẤM TRẠNG THÁI */}
                            <AnimatePresence>
                                {!isLoading && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        className="absolute bottom-0 right-0 h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-emerald-500 ring-2 ring-white"
                                    />
                                )}
                            </AnimatePresence>
                        </Link>

                    </div>

                </div>

                {/* KHUNG TÌM KIẾM TRÊN MOBILE (Thả xuống khi ấn icon kính lúp) */}
                <AnimatePresence>
                    {isMobileSearchOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="md:hidden overflow-hidden border-t border-black/5 bg-[#f6f6f4]"
                        >
                            <div className="p-3">
                                <div className="relative w-full">
                                    <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 text-sm" />
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm sản phẩm..."
                                        autoFocus
                                        className="h-10 w-full rounded-full border border-black/10 bg-white pl-9 pr-4 text-xs text-zinc-800 outline-none focus:border-black"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
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