import React, { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import {
    IoClose,
    IoLockClosedOutline,
    IoKeyOutline,
    IoShieldCheckmarkOutline,
    IoEyeOutline,
    IoEyeOffOutline,
} from "react-icons/io5";

import { useUser } from "../hooks/useUser";
import type { ChangePasswordFormInputs } from "../types/requests";
import { useLockBodyScroll } from "../../../../hooks/useLockBodyScroll";
import { BACKDROP_STYLES, backdropVariants, modalVariants } from "../../../../utils/animation";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    email: string;
    isLoading?: boolean;
}

const ChangePasswordModal: React.FC<Props> = ({
    isOpen,
    onClose,
    email,
    isLoading = false,
}) => {
    useLockBodyScroll(isOpen);

    const { changePassword } = useUser();

    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
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
            },
        });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
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
                        className="relative w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden rounded-2xl sm:rounded-3xl border border-zinc-200/80 bg-white shadow-2xl"
                    >
                        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full max-h-[90vh]">
                            {/* Header */}
                            <div className="flex shrink-0 items-center justify-between border-b border-zinc-100 px-4 py-4 sm:px-8 sm:py-5">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-800">
                                        <IoLockClosedOutline className="text-lg sm:text-xl" />
                                    </div>
                                    <div className="min-w-0">
                                        <h2 className="text-base sm:text-lg font-bold tracking-tight text-zinc-900 truncate">
                                            Đổi mật khẩu
                                        </h2>
                                        <p className="text-[11px] sm:text-xs text-zinc-500 truncate">
                                            Tăng cường bảo mật cho tài khoản
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 cursor-pointer"
                                >
                                    <IoClose className="text-lg sm:text-xl" />
                                </button>
                            </div>

                            {/* Body - Scrollable */}
                            <div className="flex-1 overflow-y-auto space-y-4 px-4 py-5 sm:px-8 sm:py-6">
                                {/* 1. Old Password */}
                                <div>
                                    <label className="mb-1.5 block text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-zinc-600">
                                        Mật khẩu hiện tại
                                    </label>
                                    <div className="relative">
                                        <input
                                            {...register("oldPassword", {
                                                required: "Vui lòng nhập mật khẩu hiện tại",
                                            })}
                                            type={showOldPassword ? "text" : "password"}
                                            placeholder="Nhập mật khẩu hiện tại"
                                            className={`h-11 sm:h-12 w-full rounded-xl border bg-zinc-50/50 pl-10 sm:pl-11 pr-10 sm:pr-11 text-xs sm:text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:bg-white focus:ring-2 ${
                                                errors.oldPassword
                                                    ? "border-rose-300 focus:border-rose-500 focus:ring-rose-100"
                                                    : "border-zinc-200/80 focus:border-zinc-900 focus:ring-zinc-900/10"
                                            }`}
                                        />
                                        <IoLockClosedOutline className="pointer-events-none absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-base sm:text-lg text-zinc-400" />
                                        <button
                                            type="button"
                                            onClick={() => setShowOldPassword(!showOldPassword)}
                                            className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 transition-colors cursor-pointer"
                                        >
                                            {showOldPassword ? <IoEyeOffOutline className="text-base sm:text-lg" /> : <IoEyeOutline className="text-base sm:text-lg" />}
                                        </button>
                                    </div>
                                    {errors.oldPassword && (
                                        <p className="mt-1.5 text-xs font-medium text-rose-500">
                                            {errors.oldPassword.message}
                                        </p>
                                    )}
                                </div>

                                {/* 2. New Password */}
                                <div>
                                    <label className="mb-1.5 block text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-zinc-600">
                                        Mật khẩu mới
                                    </label>
                                    <div className="relative">
                                        <input
                                            {...register("newPassword", {
                                                required: "Vui lòng nhập mật khẩu mới",
                                                minLength: {
                                                    value: 6,
                                                    message: "Mật khẩu phải có ít nhất 6 ký tự",
                                                },
                                            })}
                                            type={showNewPassword ? "text" : "password"}
                                            placeholder="Tối thiểu 6 ký tự"
                                            className={`h-11 sm:h-12 w-full rounded-xl border bg-zinc-50/50 pl-10 sm:pl-11 pr-10 sm:pr-11 text-xs sm:text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:bg-white focus:ring-2 ${
                                                errors.newPassword
                                                    ? "border-rose-300 focus:border-rose-500 focus:ring-rose-100"
                                                    : "border-zinc-200/80 focus:border-zinc-900 focus:ring-zinc-900/10"
                                            }`}
                                        />
                                        <IoKeyOutline className="pointer-events-none absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-base sm:text-lg text-zinc-400" />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 transition-colors cursor-pointer"
                                        >
                                            {showNewPassword ? <IoEyeOffOutline className="text-base sm:text-lg" /> : <IoEyeOutline className="text-base sm:text-lg" />}
                                        </button>
                                    </div>
                                    {errors.newPassword && (
                                        <p className="mt-1.5 text-xs font-medium text-rose-500">
                                            {errors.newPassword.message}
                                        </p>
                                    )}
                                </div>

                                {/* 3. Confirm New Password */}
                                <div>
                                    <label className="mb-1.5 block text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-zinc-600">
                                        Xác nhận mật khẩu mới
                                    </label>
                                    <div className="relative">
                                        <input
                                            {...register("confirmNewPassword", {
                                                required: "Vui lòng xác nhận mật khẩu",
                                                validate: (value) =>
                                                    value === newPasswordValue ||
                                                    "Mật khẩu xác nhận không khớp",
                                            })}
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Nhập lại mật khẩu mới"
                                            className={`h-11 sm:h-12 w-full rounded-xl border bg-zinc-50/50 pl-10 sm:pl-11 pr-10 sm:pr-11 text-xs sm:text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:bg-white focus:ring-2 ${
                                                errors.confirmNewPassword
                                                    ? "border-rose-300 focus:border-rose-500 focus:ring-rose-100"
                                                    : "border-zinc-200/80 focus:border-zinc-900 focus:ring-zinc-900/10"
                                            }`}
                                        />
                                        <IoShieldCheckmarkOutline className="pointer-events-none absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-base sm:text-lg text-zinc-400" />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 transition-colors cursor-pointer"
                                        >
                                            {showConfirmPassword ? <IoEyeOffOutline className="text-base sm:text-lg" /> : <IoEyeOutline className="text-base sm:text-lg" />}
                                        </button>
                                    </div>
                                    {errors.confirmNewPassword && (
                                        <p className="mt-1.5 text-xs font-medium text-rose-500">
                                            {errors.confirmNewPassword.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex shrink-0 flex-col-reverse sm:flex-row items-center justify-end gap-2.5 sm:gap-3 border-t border-zinc-100 bg-zinc-50/50 px-4 py-3.5 sm:px-8 sm:py-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="h-10 sm:h-11 w-full sm:w-auto rounded-xl border border-zinc-200 bg-white px-5 text-xs font-semibold text-zinc-700 transition-colors hover:bg-zinc-100 cursor-pointer"
                                >
                                    Huỷ
                                </button>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex h-10 sm:h-11 w-full sm:w-auto sm:min-w-[140px] items-center justify-center rounded-xl bg-zinc-900 px-5 text-xs font-semibold text-white transition-all hover:bg-black disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                            <span>Đang xử lý...</span>
                                        </div>
                                    ) : (
                                        "Cập nhật mật khẩu"
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

export default ChangePasswordModal;