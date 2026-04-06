import React, { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { 
    IoClose, 
    IoLockClosed, 
    IoKey, 
    IoShieldCheckmark,
    IoEyeOutline,
    IoEyeOffOutline,
    IoColorWandOutline
} from "react-icons/io5";
import { useUsers } from "../hooks/useUsers";
import type { ChangePasswordFormInputs } from "../types/requests";

// --- HOẠT ẢNH (ANIMATIONS) SIÊU MƯỢT ---
const backdropVariants: Variants = {
    hidden: { opacity: 0, backdropFilter: "blur(0px)" },
    visible: { opacity: 1, backdropFilter: "blur(12px)", transition: { duration: 0.4, ease: "easeOut" } },
};

const modalVariants: Variants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: { 
        opacity: 1, 
        y: 0, 
        scale: 1, 
        transition: { type: "spring", stiffness: 400, damping: 30, mass: 0.8 } 
    },
    exit: { 
        opacity: 0, 
        y: 20, 
        scale: 0.95, 
        transition: { duration: 0.25, ease: "easeIn" } 
    }
};

interface Props {
    isOpen: boolean;
    onClose: () => void;
    email: string;
    isLoading?: boolean;
}

const ChangePasswordDialog: React.FC<Props> = ({
    isOpen,
    onClose,
    email,
    isLoading = false,
}) => {
    const { changePassword } = useUsers();

    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors }
    } = useForm<ChangePasswordFormInputs>();

    const newPasswordValue = watch("newPassword");

    const onSubmit: SubmitHandler<ChangePasswordFormInputs> = (data) => {
        const dataForm = { ...data, email };
        changePassword(dataForm, { 
            onSuccess: (response) => {
                if (response.succeeded) {
                    reset();
                    onClose();
                }
            }
        });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 font-sans antialiased">
                    
                    {/* BACKDROP - Nền mờ sâu (Deep Glassmorphism) */}
                    <motion.div
                        className="absolute inset-0 bg-zinc-950/30"
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        onClick={onClose}
                    />

                    {/* MODAL CONTENT - Bo góc lớn, bóng đổ 3D mềm mại */}
                    <motion.div
                        className="relative w-full max-w-[480px] bg-white rounded-[28px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] ring-1 ring-zinc-900/5 overflow-hidden flex flex-col"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
                            
                            {/* --- HEADER --- */}
                            <div className="px-8 pt-8 pb-6 flex items-start justify-between bg-white shrink-0 relative z-10">
                                <div className="pr-4">
                                    <div className="flex items-center gap-4 mb-3">
                                        {/* Icon Container nổi bật */}
                                        <div className="w-12 h-12 rounded-[14px] bg-zinc-900 flex items-center justify-center shadow-lg shadow-zinc-900/20">
                                            <IoColorWandOutline className="text-white text-2xl" />
                                        </div>
                                        <h3 className="text-[22px] font-bold text-zinc-900 tracking-tight">
                                            Đổi mật khẩu
                                        </h3>
                                    </div>
                                    <p className="text-[14.5px] text-zinc-500 leading-relaxed font-medium">
                                        Vui lòng nhập mật khẩu cũ và tạo mật khẩu mới an toàn hơn cho tài khoản của bạn.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="w-9 h-9 flex items-center justify-center rounded-full bg-zinc-100/80 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 transition-all active:scale-95"
                                >
                                    <IoClose className="text-[20px]" />
                                </button>
                            </div>

                            {/* --- BODY --- */}
                            <div className="px-8 py-2 overflow-y-auto custom-scrollbar flex-1 space-y-6 relative z-0">
                                
                                {/* 1. Mật khẩu hiện tại */}
                                <div className="relative">
                                    <div className="relative group">
                                        <IoLockClosed className={`absolute left-4 top-1/2 -translate-y-1/2 text-[19px] pointer-events-none transition-colors duration-300 z-10 ${errors.oldPassword ? 'text-red-500' : 'text-zinc-400 peer-focus:text-zinc-900'}`} />
                                        
                                        <input
                                            id="oldPassword"
                                            {...register("oldPassword", { required: "Vui lòng nhập mật khẩu hiện tại" })}
                                            type={showOldPassword ? "text" : "password"}
                                            placeholder=" " 
                                            className={`peer w-full h-[56px] pl-12 pr-12 bg-zinc-50 border ${errors.oldPassword ? 'border-red-500 focus:ring-red-500/20' : 'border-zinc-200 focus:border-zinc-900 focus:ring-zinc-900/10'} rounded-xl focus:bg-white focus:ring-4 outline-none transition-all duration-300 text-[15px] font-medium text-zinc-900`}
                                        />
                                        
                                        <label
                                            htmlFor="oldPassword"
                                            className="absolute cursor-text left-12 top-1/2 -translate-y-1/2 text-[15px] text-zinc-500 transition-all duration-300 pointer-events-none
                                            peer-focus:top-0 peer-focus:left-4 peer-focus:text-[13px] peer-focus:font-bold peer-focus:text-zinc-900 peer-focus:bg-white peer-focus:px-2 peer-focus:-translate-y-1/2
                                            peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:left-4 peer-[:not(:placeholder-shown)]:text-[13px] peer-[:not(:placeholder-shown)]:font-bold peer-[:not(:placeholder-shown)]:text-zinc-900 peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-2 peer-[:not(:placeholder-shown)]:-translate-y-1/2"
                                        >
                                            Mật khẩu hiện tại
                                        </label>

                                        <button 
                                            type="button"
                                            onClick={() => setShowOldPassword(!showOldPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-zinc-800 transition-all"
                                        >
                                            {showOldPassword ? <IoEyeOffOutline size={19} /> : <IoEyeOutline size={19} />}
                                        </button>
                                    </div>
                                    {errors.oldPassword && <p className="text-[13px] font-semibold text-red-500 mt-2 ml-1">{errors.oldPassword.message}</p>}
                                </div>

                                {/* 2. Mật khẩu mới */}
                                <div className="relative">
                                    <div className="relative group">
                                        <IoKey className={`absolute left-4 top-1/2 -translate-y-1/2 text-[19px] pointer-events-none transition-colors duration-300 z-10 ${errors.newPassword ? 'text-red-500' : 'text-zinc-400 peer-focus:text-zinc-900'}`} />
                                        
                                        <input
                                            id="newPassword"
                                            {...register("newPassword", { 
                                                required: "Vui lòng nhập mật khẩu mới",
                                                minLength: { value: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" }
                                            })}
                                            type={showNewPassword ? "text" : "password"}
                                            placeholder=" " 
                                            className={`peer w-full h-[56px] pl-12 pr-12 bg-zinc-50 border ${errors.newPassword ? 'border-red-500 focus:ring-red-500/20' : 'border-zinc-200 focus:border-zinc-900 focus:ring-zinc-900/10'} rounded-xl focus:bg-white focus:ring-4 outline-none transition-all duration-300 text-[15px] font-medium text-zinc-900`}
                                        />
                                        
                                        <label
                                            htmlFor="newPassword"
                                            className="absolute cursor-text left-12 top-1/2 -translate-y-1/2 text-[15px] text-zinc-500 transition-all duration-300 pointer-events-none
                                            peer-focus:top-0 peer-focus:left-4 peer-focus:text-[13px] peer-focus:font-bold peer-focus:text-zinc-900 peer-focus:bg-white peer-focus:px-2 peer-focus:-translate-y-1/2
                                            peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:left-4 peer-[:not(:placeholder-shown)]:text-[13px] peer-[:not(:placeholder-shown)]:font-bold peer-[:not(:placeholder-shown)]:text-zinc-900 peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-2 peer-[:not(:placeholder-shown)]:-translate-y-1/2"
                                        >
                                            Mật khẩu mới
                                        </label>

                                        <button 
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-zinc-800 transition-all"
                                        >
                                            {showNewPassword ? <IoEyeOffOutline size={19} /> : <IoEyeOutline size={19} />}
                                        </button>
                                    </div>
                                    {errors.newPassword && <p className="text-[13px] font-semibold text-red-500 mt-2 ml-1">{errors.newPassword.message}</p>}
                                </div>

                                {/* 3. Xác nhận mật khẩu mới */}
                                <div className="relative">
                                    <div className="relative group">
                                        <IoShieldCheckmark className={`absolute left-4 top-1/2 -translate-y-1/2 text-[19px] pointer-events-none transition-colors duration-300 z-10 ${errors.confirmNewPassword ? 'text-red-500' : 'text-zinc-400 peer-focus:text-zinc-900'}`} />
                                        
                                        <input
                                            id="confirmNewPassword"
                                            {...register("confirmNewPassword", { 
                                                required: "Vui lòng xác nhận mật khẩu",
                                                validate: (value) => value === newPasswordValue || "Mật khẩu xác nhận không khớp"
                                            })}
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder=" " 
                                            className={`peer w-full h-[56px] pl-12 pr-12 bg-zinc-50 border ${errors.confirmNewPassword ? 'border-red-500 focus:ring-red-500/20' : 'border-zinc-200 focus:border-zinc-900 focus:ring-zinc-900/10'} rounded-xl focus:bg-white focus:ring-4 outline-none transition-all duration-300 text-[15px] font-medium text-zinc-900`}
                                        />
                                        
                                        <label
                                            htmlFor="confirmNewPassword"
                                            className="absolute cursor-text left-12 top-1/2 -translate-y-1/2 text-[15px] text-zinc-500 transition-all duration-300 pointer-events-none
                                            peer-focus:top-0 peer-focus:left-4 peer-focus:text-[13px] peer-focus:font-bold peer-focus:text-zinc-900 peer-focus:bg-white peer-focus:px-2 peer-focus:-translate-y-1/2
                                            peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:left-4 peer-[:not(:placeholder-shown)]:text-[13px] peer-[:not(:placeholder-shown)]:font-bold peer-[:not(:placeholder-shown)]:text-zinc-900 peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-2 peer-[:not(:placeholder-shown)]:-translate-y-1/2"
                                        >
                                            Xác nhận mật khẩu
                                        </label>

                                        <button 
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-zinc-800 transition-all"
                                        >
                                            {showConfirmPassword ? <IoEyeOffOutline size={19} /> : <IoEyeOutline size={19} />}
                                        </button>
                                    </div>
                                    {errors.confirmNewPassword && <p className="text-[13px] font-semibold text-red-500 mt-2 ml-1">{errors.confirmNewPassword.message}</p>}
                                </div>

                            </div>

                            {/* --- FOOTER --- */}
                            <div className="px-8 py-8 mt-2">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="relative w-full h-[54px] overflow-hidden text-[15px] tracking-wide font-bold text-white bg-zinc-900 rounded-xl transition-all duration-300 disabled:opacity-70 disabled:cursor-wait flex items-center justify-center group hover:-translate-y-[2px] hover:shadow-[0_12px_24px_-8px_rgba(24,24,27,0.4)] active:translate-y-0 active:shadow-none"
                                >
                                    {/* Hiệu ứng tia sáng chạy ngang nút (Shine effect) */}
                                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
                                    
                                    {isLoading ? (
                                        <div className="w-5 h-5 border-[2.5px] border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        'CẬP NHẬT MẬT KHẨU'
                                    )}
                                </button>
                            </div>

                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

export default ChangePasswordDialog;