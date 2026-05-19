import React, { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import {
    IoCallOutline,
    IoClose,
    IoPersonOutline,
    IoChevronDown,
    IoCalendarOutline,
    IoMaleFemaleOutline,
} from "react-icons/io5";

import type { User } from "../types/user";
import { useUsers } from "../hooks/useUsers";
import type { UserFormInputs } from "../types/requests";

// ======================
// Animation
// ======================

const backdropVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
};

const modalVariants: Variants = {
    hidden: {
        opacity: 0,
        y: 24,
        scale: 0.98,
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.28,
            ease: "easeOut",
        },
    },
    exit: {
        opacity: 0,
        y: 12,
        scale: 0.98,
        transition: {
            duration: 0.2,
        },
    },
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
    isLoading = false,
}) => {
    const { updateUser } = useUsers();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
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
        updateUser(data, {
            onSuccess: (response) => {
                if (response.succeeded) onClose();
            },
        });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    
                    {/* Backdrop */}
                    <motion.div
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        onClick={onClose}
                        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-w-2xl overflow-hidden rounded-[32px] border border-zinc-200/70 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)]"
                    >
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="flex flex-col"
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between border-b border-zinc-100 px-6 py-6 sm:px-8">
                                <div>
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-700">
                                        <IoPersonOutline className="text-[22px]" />
                                    </div>

                                    <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
                                        Cập nhật hồ sơ
                                    </h2>

                                    <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                                        Chỉnh sửa thông tin cá nhân của bạn theo
                                        phong cách tối giản và hiện đại.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 transition-all duration-200 hover:border-zinc-300 hover:text-zinc-900"
                                >
                                    <IoClose className="text-xl" />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="space-y-6 px-6 py-6 sm:px-8">
                                
                                {/* Full Name */}
                                <div>
                                    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-zinc-700">
                                        <IoPersonOutline className="text-zinc-400" />
                                        Họ và tên
                                    </label>

                                    <div className="relative">
                                        <input
                                            {...register("fullName", {
                                                required:
                                                    "Vui lòng nhập họ tên",
                                            })}
                                            type="text"
                                            placeholder="Nhập họ và tên"
                                            className={`h-14 w-full rounded-2xl border bg-zinc-50 px-4 text-[15px] text-zinc-900 outline-none transition-all duration-200 placeholder:text-zinc-400 focus:bg-white focus:ring-4 ${
                                                errors.fullName
                                                    ? "border-red-300 focus:ring-red-100"
                                                    : "border-zinc-200 focus:border-zinc-900 focus:ring-zinc-100"
                                            }`}
                                        />
                                    </div>

                                    {errors.fullName && (
                                        <p className="mt-2 text-sm text-red-500">
                                            {errors.fullName.message}
                                        </p>
                                    )}
                                </div>

                                {/* Phone Number */}
                                <div>
                                    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-zinc-700">
                                        <IoCallOutline className="text-zinc-400" />
                                        Số điện thoại
                                    </label>

                                    <input
                                        {...register("phoneNumber", {
                                            required:
                                                "Vui lòng nhập số điện thoại",
                                            pattern: {
                                                value:
                                                    /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
                                                message:
                                                    "Số điện thoại không hợp lệ",
                                            },
                                        })}
                                        type="tel"
                                        placeholder="Nhập số điện thoại"
                                        className={`h-14 w-full rounded-2xl border bg-zinc-50 px-4 text-[15px] text-zinc-900 outline-none transition-all duration-200 placeholder:text-zinc-400 focus:bg-white focus:ring-4 ${
                                            errors.phoneNumber
                                                ? "border-red-300 focus:ring-red-100"
                                                : "border-zinc-200 focus:border-zinc-900 focus:ring-zinc-100"
                                        }`}
                                    />

                                    {errors.phoneNumber && (
                                        <p className="mt-2 text-sm text-red-500">
                                            {errors.phoneNumber.message}
                                        </p>
                                    )}
                                </div>

                                {/* Grid */}
                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                    
                                    {/* Gender */}
                                    <div>
                                        <label className="mb-2 flex items-center gap-2 text-sm font-medium text-zinc-700">
                                            <IoMaleFemaleOutline className="text-zinc-400" />
                                            Giới tính
                                        </label>

                                        <div className="relative">
                                            <select
                                                {...register("gender", {
                                                    required: "Bắt buộc",
                                                })}
                                                className={`h-14 w-full appearance-none rounded-2xl border bg-zinc-50 px-4 text-[15px] text-zinc-900 outline-none transition-all duration-200 focus:bg-white focus:ring-4 ${
                                                    errors.gender
                                                        ? "border-red-300 focus:ring-red-100"
                                                        : "border-zinc-200 focus:border-zinc-900 focus:ring-zinc-100"
                                                }`}
                                            >
                                                <option
                                                    value=""
                                                    disabled
                                                    hidden
                                                >
                                                    Chọn giới tính
                                                </option>

                                                <option value="Male">
                                                    Nam
                                                </option>

                                                <option value="Female">
                                                    Nữ
                                                </option>

                                                <option value="Other">
                                                    Khác
                                                </option>
                                            </select>

                                            <IoChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                                        </div>

                                        {errors.gender && (
                                            <p className="mt-2 text-sm text-red-500">
                                                {errors.gender.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Date Of Birth */}
                                    <div>
                                        <label className="mb-2 flex items-center gap-2 text-sm font-medium text-zinc-700">
                                            <IoCalendarOutline className="text-zinc-400" />
                                            Ngày sinh
                                        </label>

                                        <input
                                            {...register("dateOfBirth", {
                                                required: "Bắt buộc",
                                            })}
                                            type="date"
                                            className={`h-14 w-full rounded-2xl border bg-zinc-50 px-4 text-[15px] text-zinc-900 outline-none transition-all duration-200 focus:bg-white focus:ring-4 ${
                                                errors.dateOfBirth
                                                    ? "border-red-300 focus:ring-red-100"
                                                    : "border-zinc-200 focus:border-zinc-900 focus:ring-zinc-100"
                                            }`}
                                        />

                                        {errors.dateOfBirth && (
                                            <p className="mt-2 text-sm text-red-500">
                                                {
                                                    errors.dateOfBirth
                                                        .message
                                                }
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-end gap-3 border-t border-zinc-100 px-6 py-5 sm:px-8">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="h-12 rounded-2xl border border-zinc-200 px-6 text-sm font-medium text-zinc-700 transition-all duration-200 hover:border-zinc-300 hover:bg-zinc-50"
                                >
                                    Huỷ
                                </button>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex h-12 min-w-[180px] items-center justify-center rounded-2xl bg-zinc-900 px-6 text-sm font-semibold text-white transition-all duration-200 hover:bg-black disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center gap-3">
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                            <span>Đang lưu...</span>
                                        </div>
                                    ) : (
                                        "Lưu thay đổi"
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