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
    }, []);

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
                    });
                }
            }
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full max-w-[540px] mx-auto"
        >
            <div className="rounded-3xl sm:rounded-[40px] border border-black/10 bg-white/80 p-6 sm:p-8 md:p-10 shadow-[0_25px_80px_rgba(0,0,0,0.08)] backdrop-blur-xl">
                
                {/* Header */}
                <div className="mb-6 sm:mb-8 md:mb-10 flex items-start justify-between gap-4">
                    <div>
                        <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.3em] sm:tracking-[0.35em] text-zinc-400">
                            Password Recovery
                        </p>

                        <h2 className="mt-2 sm:mt-4 text-3xl sm:text-4xl md:text-5xl font-black tracking-[-0.06em] text-zinc-900 leading-none">
                            Forgot
                            <br />
                            Password
                        </h2>

                        <p className="mt-3 sm:mt-5 max-w-[320px] text-xs sm:text-sm leading-relaxed sm:leading-7 text-zinc-500">
                            Nhập email của bạn để nhận mã OTP và tiếp tục
                            khôi phục tài khoản một cách nhanh chóng.
                        </p>
                    </div>

                    <Link
                        to="/auth/login"
                        className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white text-zinc-900 transition-all duration-300 hover:bg-black hover:text-white"
                        title="Quay lại Đăng nhập"
                    >
                        <IoArrowBack className="text-base sm:text-lg" />
                    </Link>
                </div>

                {/* Form */}
                <form
                    className="space-y-5 sm:space-y-7"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    {/* Email */}
                    <div>
                        <label className="mb-1.5 sm:mb-2 block text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                            Email Address
                        </label>

                        <div className="relative">
                            <HiOutlineMail
                                className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-zinc-400 text-lg sm:text-xl"
                            />

                            <input
                                type="email"
                                {...register("email", {
                                    required: "Vui lòng nhập email",
                                    pattern: {
                                        value:
                                            /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Email không hợp lệ"
                                    }
                                })}
                                placeholder="Enter your email"
                                disabled={isLoading}
                                className={`h-12 sm:h-14 w-full rounded-2xl border bg-[#f8f8f7] pl-11 sm:pl-14 pr-4 sm:pr-5 text-xs sm:text-sm text-zinc-900 outline-none transition-all duration-300 focus:bg-white
                                    ${
                                        errors.email
                                            ? "border-red-400"
                                            : "border-transparent focus:border-black"
                                    }`}
                            />
                        </div>

                        {errors.email && (
                            <p className="mt-1.5 sm:mt-2 text-[11px] sm:text-xs text-red-500">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    {/* Info Card */}
                    <div className="rounded-2xl sm:rounded-3xl border border-black/5 bg-[#f8f8f7] p-4 sm:p-5">
                        <div className="flex items-start gap-3 sm:gap-4">
                            <div className="flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-black text-white text-sm sm:text-base">
                                ✉️
                            </div>

                            <div>
                                <h4 className="text-xs sm:text-sm font-bold text-zinc-900">
                                    Verification via OTP
                                </h4>

                                <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm leading-relaxed sm:leading-6 text-zinc-500">
                                    Một mã OTP gồm 6 chữ số sẽ được gửi đến email
                                    của bạn để xác minh và đặt lại mật khẩu.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`flex h-12 sm:h-14 w-full items-center justify-center rounded-2xl text-xs sm:text-sm font-bold uppercase tracking-[0.2em] sm:tracking-[0.25em] transition-all duration-300
                            ${
                                isLoading
                                    ? "cursor-not-allowed bg-zinc-300 text-zinc-500"
                                    : "bg-black text-white hover:scale-[1.01] active:scale-[0.99]"
                            }`}
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2 sm:gap-3">
                                <svg
                                    className="h-4 w-4 sm:h-5 sm:w-5 animate-spin"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />

                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                    />
                                </svg>

                                Sending...
                            </div>
                        ) : (
                            "Send Verification Code"
                        )}
                    </button>
                </form>

                {/* Footer */}
                <div className="mt-6 sm:mt-10 border-t border-zinc-200 pt-4 sm:pt-6 text-center">
                    <p className="text-xs sm:text-sm text-zinc-500">
                        Đã nhớ mật khẩu?

                        <Link
                            to="/auth/login"
                            className="ml-2 font-bold text-zinc-900 hover:underline inline-block"
                        >
                            Đăng nhập
                        </Link>
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default ForgotPasswordForm;