import React, { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";
import { IoEye, IoEyeOff, IoHome } from "react-icons/io5";
import { HiOutlineLockClosed, HiOutlineMail } from 'react-icons/hi';
import { useGoogleLogin, useLogin } from "../hooks/useAuth";
import type { LoginFormInputs } from '../types/requests';
import { GoogleLogin } from '@react-oauth/google';

interface Props {
    initialData?: { email: string; password: string };
}

export const LoginForm: React.FC<Props> = ({ initialData }) => {
    const [showPassword, setShowPassword] = useState(false);

    const { login, isLoading: isLoginLoading } = useLogin();
    const { googleLogin, isLoading: isGoogleLoginLoading } = useGoogleLogin();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginFormInputs>({
        values: initialData
    });

    const onSubmit: SubmitHandler<LoginFormInputs> = (request) => {
        login({
            email: request.email,
            password: request.password
        });
    };

    const handleSuccess = (credentialResponse: any) => {
        googleLogin({ token: credentialResponse.credential });
    };

    const handleError = () => {
        console.log("Đăng nhập bằng Google thất bại!");
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-[520px]"
        >
            <div className="rounded-[40px] border border-black/10 bg-white/80 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.08)] backdrop-blur-xl sm:p-10">
                
                {/* TOP */}
                <div className="mb-10 flex items-start justify-between">
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-zinc-400">
                            Welcome Back
                        </p>

                        <h2 className="mt-3 text-4xl font-black tracking-[-0.04em] text-zinc-900">
                            Sign In
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
                <form
                    className="space-y-6"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    {/* EMAIL */}
                    <div>
                        <label className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                            Email Address
                        </label>

                        <div className="relative">
                            <HiOutlineMail
                                size={20}
                                className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400"
                            />

                            <input
                                type="email"
                                {...register("email", {
                                    required: "Vui lòng nhập email",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Email không hợp lệ"
                                    }
                                })}
                                placeholder="Enter your email"
                                className={`h-14 w-full rounded-2xl border bg-[#f8f8f7] pl-14 pr-5 text-sm text-zinc-900 outline-none transition-all focus:bg-white
                                    ${
                                        errors.email
                                            ? "border-red-400"
                                            : "border-transparent focus:border-black"
                                    }`}
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
                            <HiOutlineLockClosed
                                size={20}
                                className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400"
                            />

                            <input
                                type={showPassword ? "text" : "password"}
                                {...register("password", {
                                    required: "Vui lòng nhập mật khẩu",
                                    minLength: {
                                        value: 6,
                                        message: "Mật khẩu phải có ít nhất 6 ký tự"
                                    }
                                })}
                                placeholder="Enter your password"
                                className={`h-14 w-full rounded-2xl border bg-[#f8f8f7] pl-14 pr-14 text-sm text-zinc-900 outline-none transition-all focus:bg-white
                                    ${
                                        errors.password
                                            ? "border-red-400"
                                            : "border-transparent focus:border-black"
                                    }`}
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword(!showPassword)
                                }
                                className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-900"
                            >
                                {showPassword ? (
                                    <IoEyeOff size={20} />
                                ) : (
                                    <IoEye size={20} />
                                )}
                            </button>
                        </div>

                        {errors.password && (
                            <p className="mt-2 text-xs text-red-500">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    {/* OPTIONS */}
                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 text-zinc-600">
                            <input
                                type="checkbox"
                                {...register("remember")}
                                className="h-4 w-4 rounded border-zinc-300"
                            />

                            Ghi nhớ
                        </label>

                        <Link
                            to="/auth/forgot-password"
                            className="font-medium text-zinc-900 hover:underline"
                        >
                            Quên mật khẩu?
                        </Link>
                    </div>

                    {/* BUTTON */}
                    <button
                        type="submit"
                        disabled={
                            isLoginLoading || isGoogleLoginLoading
                        }
                        className={`flex h-14 w-full items-center justify-center rounded-2xl text-sm font-bold uppercase tracking-[0.2em] transition-all
                            ${
                                isLoginLoading || isGoogleLoginLoading
                                    ? "cursor-not-allowed bg-zinc-300 text-zinc-500"
                                    : "bg-black text-white hover:scale-[1.01]"
                            }`}
                    >
                        {isLoginLoading ? "Đang xử lý..." : "Đăng nhập"}
                    </button>

                    {/* DIVIDER */}
                    <div className="flex items-center gap-4 py-2">
                        <div className="h-px flex-1 bg-zinc-200" />
                        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                            Or Continue
                        </span>
                        <div className="h-px flex-1 bg-zinc-200" />
                    </div>

                    {/* GOOGLE */}
                    <div className="flex justify-center">
                        <GoogleLogin
                            onSuccess={handleSuccess}
                            onError={handleError}
                            theme="outline"
                            shape="pill"
                            size="large"
                            width="320"
                            text="signin_with"
                        />
                    </div>
                </form>

                {/* FOOTER */}
                <p className="mt-8 text-center text-sm text-zinc-500">
                    Bạn chưa có tài khoản?
                    <Link
                        to="/auth/register"
                        className="ml-2 font-bold text-zinc-900 hover:underline"
                    >
                        Đăng ký ngay
                    </Link>
                </p>
            </div>
        </motion.div>
    );
};