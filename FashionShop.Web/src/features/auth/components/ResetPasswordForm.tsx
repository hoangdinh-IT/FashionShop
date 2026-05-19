// import type React from "react";
// import { motion } from 'framer-motion';
// import { useResetPassword } from "../hooks/useAuth";
// import { useForm, type SubmitHandler } from "react-hook-form";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { IoArrowBack, IoEye, IoEyeOff } from "react-icons/io5";
// import { HiOutlineKey, HiOutlineLockClosed } from "react-icons/hi";
// import { useEffect, useState } from "react";
// import type { ResetPasswordFormInputs } from "../types/requests";

// const ResetPasswordForm: React.FC = () => {
//     const location = useLocation();
//     const navigate = useNavigate();

//     const email = location.state?.email || "";

//     useEffect(() => {
//         if (sessionStorage.getItem("isPasswordResetDone")) navigate("/auth/login"); 
//     })

//     const { resetPassword, isLoading } = useResetPassword();

//     const [showNewPassword, setShowNewPassword] = useState(false);
//     const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//     const {
//         register,
//         handleSubmit,
//         watch,
//         formState: { errors },
//     } = useForm<ResetPasswordFormInputs>();

//     const newPasswordValue = watch("newPassword");

//     const onSubmit: SubmitHandler<ResetPasswordFormInputs> = (data) => {
//         resetPassword({ ...data, email }, {
//             onSuccess: (response) => {
//                 if (response.succeeded) {
//                     sessionStorage.setItem("isPasswordResetDone", "true");
//                     navigate("/auth/login", { replace: true });
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
                
//                 {/* Nút Trở Về */}
//                 <Link to="/auth/forgot-password" className="absolute left-6 top-6 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-all hover:bg-white hover:text-black">
//                     <IoArrowBack size={18} />
//                 </Link>

//                 {/* Header */}
//                 <div className="mb-8 text-center">
//                     <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-white/20 ring-1 ring-white/40 shadow-lg backdrop-blur-sm">
//                         <span className="text-4xl drop-shadow-md">🛡️</span> 
//                     </div>
//                     <h2 className="text-3xl font-bold tracking-wide text-white drop-shadow-sm">Tạo mật khẩu mới</h2>
//                     <p className="mt-2 text-sm font-medium text-white/70 uppercase tracking-widest">
//                         Bảo mật tài khoản của bạn
//                     </p>
//                 </div>

//                 {/* Form */}
//                 <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    
//                     {/* --- Input OTP --- */}
//                     <div className="group relative">
//                         <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5 text-white/60 transition-colors group-focus-within:text-white">
//                             <HiOutlineKey size={22} />
//                         </div>
//                         <input
//                             type="text"
//                             {...register("otp", { 
//                                 required: "Vui lòng nhập mã OTP",
//                                 minLength: { value: 6, message: "Mã OTP phải có 6 ký tự" },
//                                 maxLength: { value: 6, message: "Mã OTP chỉ có 6 ký tự" }
//                             })}
//                             className={`block w-full rounded-xl border bg-white/5 py-3.5 pl-14 pr-4 text-base text-white placeholder-white/40 backdrop-blur-sm transition-all focus:bg-white/10 focus:outline-none focus:ring-1 
//                                 ${errors.otp 
//                                     ? "border-red-400 focus:border-red-400 focus:ring-red-400" 
//                                     : "border-white/20 focus:border-white focus:ring-white/50"
//                                 }`}
//                             placeholder="Nhập mã OTP (6 chữ số)"
//                             disabled={isLoading}
//                         />
//                         {/* Hiển thị lỗi OTP */}
//                         {errors.otp && (
//                             <p className="absolute -bottom-6 left-1 text-xs font-medium text-red-300 animate-pulse">
//                                 {errors.otp.message}
//                             </p>
//                         )}
//                     </div>

//                     {/* --- Input New Password --- */}
//                     <div className="group relative">
//                         <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5 text-white/60 transition-colors group-focus-within:text-white">
//                             <HiOutlineLockClosed size={22} />
//                         </div>
//                         <input
//                             type={showNewPassword ? "text" : "password"}
//                             {...register("newPassword", { 
//                                 required: "Vui lòng nhập mật khẩu mới",
//                                 minLength: {
//                                     value: 6,
//                                     message: "Mật khẩu phải có ít nhất 6 ký tự"
//                                 }
//                             })}
//                             className={`block w-full rounded-xl border bg-white/5 py-3.5 pl-14 pr-14 text-base text-white placeholder-white/40 backdrop-blur-sm transition-all focus:bg-white/10 focus:outline-none focus:ring-1
//                                 ${errors.newPassword 
//                                     ? "border-red-400 focus:border-red-400 focus:ring-red-400" 
//                                     : "border-white/20 focus:border-white focus:ring-white/50"
//                                 }`}
//                             placeholder="Mật khẩu mới"
//                             disabled={isLoading}
//                         />
//                         <button
//                             type="button"
//                             onClick={() => setShowNewPassword(!showNewPassword)}
//                             className="absolute inset-y-0 right-0 flex items-center pr-5 text-white/60 hover:text-white transition-colors"
//                             tabIndex={-1} // Ngăn focus bằng phím tab vào nút này
//                         >
//                             {showNewPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
//                         </button>
//                         {/* Hiển thị lỗi New Password */}
//                         {errors.newPassword && (
//                             <p className="absolute -bottom-6 left-1 text-xs font-medium text-red-300 animate-pulse">
//                                 {errors.newPassword.message}
//                             </p>
//                         )}
//                     </div>

//                     {/* --- Input Confirm New Password --- */}
//                     <div className="group relative">
//                         <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5 text-white/60 transition-colors group-focus-within:text-white">
//                             <HiOutlineLockClosed size={22} />
//                         </div>
//                         <input
//                             type={showConfirmPassword ? "text" : "password"}
//                             {...register("confirmNewPassword", { 
//                                 required: "Vui lòng xác nhận mật khẩu mới",
//                                 validate: (value) => value === newPasswordValue || "Mật khẩu không trùng khớp" // Validation quan trọng
//                             })}
//                             className={`block w-full rounded-xl border bg-white/5 py-3.5 pl-14 pr-14 text-base text-white placeholder-white/40 backdrop-blur-sm transition-all focus:bg-white/10 focus:outline-none focus:ring-1
//                                 ${errors.confirmNewPassword 
//                                     ? "border-red-400 focus:border-red-400 focus:ring-red-400" 
//                                     : "border-white/20 focus:border-white focus:ring-white/50"
//                                 }`}
//                             placeholder="Xác nhận mật khẩu mới"
//                             disabled={isLoading}
//                         />
//                         <button
//                             type="button"
//                             onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                             className="absolute inset-y-0 right-0 flex items-center pr-5 text-white/60 hover:text-white transition-colors"
//                             tabIndex={-1}
//                         >
//                             {showConfirmPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
//                         </button>
//                         {/* Hiển thị lỗi Confirm Password */}
//                         {errors.confirmNewPassword && (
//                             <p className="absolute -bottom-6 left-1 text-xs font-medium text-red-300 animate-pulse">
//                                 {errors.confirmNewPassword.message}
//                             </p>
//                         )}
//                     </div>

//                     {/* Dòng trống để đẩy nút bấm xuống một chút, bù khoảng trống cho error message absolute */}
//                     <div className="h-1"></div>

//                     {/* --- Submit Button --- */}
//                     <button
//                         type="submit"
//                         disabled={isLoading}
//                         className={`w-full rounded-xl py-3.5 text-base font-bold transition-all shadow-lg flex items-center justify-center gap-2 mt-4
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
//                                 <span>ĐANG CẬP NHẬT...</span>
//                             </>
//                         ) : (
//                             "CẬP NHẬT MẬT KHẨU"
//                         )}
//                     </button>
//                 </form>

//             </div>
//         </motion.div>
//     );
// }

// export default ResetPasswordForm;
import type React from "react";
import { motion } from "framer-motion";
import { useResetPassword } from "../hooks/useAuth";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoArrowBack, IoEye, IoEyeOff } from "react-icons/io5";
import { HiOutlineKey, HiOutlineLockClosed } from "react-icons/hi";
import { useEffect, useState } from "react";
import type { ResetPasswordFormInputs } from "../types/requests";

const ResetPasswordForm: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const email = location.state?.email || "";

    useEffect(() => {
        if (sessionStorage.getItem("isPasswordResetDone")) {
            navigate("/auth/login");
        }
    });

    const { resetPassword, isLoading } = useResetPassword();

    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<ResetPasswordFormInputs>();

    const newPasswordValue = watch("newPassword");

    const onSubmit: SubmitHandler<ResetPasswordFormInputs> = (data) => {
        resetPassword(
            { ...data, email },
            {
                onSuccess: (response) => {
                    if (response.succeeded) {
                        sessionStorage.setItem(
                            "isPasswordResetDone",
                            "true"
                        );

                        navigate("/auth/login", {
                            replace: true,
                        });
                    }
                },
            }
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full max-w-[560px]"
        >
            <div className="rounded-[40px] border border-black/10 bg-white/80 p-8 shadow-[0_25px_80px_rgba(0,0,0,0.08)] backdrop-blur-xl sm:p-10">
                
                {/* Header */}
                <div className="mb-10 flex items-start justify-between gap-6">
                    <div>
                        <p className="text-[11px] font-black uppercase tracking-[0.35em] text-zinc-400">
                            Security Update
                        </p>

                        <h2 className="mt-4 text-5xl font-black leading-none tracking-[-0.06em] text-zinc-900">
                            Reset
                            <br />
                            Password
                        </h2>

                        <p className="mt-5 max-w-[340px] text-sm leading-7 text-zinc-500">
                            Tạo mật khẩu mới để tiếp tục bảo vệ tài khoản của bạn
                            với trải nghiệm đăng nhập an toàn hơn.
                        </p>
                    </div>

                    <Link
                        to="/auth/forgot-password"
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white text-zinc-900 transition-all duration-300 hover:bg-black hover:text-white"
                    >
                        <IoArrowBack size={18} />
                    </Link>
                </div>

                {/* Email Badge */}
                <div className="mb-8 rounded-3xl border border-black/5 bg-[#f8f8f7] p-5">
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                        Recovery Email
                    </p>

                    <p className="mt-2 break-all text-sm font-semibold text-zinc-900">
                        {email}
                    </p>
                </div>

                {/* Form */}
                <form
                    className="space-y-7"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    {/* OTP */}
                    <div>
                        <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                            OTP Code
                        </label>

                        <div className="relative">
                            <HiOutlineKey
                                size={20}
                                className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400"
                            />

                            <input
                                type="text"
                                disabled={isLoading}
                                {...register("otp", {
                                    required: "Vui lòng nhập mã OTP",
                                    minLength: {
                                        value: 6,
                                        message: "Mã OTP phải có 6 ký tự",
                                    },
                                    maxLength: {
                                        value: 6,
                                        message: "Mã OTP chỉ có 6 ký tự",
                                    },
                                })}
                                placeholder="Enter 6-digit OTP"
                                className={`h-14 w-full rounded-2xl border bg-[#f8f8f7] pl-14 pr-5 text-sm tracking-[0.25em] text-zinc-900 outline-none transition-all duration-300 focus:bg-white
                                    ${
                                        errors.otp
                                            ? "border-red-400"
                                            : "border-transparent focus:border-black"
                                    }`}
                            />
                        </div>

                        {errors.otp && (
                            <p className="mt-2 text-xs text-red-500">
                                {errors.otp.message}
                            </p>
                        )}
                    </div>

                    {/* New Password */}
                    <div>
                        <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                            New Password
                        </label>

                        <div className="relative">
                            <HiOutlineLockClosed
                                size={20}
                                className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400"
                            />

                            <input
                                type={
                                    showNewPassword ? "text" : "password"
                                }
                                disabled={isLoading}
                                {...register("newPassword", {
                                    required:
                                        "Vui lòng nhập mật khẩu mới",
                                    minLength: {
                                        value: 6,
                                        message:
                                            "Mật khẩu phải có ít nhất 6 ký tự",
                                    },
                                })}
                                placeholder="Create new password"
                                className={`h-14 w-full rounded-2xl border bg-[#f8f8f7] pl-14 pr-14 text-sm text-zinc-900 outline-none transition-all duration-300 focus:bg-white
                                    ${
                                        errors.newPassword
                                            ? "border-red-400"
                                            : "border-transparent focus:border-black"
                                    }`}
                            />

                            <button
                                type="button"
                                tabIndex={-1}
                                onClick={() =>
                                    setShowNewPassword(
                                        !showNewPassword
                                    )
                                }
                                className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-400 transition-colors hover:text-zinc-900"
                            >
                                {showNewPassword ? (
                                    <IoEyeOff size={20} />
                                ) : (
                                    <IoEye size={20} />
                                )}
                            </button>
                        </div>

                        {errors.newPassword && (
                            <p className="mt-2 text-xs text-red-500">
                                {errors.newPassword.message}
                            </p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                            Confirm Password
                        </label>

                        <div className="relative">
                            <HiOutlineLockClosed
                                size={20}
                                className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400"
                            />

                            <input
                                type={
                                    showConfirmPassword
                                        ? "text"
                                        : "password"
                                }
                                disabled={isLoading}
                                {...register("confirmNewPassword", {
                                    required:
                                        "Vui lòng xác nhận mật khẩu mới",
                                    validate: (value) =>
                                        value === newPasswordValue ||
                                        "Mật khẩu không trùng khớp",
                                })}
                                placeholder="Confirm new password"
                                className={`h-14 w-full rounded-2xl border bg-[#f8f8f7] pl-14 pr-14 text-sm text-zinc-900 outline-none transition-all duration-300 focus:bg-white
                                    ${
                                        errors.confirmNewPassword
                                            ? "border-red-400"
                                            : "border-transparent focus:border-black"
                                    }`}
                            />

                            <button
                                type="button"
                                tabIndex={-1}
                                onClick={() =>
                                    setShowConfirmPassword(
                                        !showConfirmPassword
                                    )
                                }
                                className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-400 transition-colors hover:text-zinc-900"
                            >
                                {showConfirmPassword ? (
                                    <IoEyeOff size={20} />
                                ) : (
                                    <IoEye size={20} />
                                )}
                            </button>
                        </div>

                        {errors.confirmNewPassword && (
                            <p className="mt-2 text-xs text-red-500">
                                {errors.confirmNewPassword.message}
                            </p>
                        )}
                    </div>

                    {/* Security Note */}
                    <div className="rounded-3xl border border-black/5 bg-[#f8f8f7] p-5">
                        <p className="text-sm leading-6 text-zinc-500">
                            Sử dụng mật khẩu mạnh gồm chữ hoa, chữ thường và ký tự
                            đặc biệt để tăng độ bảo mật cho tài khoản.
                        </p>
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

                                Updating...
                            </div>
                        ) : (
                            "Update Password"
                        )}
                    </button>
                </form>
            </div>
        </motion.div>
    );
};

export default ResetPasswordForm;