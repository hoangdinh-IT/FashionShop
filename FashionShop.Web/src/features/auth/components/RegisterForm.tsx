import React, { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { motion } from "framer-motion";
import { HiOutlineMail, HiOutlineLockClosed } from "react-icons/hi";
import { IoEye, IoEyeOff, IoHome } from "react-icons/io5";
import { useRegister } from "../hooks/useAuth";
import type { RegisterFormInputs } from "../types/requests";
import { Link } from "react-router-dom";

export const RegisterForm: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { registerMutation, isLoading } = useRegister();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<RegisterFormInputs>();

    const password = watch("password");

    const onSubmit: SubmitHandler<RegisterFormInputs> = (data) => {
        registerMutation({
            email: data.email,
            password: data.password,
            confirmPassword: data.confirmPassword,
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-[520px]"
        >
            <div className="rounded-[36px] border border-zinc-200 bg-white/80 p-10 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.06)]">

                {/* TITLE */}
                <div className="mb-10 flex items-start justify-between">
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-zinc-400">
                            Create Account
                        </p>

                        <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-zinc-900">
                            Join us today
                        </h2>
                    </div>

                    <Link
                        to="/"
                        className="flex h-12 w-12 items-center justify-center rounded-full border border-black/10 bg-white text-zinc-900 transition-all hover:border-black hover:bg-black hover:text-white"
                    >
                        <IoHome size={18} />
                    </Link>
                </div>
                

                {/* FORM */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                    {/* EMAIL */}
                    <div>
                        <label className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                            Email
                        </label>

                        <div className="relative">
                            <HiOutlineMail className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400" />

                            <input
                                type="email"
                                {...register("email", {
                                    required: "Vui lòng nhập email",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Email không hợp lệ",
                                    },
                                })}
                                placeholder="Enter your email"
                                tabIndex={1}
                                className={`h-14 w-full rounded-2xl border bg-zinc-50 pl-14 pr-5 text-sm outline-none transition
                                ${errors.email ? "border-red-400" : "border-transparent focus:border-zinc-900 focus:bg-white"}`}
                            />
                        </div>

                        {errors.email && (
                            <p className="mt-2 text-xs text-red-500">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    {/* PASSWORD */}
                    <div>
                        <label className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                            Password
                        </label>

                        <div className="relative">
                            <HiOutlineLockClosed className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400" />

                            <input
                                type={showPassword ? "text" : "password"}
                                {...register("password", {
                                    required: "Vui lòng nhập mật khẩu",
                                    minLength: {
                                        value: 6,
                                        message: "Tối thiểu 6 ký tự",
                                    },
                                })}
                                placeholder="Create password"
                                tabIndex={2}
                                className={`h-14 w-full rounded-2xl border bg-zinc-50 pl-14 pr-14 text-sm outline-none transition
                                ${errors.password ? "border-red-400" : "border-transparent focus:border-zinc-900 focus:bg-white"}`}
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-400"
                            >
                                {showPassword ? <IoEyeOff /> : <IoEye />}
                            </button>
                        </div>

                        {errors.password && (
                            <p className="mt-2 text-xs text-red-500">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    {/* CONFIRM PASSWORD */}
                    <div>
                        <label className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                            Confirm
                        </label>

                        <div className="relative">
                            <HiOutlineLockClosed className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400" />

                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                {...register("confirmPassword", {
                                    required: "Vui lòng nhập lại mật khẩu",
                                    validate: (v) =>
                                        v === password || "Mật khẩu không khớp",
                                })}
                                placeholder="Confirm password"
                                tabIndex={3}
                                className={`h-14 w-full rounded-2xl border bg-zinc-50 pl-14 pr-14 text-sm outline-none transition
                                ${errors.confirmPassword ? "border-red-400" : "border-transparent focus:border-zinc-900 focus:bg-white"}`}
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                }
                                className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-400"
                            >
                                {showConfirmPassword ? <IoEyeOff /> : <IoEye />}
                            </button>
                        </div>

                        {errors.confirmPassword && (
                            <p className="mt-2 text-xs text-red-500">
                                {errors.confirmPassword.message}
                            </p>
                        )}
                    </div>

                    {/* BUTTON */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        tabIndex={4}
                        className="h-14 w-full rounded-2xl bg-black text-sm font-bold uppercase tracking-[0.2em] text-white transition hover:scale-[1.01] disabled:bg-zinc-300"
                    >
                        {isLoading ? "Đang xử lý..." : "Đăng ký"}
                    </button>

                    {/* FOOTER */}
                    <div className="mt-4 text-center text-sm text-zinc-500">
                        Bạn đã có tài khoản?
                        <Link
                            to="/auth/login"
                            className="ml-2 font-bold text-zinc-900 hover:underline"
                        >
                            Đăng nhập
                        </Link>
                    </div>
                </form>
            </div>
        </motion.div>
    );
};