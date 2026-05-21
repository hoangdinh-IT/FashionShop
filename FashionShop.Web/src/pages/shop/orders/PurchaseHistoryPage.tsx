import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoReceiptOutline } from "react-icons/io5";

import type { OrderSummary } from "../../../features/shop/orders/types/order";
import { useOrder, useOrderMutations, useOrders } from "../../../features/shop/orders/hooks/useOrders";
import PurchaseOrderItem from "../../../features/shop/orders/components/PurchaseHistory/PurchaseOrderItem";
import OrderDetailDialog from "../../../features/shop/orders/components/PurchaseHistory/OrderDetailDialog";
import { useDialog } from "../../../contexts";

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

const PurchaseHistoryPage = () => {
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "instant"
        });
    }, []);

    const { showDialog } = useDialog(); 

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
        showDialog({
            title: "XÁC NHẬN HUỶ ĐƠN",
            message: "Đơn hàng này sẽ bị huỷ. Bạn có chắc chắn muốn tiếp tục?",
            confirmText: "Xác nhận",
            cancelText: "Hủy bỏ",
            confirmColor: "error",
            onConfirm: () => updateCancelledOrder(orderId)
        });
    }

    const handleViewDetailOrder = (orderId: string) => {
        setSelectedOrderId(orderId);
        setIsDetailOpen(true);
    }
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="w-full"
        >
            <main className="flex-1 bg-white rounded-[2rem] shadow-sm border border-zinc-100 min-h-[600px] overflow-visible relative">

                {/* BACKGROUND */}
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-50/40 rounded-full blur-[120px] -z-10" />
                <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-rose-50/40 rounded-full blur-[100px] -z-10" />

                {/* ===================================================== */}
                {/* STICKY HEADER */}
                {/* ===================================================== */}
                <div className="sticky top-20 z-40 bg-white/88 backdrop-blur-2xl border-b border-zinc-100 rounded-t-[2rem]">

                    <div className="px-6 md:px-10 pt-5 pb-5">

                        {/* TITLE */}
                        <header className="relative flex flex-col items-center">

                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-block"
                            >
                                <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight mb-2 italic text-center">
                                    LỊCH SỬ MUA HÀNG
                                </h1>
                            </motion.div>

                            <div className="h-[3px] w-10 bg-slate-900 rounded-full" />
                        </header>

                        {/* STATUS TAB */}
                        <div className="mt-5 flex justify-center">

                            <nav className="bg-white/80 backdrop-blur-xl p-1.5 rounded-[24px] border border-white/40 shadow-[0_10px_24px_rgba(0,0,0,0.04)] flex gap-1 overflow-x-auto hide-scrollbar max-w-full">

                                {STATUS_TABS.map((tab) => {

                                    const isActive = activeTab === tab.id;

                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`
                                                relative px-5 py-2.5 rounded-[18px]
                                                text-[10px] font-black uppercase tracking-[0.22em]
                                                whitespace-nowrap transition-all duration-500
                                                cursor-pointer
                                                ${
                                                    isActive
                                                        ? "text-white"
                                                        : "text-slate-400 hover:text-slate-700"
                                                }
                                            `}
                                        >
                                            <span className="relative z-10">
                                                {tab.label}
                                            </span>

                                            {isActive && (
                                                <motion.div
                                                    layoutId="modern_tab_pill"
                                                    className="absolute inset-0 bg-slate-900 shadow-lg shadow-slate-200"
                                                    style={{ borderRadius: 18 }}
                                                    transition={{
                                                        type: "spring",
                                                        stiffness: 300,
                                                        damping: 30
                                                    }}
                                                />
                                            )}
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>
                    </div>
                </div>

                {/* ===================================================== */}
                {/* CONTENT */}
                {/* ===================================================== */}
                <div className="px-6 md:px-10 py-8">

                    <AnimatePresence mode="popLayout">

                        {isLoadingOrders ? (

                            <div className="grid grid-cols-1 gap-5">

                                {[...Array(5)].map((_, index) => (

                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="overflow-hidden rounded-[28px] border border-zinc-100 bg-white"
                                    >

                                        {/* TOP */}
                                        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-5">

                                            <div className="space-y-3">
                                                <div className="h-3 w-28 animate-pulse rounded-full bg-zinc-200" />
                                                <div className="h-4 w-44 animate-pulse rounded-full bg-zinc-200" />
                                            </div>

                                            <div className="h-9 w-28 animate-pulse rounded-full bg-zinc-200" />
                                        </div>

                                        {/* PRODUCT */}
                                        <div className="px-6 py-5">

                                            <div className="flex gap-4">

                                                <div className="h-24 w-24 shrink-0 animate-pulse rounded-2xl bg-zinc-200" />

                                                <div className="flex-1 space-y-3">
                                                    <div className="h-4 w-2/3 animate-pulse rounded-full bg-zinc-200" />
                                                    <div className="h-3 w-1/3 animate-pulse rounded-full bg-zinc-100" />
                                                    <div className="h-3 w-1/4 animate-pulse rounded-full bg-zinc-100" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* FOOTER */}
                                        <div className="flex items-center justify-between border-t border-zinc-100 px-6 py-5">

                                            <div className="space-y-2">
                                                <div className="h-3 w-24 animate-pulse rounded-full bg-zinc-100" />
                                                <div className="h-5 w-32 animate-pulse rounded-full bg-zinc-200" />
                                            </div>

                                            <div className="flex gap-3">
                                                <div className="h-10 w-28 animate-pulse rounded-2xl bg-zinc-200" />
                                                <div className="h-10 w-32 animate-pulse rounded-2xl bg-zinc-300" />
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                        ) : filteredOrders.length > 0 ? (

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

                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center py-28 px-6 group"
                            >

                                <div className="relative mb-10">

                                    <div className="absolute inset-0 bg-indigo-500/10 blur-[40px] rounded-full scale-150" />

                                    <div className="relative w-20 h-20 bg-white border border-slate-50 rounded-[32px] flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.02)] overflow-hidden">

                                        <IoReceiptOutline className="text-3xl text-slate-300" />
                                    </div>
                                </div>

                                <div className="text-center space-y-2">

                                    <h3 className="text-[15px] font-black text-slate-800 uppercase tracking-[0.3em]">
                                        Danh sách trống
                                    </h3>

                                    <p className="text-[11px] text-slate-400 italic tracking-wide">
                                        Chưa có dữ liệu cho mục này
                                    </p>
                                </div>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>
            </main>

            <style>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }

                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>

            <OrderDetailDialog
                order={order}
                isOpen={isDetailOpen}
                onClose={() => {
                    setSelectedOrderId(undefined);
                    setIsDetailOpen(false);
                }}
                isLoading={isLoadingOrder}
            />
        </motion.div>
    );
};

export default PurchaseHistoryPage;