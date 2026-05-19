import React from "react";
import { motion } from "framer-motion";
import { RegisterForm } from "../../features/auth/components/RegisterForm";

const RegisterPage: React.FC = () => {
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
                            Identity.
                            <br />
                            Secure.
                        </h1>

                        <p className="mt-8 max-w-[520px] text-base leading-8 text-zinc-600">
                            Tạo tài khoản để trải nghiệm hệ thống mua sắm hiện đại,
                            tinh giản và được cá nhân hóa cho riêng bạn.
                        </p>
                    </div>

                    {/* FOOT NOTE */}
                    <div className="mt-16 text-sm text-zinc-500">
                        By continuing, you agree to our Terms & Privacy Policy.
                    </div>
                </motion.div>

                {/* RIGHT FORM */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="flex items-center justify-center"
                >
                    <RegisterForm />
                </motion.div>

            </div>
        </div>
    );
};

export default RegisterPage;