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
import AddressString from "../../../shop/addresses/components/AddressString";
import type { OrderDetail } from "../types/order";

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

// Hiệu ứng 3 dấu chấm cho Loading
const dotVariants: Variants = {
    animate: (i: number) => ({
        y: [0, -10, 0],
        transition: {
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut"
        }
    })
};

interface Props {
    isOpen: boolean;
    onClose: () => void;
    order?: OrderDetail;
    isLoading: boolean;
}

const OrderDetailDialog: React.FC<Props> = ({ isOpen, onClose, order, isLoading }) => {
    
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
                        className="relative w-full max-w-4xl bg-[#F8F9FB] rounded-[40px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col h-[92vh]" // Đổi max-h thành h để giữ form
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {isLoading ? (
                            <div className="flex-1 flex flex-col items-center justify-center bg-white">
                                <div className="flex gap-2">
                                    {[0, 1, 2].map((i) => (
                                        <motion.div
                                            key={i}
                                            custom={i}
                                            variants={dotVariants}
                                            animate="animate"
                                            className="w-3 h-3 bg-indigo-500 rounded-full"
                                        />
                                    ))}
                                </div>
                                <p className="mt-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] animate-pulse">
                                    Đang tải dữ liệu đơn hàng...
                                </p>
                            </div>
                        ) : order ? (
                            <>
                                {/* --- HEADER --- */}
                                <div className="relative bg-white px-8 py-7 sm:px-10 border-b border-gray-100 shrink-0">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="bg-indigo-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                                                    Chi tiết vận đơn
                                                </span>
                                                <span className="text-gray-400 font-bold text-sm tracking-tight">
                                                    #{order.orderId.slice(0, 8).toUpperCase()}
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
                                <div className="flex-1 overflow-y-auto bg-[#f6f8fc] custom-scrollbar">
                                    <div className="px-6 sm:px-8 py-7">

                                        {/* Product List */}
                                        <div className="space-y-4">
                                            {order.orderItems.map((item, index) => (
                                                <motion.div
                                                    key={item.orderItemId}
                                                    initial={{ opacity: 0, y: 16 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.04 }}
                                                    whileHover={{ y: -2 }}
                                                    className="relative overflow-hidden rounded-[28px] bg-white border border-slate-200/60 p-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)] transition-all duration-300 hover:shadow-[0_20px_50px_rgba(15,23,42,0.08)]"
                                                >
                                                    {/* glow effect */}
                                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/0 via-indigo-50/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />

                                                    <div className="relative flex items-center gap-5">
                                                        
                                                        {/* Product Image */}
                                                        <div className="relative shrink-0">
                                                            <div className="w-24 h-24 rounded-[22px] overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50 border border-slate-200">
                                                                <img
                                                                    src={item.imageUrl || "/placeholder.png"}
                                                                    alt={item.productName}
                                                                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                                                />
                                                            </div>

                                                            {/* Quantity */}
                                                            <div className="absolute -bottom-2 -right-2 min-w-[30px] h-[30px] px-2 rounded-full bg-slate-900 text-white text-xs font-semibold flex items-center justify-center shadow-lg border-4 border-white">
                                                                {item.quantity}
                                                            </div>
                                                        </div>

                                                        {/* Info */}
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="text-[16px] font-semibold text-slate-900 truncate">
                                                                {item.productName}
                                                            </h4>

                                                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                                                                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
                                                                    {item.variantName}
                                                                </span>

                                                                <span className="text-slate-300">
                                                                    •
                                                                </span>

                                                                <span className="text-sm text-slate-400">
                                                                    {formatCurrency(item.unitPrice)} / sản phẩm
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Price */}
                                                        <div className="text-right shrink-0">
                                                            <div className="text-[20px] font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                                                                {formatCurrency(item.totalLine)}
                                                            </div>

                                                            <div className="text-[11px] text-slate-400 mt-1 font-medium">
                                                                Thành tiền
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
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
                                            <div className="flex justify-between items-center text-[13px] font-bold">
                                                <span className="text-gray-400 uppercase tracking-tighter">Khuyến mãi:</span>
                                                <span className="text-gray-600">-{formatCurrency(order.discountAmount)}</span>
                                            </div>
                                            <div className="pt-4 mt-2 border-t border-dashed border-gray-200 flex justify-between items-center">
                                                <div className="flex flex-col">
                                                    <span className="text-gray-900 font-black text-xl leading-none">TỔNG CỘNG</span>
                                                    <span className="text-[9px] font-black text-indigo-500 uppercase tracking-[0.2em] mt-1.5 flex items-center gap-1">
                                                        <IoCardOutline /> Final Amount
                                                    </span>
                                                </div>
                                                <span className="text-4xl font-black bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent tracking-tighter drop-shadow-sm">
                                                    {formatCurrency(order.totalAmount)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : null}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default OrderDetailDialog;