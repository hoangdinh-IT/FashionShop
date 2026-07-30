import React, { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import {
    IoCallOutline,
    IoClose,
    IoPersonOutline,
    IoChevronDown,
    IoCalendarOutline,
    IoMaleFemaleOutline,
} from "react-icons/io5";

import type { User } from "../types/user";
import { useUser } from "../hooks/useUser";
import type { UserFormInputs } from "../types/requests";
import { useLockBodyScroll } from "../../../../hooks/useLockBodyScroll";
import { BACKDROP_STYLES, backdropVariants, modalVariants } from "../../../../utils/animation";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    initialData?: User;
    isLoading?: boolean;
}

const ProfileFormModal: React.FC<Props> = ({
    isOpen,
    onClose,
    initialData,
    isLoading = false,
}) => {
    useLockBodyScroll(isOpen);

    const { updateUser } = useUser();

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
                        className={BACKDROP_STYLES}
                    />

                    {/* Modal */}
                    <motion.div
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-zinc-200/80 bg-white shadow-2xl"
                    >
                        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
                            {/* Header */}
                            <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-5 sm:px-8">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-800">
                                        <IoPersonOutline className="text-xl" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold tracking-tight text-zinc-900">
                                            Cập nhật hồ sơ
                                        </h2>
                                        <p className="text-xs text-zinc-500">
                                            Quản lý thông tin cá nhân của bạn
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 cursor-pointer"
                                >
                                    <IoClose className="text-xl" />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="space-y-4 px-6 py-6 sm:px-8">
                                {/* Full Name */}
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-600">
                                        Họ và tên
                                    </label>
                                    <div className="relative">
                                        <input
                                            {...register("fullName", {
                                                required: "Vui lòng nhập họ tên",
                                            })}
                                            type="text"
                                            placeholder="Nhập họ và tên"
                                            className={`h-12 w-full rounded-xl border bg-zinc-50/50 pl-11 pr-4 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:bg-white focus:ring-2 ${
                                                errors.fullName
                                                    ? "border-rose-300 focus:border-rose-500 focus:ring-rose-100"
                                                    : "border-zinc-200/80 focus:border-zinc-900 focus:ring-zinc-900/10"
                                            }`}
                                        />
                                        <IoPersonOutline className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-zinc-400" />
                                    </div>
                                    {errors.fullName && (
                                        <p className="mt-1.5 text-xs text-rose-500 font-medium">
                                            {errors.fullName.message}
                                        </p>
                                    )}
                                </div>

                                {/* Phone Number */}
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-600">
                                        Số điện thoại
                                    </label>
                                    <div className="relative">
                                        <input
                                            {...register("phoneNumber", {
                                                required: "Vui lòng nhập số điện thoại",
                                                pattern: {
                                                    value: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
                                                    message: "Số điện thoại không hợp lệ",
                                                },
                                            })}
                                            type="tel"
                                            placeholder="Nhập số điện thoại"
                                            className={`h-12 w-full rounded-xl border bg-zinc-50/50 pl-11 pr-4 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:bg-white focus:ring-2 ${
                                                errors.phoneNumber
                                                    ? "border-rose-300 focus:border-rose-500 focus:ring-rose-100"
                                                    : "border-zinc-200/80 focus:border-zinc-900 focus:ring-zinc-900/10"
                                            }`}
                                        />
                                        <IoCallOutline className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-zinc-400" />
                                    </div>
                                    {errors.phoneNumber && (
                                        <p className="mt-1.5 text-xs text-rose-500 font-medium">
                                            {errors.phoneNumber.message}
                                        </p>
                                    )}
                                </div>

                                {/* Grid: Gender & Date of Birth */}
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    {/* Gender */}
                                    <div>
                                        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-600">
                                            Giới tính
                                        </label>
                                        <div className="relative">
                                            <select
                                                {...register("gender", {
                                                    required: "Bắt buộc",
                                                })}
                                                className={`h-12 w-full appearance-none rounded-xl border bg-zinc-50/50 pl-11 pr-10 text-sm text-zinc-900 outline-none transition-all focus:bg-white focus:ring-2 ${
                                                    errors.gender
                                                        ? "border-rose-300 focus:border-rose-500 focus:ring-rose-100"
                                                        : "border-zinc-200/80 focus:border-zinc-900 focus:ring-zinc-900/10"
                                                }`}
                                            >
                                                <option value="" disabled hidden>
                                                    Chọn giới tính
                                                </option>
                                                <option value="Male">Nam</option>
                                                <option value="Female">Nữ</option>
                                                <option value="Other">Khác</option>
                                            </select>
                                            <IoMaleFemaleOutline className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-zinc-400" />
                                            <IoChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-base text-zinc-400" />
                                        </div>
                                        {errors.gender && (
                                            <p className="mt-1.5 text-xs text-rose-500 font-medium">
                                                {errors.gender.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Date Of Birth */}
                                    <div>
                                        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-600">
                                            Ngày sinh
                                        </label>
                                        <div className="relative">
                                            <input
                                                {...register("dateOfBirth", {
                                                    required: "Bắt buộc",
                                                })}
                                                type="date"
                                                className={`h-12 w-full rounded-xl border bg-zinc-50/50 pl-11 pr-4 text-sm text-zinc-900 outline-none transition-all focus:bg-white focus:ring-2 ${
                                                    errors.dateOfBirth
                                                        ? "border-rose-300 focus:border-rose-500 focus:ring-rose-100"
                                                        : "border-zinc-200/80 focus:border-zinc-900 focus:ring-zinc-900/10"
                                                }`}
                                            />
                                            <IoCalendarOutline className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-zinc-400" />
                                        </div>
                                        {errors.dateOfBirth && (
                                            <p className="mt-1.5 text-xs text-rose-500 font-medium">
                                                {errors.dateOfBirth.message}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-end gap-3 border-t border-zinc-100 bg-zinc-50/50 px-6 py-4 sm:px-8">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="h-11 rounded-xl border border-zinc-200 bg-white px-5 text-xs font-semibold text-zinc-700 transition-colors hover:bg-zinc-100 cursor-pointer"
                                >
                                    Huỷ
                                </button>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex h-11 min-w-[140px] items-center justify-center rounded-xl bg-zinc-900 px-5 text-xs font-semibold text-white transition-all hover:bg-black disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
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

export default ProfileFormModal;