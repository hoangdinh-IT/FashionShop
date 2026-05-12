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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="group relative bg-white rounded-[24px] border border-slate-100 hover:border-slate-200 transition-all duration-500 shadow-sm hover:shadow-[0_20px_50px_rgba(0,0,0,0.04)] overflow-hidden"
        >
            <div className="p-1"> {/* Inner border effect */}
                <div className="bg-white rounded-[22px]">
                    
                    {Object.entries(groupedItems || {}).map(([brandName, items], brandIdx) => (
                        <div key={brandName} className={brandIdx > 0 ? "border-t border-slate-50 mt-2" : ""}>
                            
                            {/* HEADER CỦA TỪNG BRAND */}
                            <div className="flex items-center justify-between px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                        <IoStorefrontOutline size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] leading-none mb-1">BRAND</p>
                                        <p className="text-sm font-bold text-slate-800 tracking-tight">{brandName}</p>
                                    </div>
                                </div>

                                {brandIdx === 0 && (
                                    <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border ${currentStatusTheme.bg} ${currentStatusTheme.border}`}>
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${currentStatusTheme.color}`}>
                                            {currentStatusLabel}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* DANH SÁCH SẢN PHẨM THUỘC BRAND NÀY */}
                            <div className="px-6 pb-4 space-y-4">
                                {items.map((item) => (
                                    <Link 
                                        key={item.orderItemId} 
                                        to={`/shop/product/${item.productSlug}`} // Điều hướng dựa trên productSlug
                                        className="flex gap-6 group/item cursor-pointer outline-none"
                                    >
                                        {/* Ảnh sản phẩm */}
                                        <div className="relative shrink-0">
                                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 group-hover/item:border-indigo-100 transition-colors">
                                                <img 
                                                    src={item.imageUrl || '/placeholder.png'} 
                                                    alt={item.productName} 
                                                    className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500" 
                                                />
                                            </div>
                                            <div className="absolute -bottom-1.5 -right-1.5 w-5 h-5 bg-slate-900 text-white text-[9px] font-bold rounded-lg flex items-center justify-center border-2 border-white shadow-sm">
                                                {item.quantity}
                                            </div>
                                        </div>
                                        
                                        {/* Thông tin sản phẩm */}
                                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                                            <h5 className="text-sm font-bold text-slate-800 line-clamp-1 group-hover/item:text-indigo-600 transition-colors">
                                                {item.productName}
                                            </h5>
                                            <div className="flex items-center gap-2 mt-1">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                    {item.variantName}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Giá tiền */}
                                        <div className="flex items-center shrink-0">
                                            <span className="text-sm font-black text-slate-900">
                                                {formatCurrency(item.unitPrice)}
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}

                    <div className="px-6 py-5 bg-slate-50/40 border-t border-slate-50 flex flex-col sm:flex-row gap-6 justify-between items-center">
                        <div className="flex items-baseline gap-3">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Thanh toán</span>
                            <span className="text-2xl font-black text-indigo-600 tracking-tighter drop-shadow-sm">
                                {formatCurrency(order.totalAmount)}
                            </span>
                        </div>

                        <div className="flex items-center gap-3">
                            {order.orderStatus === 'Pending' && (
                                <button 
                                    onClick={() => onCancelledOrder?.(order.orderId)}
                                    className="group/cancel px-5 h-11 text-[10px] font-black uppercase tracking-[0.15em] text-rose-500/80 bg-transparent border border-rose-100 hover:bg-rose-50/50 hover:text-rose-600 hover:border-rose-200 transition-all duration-300 active:scale-95 cursor-pointer flex items-center gap-2 rounded-2xl"
                                >
                                    <div className="relative flex items-center justify-center">
                                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400 group-hover/cancel:scale-125 transition-transform" />
                                        <span className="absolute w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping opacity-20 group-hover/cancel:opacity-40" />
                                    </div>
                                    Hủy đơn
                                </button>
                            )}

                            {order.orderStatus === 'Success' && (
                                <button 
                                    className="group/review px-5 h-11 text-[10px] font-black uppercase tracking-[0.15em] text-amber-600 bg-amber-50/30 border border-amber-100/50 hover:bg-amber-50 hover:border-amber-200 transition-all duration-500 active:scale-95 cursor-pointer flex items-center gap-2 rounded-2xl relative overflow-hidden"
                                >
                                    {/* Hiệu ứng ánh sáng chạy ngang qua khi hover */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover/review:animate-[shimmer_1.5s_infinite] transition-transform" />
                                    
                                    <div className="flex items-center gap-1.5 relative z-10">
                                        <IoStarOutline className="group-hover/review:rotate-[20deg] transition-transform duration-300" size={14} />
                                        <span>Đánh giá</span>
                                    </div>

                                    {/* Chấm tròn nhỏ biểu thị tương tác */}
                                    <div className="w-1 h-1 rounded-full bg-amber-400 opacity-0 group-hover/review:opacity-100 transition-opacity" />
                                </button>
                            )}

                            {/* Điểm nhấn màu sắc 3: Nút hành động chính */}
                            <button 
                                onClick={() => onViewDetail?.(order.orderId)}
                                className="h-10 pl-5 pr-4 bg-slate-600 hover:bg-slate-800 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all duration-300 shadow-sm hover:shadow-indigo-100 active:scale-95 flex items-center gap-2 group/btn cursor-pointer"
                            >
                                Chi tiết
                                <IoChevronForwardOutline className="group-hover:translate-x-0.5 transition-transform" size={12} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default PurchaseOrderItem;