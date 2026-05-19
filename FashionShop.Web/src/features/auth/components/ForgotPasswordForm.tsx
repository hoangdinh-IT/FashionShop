// import type React from "react";
// import { useForm, type SubmitHandler } from "react-hook-form";
// import { useForgotPassword } from "../hooks/useAuth";
// import { IoArrowBack } from "react-icons/io5";
// import { Link, useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import { HiOutlineMail } from "react-icons/hi";
// import { useEffect } from "react";
// import type { ForgotPasswordFormInputs } from "../types/requests";

// const ForgotPasswordForm: React.FC = () => {
//     const navigate = useNavigate();

//     useEffect(() => {
//         sessionStorage.removeItem("isPasswordResetDone");
//     })

//     const { forgotPassword, isLoading } = useForgotPassword();

//     const {
//         register,
//         handleSubmit,
//         formState: { errors }
//     } = useForm<ForgotPasswordFormInputs>();

//     const onSubmit: SubmitHandler<ForgotPasswordFormInputs> = (data) => {
//         forgotPassword(data, {
//             onSuccess: (response) => {
//                 if (response.succeeded) {
//                     navigate("/auth/reset-password", {
//                         state: { email: data.email },
//                         replace: true,
//                     })
//                 }
//             }
//         });
//     } 

//     return (
//         <motion.div 
//             initial={{ opacity: 0, scale: 0.95 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 0.6, ease: "easeOut" }}
//             className="w-full max-w-[480px]"
//         >
//             <div className="relative overflow-hidden rounded-3xl border border-white/30 bg-white/10 px-10 py-10 shadow-2xl backdrop-blur-md">
                
//                 {/* Nút Trở Về (Back) */}
//                 <Link to="/auth/login" className="absolute left-6 top-6 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-all hover:bg-white hover:text-black">
//                     <IoArrowBack size={18} />
//                 </Link>

//                 {/* Header */}
//                 <div className="mb-8 text-center">
//                     <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-white/20 ring-1 ring-white/40 shadow-lg backdrop-blur-sm">
//                         {/* Có thể dùng icon 🔐 hoặc giữ nguyên 🛍️ tuỳ gu của bạn */}
//                         <span className="text-4xl drop-shadow-md">🔐</span> 
//                     </div>
//                     <h2 className="text-3xl font-bold tracking-wide text-white drop-shadow-sm">Quên mật khẩu</h2>
//                     <p className="mt-2 text-sm font-medium text-white/70 uppercase tracking-widest">
//                         Khôi phục tài khoản của bạn
//                     </p>
//                 </div>

//                 {/* Form */}
//                 <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    
//                     {/* --- Input Email --- */}
//                     <div className="group relative">
//                         <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5 text-white/60 transition-colors group-focus-within:text-white">
//                             <HiOutlineMail size={22} />
//                         </div>
//                         <input
//                             type="email"
//                             {...register("email", { 
//                                 required: "Vui lòng nhập email",
//                                 pattern: {
//                                     value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
//                                     message: "Email không hợp lệ"
//                                 }
//                             })}
//                             className={`block w-full rounded-xl border bg-white/5 py-3.5 pl-14 pr-4 text-base text-white placeholder-white/40 backdrop-blur-sm transition-all focus:bg-white/10 focus:outline-none focus:ring-1 
//                                 ${errors.email 
//                                     ? "border-red-400 focus:border-red-400 focus:ring-red-400" 
//                                     : "border-white/20 focus:border-white focus:ring-white/50"
//                                 }`}
//                             placeholder="Nhập email của bạn"
//                             disabled={isLoading}
//                         />
//                         {/* Hiển thị lỗi Email */}
//                         {errors.email && (
//                             <p className="absolute -bottom-6 left-1 text-xs font-medium text-red-300 animate-pulse">
//                                 {errors.email.message}
//                             </p>
//                         )}
//                     </div>

//                     {/* Lời nhắn nhỏ cho người dùng */}
//                     <p className="text-sm text-white/70 text-center pb-2">
//                         Chúng tôi sẽ gửi một mã OTP gồm 6 chữ số đến email này để bạn đặt lại mật khẩu.
//                     </p>

//                     {/* --- Submit Button --- */}
//                     <button
//                         type="submit"
//                         disabled={isLoading}
//                         className={`w-full rounded-xl py-3.5 text-base font-bold transition-all shadow-lg flex items-center justify-center gap-2
//                             ${isLoading 
//                                 ? "bg-white/50 cursor-not-allowed text-gray-800" 
//                                 : "bg-white text-gray-900 hover:scale-[1.02] hover:bg-gray-100 active:scale-95"
//                             }
//                         `}
//                     >
//                         {isLoading ? (
//                             <>
//                                 <svg className="animate-spin h-5 w-5 text-gray-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                 </svg>
//                                 <span>ĐANG GỬI...</span>
//                             </>
//                         ) : (
//                             "GỬI MÃ XÁC THỰC"
//                         )}
//                     </button>
//                 </form>

//                 {/* Footer */}
//                 <p className="mt-8 text-center text-sm text-white/60">
//                     Đã nhớ ra mật khẩu?
//                     <Link 
//                         to="/auth/login" 
//                         className="ml-2 font-bold text-white transition-colors hover:underline"
//                     >
//                         Đăng nhập
//                     </Link>
//                 </p>
//             </div>
//         </motion.div>
//     );
// }

// export default ForgotPasswordForm;
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
    });

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
            className="w-full max-w-[540px]"
        >
            <div className="rounded-[40px] border border-black/10 bg-white/80 p-8 shadow-[0_25px_80px_rgba(0,0,0,0.08)] backdrop-blur-xl sm:p-10">
                
                {/* Header */}
                <div className="mb-10 flex items-start justify-between gap-6">
                    <div>
                        <p className="text-[11px] font-black uppercase tracking-[0.35em] text-zinc-400">
                            Password Recovery
                        </p>

                        <h2 className="mt-4 text-5xl font-black tracking-[-0.06em] text-zinc-900 leading-none">
                            Forgot
                            <br />
                            Password
                        </h2>

                        <p className="mt-5 max-w-[320px] text-sm leading-7 text-zinc-500">
                            Nhập email của bạn để nhận mã OTP và tiếp tục
                            khôi phục tài khoản một cách nhanh chóng.
                        </p>
                    </div>

                    <Link
                        to="/auth/login"
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white text-zinc-900 transition-all duration-300 hover:bg-black hover:text-white"
                    >
                        <IoArrowBack size={18} />
                    </Link>
                </div>

                {/* Form */}
                <form
                    className="space-y-7"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    {/* Email */}
                    <div>
                        <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500">
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
                                        value:
                                            /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Email không hợp lệ"
                                    }
                                })}
                                placeholder="Enter your email"
                                disabled={isLoading}
                                className={`h-14 w-full rounded-2xl border bg-[#f8f8f7] pl-14 pr-5 text-sm text-zinc-900 outline-none transition-all duration-300 focus:bg-white
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

                    {/* Info Card */}
                    <div className="rounded-3xl border border-black/5 bg-[#f8f8f7] p-5">
                        <div className="flex items-start gap-4">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-black text-white">
                                ✉️
                            </div>

                            <div>
                                <h4 className="text-sm font-bold text-zinc-900">
                                    Verification via OTP
                                </h4>

                                <p className="mt-1 text-sm leading-6 text-zinc-500">
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
                        className={`flex h-14 w-full items-center justify-center rounded-2xl text-sm font-bold uppercase tracking-[0.25em] transition-all duration-300
                            ${
                                isLoading
                                    ? "cursor-not-allowed bg-zinc-300 text-zinc-500"
                                    : "bg-black text-white hover:scale-[1.01]"
                            }`}
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-3">
                                <svg
                                    className="h-5 w-5 animate-spin"
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
                                        d="M4 12a8 8 0 018-8V0C5.373 
                                        0 0 5.373 0 12h4z"
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
                <div className="mt-10 border-t border-zinc-200 pt-6 text-center">
                    <p className="text-sm text-zinc-500">
                        Đã nhớ mật khẩu?

                        <Link
                            to="/auth/login"
                            className="ml-2 font-bold text-zinc-900 hover:underline"
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