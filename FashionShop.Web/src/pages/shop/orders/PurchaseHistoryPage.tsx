import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoReceiptOutline } from "react-icons/io5";

import type { OrderItemSummary, OrderSummary } from "../../../features/shop/orders/types/order";
import { useOrder, useOrderMutations, useOrders } from "../../../features/shop/orders/hooks/useOrders";
import PurchaseOrderItem from "../../../features/shop/orders/components/PurchaseHistory/PurchaseOrderItem";
import OrderDetailModal from "../../../features/shop/orders/components/PurchaseHistory/OrderDetailModal";
import { useDialog } from "../../../contexts";
import ProductReviewModal from "../../../features/shop/reviews/components/ProductReviewModal";

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
    const [modalConfig, setModalConfig] = useState<{
        isOpen: "DETAIL" | "REVIEW" | null,
        orderId: string | undefined,
        orderItem: OrderItemSummary | undefined
    }>({
        isOpen: null,
        orderId: undefined,
        orderItem: undefined
    });

    const [reviewedItemIds, setReviewedItemIds] = useState<Set<number>>(new Set());

    const handleReviewSuccess = (orderItemId: number) => {
        setReviewedItemIds((prev) => new Set(prev).add(orderItemId));
    };

    const { orders, isLoading: isLoadingOrders } = useOrders();
    const { order, isLoading: isLoadingOrder } = useOrder(modalConfig.orderId);
    const { updateCancelledOrder } = useOrderMutations();

    const filteredOrders = activeTab === "All"
        ? orders
        : orders?.filter((order: OrderSummary) => order.orderStatus === activeTab) || [];

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

    const handleViewDetailOrder = (orderId: string) => 
        setModalConfig({ isOpen: "DETAIL", orderId: orderId, orderItem: undefined });

    const handleReview = (orderItem: OrderItemSummary) =>
        setModalConfig({ isOpen: "REVIEW", orderId: undefined, orderItem: orderItem });

    const handleClose = () => 
        setModalConfig({ isOpen: null, orderId: undefined, orderItem: undefined });

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-5xl mx-auto px-0 sm:px-4 md:px-6 py-2 sm:py-6 min-w-0 overflow-x-hidden font-sans"
        >
            <main className="bg-white rounded-xl sm:rounded-3xl border-0 sm:border border-zinc-200/80 min-h-[500px] sm:min-h-[600px] relative overflow-hidden shadow-none sm:shadow-sm">

                {/* STICKY HEADER */}
                <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-zinc-100 px-3 sm:px-6 md:px-8 py-3 sm:py-6">
                    
                    {/* TITLE */}
                    <header className="relative flex flex-col items-center mb-3 sm:mb-6">
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-block"
                        >
                            <h1 className="text-lg sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight mb-1 sm:mb-2 italic text-center">
                                LỊCH SỬ MUA HÀNG
                            </h1>
                        </motion.div>
                        <div className="h-[3px] w-8 sm:w-10 bg-slate-900 rounded-full" />
                    </header>

                    {/* STATUS TABS - Căn giữa ở màn hình md trở lên */}
                    <div className="w-full flex justify-start md:justify-center overflow-hidden">
                        <nav className="bg-zinc-100/80 p-1 rounded-xl sm:rounded-2xl flex gap-1 overflow-x-auto hide-scrollbar w-full md:w-auto border border-zinc-200/50">
                            {STATUS_TABS.map((tab) => {
                                const isActive = activeTab === tab.id;

                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`
                                            relative px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-semibold
                                            whitespace-nowrap transition-colors duration-200 cursor-pointer shrink-0
                                            ${isActive ? "text-white" : "text-zinc-800 hover:text-black"}
                                        `}
                                    >
                                        <span className="relative z-10">{tab.label}</span>

                                        {isActive && (
                                            <motion.div
                                                layoutId="active_tab_pill"
                                                className="absolute inset-0 bg-zinc-900 rounded-lg sm:rounded-xl shadow-sm"
                                                transition={{
                                                    type: "spring",
                                                    stiffness: 350,
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

                {/* MAIN CONTENT */}
                <div className="p-2 sm:p-6 md:p-8 min-w-0">
                    <AnimatePresence mode="popLayout">
                        {isLoadingOrders ? (
                            /* SKELETON LOADING */
                            <div className="space-y-3 sm:space-y-4">
                                {[...Array(3)].map((_, index) => (
                                    <div
                                        key={index}
                                        className="rounded-xl sm:rounded-2xl border border-zinc-100 p-3 sm:p-6 space-y-3 sm:space-y-4 bg-white animate-pulse"
                                    >
                                        <div className="flex justify-between items-center">
                                            <div className="h-4 w-24 sm:w-32 bg-zinc-100 rounded-md" />
                                            <div className="h-5 sm:h-6 w-16 sm:w-20 bg-zinc-100 rounded-full" />
                                        </div>
                                        <div className="flex gap-3 sm:gap-4 items-center">
                                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-zinc-100 rounded-lg sm:rounded-xl shrink-0" />
                                            <div className="flex-1 space-y-2 min-w-0">
                                                <div className="h-3.5 sm:h-4 w-2/3 sm:w-1/2 bg-zinc-100 rounded-md" />
                                                <div className="h-3 w-1/3 sm:w-1/4 bg-zinc-100 rounded-md" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : filteredOrders.length > 0 ? (
                            /* ORDER LIST */
                            <div className="space-y-3 sm:space-y-4 min-w-0">
                                {filteredOrders.map((order: OrderSummary, index: number) => (
                                    <motion.div
                                        key={order.orderId}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.98 }}
                                        transition={{ delay: index * 0.04 }}
                                        className="min-w-0"
                                    >
                                        <PurchaseOrderItem
                                            order={order}
                                            reviewedItemIds={reviewedItemIds}
                                            onCancelledOrder={handleCancelledOrder}
                                            onViewDetail={handleViewDetailOrder}
                                            onReview={handleReview}
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            /* EMPTY STATE */
                            <motion.div
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center py-12 sm:py-20 px-4 text-center"
                            >
                                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center mb-3">
                                    <IoReceiptOutline className="text-xl sm:text-2xl text-zinc-400" />
                                </div>
                                <h3 className="text-xs sm:text-sm font-semibold text-zinc-900 mb-1">
                                    Chưa có đơn hàng
                                </h3>
                                <p className="text-[11px] sm:text-xs text-zinc-500 max-w-xs">
                                    Bạn hiện không có đơn hàng nào trong trạng thái này.
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            {/* CSS Tùy chỉnh ẩn thanh cuộn cho mobile */}
            <style>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>

            {/* MODALS */}
            <OrderDetailModal
                order={order}
                isOpen={modalConfig.isOpen === "DETAIL"}
                onClose={handleClose}
                isLoading={isLoadingOrder}
            />

            <ProductReviewModal 
                isOpen={modalConfig.isOpen === "REVIEW"}
                onClose={handleClose}
                orderItem={modalConfig.orderItem}
                onSuccess={() => {
                    if (modalConfig.orderItem) {
                        handleReviewSuccess(modalConfig.orderItem.orderItemId);
                    }
                }}
            />
        </motion.div>
    );
};

export default PurchaseHistoryPage;