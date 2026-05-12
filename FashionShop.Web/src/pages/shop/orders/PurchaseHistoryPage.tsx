import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoReceiptOutline } from "react-icons/io5";

import type { OrderSummary } from "../../../features/shop/orders/types/order";
import { useOrder, useOrderMutations, useOrders } from "../../../features/shop/orders/hooks/useOrders";
import PurchaseOrderItem from "../../../features/shop/orders/components/PurchaseHistory/PurchaseOrderItem";
import OrderDetailDialog from "../../../features/shop/orders/components/PurchaseHistory/OrderDetailDialog";

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
    const [activeTab, setActiveTab] = useState('All');
    const [selectedOrderId, setSelectedOrderId] = useState<string | undefined>(undefined);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const { orders, isLoading: isLoadingOrders } = useOrders();
    const { order, isLoading: isLoadingOrder } = useOrder(selectedOrderId);
    const { updateCancelledOrder } = useOrderMutations();

    const filteredOrders = activeTab === "All"
        ? orders
        : orders.filter((order: OrderSummary) => order.orderStatus === activeTab);

    const handleCancelledOrder = (orderId: string) => {
        updateCancelledOrder(orderId);
    }

    const handleViewDetailOrder = (orderId: string) => {
        setSelectedOrderId(orderId);
        setIsDetailOpen(true);
    }

    return (
        <div className="min-h-screen bg-[#FDFDFF] relative overflow-hidden font-sans selection:bg-indigo-100">
            
            {/* BACKGROUND BLOBS - Giữ nguyên hiệu ứng nền mờ */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-50/50 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-rose-50/50 rounded-full blur-[100px] -z-10" />

            <div className="max-w-5xl mx-auto py-6 px-4 md:px-8 relative z-0">
                
                {/* 1. CREATIVE HEADER - Giảm padding-bottom và margin-bottom */}
                <header className="mb-6 relative flex flex-col items-center">
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block"
                    >
                        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter mb-2 italic">
                            LỊCH SỬ MUA HÀNG
                        </h1>
                    </motion.div>
                    <div className="h-1 w-12 bg-slate-900 rounded-full" />
                </header>

                {/* 2. GLASS-TAB NAVIGATION - Giảm margin-bottom */}
                <div className="sticky top-6 z-50 mb-12 flex justify-center">
                    <nav className="bg-white/80 backdrop-blur-xl p-2 rounded-[28px] border border-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.04)] flex gap-1 overflow-x-auto hide-scrollbar max-w-full">
                        {STATUS_TABS.map((tab) => {
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`relative px-6 py-3 rounded-[22px] text-[11px] font-black uppercase tracking-widest transition-all duration-500 whitespace-nowrap cursor-pointer ${
                                        isActive ? 'text-white' : 'text-slate-400 hover:text-slate-600'
                                    }`}
                                >
                                    <span className="relative z-10">{tab.label}</span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="modern_tab_pill"
                                            className="absolute inset-0 bg-slate-900 shadow-lg shadow-slate-200"
                                            style={{ borderRadius: 22 }}
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* 3. ORDER LIST */}
                <div className="relative px-2">
                    <AnimatePresence mode="popLayout">
                        {filteredOrders.length > 0 ? (
                            <div className="grid grid-cols-1 gap-5">
                                {filteredOrders.map((order: OrderSummary, index: number) => (
                                    <motion.div
                                        key={order.orderId}
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.98 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <PurchaseOrderItem 
                                            order={order}
                                            onCancelledOrder={handleCancelledOrder}
                                            onViewDetail={handleViewDetailOrder}
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            /* MODERN EMPTY STATE - Điều chỉnh lại py-20 cho gọn */
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }} 
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center py-28 px-6 group"
                            >
                                {/* Minimalist Icon Art */}
                                <div className="relative mb-10">
                                    {/* Lớp shadow mềm mại tạo chiều sâu */}
                                    <div className="absolute inset-0 bg-indigo-500/10 blur-[40px] rounded-full scale-150 group-hover:scale-110 transition-transform duration-1000" />
                                    
                                    <div className="relative w-20 h-20 bg-white border border-slate-50 rounded-[32px] flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.02)] overflow-hidden">
                                        {/* Họa tiết trang trí chìm */}
                                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-slate-100 to-transparent" />
                                        
                                        <IoReceiptOutline className="text-3xl text-slate-300 group-hover:text-indigo-400 transition-colors duration-500" />
                                        
                                        {/* Hiệu ứng tia sáng nhỏ */}
                                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-indigo-50 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </div>

                                {/* Typography Driven Info */}
                                <div className="text-center space-y-2">
                                    <h3 className="text-[15px] font-black text-slate-800 uppercase tracking-[0.3em]">
                                        Danh sách trống
                                    </h3>
                                    <div className="flex items-center justify-center gap-3">
                                        <div className="h-[1px] w-4 bg-slate-200" />
                                        <p className="text-[11px] text-slate-400 font-medium italic tracking-wide">
                                            Chưa có dữ liệu cho mục này
                                        </p>
                                        <div className="h-[1px] w-4 bg-slate-200" />
                                    </div>
                                </div>

                                {/* Subtle Decorative Element */}
                                <motion.div 
                                    animate={{ y: [0, 5, 0] }}
                                    transition={{ repeat: Infinity, duration: 4 }}
                                    className="mt-12 text-[10px] text-slate-300 font-bold uppercase tracking-[0.2em] opacity-40 group-hover:opacity-100 transition-opacity"
                                >
                                    RKA Shop • Portfolio
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <style>{`
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>

            <OrderDetailDialog
                order={order}
                isOpen={isDetailOpen}
                onClose={() => {
                    setSelectedOrderId(undefined)
                    setIsDetailOpen(false)
                }}
                isLoading={isLoadingOrder}
            />
        </div>
    );
};

export default PurchaseHistory;