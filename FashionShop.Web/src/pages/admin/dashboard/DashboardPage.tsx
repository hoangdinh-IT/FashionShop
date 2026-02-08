import React from 'react';
import { IoTrendingUp, IoWalletOutline, IoPeople, IoBagHandleOutline } from "react-icons/io5";

// Card thống kê nhỏ
const StatCard = ({ title, value, sub, icon: Icon, color }: any) => (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <h3 className="mt-1 text-2xl font-bold text-gray-800">{value}</h3>
            </div>
            <div className={`rounded-xl p-3 ${color}`}>
                <Icon className="text-xl text-white" />
            </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
            <span className="flex items-center text-green-500 font-medium">
                <IoTrendingUp className="mr-1" /> {sub}
            </span>
            <span className="ml-2 text-gray-400">so với tháng trước</span>
        </div>
    </div>
);

const DashboardPage: React.FC = () => {
    return (
        <div className="space-y-6">

            {/* 1. Header Page */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Tổng quan</h1>
                <p className="text-gray-500">Chào mừng bạn quay trở lại, đây là báo cáo hôm nay.</p>
            </div>

            {/* 2. Stats Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Tổng doanh thu" value="120.500.000₫" sub="+12%" icon={IoWalletOutline} color="bg-blue-500" />
                <StatCard title="Khách hàng mới" value="340" sub="+5%" icon={IoPeople} color="bg-purple-500" />
                <StatCard title="Đơn hàng" value="1,203" sub="+18%" icon={IoBagHandleOutline} color="bg-orange-500" />
                <StatCard title="Tỉ lệ chuyển đổi" value="3.45%" sub="+2%" icon={IoTrendingUp} color="bg-green-500" />
            </div>

            {/* 3. Content Section (Chart giả lập & Table) */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Chart Section */}
                <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 lg:col-span-2">
                    <h3 className="mb-4 text-lg font-bold text-gray-800">Biểu đồ doanh thu</h3>
                    <div className="flex h-64 items-center justify-center rounded-xl bg-gray-50 border border-dashed border-gray-300 text-gray-400">
                        [Khu vực hiển thị Biểu đồ]
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
                    <h3 className="mb-4 text-lg font-bold text-gray-800">Hoạt động gần đây</h3>
                    <ul className="space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                            <li key={i} className="flex items-start gap-3">
                                <div className="h-2 w-2 mt-2 rounded-full bg-indigo-500 shrink-0" />
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Nguyễn Văn A vừa đặt hàng mới</p>
                                    <p className="text-xs text-gray-400">2 phút trước</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

        </div>
    );
};

export default DashboardPage;