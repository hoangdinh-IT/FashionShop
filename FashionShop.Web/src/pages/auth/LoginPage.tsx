// import React from 'react';
// import { LoginForm } from '../../features/auth/components/LoginForm';

// const LoginPage: React.FC = () => {
//     return (
//         <LoginForm />
//     );
// };

// export default LoginPage;




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
                        password="123456"
                        onClick={() => handleSelectAccount("admin@fashionshop.com", "123456")}
                    />

                    {/* Card Khách hàng */}
                    <QuickAccessCard 
                        role="Khách hàng"
                        icon={<IoPerson className="text-emerald-400" />}
                        email="hoangdinh20040104@gmail.com"
                        password="123456"
                        onClick={() => handleSelectAccount("hoangdinh20040104@gmail.com", "123456")}
                    />
                </div>
            </div>
        </div>
    );
};

// Component con cho Form phụ - Thiết kế cực kỳ nhẹ nhàng
const QuickAccessCard = ({ role, icon, email, password, onClick }: any) => (
    <motion.button
        whileHover={{ x: 10, backgroundColor: "rgba(255, 255, 255, 0.08)" }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className="group w-full flex flex-col items-start gap-1 rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition-all backdrop-blur-sm"
    >
        <div className="flex items-center gap-2 mb-1">
            {icon}
            <span className="text-xs font-bold text-white/80">{role}</span>
        </div>
        <div className="space-y-0.5 opacity-50 group-hover:opacity-100 transition-opacity">
            <p className="text-[10px] text-white font-mono">E: {email}</p>
            <p className="text-[10px] text-white font-mono">P: {password}</p>
        </div>
    </motion.button>
);

export default LoginPage;