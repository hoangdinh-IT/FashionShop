import { motion } from "framer-motion";
import { 
    IoStorefrontOutline, 
    IoChevronForwardOutline,
    IoChatbubbleEllipsesOutline,
    IoCloseCircleOutline,
    IoSyncOutline
} from "react-icons/io5";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

// Import Type và các cấu hình màu sắc/trạng thái từ file cha
import type { Order } from "../types/order";
import { STATUS_TABS, STATUS_THEME } from "../../../../pages/shop/orders/PurchaseHistory";
import type React from "react";

interface Props {
    order: Order;
    onUpdateCancelled: (orderId: string) => void;
}

const PurchaseOrderItem: React.FC<Props> = ({ order, onUpdateCancelled }) => {
    // Hàm format tiền tệ (được đóng gói gọn trong component này)
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const currentStatusTheme = STATUS_THEME[order.orderStatus] || STATUS_THEME['Pending'];
    const currentStatusLabel = STATUS_TABS.find(t => t.id === order.orderStatus)?.label;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="group bg-white rounded-[24px] border border-slate-200/70 shadow-sm hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] transition-all duration-300 overflow-hidden"
        >
            {/* Order Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-600 shadow-sm">
                        <IoStorefrontOutline size={18} />
                    </div>
                    <div>
                        <p className="text-sm font-black text-slate-800 tracking-tight">Fashion Boutique</p>
                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                            #{order.id.slice(0, 8)}
                        </p>
                    </div>
                </div>
                <div className={`px-4 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-widest border ${currentStatusTheme.bg} ${currentStatusTheme.color} ${currentStatusTheme.border}`}>
                    {currentStatusLabel}
                </div>
            </div>

            {/* Order Items */}
            <div className="px-6 py-5 space-y-6">
                {order.orderDetails.map((item) => (
                    <div key={item.id} className="flex gap-5">
                        <div className="w-24 h-24 rounded-2xl bg-slate-50 overflow-hidden border border-slate-100 shrink-0">
                            <img src={item.imageUrl || '/placeholder.png'} alt={item.productName} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        </div>
                        
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                            <h4 className="text-[15px] font-bold text-slate-800 line-clamp-2 leading-snug">
                                {item.productName}
                            </h4>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="bg-slate-100 text-slate-500 text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                                    {item.variantName}
                                </span>
                                <span className="text-slate-400 text-xs font-semibold">x {item.quantity}</span>
                            </div>
                        </div>

                        <div className="flex flex-col justify-center items-end shrink-0 pl-2">
                            <span className="text-[15px] font-black text-indigo-600">
                                {formatCurrency(item.unitPrice)}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Order Footer & Actions */}
            <div className="px-6 py-5 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row gap-5 justify-between items-center">
                <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                    <span>Thời gian đặt:</span>
                    <span className="font-bold text-slate-600">
                        {format(new Date(order.orderDate), "HH:mm, dd/MM/yyyy", { locale: vi })}
                    </span>
                </div>
                
                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-left sm:text-right mr-2">
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-0.5">Thành tiền</p>
                        <p className="text-xl font-black text-slate-900 tracking-tighter leading-none">
                            {formatCurrency(order.totalAmount)}
                        </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        {(order.orderStatus === 'Pending') && (
                            <button 
                                onClick={() => onUpdateCancelled?.(order.id)}
                                className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold rounded-xl transition-all active:scale-95 shadow-sm cursor-pointer"
                            >
                                <IoCloseCircleOutline size={16} /> Hủy đơn
                            </button>
                        )}

                        {order.orderStatus === 'Success' && (
                            <button className="flex items-center gap-1.5 px-4 py-2.5 bg-amber-50 text-amber-600 hover:bg-amber-100 border border-amber-200 text-xs font-bold rounded-xl transition-all active:scale-95 shadow-sm cursor-pointer">
                                <IoChatbubbleEllipsesOutline size={16} /> Đánh giá
                            </button>
                        )}

                        {(order.orderStatus === 'Success' || order.orderStatus === 'Cancelled') && (
                            <button className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold rounded-xl transition-all active:scale-95 shadow-sm cursor-pointer">
                                <IoSyncOutline size={16} /> Mua lại
                            </button>
                        )}

                        <button className="flex items-center gap-1 px-5 py-2.5 bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-95 cursor-pointer">
                            Chi tiết <IoChevronForwardOutline />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default PurchaseOrderItem;