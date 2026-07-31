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
            className="w-full max-w-[520px] mx-auto"
        >
            <div className="rounded-3xl sm:rounded-[36px] border border-zinc-200 bg-white/80 p-6 sm:p-8 lg:p-10 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.06)]">

                {/* TITLE */}
                <div className="mb-6 sm:mb-8 lg:mb-10 flex items-start justify-between">
                    <div>
                        <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.3em] text-zinc-400">
                            Create Account
                        </p>

                        <h2 className="mt-2 sm:mt-3 text-2xl sm:text-3xl font-black tracking-[-0.04em] text-zinc-900">
                            Join us today
                        </h2>
                    </div>

                    <Link
                        to="/"
                        className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-black/10 bg-white text-zinc-900 transition-all hover:border-black hover:bg-black hover:text-white shrink-0"
                        title="Về trang chủ"
                    >
                        <IoHome className="text-base sm:text-lg" />
                    </Link>
                </div>

                {/* FORM */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">

                    {/* EMAIL */}
                    <div>
                        <label className="mb-1.5 sm:mb-2 block text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                            Email
                        </label>

                        <div className="relative">
                            <HiOutlineMail className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-zinc-400 text-lg sm:text-xl" />

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
                                className={`h-12 sm:h-14 w-full rounded-2xl border bg-zinc-50 pl-11 sm:pl-14 pr-4 sm:pr-5 text-xs sm:text-sm text-zinc-900 outline-none transition-all focus:bg-white
                                ${errors.email ? "border-red-400" : "border-transparent focus:border-zinc-900"}`}
                            />
                        </div>

                        {errors.email && (
                            <p className="mt-1.5 text-[11px] sm:text-xs text-red-500">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    {/* PASSWORD */}
                    <div>
                        <label className="mb-1.5 sm:mb-2 block text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                            Password
                        </label>

                        <div className="relative">
                            <HiOutlineLockClosed className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-zinc-400 text-lg sm:text-xl" />

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
                                className={`h-12 sm:h-14 w-full rounded-2xl border bg-zinc-50 pl-11 sm:pl-14 pr-11 sm:pr-14 text-xs sm:text-sm text-zinc-900 outline-none transition-all focus:bg-white
                                ${errors.password ? "border-red-400" : "border-transparent focus:border-zinc-900"}`}
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 sm:right-5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-900 p-1"
                            >
                                {showPassword ? (
                                    <IoEyeOff className="text-lg sm:text-xl" />
                                ) : (
                                    <IoEye className="text-lg sm:text-xl" />
                                )}
                            </button>
                        </div>

                        {errors.password && (
                            <p className="mt-1.5 text-[11px] sm:text-xs text-red-500">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    {/* CONFIRM PASSWORD */}
                    <div>
                        <label className="mb-1.5 sm:mb-2 block text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                            Confirm
                        </label>

                        <div className="relative">
                            <HiOutlineLockClosed className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-zinc-400 text-lg sm:text-xl" />

                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                {...register("confirmPassword", {
                                    required: "Vui lòng nhập lại mật khẩu",
                                    validate: (v) =>
                                        v === password || "Mật khẩu không khớp",
                                })}
                                placeholder="Confirm password"
                                tabIndex={3}
                                className={`h-12 sm:h-14 w-full rounded-2xl border bg-zinc-50 pl-11 sm:pl-14 pr-11 sm:pr-14 text-xs sm:text-sm text-zinc-900 outline-none transition-all focus:bg-white
                                ${errors.confirmPassword ? "border-red-400" : "border-transparent focus:border-zinc-900"}`}
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                }
                                className="absolute right-4 sm:right-5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-900 p-1"
                            >
                                {showConfirmPassword ? (
                                    <IoEyeOff className="text-lg sm:text-xl" />
                                ) : (
                                    <IoEye className="text-lg sm:text-xl" />
                                )}
                            </button>
                        </div>

                        {errors.confirmPassword && (
                            <p className="mt-1.5 text-[11px] sm:text-xs text-red-500">
                                {errors.confirmPassword.message}
                            </p>
                        )}
                    </div>

                    {/* BUTTON */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        tabIndex={4}
                        className={`h-12 sm:h-14 w-full rounded-2xl text-xs sm:text-sm font-bold uppercase tracking-[0.2em] transition-all
                        ${
                            isLoading
                                ? "cursor-not-allowed bg-zinc-300 text-zinc-500"
                                : "bg-black text-white hover:scale-[1.01] active:scale-[0.99]"
                        }`}
                    >
                        {isLoading ? "Đang xử lý..." : "Đăng ký"}
                    </button>

                    {/* FOOTER */}
                    <div className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-zinc-500">
                        Bạn đã có tài khoản?
                        <Link
                            to="/auth/login"
                            className="ml-2 font-bold text-zinc-900 hover:underline inline-block"
                        >
                            Đăng nhập
                        </Link>
                    </div>
                </form>
            </div>
        </motion.div>
    );
};