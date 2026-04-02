import type React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useForgotPassword } from "../hooks/useAuth";
import { IoArrowBack } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { HiOutlineMail } from "react-icons/hi";
import { useEffect } from "react";
import type { ForgotPasswordFormInputs } from "../types/requests";

const ForgotPasswordForm: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        sessionStorage.removeItem("isPasswordResetDone");
    })

    const { forgotPassword, isLoading } = useForgotPassword();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<ForgotPasswordFormInputs>();

    const onSubmit: SubmitHandler<ForgotPasswordFormInputs> = (data) => {
        forgotPassword(data, {
            onSuccess: (response) => {
                if (response.succeeded) {
                    navigate("/auth/reset-password", {
                        state: { email: data.email },
                        replace: true,
                    })
                }
            }
        });
    } 

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full max-w-[480px]"
        >
            <div className="relative overflow-hidden rounded-3xl border border-white/30 bg-white/10 px-10 py-10 shadow-2xl backdrop-blur-md">
                
                {/* Nút Trở Về (Back) */}
                <Link to="/auth/login" className="absolute left-6 top-6 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-all hover:bg-white hover:text-black">
                    <IoArrowBack size={18} />
                </Link>

                {/* Header */}
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-white/20 ring-1 ring-white/40 shadow-lg backdrop-blur-sm">
                        {/* Có thể dùng icon 🔐 hoặc giữ nguyên 🛍️ tuỳ gu của bạn */}
                        <span className="text-4xl drop-shadow-md">🔐</span> 
                    </div>
                    <h2 className="text-3xl font-bold tracking-wide text-white drop-shadow-sm">Quên mật khẩu</h2>
                    <p className="mt-2 text-sm font-medium text-white/70 uppercase tracking-widest">
                        Khôi phục tài khoản của bạn
                    </p>
                </div>

                {/* Form */}
                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    
                    {/* --- Input Email --- */}
                    <div className="group relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5 text-white/60 transition-colors group-focus-within:text-white">
                            <HiOutlineMail size={22} />
                        </div>
                        <input
                            type="email"
                            {...register("email", { 
                                required: "Vui lòng nhập email",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Email không hợp lệ"
                                }
                            })}
                            className={`block w-full rounded-xl border bg-white/5 py-3.5 pl-14 pr-4 text-base text-white placeholder-white/40 backdrop-blur-sm transition-all focus:bg-white/10 focus:outline-none focus:ring-1 
                                ${errors.email 
                                    ? "border-red-400 focus:border-red-400 focus:ring-red-400" 
                                    : "border-white/20 focus:border-white focus:ring-white/50"
                                }`}
                            placeholder="Nhập email của bạn"
                            disabled={isLoading}
                        />
                        {/* Hiển thị lỗi Email */}
                        {errors.email && (
                            <p className="absolute -bottom-6 left-1 text-xs font-medium text-red-300 animate-pulse">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    {/* Lời nhắn nhỏ cho người dùng */}
                    <p className="text-sm text-white/70 text-center pb-2">
                        Chúng tôi sẽ gửi một mã OTP gồm 6 chữ số đến email này để bạn đặt lại mật khẩu.
                    </p>

                    {/* --- Submit Button --- */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full rounded-xl py-3.5 text-base font-bold transition-all shadow-lg flex items-center justify-center gap-2
                            ${isLoading 
                                ? "bg-white/50 cursor-not-allowed text-gray-800" 
                                : "bg-white text-gray-900 hover:scale-[1.02] hover:bg-gray-100 active:scale-95"
                            }
                        `}
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-gray-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>ĐANG GỬI...</span>
                            </>
                        ) : (
                            "GỬI MÃ XÁC THỰC"
                        )}
                    </button>
                </form>

                {/* Footer */}
                <p className="mt-8 text-center text-sm text-white/60">
                    Đã nhớ ra mật khẩu?
                    <Link 
                        to="/auth/login" 
                        className="ml-2 font-bold text-white transition-colors hover:underline"
                    >
                        Đăng nhập
                    </Link>
                </p>
            </div>
        </motion.div>
    );
}

export default ForgotPasswordForm;