import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoReceiptOutline } from "react-icons/io5";

import type { Order } from "../../../features/shop/orders/types/order";
import { useOrderMutations, useOrders } from "../../../features/shop/orders/hooks/useOrders";
import PurchaseOrderItem from "../../../features/shop/orders/components/PurchaseOrderItem";

// Export để file con (PurchaseOrderItem) có thể sử dụng lại mà không cần khai báo lại
export const STATUS_TABS = [
    { id: 'All', label: 'Tất cả' },
    { id: 'Pending', label: 'Chờ xử lý' },
    { id: 'Confirmed', label: 'Đã xác nhận' },
    { id: 'Shipping', label: 'Đang giao' },
    { id: 'Success', label: 'Đã giao' },
    { id: 'Cancelled', label: 'Đã huỷ' },
];

export const STATUS_THEME: Record<string, { color: string, bg: string, border: string }> = {
    Pending: { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
    Confirmed: { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
    Shipping: { color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200' },
    Success: { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
    Cancelled: { color: 'text-red-500', bg: 'bg-red-100', border: 'border-red-200' },
};

const PurchaseHistory = () => {
    const { orders } = useOrders(); 
    const { updateCancelledOrder } = useOrderMutations();

    const [activeTab, setActiveTab] = useState('All');

    const filteredOrders = activeTab === 'All' 
        ? orders 
        : orders.filter((order: Order) => order.orderStatus === activeTab);

    const handleUpdateCancelled = (orderId: string) => {
        updateCancelledOrder(orderId);
    }

    return (
        <div className="min-h-screen bg-[#f4f6f9] py-10 px-4 md:px-8 font-sans selection:bg-indigo-100">
            {/* VÙNG NỀN TRẮNG TO NHẤT */}
            <div className="max-w-5xl mx-auto bg-white rounded-[32px] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.05)] overflow-hidden">
                
                {/* 1. HEADER */}
                <div className="pt-12 pb-8 px-6 text-center border-b border-slate-100 relative">
                    <h1 className="text-2xl md:text-3xl font-semibold tracking-[0.15em] text-zinc-900 uppercase mb-2">
                        Lịch sử mua hàng
                    </h1>
                </div>

                {/* 2. SCROLLABLE TABS */}
                <div className="border-b border-slate-100 bg-white sticky top-0 z-10">
                    <div className="flex gap-8 overflow-x-auto hide-scrollbar px-8">
                        {STATUS_TABS.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`relative py-4 text-[13px] font-bold uppercase tracking-widest transition-all whitespace-nowrap cursor-pointer ${
                                    activeTab === tab.id ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-700'
                                }`}
                            >
                                {tab.label}
                                {activeTab === tab.id && (
                                    <motion.div
                                        layoutId="active_tab"
                                        className="absolute bottom-0 left-0 right-0 h-[3px] bg-indigo-600 rounded-t-full"
                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 3. DANH SÁCH ĐƠN HÀNG */}
                <div className="p-6 md:p-10 space-y-8 bg-slate-50/30">
                    <AnimatePresence mode="popLayout">
                        {filteredOrders.length > 0 ? (
                            filteredOrders.map((order: Order) => (
                                <PurchaseOrderItem 
                                    order={order}
                                    onUpdateCancelled={handleUpdateCancelled}
                                />
                            ))
                        ) : (
                            /* Empty State */
                            <motion.div 
                                initial={{ opacity: 0 }} 
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-[24px] border border-dashed border-slate-200"
                            >
                                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                                    <IoReceiptOutline className="text-5xl text-slate-300" />
                                </div>
                                <h3 className="text-xl font-black text-slate-800 tracking-tight">Chưa có đơn hàng</h3>
                                <p className="text-slate-500 text-sm mt-2 max-w-sm font-medium">
                                    Bạn chưa có đơn hàng nào trong trạng thái này. Khám phá cửa hàng ngay nhé!
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <style>{`
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
};

export default PurchaseHistory;