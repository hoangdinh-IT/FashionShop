import type React from "react";
import type { User } from "../types/user";
import { useMemo, useState, useEffect } from "react";
import { motion, type Variants } from "framer-motion";
import {
    IoMailOutline,
    IoCallOutline,
    IoCalendarOutline,
    IoPersonOutline,
    IoShieldOutline,
    IoLockClosedOutline,
    IoSparklesOutline,
    IoPencilOutline,
    IoKeyOutline,
} from "react-icons/io5";

import ProfileUpdateModal from "./ProfileFormModal";
import ChangePasswordModal from "./ChangePasswordModal";

interface Props {
    user?: User;
    isLoading: boolean;
}

// Cấu hình Easing cao cấp (Luxury Editorial Feel)
const customEase = [0.16, 1, 0.3, 1] as const;

// Variants cho Container tổng
const containerVariants: Variants = {
    hidden: { 
        opacity: 0, 
        scale: 0.97,
        filter: "blur(4px)" 
    },
    visible: {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        transition: {
            duration: 0.6,
            ease: customEase,
            staggerChildren: 0.08,
            delayChildren: 0.1,
        },
    },
};

// Variants cho các item con bên trong
const itemVariants: Variants = {
    hidden: { 
        opacity: 0, 
        y: 10,
        filter: "blur(2px)" 
    },
    visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: {
            duration: 0.45,
            ease: customEase,
        },
    },
};

const AccountInformation: React.FC<Props> = ({ user, isLoading }) => {
    const [isOpen, setIsOpen] = useState<
        "PROFILE" | "CHANGE-PASSWORD" | null
    >();
    
    // State quản lý lỗi khi load ảnh avatar
    const [imageError, setImageError] = useState(false);

    // Reset lại trạng thái lỗi ảnh khi thông tin user.avatar thay đổi
    useEffect(() => {
        setImageError(false);
    }, [user?.avatar]);

    const handleOpenProfile = () => setIsOpen("PROFILE");
    const handleOpenChangePassword = () => setIsOpen("CHANGE-PASSWORD");
    const handleClose = () => setIsOpen(null);

    const genderText = useMemo(() => {
        switch (user?.gender) {
            case "Male":
                return "Nam";
            case "Female":
                return "Nữ";
            default:
                return "Khác";
        }
    }, [user?.gender]);

    const formattedDate = useMemo(() => {
        if (!user?.dateOfBirth) return "--";
        const date = new Date(user.dateOfBirth);
        if (isNaN(date.getTime())) return "--";

        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    }, [user?.dateOfBirth]);

    const profileItems = [
        {
            label: "Họ và tên",
            value: user?.fullName || "--",
            icon: IoPersonOutline,
        },
        {
            label: "Số điện thoại",
            value: user?.phoneNumber || "--",
            icon: IoCallOutline,
        },
        {
            label: "Giới tính",
            value: genderText,
            icon: IoSparklesOutline,
        },
        {
            label: "Ngày sinh",
            value: formattedDate,
            icon: IoCalendarOutline,
        },
    ];

    const securityItems = [
        {
            label: "Email",
            value: user?.email || "--",
            icon: IoMailOutline,
        },
        {
            label: "Mật khẩu",
            value: "••••••••••••",
            icon: IoLockClosedOutline,
            isPassword: true,
        },
    ];

    return (
        <div className="w-full">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="overflow-hidden rounded-2xl sm:rounded-3xl border border-zinc-200/80 bg-white shadow-xs"
            >
                {/* Header */}
                <motion.div 
                    variants={itemVariants}
                    className="border-b border-zinc-100 p-5 sm:p-8 lg:p-10"
                >
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        {/* User Info */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
                            {/* Avatar */}
                            <div className="relative shrink-0">
                                <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100/80 shadow-xs">
                                    {isLoading ? (
                                        <div className="h-full w-full animate-pulse bg-zinc-200" />
                                    ) : user?.avatar && !imageError ? (
                                        <img
                                            src={user.avatar}
                                            alt={user.fullName || "User Avatar"}
                                            referrerPolicy="no-referrer"
                                            crossOrigin="anonymous"
                                            onError={() => setImageError(true)}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-zinc-100 text-zinc-400">
                                            <IoPersonOutline className="text-2xl sm:text-3xl" />
                                        </div>
                                    )}
                                </div>

                                <div className="absolute -bottom-1 -right-1 h-3.5 w-3.5 sm:h-4 sm:w-4 rounded-full border-2 border-white bg-emerald-500 shadow-xs" />
                            </div>

                            {/* Text */}
                            <div className="min-w-0">
                                <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                                    Account Center
                                </p>

                                <h1 className="mt-0.5 sm:mt-1 text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 truncate">
                                    {user?.fullName || "Người dùng"}
                                </h1>

                                <div className="mt-2 inline-flex items-center gap-1.5 sm:gap-2 rounded-lg border border-zinc-200/80 bg-zinc-50/80 px-2.5 py-1 text-xs font-medium text-zinc-600">
                                    <IoShieldOutline className="text-sm text-zinc-500 shrink-0" />
                                    <span className="truncate">
                                        Thành viên{" "}
                                        <strong className="font-semibold text-zinc-900">
                                            {user?.membershipClass || "New"}
                                        </strong>
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:items-center gap-2.5 sm:gap-3 w-full lg:w-auto">
                            <button
                                onClick={handleOpenProfile}
                                className="flex h-10 sm:h-11 items-center justify-center gap-2 rounded-xl border border-zinc-200/80 bg-white px-4 sm:px-5 text-xs font-semibold text-zinc-800 transition-all hover:border-zinc-900 hover:bg-zinc-900 hover:text-white cursor-pointer w-full lg:w-auto"
                            >
                                <IoPencilOutline className="text-base shrink-0" />
                                <span>Cập nhật hồ sơ</span>
                            </button>

                            <button
                                onClick={handleOpenChangePassword}
                                className="flex h-10 sm:h-11 items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 sm:px-5 text-xs font-semibold text-white transition-all hover:bg-black cursor-pointer w-full lg:w-auto"
                            >
                                <IoKeyOutline className="text-base shrink-0" />
                                <span>Đổi mật khẩu</span>
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Content */}
                <div className="grid gap-8 p-5 sm:p-8 lg:p-10 lg:grid-cols-2">
                    {/* Personal */}
                    <motion.section variants={itemVariants}>
                        <div className="mb-4 sm:mb-5">
                            <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                                Personal Information
                            </p>

                            <h2 className="mt-0.5 text-base sm:text-lg font-bold text-zinc-900">
                                Hồ sơ cá nhân
                            </h2>
                        </div>

                        <div className="space-y-2.5 sm:space-y-3">
                            {profileItems.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <motion.div
                                        key={item.label}
                                        variants={itemVariants}
                                        whileHover={{ scale: 1.005 }}
                                        transition={{ duration: 0.2 }}
                                        className="flex items-center gap-3.5 sm:gap-4 rounded-xl sm:rounded-2xl border border-zinc-200/60 bg-zinc-50/60 p-3.5 sm:p-4 transition-colors duration-200 hover:border-zinc-300 hover:bg-white"
                                    >
                                        <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-white text-zinc-700 shadow-xs border border-zinc-200/50">
                                            <Icon className="text-base sm:text-lg" />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <p className="text-[11px] sm:text-xs font-medium text-zinc-400">
                                                {item.label}
                                            </p>

                                            <p className="mt-0.5 text-xs sm:text-sm font-semibold text-zinc-900 truncate">
                                                {isLoading ? (
                                                    <span className="inline-block h-4 w-24 animate-pulse rounded bg-zinc-200" />
                                                ) : (
                                                    item.value
                                                )}
                                            </p>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.section>

                    {/* Security */}
                    <motion.section variants={itemVariants}>
                        <div className="mb-4 sm:mb-5">
                            <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                                Login & Security
                            </p>

                            <h2 className="mt-0.5 text-base sm:text-lg font-bold text-zinc-900">
                                Đăng nhập & bảo mật
                            </h2>
                        </div>

                        <div className="space-y-2.5 sm:space-y-3">
                            {securityItems.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <motion.div
                                        key={item.label}
                                        variants={itemVariants}
                                        whileHover={{ scale: 1.005 }}
                                        transition={{ duration: 0.2 }}
                                        className="flex items-center gap-3.5 sm:gap-4 rounded-xl sm:rounded-2xl border border-zinc-200/60 bg-zinc-50/60 p-3.5 sm:p-4 transition-colors duration-200 hover:border-zinc-300 hover:bg-white"
                                    >
                                        <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-white text-zinc-700 shadow-xs border border-zinc-200/50">
                                            <Icon className="text-base sm:text-lg" />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <p className="text-[11px] sm:text-xs font-medium text-zinc-400">
                                                {item.label}
                                            </p>

                                            <p
                                                className={`mt-0.5 text-xs sm:text-sm font-semibold text-zinc-900 truncate ${
                                                    item.isPassword
                                                        ? "tracking-widest"
                                                        : ""
                                                }`}
                                            >
                                                {isLoading ? (
                                                    <span className="inline-block h-4 w-24 animate-pulse rounded bg-zinc-200" />
                                                ) : (
                                                    item.value
                                                )}
                                            </p>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.section>
                </div>
            </motion.div>

            <ProfileUpdateModal
                isOpen={isOpen === "PROFILE"}
                onClose={handleClose}
                initialData={user}
                isLoading={isLoading}
            />

            <ChangePasswordModal
                isOpen={isOpen === "CHANGE-PASSWORD"}
                onClose={handleClose}
                email={user?.email || ""}
                isLoading={isLoading}
            />
        </div>
    );
};

export default AccountInformation;