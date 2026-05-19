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
import { useUsers } from "../../../features/shop/users/hooks/useUsers";

const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const { user, isLoading } = useUsers();

    return (
        <>
            <header className="sticky top-0 z-50 border-b border-black/5 bg-[#f5f3ee]/90 backdrop-blur-xl">
                <div className="mx-auto flex h-[78px] w-full items-center justify-between px-5 sm:px-8 lg:px-14">

                    {/* LEFT */}
                    <div className="flex flex-1 items-center gap-3">
                        <motion.button
                            whileTap={{ scale: 0.96 }}
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="group flex h-11 items-center gap-3 rounded-full border border-black/10 bg-white/70 px-5 transition-all duration-300 hover:border-black hover:bg-white"
                        >
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white">
                                <HiOutlineMenuAlt3 className="text-[18px]" />
                            </div>

                            <span className="hidden text-[12px] font-semibold uppercase tracking-[0.18em] text-zinc-700 sm:block">
                                Danh mục
                            </span>
                        </motion.button>
                    </div>

                    {/* CENTER */}
                    <div className="flex flex-1 justify-center">
                        <Link
                            to="/"
                            className="group relative"
                        >
                            <div className="absolute inset-0 scale-75 rounded-full bg-black/5 blur-2xl transition-all duration-500 group-hover:scale-110" />

                            <div className="relative flex flex-col items-center">
                                <span className="text-[10px] font-bold uppercase tracking-[0.45em] text-zinc-400">
                                    Expressive
                                </span>

                                <h1 className="text-2xl font-black uppercase tracking-[-0.08em] text-black sm:text-3xl">
                                    RKA
                                </h1>
                            </div>
                        </Link>
                    </div>

                    {/* RIGHT */}
                    <div className="flex flex-1 items-center justify-end gap-3 sm:gap-4">

                        {/* SEARCH */}
                        <div className="relative hidden lg:block">
                            <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />

                            <input
                                type="text"
                                placeholder="Tìm kiếm sản phẩm..."
                                className="h-11 w-[250px] rounded-full border border-black/10 bg-white/70 pl-11 pr-4 text-sm text-zinc-800 outline-none transition-all duration-300 placeholder:text-zinc-400 focus:border-black focus:bg-white"
                            />
                        </div>

                        {/* CART */}
                        <motion.div
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link
                                to="/shop/cart"
                                className="group relative flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white/70 transition-all duration-300 hover:border-black hover:bg-white"
                            >
                                <div className="absolute inset-0 rounded-full bg-black/[0.03] opacity-0 blur-xl transition-all duration-500 group-hover:opacity-100" />

                                <HiOutlineShoppingBag className="relative text-[20px] text-zinc-700 transition-all duration-300 group-hover:scale-110 group-hover:text-black" />
                            </Link>
                        </motion.div>

                        {/* USER */}
                        <motion.div
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link
                                to="/shop/account/information"
                                className="group relative block"
                            >
                                <div className="absolute inset-0 rounded-full bg-black/[0.04] opacity-0 blur-xl transition-all duration-500 group-hover:opacity-100" />

                                <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-black/10 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300 group-hover:border-black">
                                    
                                    {isLoading ? (
                                        <div className="flex items-center justify-center">
                                            <div className="h-4 w-4 animate-spin rounded-full border border-zinc-300 border-t-black" />
                                        </div>
                                    ) : user?.avatar ? (
                                        <img
                                            src={user.avatar}
                                            alt={user.fullName || "User Avatar"}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            onError={(e) => {
                                                e.currentTarget.style.display =
                                                    "none";
                                            }}
                                        />
                                    ) : (
                                        <HiOutlineUser className="text-[20px] text-zinc-500" />
                                    )}

                                    {/* STATUS */}
                                    <AnimatePresence>
                                        {!isLoading && (
                                            <motion.div
                                                initial={{
                                                    scale: 0,
                                                    opacity: 0,
                                                }}
                                                animate={{
                                                    scale: 1,
                                                    opacity: 1,
                                                }}
                                                exit={{
                                                    scale: 0,
                                                    opacity: 0,
                                                }}
                                                className="absolute bottom-0.5 right-0.5 h-2.5 w-2.5 rounded-full border border-white bg-emerald-500"
                                            />
                                        )}
                                    </AnimatePresence>
                                </div>
                            </Link>
                        </motion.div>
                    </div>
                </div>

                {/* Bottom subtle line */}
                <div className="h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent" />
            </header>

            <MegaMenu
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
            />
        </>
    );
};

export default Header;