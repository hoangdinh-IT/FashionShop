import React from "react";
import { motion } from "framer-motion";
import { RegisterForm } from "../../features/auth/components/RegisterForm";

const RegisterPage: React.FC = () => {
    return (
        <div className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-12">
            <div className="grid grid-cols-1 gap-8 sm:gap-12 lg:grid-cols-[1fr_520px] lg:gap-16 items-center">

                {/* LEFT CONTENT - Đưa lên trên ở mobile (order-1) */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="flex flex-col justify-between h-full order-1 text-center lg:text-left"
                >
                    <div className="flex flex-col items-center lg:items-start">
                        <p className="mb-2 sm:mb-4 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.3em] sm:tracking-[0.4em] text-zinc-500">
                            Fashion Platform
                        </p>

                        <h1 className="max-w-[700px] text-3xl sm:text-5xl lg:text-7xl font-black leading-[1.05] tracking-[-0.04em] sm:tracking-[-0.05em] text-zinc-900">
                            Minimal.
                            <br className="hidden sm:inline" />{" "}
                            Identity.
                            <br className="hidden sm:inline" />{" "}
                            Secure.
                        </h1>

                        <p className="mt-4 sm:mt-6 lg:mt-8 max-w-[520px] text-sm sm:text-base leading-relaxed sm:leading-8 text-zinc-600">
                            Tạo tài khoản để trải nghiệm hệ thống mua sắm hiện đại,
                            tinh giản và được cá nhân hóa cho riêng bạn.
                        </p>
                    </div>

                    {/* FOOT NOTE */}
                    <div className="mt-6 sm:mt-12 lg:mt-16 text-xs sm:text-sm text-zinc-400 sm:text-zinc-500 hidden lg:block">
                        By continuing, you agree to our Terms & Privacy Policy.
                    </div>
                </motion.div>

                {/* RIGHT FORM - Nằm bên dưới ở mobile (order-2) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="flex items-center justify-center order-2 w-full"
                >
                    <RegisterForm />
                </motion.div>

                {/* FOOT NOTE MOBILE - Hiển thị dưới cùng trên màn hình nhỏ */}
                <div className="order-3 text-center text-xs text-zinc-400 lg:hidden">
                    By continuing, you agree to our Terms & Privacy Policy.
                </div>

            </div>
        </div>
    );
};

export default RegisterPage;