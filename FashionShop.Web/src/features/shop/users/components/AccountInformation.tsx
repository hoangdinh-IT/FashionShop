import type React from "react";
import type { User } from "../types/user";
import { useState } from "react";
import ProfileUpdateDialog from "./ProfileFormDialog";
import ChangePasswordDialog from "./ChangePasswordDialog";

interface Props {
    user?: User;
    isLoading: boolean;
}

const AccountInformation: React.FC<Props> = ({ user, isLoading }) => {
    // const [modalConfig, setModalConfig] = useState<{
    //     isOpen: "PROFILE" | "CHANGE-PASSWORD" | null; 
    // }>({
    //     isOpen: null,
    // })

    const [isOpen, setIsOpen] = useState<"PROFILE" | "CHANGE-PASSWORD" | null>();

    const handleOpenProfile = () => setIsOpen("PROFILE")

    const handleOpenChangePassword = () => setIsOpen("CHANGE-PASSWORD")

    const handleClose = () => setIsOpen(null)

    return (
        <div className="bg-white w-full max-w-5xl mx-auto p-8 md:p-16 font-sans antialiased text-neutral-900 selection:bg-neutral-200">

            {/* KHU VỰC THÔNG TIN TÀI KHOẢN */}
            <div className="mb-24">
                <div className="mb-12">
                    <h1 className="text-2xl md:text-3xl font-semibold tracking-[0.15em] text-zinc-900 uppercase mb-2">
                        Thông tin tài khoản
                    </h1>
                    <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-[0.2em]">
                        Hồ sơ cá nhân định danh
                    </p>
                </div>

                {/* Bọc toàn bộ danh sách bằng border-top để đóng khung nội dung */}
                <div className="flex flex-col border-t border-neutral-200">
                    
                    <div className="group flex items-center py-6 border-b border-neutral-200 hover:border-neutral-900 transition-colors duration-500 cursor-default">
                        <span className="w-[150px] md:w-[240px] text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-400 group-hover:text-neutral-900 transition-colors duration-500">
                            Họ và tên
                        </span>
                        <span className="text-base font-normal text-neutral-900">
                            {user?.fullName}
                        </span>
                    </div>

                    <div className="group flex items-center py-6 border-b border-neutral-200 hover:border-neutral-900 transition-colors duration-500 cursor-default">
                        <span className="w-[150px] md:w-[240px] text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-400 group-hover:text-neutral-900 transition-colors duration-500">
                            Số điện thoại
                        </span>
                        <span className="text-base font-normal text-neutral-900">
                            {user?.phoneNumber}
                        </span>
                    </div>

                    <div className="group flex items-center py-6 border-b border-neutral-200 hover:border-neutral-900 transition-colors duration-500 cursor-default">
                        <span className="w-[150px] md:w-[240px] text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-400 group-hover:text-neutral-900 transition-colors duration-500">
                            Giới tính
                        </span>
                        <span className="text-base font-normal text-neutral-900">
                            {user?.gender == "Male" ? "Nam" : user?.gender == "Female" ? "Nữ" : "Khác"}
                        </span>
                    </div>

                    <div className="group flex items-center py-6 border-b border-neutral-200 hover:border-neutral-900 transition-colors duration-500 cursor-default">
                        <span className="w-[150px] md:w-[240px] text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-400 group-hover:text-neutral-900 transition-colors duration-500">
                            Ngày sinh
                        </span>
                        <span className="text-base font-normal text-neutral-900">
                            {user?.dateOfBirth.toString()}
                        </span>
                    </div>
                </div>

                {/* Nút bấm Ghost Button sang trọng */}
                <button 
                    onClick={handleOpenProfile}
                    className="group mt-10 inline-flex items-center justify-center gap-4 px-10 py-4 border border-neutral-900 bg-transparent text-neutral-900 text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-neutral-900 hover:text-white transition-all duration-500 w-full md:w-auto"
                >
                    <span>Cập nhật hồ sơ</span>
                </button>
            </div>

            {/* KHU VỰC THÔNG TIN ĐĂNG NHẬP */}
            <div>
                <div className="mb-12">
                    <h2 className="text-2xl md:text-3xl font-semibold tracking-[0.15em] text-zinc-900 uppercase mb-2">
                        Thông tin đăng nhập
                    </h2>
                    <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-[0.2em]">
                        Bảo mật tài khoản
                    </p>
                </div>

                <div className="flex flex-col border-t border-neutral-200">
                    
                    <div className="group flex items-center py-6 border-b border-neutral-200 hover:border-neutral-900 transition-colors duration-500 cursor-default">
                        <span className="w-[150px] md:w-[240px] text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-400 group-hover:text-neutral-900 transition-colors duration-500">
                            Email
                        </span>
                        <span className="text-base font-normal text-neutral-900">
                            {user?.email}
                        </span>
                    </div>

                    <div className="group flex items-center py-6 border-b border-neutral-200 hover:border-neutral-900 transition-colors duration-500 cursor-default">
                        <span className="w-[150px] md:w-[240px] text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-400 group-hover:text-neutral-900 transition-colors duration-500">
                            Mật khẩu
                        </span>
                        <span className="text-neutral-900 tracking-[0.4em] text-xl leading-none mt-1 translate-y-[2px]">
                            ••••••••••••
                        </span>
                    </div>
                </div>

                <button
                    onClick={handleOpenChangePassword}
                    className="group mt-10 inline-flex items-center justify-center gap-4 px-10 py-4 border border-neutral-900 bg-transparent text-neutral-900 text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-neutral-900 hover:text-white transition-all duration-500 w-full md:w-auto"
                >
                    <span>Đổi mật khẩu</span>
                </button>
            </div>

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