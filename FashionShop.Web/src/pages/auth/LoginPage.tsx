import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { IoShieldCheckmark, IoPerson } from "react-icons/io5";
import LoginForm from '../../features/auth/components/LoginForm';

const LoginPage: React.FC = () => {
    const [selectedAccount, setSelectedAccount] = useState({
        email: '',
        password: '',
    });

    const handleSelectAccount = (email: string, pass: string) => {
        setSelectedAccount({ email, password: pass });
    };

    return (
        <div className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
            <div className="grid grid-cols-1 gap-8 lg:gap-12 lg:grid-cols-[1fr_480px] xl:grid-cols-[1fr_520px] items-center">
                
                {/* LEFT CONTENT */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col justify-between h-full"
                >
                    <div>
                        <p className="mb-2 sm:mb-4 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.3em] sm:tracking-[0.4em] text-zinc-500">
                            Fashion Platform
                        </p>

                        <h1 className="max-w-[700px] text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.05] tracking-[-0.04em] text-zinc-900">
                            Minimal.
                            <br />
                            Elegant.
                            <br />
                            Timeless.
                        </h1>

                        <p className="mt-4 sm:mt-6 lg:mt-8 max-w-[520px] text-sm sm:text-base leading-6 sm:leading-8 text-zinc-600">
                            Trải nghiệm thời trang hiện đại với giao diện tối giản,
                            cảm xúc tinh tế và hiệu năng mượt mà trên mọi thiết bị.
                        </p>
                    </div>

                    {/* QUICK ACCESS - Hiển thị dạng lưới 1 cột ở mobile nhỏ, 2 cột ở tablet trở lên */}
                    <div className="mt-8 sm:mt-12 lg:mt-16">
                        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-zinc-400">
                            Đăng nhập nhanh (Quick Access)
                        </p>
                        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
                            <QuickAccessCard
                                role="Administrator"
                                icon={<IoShieldCheckmark size={18} />}
                                email="admin@fashionshop.com"
                                password="●●●●●●"
                                onClick={() =>
                                    handleSelectAccount(
                                        "admin@fashionshop.com",
                                        "admin000"
                                    )
                                }
                            />

                            <QuickAccessCard
                                role="Customer"
                                icon={<IoPerson size={18} />}
                                email="hoangdinh20040104@gmail.com"
                                password="●●●●●●"
                                onClick={() =>
                                    handleSelectAccount(
                                        "hoangdinh20040104@gmail.com",
                                        "customer000"
                                    )
                                }
                            />
                        </div>
                    </div>
                </motion.div>

                {/* RIGHT LOGIN FORM */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="flex items-center justify-center w-full mt-4 lg:mt-0"
                >
                    <div className="w-full max-w-[480px]">
                        <LoginForm initialData={selectedAccount} />
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

interface QuickCardProps {
    role: string;
    icon: React.ReactNode;
    email: string;
    password: string;
    onClick: () => void;
}

const QuickAccessCard = ({
    role,
    icon,
    email,
    password,
    onClick,
}: QuickCardProps) => {
    return (
        <motion.button
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className="group w-full rounded-2xl sm:rounded-[28px] border border-black/10 bg-white/80 p-4 sm:p-5 text-left backdrop-blur-sm transition-all duration-300 hover:border-black hover:bg-white cursor-pointer shadow-xs"
        >
            <div className="mb-3 sm:mb-4 flex items-center gap-3">
                <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-black text-white shrink-0">
                    {icon}
                </div>

                <div className="min-w-0">
                    <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-400">
                        Quick Access
                    </p>

                    <h3 className="text-sm sm:text-base font-bold text-zinc-900 truncate">
                        {role}
                    </h3>
                </div>
            </div>

            <div className="space-y-1 text-xs sm:text-sm text-zinc-600">
                <p className="truncate">
                    <span className="font-semibold text-zinc-900">
                        Email:
                    </span>{" "}
                    {email}
                </p>

                <p>
                    <span className="font-semibold text-zinc-900">
                        Pass:
                    </span>{" "}
                    {password}
                </p>
            </div>

            <div className="mt-3 sm:mt-4 flex items-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] text-zinc-400 transition-colors group-hover:text-zinc-900">
                <span>Dùng tài khoản</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
            </div>
        </motion.button>
    );
};

export default LoginPage;