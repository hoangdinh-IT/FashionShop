import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { IoShieldCheckmark, IoPerson } from "react-icons/io5";
import { LoginForm } from '../../features/auth/components/LoginForm';

const LoginPage: React.FC = () => {
    const [selectedAccount, setSelectedAccount] = useState({ email: '', password: '' });

    const handleSelectAccount = (email: string, pass: string) => {
        setSelectedAccount({ email, password: pass });
    };

    return (
        // Container chính: Căn giữa toàn bộ theo chiều ngang và dọc
        <div className="flex items-center justify-center p-6">
            
            {/* Wrapper bọc cả 2 phần để kiểm soát khoảng cách */}
            <div className="flex flex-col lg:flex-row items-center gap-8">
                
                {/* PHẦN 1: FORM ĐĂNG NHẬP (Giữ nguyên kích thước gốc) */}
                <LoginForm initialData={selectedAccount} />

                {/* PHẦN 2: 2 FORM PHỤ (Nằm bên phải trên màn hình lớn) */}
                <div className="flex flex-col gap-4 w-[240px]">
                    <h3 className="text-white/30 text-[10px] font-bold uppercase tracking-[0.2em] ml-2">
                        Truy cập nhanh
                    </h3>

                    {/* Card Admin */}
                    <QuickAccessCard 
                        role="Admin"
                        icon={<IoShieldCheckmark className="text-blue-400" />}
                        email="admin@fashionshop.com"
                        password="******"
                        onClick={() => handleSelectAccount("admin@fashionshop.com", "000000")}
                    />

                    {/* Card Khách hàng */}
                    <QuickAccessCard 
                        role="Khách hàng"
                        icon={<IoPerson className="text-emerald-400" />}
                        email="hoangdinh20040104@gmail.com"
                        password="******"
                        onClick={() => handleSelectAccount("hoangdinh20040104@gmail.com", "000000")}
                    />
                </div>
            </div>
        </div>
    );
};

// Component con cho Form phụ - Thiết kế cực kỳ nhẹ nhàng
const QuickAccessCard = ({ role, icon, email, password, onClick }: any) => (
    <motion.button
        whileHover={{ x: 10, backgroundColor: "rgba(255, 255, 255, 0.12)" }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className="group w-full min-w-[280px] flex flex-col items-start gap-1 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-left transition-all backdrop-blur-md shadow-lg"
    >
        <div className="flex items-center gap-2.5 mb-1.5">
            {icon}
            <span className="text-xs font-bold text-white/90 uppercase tracking-wider">{role}</span>
        </div>
        <div className="space-y-1 opacity-60 group-hover:opacity-100 transition-opacity w-full">
            <p className="text-[11px] text-white font-mono break-all leading-relaxed">
                <span className="text-white/50">Email:</span> {email}
            </p>
            <p className="text-[11px] text-white font-mono">
                <span className="text-white/50">Password:</span> {password}
            </p>
        </div>
    </motion.button>
);

export default LoginPage;