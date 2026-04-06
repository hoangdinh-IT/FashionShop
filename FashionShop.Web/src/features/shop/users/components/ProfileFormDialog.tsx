import React, { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { 
    IoCall, 
    IoClose, 
    IoPersonOutline, 
    IoChevronDown,
    IoCalendarOutline,
    IoMaleFemaleOutline
} from "react-icons/io5";
import type { User } from "../types/user";
import { useUsers } from "../hooks/useUsers";
import type { UserFormInputs } from "../types/requests";

// --- HOẠT ẢNH (ANIMATIONS) ---
// Chỉnh lại spring dẻo dai và tự nhiên hơn
const backdropVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
};

const modalVariants: Variants = {
    hidden: { opacity: 0, y: 40, scale: 0.96 },
    visible: { 
        opacity: 1, 
        y: 0, 
        scale: 1, 
        transition: { type: "spring", stiffness: 400, damping: 30 } 
    },
    exit: { 
        opacity: 0, 
        y: 20, 
        scale: 0.96, 
        transition: { duration: 0.2, ease: "easeOut" } 
    }
};

interface Props {
    isOpen: boolean;
    onClose: () => void;
    initialData?: User;
    isLoading?: boolean;
}

const ProfileFormDialog: React.FC<Props> = ({
    isOpen,
    onClose,
    initialData,
    isLoading = false
}) => {
    const { updateUser } = useUsers();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<UserFormInputs>();

    useEffect(() => {
        if (initialData) {
            reset({
                fullName: initialData.fullName || "",
                phoneNumber: initialData.phoneNumber || "",
                gender: initialData.gender || "",
                dateOfBirth: initialData.dateOfBirth || "", 
            });
        }
    }, [initialData, reset]);

    const onSubmit: SubmitHandler<UserFormInputs> = (data) => {
        updateUser(data, { onSuccess: (response) => {
            if (response.succeeded) onClose();
        }});
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 font-sans antialiased">
                    
                    {/* BACKDROP - Mờ tinh tế */}
                    <motion.div
                        className="absolute inset-0 bg-zinc-900/30 backdrop-blur-[6px]"
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        onClick={onClose}
                    />

                    {/* MODAL CONTENT */}
                    <motion.div
                        className="relative w-full max-w-lg bg-white rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-zinc-100 overflow-hidden flex flex-col"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
                            
                            {/* --- HEADER --- */}
                            <div className="px-8 py-7 flex items-start justify-between bg-white shrink-0">
                                <div>
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-zinc-100 to-zinc-50 border border-zinc-100 flex items-center justify-center mb-4 shadow-sm">
                                        <IoPersonOutline className="text-zinc-700 text-xl" />
                                    </div>
                                    <h3 className="text-2xl font-semibold text-zinc-900 tracking-tight">
                                        Thông tin tài khoản
                                    </h3>
                                    <p className="text-[14px] text-zinc-500 mt-1.5 leading-relaxed">
                                        Quản lý và cập nhật thông tin cá nhân của bạn để trải nghiệm dịch vụ tốt nhất.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="w-9 h-9 flex items-center justify-center rounded-full bg-zinc-50 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 transition-all duration-200"
                                >
                                    <IoClose className="text-xl" />
                                </button>
                            </div>

                            {/* --- BODY --- */}
                            <div className="px-8 pb-4 pt-2 overflow-y-auto custom-scrollbar flex-1 space-y-6">
                                
                                {/* Full Name */}
                                <div className="relative">
                                    <div className="relative">
                                        <IoPersonOutline className={`absolute left-4 top-1/2 -translate-y-1/2 text-[20px] pointer-events-none transition-colors duration-300 z-10 ${errors.fullName ? 'text-red-400' : 'text-zinc-400 peer-focus:text-zinc-900'}`} />
                                        
                                        <input
                                            id="fullName"
                                            {...register("fullName", { required: "Vui lòng nhập họ tên" })}
                                            type="text"
                                            placeholder=" "
                                            className={`peer w-full h-[56px] pl-12 pr-4 bg-zinc-50/80 border ${errors.fullName ? 'border-red-400' : 'border-zinc-200/80'} rounded-2xl focus:bg-white focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 outline-none transition-all duration-300 text-[15px] font-medium text-zinc-900`}
                                        />
                                        
                                        <label
                                            htmlFor="fullName"
                                            className="absolute cursor-text left-12 top-1/2 -translate-y-1/2 text-[15px] text-zinc-500 transition-all duration-300 pointer-events-none
                                            peer-focus:top-0 peer-focus:left-4 peer-focus:text-[13px] peer-focus:font-semibold peer-focus:text-zinc-900 peer-focus:bg-white peer-focus:px-2 peer-focus:-mt-[2px]
                                            peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:left-4 peer-[:not(:placeholder-shown)]:text-[13px] peer-[:not(:placeholder-shown)]:font-semibold peer-[:not(:placeholder-shown)]:text-zinc-900 peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-2 peer-[:not(:placeholder-shown)]:-mt-[2px]"
                                        >
                                            Họ và tên
                                        </label>
                                    </div>
                                    {errors.fullName && <p className="text-[13px] text-red-500 mt-1.5 font-medium pl-1">{errors.fullName.message}</p>}
                                </div>

                                {/* Phone Number */}
                                <div className="relative">
                                    <div className="relative">
                                        <IoCall className={`absolute left-4 top-1/2 -translate-y-1/2 text-[18px] pointer-events-none transition-colors duration-300 z-10 ${errors.phoneNumber ? 'text-red-400' : 'text-zinc-400 peer-focus:text-zinc-900'}`} />
                                        
                                        <input
                                            id="phoneNumber"
                                            {...register("phoneNumber", { 
                                                required: "Vui lòng nhập số điện thoại",
                                                pattern: {
                                                    value: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
                                                    message: "Số điện thoại không hợp lệ"
                                                }
                                            })}
                                            type="tel"
                                            placeholder=" "
                                            className={`peer w-full h-[56px] pl-12 pr-4 bg-zinc-50/80 border ${errors.phoneNumber ? 'border-red-400' : 'border-zinc-200/80'} rounded-2xl focus:bg-white focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 outline-none transition-all duration-300 text-[15px] font-medium text-zinc-900`}
                                        />
                                        
                                        <label
                                            htmlFor="phoneNumber"
                                            className="absolute cursor-text left-12 top-1/2 -translate-y-1/2 text-[15px] text-zinc-500 transition-all duration-300 pointer-events-none
                                            peer-focus:top-0 peer-focus:left-4 peer-focus:text-[13px] peer-focus:font-semibold peer-focus:text-zinc-900 peer-focus:bg-white peer-focus:px-2 peer-focus:-mt-[2px]
                                            peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:left-4 peer-[:not(:placeholder-shown)]:text-[13px] peer-[:not(:placeholder-shown)]:font-semibold peer-[:not(:placeholder-shown)]:text-zinc-900 peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-2 peer-[:not(:placeholder-shown)]:-mt-[2px]"
                                        >
                                            Số điện thoại
                                        </label>
                                    </div>
                                    {errors.phoneNumber && <p className="text-[13px] text-red-500 mt-1.5 font-medium pl-1">{errors.phoneNumber.message}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-5">
                                    {/* Gender */}
                                    <div className="space-y-2">
                                        <label className="text-[13px] font-semibold text-zinc-900 flex items-center gap-2 pl-1">
                                            <IoMaleFemaleOutline className="text-zinc-500 text-[16px]" />
                                            Giới tính
                                        </label>
                                        <div className="relative">
                                            <select
                                                {...register("gender", { required: "Bắt buộc" })}
                                                className={`w-full h-[52px] pl-4 pr-10 bg-zinc-50/80 border ${errors.gender ? 'border-red-400' : 'border-zinc-200/80'} rounded-2xl focus:bg-white focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 outline-none transition-all duration-300 text-[15px] font-medium text-zinc-900 appearance-none cursor-pointer`}
                                            >
                                                <option value="" disabled hidden>Chọn</option>
                                                <option value="Male">Nam</option>
                                                <option value="Female">Nữ</option>
                                                <option value="Other">Khác</option>
                                            </select>
                                            <IoChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                                        </div>
                                        {errors.gender && <p className="text-[13px] text-red-500 mt-1 font-medium pl-1">{errors.gender.message}</p>}
                                    </div>

                                    {/* Date of Birth */}
                                    <div className="space-y-2">
                                        <label className="text-[13px] font-semibold text-zinc-900 flex items-center gap-2 pl-1">
                                            <IoCalendarOutline className="text-zinc-500 text-[16px]" />
                                            Ngày sinh
                                        </label>
                                        <input
                                            {...register("dateOfBirth", { required: "Bắt buộc" })}
                                            type="date"
                                            className={`w-full h-[52px] px-4 bg-zinc-50/80 border ${errors.dateOfBirth ? 'border-red-400' : 'border-zinc-200/80'} rounded-2xl focus:bg-white focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 outline-none transition-all duration-300 text-[15px] font-medium text-zinc-900 cursor-pointer`}
                                        />
                                        {errors.dateOfBirth && <p className="text-[13px] text-red-500 mt-1 font-medium pl-1">{errors.dateOfBirth.message}</p>}
                                    </div>
                                </div>

                            </div>

                            {/* --- FOOTER --- */}
                            <div className="px-8 py-6 mt-2 bg-white rounded-b-[1.5rem]">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="relative w-full h-[56px] text-[14px] font-bold tracking-widest text-white bg-zinc-900 hover:bg-zinc-800 rounded-2xl transition-all duration-300 disabled:opacity-70 disabled:cursor-wait flex items-center justify-center overflow-hidden shadow-[0_4px_14px_0_rgb(24,24,27,0.3)] hover:shadow-[0_6px_20px_rgba(24,24,27,0.23)] hover:-translate-y-[1px] active:translate-y-[0px] active:scale-[0.98]"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center gap-3">
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            <span>ĐANG LƯU...</span>
                                        </div>
                                    ) : (
                                        'CẬP NHẬT THÔNG TIN'
                                    )}
                                </button>
                            </div>

                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ProfileFormDialog;