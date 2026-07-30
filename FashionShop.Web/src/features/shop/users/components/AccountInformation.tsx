import type React from "react";
import type { User } from "../types/user";
import { useMemo, useState } from "react";
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
                className="overflow-hidden rounded-3xl border border-zinc-200/80 bg-white shadow-xs"
            >
                {/* Header */}
                <motion.div 
                    variants={itemVariants}
                    className="border-b border-zinc-100 px-6 py-8 sm:px-10"
                >
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        {/* User Info */}
                        <div className="flex items-center gap-5">
                            {/* Avatar */}
                            <div className="relative">
                                <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100/80 shadow-xs">
                                    {user?.avatar ? (
                                        <img
                                            src={user.avatar}
                                            alt={
                                                user.fullName ||
                                                "User Avatar"
                                            }
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <IoPersonOutline className="text-3xl text-zinc-400" />
                                    )}
                                </div>

                                <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-emerald-500 shadow-xs" />
                            </div>

                            {/* Text */}
                            <div>
                                <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                                    Account Center
                                </p>

                                <h1 className="mt-1 text-2xl font-bold tracking-tight text-zinc-900">
                                    {user?.fullName || "Người dùng"}
                                </h1>

                                <div className="mt-2.5 inline-flex items-center gap-2 rounded-lg border border-zinc-200/80 bg-zinc-50/80 px-3 py-1 text-xs font-medium text-zinc-600">
                                    <IoShieldOutline className="text-sm text-zinc-500" />
                                    <span>
                                        Thành viên{" "}
                                        <strong className="font-semibold text-zinc-900">
                                            {user?.membershipClass || "New"}
                                        </strong>
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap items-center gap-3">
                            <button
                                onClick={handleOpenProfile}
                                className="flex h-11 items-center gap-2 rounded-xl border border-zinc-200/80 bg-white px-5 text-xs font-semibold text-zinc-800 transition-all hover:border-zinc-900 hover:bg-zinc-900 hover:text-white cursor-pointer"
                            >
                                <IoPencilOutline className="text-base" />
                                <span>Cập nhật hồ sơ</span>
                            </button>

                            <button
                                onClick={handleOpenChangePassword}
                                className="flex h-11 items-center gap-2 rounded-xl bg-zinc-900 px-5 text-xs font-semibold text-white transition-all hover:bg-black cursor-pointer"
                            >
                                <IoKeyOutline className="text-base" />
                                <span>Đổi mật khẩu</span>
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Content */}
                <div className="grid gap-8 px-6 py-8 sm:px-10 lg:grid-cols-2">
                    {/* Personal */}
                    <motion.section variants={itemVariants}>
                        <div className="mb-5">
                            <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                                Personal Information
                            </p>

                            <h2 className="mt-0.5 text-lg font-bold text-zinc-900">
                                Hồ sơ cá nhân
                            </h2>
                        </div>

                        <div className="space-y-3">
                            {profileItems.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <motion.div
                                        key={item.label}
                                        variants={itemVariants}
                                        whileHover={{ scale: 1.01 }}
                                        transition={{ duration: 0.2 }}
                                        className="flex items-center gap-4 rounded-2xl border border-zinc-200/60 bg-zinc-50/60 p-4 transition-colors duration-200 hover:border-zinc-300 hover:bg-white"
                                    >
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-zinc-700 shadow-xs border border-zinc-200/50">
                                            <Icon className="text-lg" />
                                        </div>

                                        <div className="flex-1">
                                            <p className="text-xs font-medium text-zinc-400">
                                                {item.label}
                                            </p>

                                            <p className="mt-0.5 text-sm font-semibold text-zinc-900">
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
                        <div className="mb-5">
                            <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                                Login & Security
                            </p>

                            <h2 className="mt-0.5 text-lg font-bold text-zinc-900">
                                Đăng nhập & bảo mật
                            </h2>
                        </div>

                        <div className="space-y-3">
                            {securityItems.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <motion.div
                                        key={item.label}
                                        variants={itemVariants}
                                        whileHover={{ scale: 1.01 }}
                                        transition={{ duration: 0.2 }}
                                        className="flex items-center gap-4 rounded-2xl border border-zinc-200/60 bg-zinc-50/60 p-4 transition-colors duration-200 hover:border-zinc-300 hover:bg-white"
                                    >
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-zinc-700 shadow-xs border border-zinc-200/50">
                                            <Icon className="text-lg" />
                                        </div>

                                        <div className="flex-1">
                                            <p className="text-xs font-medium text-zinc-400">
                                                {item.label}
                                            </p>

                                            <p
                                                className={`mt-0.5 text-sm font-semibold text-zinc-900 ${
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