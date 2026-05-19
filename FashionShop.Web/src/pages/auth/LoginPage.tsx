import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { IoShieldCheckmark, IoPerson } from "react-icons/io5";
import { LoginForm } from '../../features/auth/components/LoginForm';

const LoginPage: React.FC = () => {
    const [selectedAccount, setSelectedAccount] = useState({
        email: '',
        password: '',
    });

    const handleSelectAccount = (email: string, pass: string) => {
        setSelectedAccount({ email, password: pass });
    };

    return (
        <div className="w-full max-w-[1320px]">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_520px]">
                
                {/* LEFT CONTENT */}
                <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7 }}
                    className="flex flex-col justify-between"
                >
                    <div>
                        <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.4em] text-zinc-500">
                            Fashion Platform
                        </p>

                        <h1 className="max-w-[700px] text-5xl font-black leading-[1.02] tracking-[-0.05em] text-zinc-900 sm:text-6xl lg:text-7xl">
                            Minimal.
                            <br />
                            Elegant.
                            <br />
                            Timeless.
                        </h1>

                        <p className="mt-8 max-w-[520px] text-base leading-8 text-zinc-600">
                            Trải nghiệm thời trang hiện đại với giao diện tối giản,
                            cảm xúc tinh tế và hiệu năng mượt mà trên mọi thiết bị.
                        </p>
                    </div>

                    {/* QUICK ACCESS */}
                    <div className="mt-16 grid gap-4 sm:grid-cols-2">
                        <QuickAccessCard
                            role="Administrator"
                            icon={<IoShieldCheckmark size={18} />}
                            email="admin@fashionshop.com"
                            password="000000"
                            onClick={() =>
                                handleSelectAccount(
                                    "admin@fashionshop.com",
                                    "000000"
                                )
                            }
                        />

                        <QuickAccessCard
                            role="Customer"
                            icon={<IoPerson size={18} />}
                            email="hoangdinh20040104@gmail.com"
                            password="000000"
                            onClick={() =>
                                handleSelectAccount(
                                    "hoangdinh20040104@gmail.com",
                                    "000000"
                                )
                            }
                        />
                    </div>
                </motion.div>

                {/* RIGHT LOGIN FORM */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="flex items-center justify-center"
                >
                    <LoginForm initialData={selectedAccount} />
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
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className="group rounded-[32px] border border-black/10 bg-white/70 p-6 text-left backdrop-blur-sm transition-all duration-300 hover:border-black hover:bg-white"
        >
            <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white">
                    {icon}
                </div>

                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                        Quick Access
                    </p>

                    <h3 className="text-lg font-bold text-zinc-900">
                        {role}
                    </h3>
                </div>
            </div>

            <div className="space-y-2 text-sm text-zinc-600">
                <p className="break-all">
                    <span className="font-semibold text-zinc-900">
                        Email:
                    </span>{" "}
                    {email}
                </p>

                <p>
                    <span className="font-semibold text-zinc-900">
                        Password:
                    </span>{" "}
                    {password}
                </p>
            </div>

            <div className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 transition-all group-hover:text-zinc-900">
                Use Account
                <span>→</span>
            </div>
        </motion.button>
    );
};

export default LoginPage;