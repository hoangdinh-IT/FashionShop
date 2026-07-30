import React from "react";
import { motion, type Variants } from "framer-motion";
import { Link } from "react-router-dom";
import { IoChevronForwardOutline, IoStarOutline } from "react-icons/io5";

// Import Type và các cấu hình từ file cha
import type { OrderItemSummary, OrderSummary } from "../../types/order";
import { STATUS_TABS, STATUS_THEME } from "../../../../../pages/shop/orders/PurchaseHistoryPage";

interface Props {
    order: OrderSummary;
    reviewedItemIds?: Set<number>;
    onCancelledOrder: (orderId: string) => void;
    onViewDetail: (orderId: string) => void;
    onReview: (order: OrderItemSummary) => void;
}

// Cấu hình Easing cao cấp (Luxury Editorial Feel)
const customEase = [0.16, 1, 0.3, 1] as const;

// Variants cho Card đơn hàng
const cardVariants: Variants = {
    hidden: { 
        opacity: 0, 
        scale: 0.97,
        filter: "blur(4px)",
    },
    visible: {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        transition: {
            duration: 0.55,
            ease: customEase,
        },
    },
    exit: {
        opacity: 0,
        scale: 0.96,
        filter: "blur(4px)",
        transition: {
            duration: 0.25,
            ease: customEase,
        },
    },
};

const PurchaseOrderItem: React.FC<Props> = ({ 
    order, 
    reviewedItemIds, 
    onCancelledOrder, 
    onViewDetail, 
    onReview 
}) => {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const currentStatusTheme = STATUS_THEME[order.orderStatus] || STATUS_THEME['Pending'];
    const currentStatusLabel = STATUS_TABS.find(t => t.id === order.orderStatus)?.label;

    const groupedItems = order.orderItems?.reduce((acc, item) => {
        const brand = item.brandName || "Fashion Boutique";
        if (!acc[brand]) acc[brand] = [];
        acc[brand].push(item);
        return acc;
    }, {} as Record<string, typeof order.orderItems>);

    return (
        <motion.div
            layout
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="group relative bg-white rounded-3xl border border-zinc-200/70 p-6 shadow-sm hover:shadow-md hover:border-zinc-300 transition-all duration-300"
        >
            {/* BRAND GROUPS & PRODUCTS */}
            {Object.entries(groupedItems || {}).map(([brandName, items], brandIdx) => (
                <div
                    key={brandName}
                    className={brandIdx > 0 ? "mt-6 pt-6 border-t border-zinc-100" : ""}
                >
                    {/* BRAND HEADER */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center p-1.5 shrink-0 overflow-hidden">
                                <img
                                    src={items?.[0]?.brandLogoUrl}
                                    alt={brandName}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <h3 className="text-sm font-semibold text-zinc-900 tracking-tight">
                                {brandName}
                            </h3>
                        </div>

                        {/* Status Badge (Only shown at the first group header) */}
                        {brandIdx === 0 && (
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border tracking-wide ${currentStatusTheme.bg} ${currentStatusTheme.border} ${currentStatusTheme.color}`}>
                                {currentStatusLabel}
                            </span>
                        )}
                    </div>

                    {/* ITEM LIST */}
                    <div className="space-y-3">
                        {items.map((item) => (
                            <Link
                                key={item.orderItemId}
                                to={`/shop/product/${item.productSlug}`}
                                className="group/item flex items-center gap-4 p-2.5 rounded-2xl hover:bg-zinc-50/80 transition-all duration-200"
                            >
                                {/* IMAGE */}
                                <div className="relative shrink-0">
                                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-100">
                                        <img
                                            src={item.imageUrl || "/placeholder.png"}
                                            alt={item.productName}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover/item:scale-105"
                                        />
                                    </div>
                                    <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-zinc-900 text-white text-[10px] font-medium flex items-center justify-center border border-white">
                                        {item.quantity}
                                    </span>
                                </div>

                                {/* INFO */}
                                <div className="flex-1 min-w-0 space-y-1">
                                    <h4 className="text-sm font-medium text-zinc-900 line-clamp-1 group-hover/item:text-zinc-600 transition-colors">
                                        {item.productName}
                                    </h4>
                                    <p className="text-xs text-zinc-400 font-normal">
                                        Phân loại: <span className="text-zinc-600 font-medium">{item.variantName}</span>
                                    </p>
                                </div>

                                {/* PRICE & REVIEW */}
                                <div className="flex flex-col items-end gap-2 shrink-0">
                                    <span className="text-sm font-semibold tracking-tight text-zinc-900">
                                        {formatCurrency(item.unitPrice)}
                                    </span>

                                    {order.orderStatus === "Success" && !item.isReviewed && !reviewedItemIds?.has(item.orderItemId) && (
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                onReview?.(item);
                                            }}
                                            className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-600 bg-amber-50 hover:bg-amber-100/80 border border-amber-200/60 px-3 py-1 rounded-xl transition-all cursor-pointer"
                                        >
                                            <IoStarOutline size={13} />
                                            <span>Đánh giá</span>
                                        </button>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            ))}

            {/* FOOTER SUMMARY & ACTIONS */}
            <div className="mt-6 pt-5 border-t border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* TOTAL */}
                <div>
                    <span className="text-xs text-zinc-400 font-normal block">
                        Tổng số tiền
                    </span>
                    <span className="text-2xl font-bold tracking-tight text-zinc-900 mt-0.5 block">
                        {formatCurrency(order.totalAmount)}
                    </span>
                </div>

                {/* ACTIONS */}
                <div className="flex items-center gap-2.5">
                    {order.orderStatus === "Pending" && (
                        <button
                            onClick={() => onCancelledOrder?.(order.orderId)}
                            className="h-10 px-4 rounded-2xl border border-rose-200 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                        >
                            Hủy đơn
                        </button>
                    )}

                    <button
                        onClick={() => onViewDetail?.(order.orderId)}
                        className="h-10 px-5 rounded-2xl bg-zinc-900 hover:bg-black text-white text-xs font-semibold tracking-wider uppercase transition-all shadow-sm active:scale-[0.98] flex items-center gap-1.5 cursor-pointer"
                    >
                        Chi tiết
                        <IoChevronForwardOutline size={14} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default PurchaseOrderItem;