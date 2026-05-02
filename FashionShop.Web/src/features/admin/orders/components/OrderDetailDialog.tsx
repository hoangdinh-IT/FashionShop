import React from "react";
import { 
    IoCloseOutline, 
    IoCallOutline, 
    IoLocationOutline, 
    IoTimeOutline, 
    IoBagCheckOutline,
    IoWalletOutline,
    IoCardOutline
} from "react-icons/io5";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import type { Order } from "../types/order";
import AddressString from "../../../shop/addresses/components/AddressString";

// --- ANIMATION VARIANTS (Đồng bộ với Voucher) --- //
const backdropVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
};

const modalVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { 
        opacity: 1, y: 0, scale: 1, 
        transition: { type: "spring", stiffness: 300, damping: 28 } 
    },
    exit: { 
        opacity: 0, y: 20, scale: 0.95, 
        transition: { duration: 0.2, ease: "easeIn" } 
    }
};

interface Props {
    isOpen: boolean;
    onClose: () => void;
    order?: Order;
}

const OrderDetailDialog: React.FC<Props> = ({ isOpen, onClose, order }) => {
    
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    return (
        <AnimatePresence>
            {isOpen && order && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 font-sans">
                    
                    {/* 1. BACKDROP (Lớp nền mờ) */}
                    <motion.div
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        onClick={onClose}
                    />

                    {/* 2. MODAL CONTENT (Khung chi tiết) */}
                    <motion.div
                        className="relative w-full max-w-4xl bg-[#F8F9FB] rounded-[40px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col max-h-[92vh]"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* --- HEADER --- */}
                        <div className="relative bg-white px-8 py-7 sm:px-10 border-b border-gray-100 shrink-0">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="bg-indigo-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                                            Chi tiết vận đơn
                                        </span>
                                        <span className="text-gray-400 font-bold text-sm tracking-tight">
                                            #{order.id.slice(0, 8).toUpperCase()}
                                        </span>
                                    </div>
                                    <h2 className="text-3xl font-black text-gray-900 tracking-tight leading-none">
                                        {order.fullName}
                                    </h2>
                                </div>
                                <button 
                                    onClick={onClose}
                                    className="p-3 bg-gray-50 hover:bg-rose-50 text-gray-400 hover:text-rose-500 rounded-2xl transition-all duration-300 active:scale-90"
                                >
                                    <IoCloseOutline size={28} />
                                </button>
                            </div>

                            {/* Quick Info Bar */}
                            <div className="flex flex-wrap gap-x-8 gap-y-4 mt-6">
                                <div className="flex items-center gap-2.5 text-gray-600 font-bold text-sm">
                                    <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100/50">
                                        <IoCallOutline size={16} />
                                    </div>
                                    {order.phoneNumber}
                                </div>

                                <div className="flex items-center gap-2.5 text-gray-600 font-bold text-sm">
                                    <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shadow-sm border border-amber-100/50">
                                        <IoTimeOutline size={16} />
                                    </div>
                                    {format(new Date(order.orderDate), "HH:mm, dd/MM/yyyy", { locale: vi })}
                                </div>

                                <div className="w-full flex items-center gap-2.5 text-gray-600 font-bold text-sm">
                                    <div className="shrink-0 w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100/50">
                                        <IoLocationOutline size={16} />
                                    </div>
                                    <div className="line-clamp-1 italic text-gray-500 font-medium">
                                        <AddressString 
                                            addressDetail={order.shippingAddress}
                                            communeCode={order.shippingCommune}
                                            districtCode={order.shippingDistrict}
                                            cityCode={order.shippingCity}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* --- BODY (SCROLLABLE) --- */}
                        <div className="flex-1 overflow-y-auto px-8 py-8 sm:px-10 custom-scrollbar bg-slate-50/40">
                            <div className="space-y-5">
                                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2 mb-6">
                                    <IoBagCheckOutline size={16} className="text-indigo-500" />
                                    Kiện hàng ({order.orderDetails.length} sản phẩm)
                                </h3>

                                {order.orderDetails.map((item) => (
                                    <motion.div 
                                        key={item.id} 
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="group bg-white rounded-[32px] p-4 flex items-center gap-5 border border-transparent hover:border-indigo-100 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.06)] transition-all duration-300"
                                    >
                                        <div className="relative shrink-0 w-20 h-20 bg-gray-50 rounded-[24px] overflow-hidden border border-gray-100 shadow-inner">
                                            <img 
                                                src={item.imageUrl || "/placeholder.png"} 
                                                alt={item.productName} 
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <div className="absolute top-0 right-0 bg-gray-900/90 backdrop-blur-md text-white text-[10px] font-black px-2 py-1 rounded-bl-xl">
                                                x{item.quantity}
                                            </div>
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-gray-900 font-black text-base truncate mb-1 uppercase tracking-tight">
                                                {item.productName}
                                            </h4>
                                            <div className="flex items-center gap-2">
                                                <span className="bg-slate-100 text-slate-500 text-[9px] font-black px-2 py-0.5 rounded-lg uppercase tracking-widest border border-slate-200/50">
                                                    {item.variantName}
                                                </span>
                                                <span className="text-gray-200 text-xs">|</span>
                                                <span className="text-gray-400 text-[11px] font-bold">
                                                    Đơn giá: {formatCurrency(item.unitPrice)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="text-right shrink-0 pr-2">
                                            <div className="text-indigo-600 font-black text-lg tracking-tighter leading-none">
                                                {formatCurrency(item.totalLine)}
                                            </div>
                                            <div className="text-[9px] font-black text-gray-300 uppercase tracking-widest mt-1">
                                                T.Tiền
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* --- FOOTER / SUMMARY --- */}
                        <div className="bg-white px-8 py-8 sm:px-10 border-t border-gray-100 shrink-0">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                                
                                {/* Note Section */}
                                <div className="bg-gray-50/80 rounded-3xl p-5 border border-gray-100/50">
                                    <div className="flex items-center gap-2 mb-2">
                                        <IoWalletOutline className="text-gray-400" />
                                        <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Ghi chú đơn hàng</span>
                                    </div>
                                    <p className="text-xs text-gray-600 italic font-semibold leading-relaxed">
                                        {order.note || "Không có ghi chú bổ sung."}
                                    </p>
                                </div>

                                {/* Totals Section */}
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-[13px] font-bold">
                                        <span className="text-gray-400 uppercase tracking-tighter">Tạm tính:</span>
                                        <span className="text-gray-600">{formatCurrency(order.subTotal)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[13px] font-bold">
                                        <span className="text-gray-400 uppercase tracking-tighter">Vận chuyển:</span>
                                        <span className="text-gray-600">+{formatCurrency(order.shippingFee)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[13px] font-black text-rose-500">
                                        <span className="uppercase tracking-tighter">Khuyến mãi:</span>
                                        <span>-{formatCurrency(order.discountAmount)}</span>
                                    </div>
                                    <div className="pt-4 mt-2 border-t border-dashed border-gray-200 flex justify-between items-center">
                                        <div className="flex flex-col">
                                            <span className="text-gray-900 font-black text-xl leading-none">TỔNG CỘNG</span>
                                            <span className="text-[9px] font-black text-indigo-500 uppercase tracking-[0.2em] mt-1.5 flex items-center gap-1">
                                                <IoCardOutline /> Final Amount
                                            </span>
                                        </div>
                                        <span className="text-4xl font-black text-indigo-600 tracking-tighter drop-shadow-sm">
                                            {formatCurrency(order.totalAmount)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default OrderDetailDialog;