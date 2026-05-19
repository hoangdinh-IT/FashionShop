import type React from "react";
import type { User } from "../types/user";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
    IoMailOutline,
    IoCallOutline,
    IoCalendarOutline,
    IoPersonOutline,
    IoShieldOutline,
    IoLockClosedOutline,
    IoSparklesOutline,
} from "react-icons/io5";

import ProfileUpdateDialog from "./ProfileFormDialog";
import ChangePasswordDialog from "./ChangePasswordDialog";

interface Props {
    user?: User;
    isLoading: boolean;
}

const AccountInformation: React.FC<Props> = ({ user, isLoading }) => {
    const [isOpen, setIsOpen] = useState<
        "PROFILE" | "CHANGE-PASSWORD" | null
    >();

    const handleOpenProfile = () => setIsOpen("PROFILE");

    const handleOpenChangePassword = () =>
        setIsOpen("CHANGE-PASSWORD");

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

        return date.toLocaleDateString("vi-VN");
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
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="overflow-hidden rounded-[28px] border border-zinc-200 bg-white"
            >
                {/* Header */}
                <div className="border-b border-zinc-100 px-6 py-8 sm:px-10">
                    <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                        
                        {/* User Info */}
                        <div className="flex items-center gap-5">
                            {/* Avatar */}
                            <div className="relative">
                                <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-100">
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
                                        <IoPersonOutline className="text-3xl text-zinc-500" />
                                    )}
                                </div>

                                <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-emerald-500" />
                            </div>

                            {/* Text */}
                            <div>
                                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-400">
                                    Account Center
                                </p>

                                <h1 className="mt-1 text-2xl font-bold tracking-[-0.03em] text-zinc-900">
                                    {user?.fullName || "Người dùng"}
                                </h1>

                                <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-zinc-200 px-3 py-1.5 text-sm text-zinc-600">
                                    <IoShieldOutline />
                                    <span>
                                        Thành viên{" "}
                                        {user?.membershipClass || "New"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <button
                                onClick={handleOpenProfile}
                                className="h-12 rounded-2xl border border-zinc-200 px-6 text-sm font-medium text-zinc-900 transition-all duration-300 hover:border-zinc-900 hover:bg-zinc-900 hover:text-white"
                            >
                                Cập nhật hồ sơ
                            </button>

                            <button
                                onClick={handleOpenChangePassword}
                                className="h-12 rounded-2xl bg-zinc-900 px-6 text-sm font-medium text-white transition-all duration-300 hover:bg-black"
                            >
                                Đổi mật khẩu
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="grid gap-8 px-6 py-8 sm:px-10 lg:grid-cols-2">
                    
                    {/* Personal */}
                    <section>
                        <div className="mb-6">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-400">
                                Personal
                            </p>

                            <h2 className="mt-1 text-xl font-bold text-zinc-900">
                                Hồ sơ cá nhân
                            </h2>
                        </div>

                        <div className="space-y-3">
                            {profileItems.map((item, index) => {
                                const Icon = item.icon;

                                return (
                                    <motion.div
                                        key={item.label}
                                        initial={{
                                            opacity: 0,
                                            y: 8,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            y: 0,
                                        }}
                                        transition={{
                                            delay: index * 0.04,
                                        }}
                                        className="flex items-center gap-4 rounded-2xl border border-zinc-100 p-4 transition-all duration-300 hover:border-zinc-200 hover:bg-zinc-50"
                                    >
                                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700">
                                            <Icon className="text-lg" />
                                        </div>

                                        <div className="flex-1">
                                            <p className="text-xs font-medium text-zinc-400">
                                                {item.label}
                                            </p>

                                            <p className="mt-1 text-sm font-semibold text-zinc-900">
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
                    </section>

                    {/* Security */}
                    <section>
                        <div className="mb-6">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-400">
                                Security
                            </p>

                            <h2 className="mt-1 text-xl font-bold text-zinc-900">
                                Đăng nhập & bảo mật
                            </h2>
                        </div>

                        <div className="space-y-3">
                            {securityItems.map((item, index) => {
                                const Icon = item.icon;

                                return (
                                    <motion.div
                                        key={item.label}
                                        initial={{
                                            opacity: 0,
                                            y: 8,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            y: 0,
                                        }}
                                        transition={{
                                            delay:
                                                index * 0.04 + 0.1,
                                        }}
                                        className="flex items-center gap-4 rounded-2xl border border-zinc-100 p-4 transition-all duration-300 hover:border-zinc-200 hover:bg-zinc-50"
                                    >
                                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700">
                                            <Icon className="text-lg" />
                                        </div>

                                        <div className="flex-1">
                                            <p className="text-xs font-medium text-zinc-400">
                                                {item.label}
                                            </p>

                                            <p
                                                className={`mt-1 text-sm font-semibold text-zinc-900 ${
                                                    item.isPassword
                                                        ? "tracking-[0.2em]"
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
                    </section>
                </div>
            </motion.div>

            <ProfileUpdateDialog
                isOpen={isOpen === "PROFILE"}
                onClose={handleClose}
                initialData={user}
                isLoading={isLoading}
            />

            <ChangePasswordDialog
                isOpen={isOpen === "CHANGE-PASSWORD"}
                onClose={handleClose}
                email={user?.email || ""}
                isLoading={isLoading}
            />
        </div>
    );
};

export default AccountInformation;