import { motion } from "framer-motion";
import { 
    IoStorefrontOutline, 
    IoChevronForwardOutline,
    IoStarOutline,
} from "react-icons/io5";

// Import Type và các cấu hình màu sắc/trạng thái từ file cha
import type { OrderSummary } from "../../types/order";
import { STATUS_TABS, STATUS_THEME } from "../../../../../pages/shop/orders/PurchaseHistoryPage";
import type React from "react";
import { Link } from "react-router-dom";

interface Props {
    order: OrderSummary;
    onCancelledOrder: (orderId: string) => void;
    onViewDetail: (orderId: string) => void;
}

const PurchaseOrderItem: React.FC<Props> = ({ order, onCancelledOrder, onViewDetail }) => {
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
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="group relative overflow-hidden rounded-[28px] border border-zinc-100 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1"
        >
            {/* ACCENT LINE (nhẹ hơn, minimal hơn) */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-indigo-400 via-zinc-900 to-cyan-400 opacity-40" />

            <div className="relative p-6">
                
                {Object.entries(groupedItems || {}).map(([brandName, items], brandIdx) => (
                    <div
                        key={brandName}
                        className={brandIdx > 0 ? "mt-7 pt-7 border-t border-zinc-100" : ""}
                    >
                        {/* BRAND HEADER */}
                        <div className="flex items-start justify-between mb-5">
                            
                            <div className="flex items-center gap-4">
                                
                                <div className="w-12 h-12 rounded-2xl bg-white border border-zinc-100 flex items-center justify-center overflow-hidden">
                                    <img
                                        src={items?.[0]?.brandLogoUrl}
                                        alt={brandName}
                                        className="w-full h-full object-contain p-2"
                                    />
                                </div>

                                <div>
                                    <h3 className="text-base font-bold text-zinc-900 tracking-tight mt-1">
                                        {brandName}
                                    </h3>
                                </div>
                            </div>

                            {brandIdx === 0 && (
                                <div className={`px-3 h-9 rounded-full border flex items-center text-[10px] uppercase tracking-[0.2em] font-bold ${currentStatusTheme.bg} ${currentStatusTheme.border} ${currentStatusTheme.color}`}>
                                    {currentStatusLabel}
                                </div>
                            )}
                        </div>

                        {/* PRODUCTS */}
                        <div className="space-y-3">
                            {items.map((item) => (
                                <Link
                                    key={item.orderItemId}
                                    to={`/shop/product/${item.productSlug}`}
                                    className="group/item flex items-center gap-4 rounded-2xl border border-transparent hover:border-zinc-100 hover:bg-zinc-50/60 transition-all duration-300 p-3"
                                >
                                    {/* IMAGE */}
                                    <div className="relative shrink-0">
                                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-zinc-100">
                                            <img
                                                src={item.imageUrl || "/placeholder.png"}
                                                alt={item.productName}
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover/item:scale-105"
                                            />
                                        </div>

                                        <div className="absolute -bottom-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-zinc-900 text-white text-[10px] font-bold flex items-center justify-center border border-white">
                                            {item.quantity}
                                        </div>
                                    </div>

                                    {/* INFO */}
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-[14px] font-semibold text-zinc-900 line-clamp-1 group-hover/item:text-indigo-600 transition-colors">
                                            {item.productName}
                                        </h4>

                                        <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-semibold">
                                            {item.variantName}
                                        </p>
                                    </div>

                                    {/* PRICE */}
                                    <div className="text-right shrink-0">
                                        <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 mb-1">
                                            Price
                                        </p>

                                        <span className="text-[14px] font-bold text-zinc-900">
                                            {formatCurrency(item.unitPrice)}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
                
                {/* FOOTER */}
                <div className="mt-7 pt-6 border-t border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                    
                    {/* TOTAL */}
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-semibold mb-2">
                            Total
                        </p>

                        <div className="text-3xl font-black tracking-tight text-zinc-900">
                            {formatCurrency(order.totalAmount)}
                        </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex items-center gap-3 flex-wrap">
                        
                        {order.orderStatus === "Pending" && (
                            <button
                                onClick={() => onCancelledOrder?.(order.orderId)}
                                className="h-10 px-4 rounded-full border border-rose-100 bg-rose-50 text-[10px] uppercase tracking-[0.2em] font-bold text-rose-500 hover:bg-rose-100 transition"
                            >
                                Hủy đơn
                            </button>
                        )}

                        {order.orderStatus === "Success" && (
                            <button className="h-10 px-4 rounded-full border border-amber-100 bg-amber-50 text-[10px] uppercase tracking-[0.2em] font-bold text-amber-600 hover:bg-amber-100 transition flex items-center gap-2">
                                <IoStarOutline size={14} />
                                Đánh giá
                            </button>
                        )}

                        <button
                            onClick={() => onViewDetail?.(order.orderId)}
                            className="h-10 px-5 rounded-full bg-zinc-900 text-white text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-black transition flex items-center gap-2"
                        >
                            Chi tiết
                            <IoChevronForwardOutline size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default PurchaseOrderItem;