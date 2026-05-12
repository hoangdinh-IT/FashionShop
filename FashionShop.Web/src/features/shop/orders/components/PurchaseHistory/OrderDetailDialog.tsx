import { motion, AnimatePresence, type Variants } from "framer-motion";
import { IoCloseOutline, IoLocationOutline, IoWalletOutline, IoTimeOutline, IoCardOutline, IoCallOutline } from "react-icons/io5";
import type { OrderDetail } from "../../types/order";
import React from "react";
import Loading from "../../../../../components/common/Loading";
import AddressString from "../../../addresses/components/AddressString";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

// --- ANIMATION VARIANTS (Đồng bộ với Voucher) --- //
const backdropVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
};

const modalVariants: Variants = {
    hidden: { opacity: 0, y: 24, scale: 0.96 },
    visible: { 
        opacity: 1, y: 0, scale: 1, 
        transition: { type: "spring", stiffness: 300, damping: 28 } 
    },
    exit: { 
        opacity: 0, y: 16, scale: 0.96, 
        transition: { duration: 0.2, ease: "easeIn" } 
    }
};

interface Props {
    order?: OrderDetail;
    isOpen: boolean;
    onClose: () => void;
    isLoading: boolean;
}

const OrderDetailDialog: React.FC<Props> = ({ isOpen, onClose, order, isLoading }) => {
    
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    return (
        <AnimatePresence>
            {isOpen && order && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 font-sans">
                    
                    {/* 1. BACKDROP */}
                    <motion.div
                        className="absolute inset-0 bg-slate-900/55 backdrop-blur-sm"
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        onClick={onClose}
                    />

                    {/* 2. MODAL CONTENT */}
                    <motion.div
                        className="relative w-full max-w-3xl bg-[#F8F9FB] rounded-[32px] shadow-[0_24px_48px_-14px_rgba(0,0,0,0.28)] overflow-hidden flex flex-col h-[88vh]"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {isLoading ? (
                            <Loading message="Đang tải dữ liệu đơn hàng" />
                        ) : order ? (
                            <>
                                {/* --- HEADER --- */}
                                <div className="relative bg-white px-6 py-5 sm:px-8 border-b border-gray-100 shrink-0">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="flex items-center gap-2.5 mb-1.5">
                                                <span className="bg-indigo-600 text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-[0.18em]">
                                                    Chi tiết vận đơn
                                                </span>
                                                <span className="text-gray-400 font-bold text-xs tracking-tight">
                                                    #{order.orderId.slice(0, 8).toUpperCase()}
                                                </span>
                                            </div>

                                            <h2 className="text-[26px] font-black text-gray-900 tracking-tight leading-none">
                                                {order.fullName}
                                            </h2>
                                        </div>

                                        <button 
                                            onClick={onClose}
                                            className="p-2.5 bg-gray-50 hover:bg-rose-50 text-gray-400 hover:text-rose-500 rounded-xl transition-all duration-300 active:scale-90"
                                        >
                                            <IoCloseOutline size={24} />
                                        </button>
                                    </div>

                                    {/* Quick Info */}
                                    <div className="flex flex-wrap gap-x-6 gap-y-3 mt-5">
                                        <div className="flex items-center gap-2 text-gray-600 font-bold text-[13px]">
                                            <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100/50">
                                                <IoCallOutline size={14} />
                                            </div>
                                            {order.phoneNumber}
                                        </div>

                                        <div className="flex items-center gap-2 text-gray-600 font-bold text-[13px]">
                                            <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 shadow-sm border border-amber-100/50">
                                                <IoTimeOutline size={14} />
                                            </div>
                                            {format(new Date(order.orderDate), "HH:mm, dd/MM/yyyy", { locale: vi })}
                                        </div>

                                        <div className="w-full flex items-center gap-2 text-gray-600 font-bold text-[13px]">
                                            <div className="shrink-0 w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100/50">
                                                <IoLocationOutline size={14} />
                                            </div>

                                            <div className="line-clamp-1 italic text-gray-500 font-medium text-[12px]">
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

                                {/* --- BODY --- */}
                                <div className="flex-1 overflow-y-auto bg-[#f6f8fc] custom-scrollbar">
                                    <div className="px-5 sm:px-6 py-5">

                                        <div className="space-y-3">
                                            {order.orderItems.map((item, index) => (
                                                <motion.div
                                                    key={item.orderItemId}
                                                    initial={{ opacity: 0, y: 12 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.035 }}
                                                    whileHover={{ y: -1.5 }}
                                                    className="relative overflow-hidden rounded-[22px] bg-white border border-slate-200/60 p-3.5 shadow-[0_8px_24px_rgba(15,23,42,0.04)] transition-all duration-300 hover:shadow-[0_14px_36px_rgba(15,23,42,0.07)]"
                                                >
                                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/0 via-indigo-50/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />

                                                    <div className="relative flex items-center gap-4">
                                                        
                                                        {/* Product Image */}
                                                        <div className="relative shrink-0">
                                                            <div className="w-20 h-20 rounded-[18px] overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50 border border-slate-200">
                                                                <img
                                                                    src={item.imageUrl || "/placeholder.png"}
                                                                    alt={item.productName}
                                                                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                                                />
                                                            </div>

                                                            {/* Quantity */}
                                                            <div className="absolute -bottom-1.5 -right-1.5 min-w-[26px] h-[26px] px-2 rounded-full bg-slate-900 text-white text-[11px] font-semibold flex items-center justify-center shadow-lg border-[3px] border-white">
                                                                {item.quantity}
                                                            </div>
                                                        </div>

                                                        {/* Info */}
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="text-[14px] font-semibold text-slate-900 truncate">
                                                                {item.productName}
                                                            </h4>

                                                            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                                                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-medium">
                                                                    {item.variantName}
                                                                </span>

                                                                <span className="text-slate-300 text-xs">
                                                                    •
                                                                </span>

                                                                <span className="text-[12px] text-slate-400">
                                                                    {formatCurrency(item.unitPrice)} / sản phẩm
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Price */}
                                                        <div className="text-right shrink-0">
                                                            <div className="text-[17px] font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                                                                {formatCurrency(item.totalLine)}
                                                            </div>

                                                            <div className="text-[10px] text-slate-400 mt-1 font-medium">
                                                                Thành tiền
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* --- FOOTER --- */}
                                <div className="bg-white px-6 py-6 sm:px-8 border-t border-gray-100 shrink-0">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                                        
                                        {/* Note */}
                                        <div className="bg-gray-50/80 rounded-2xl p-4 border border-gray-100/50">
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <IoWalletOutline className="text-gray-400 text-sm" />
                                                <span className="text-[9px] font-black uppercase text-gray-400 tracking-[0.16em]">
                                                    Ghi chú đơn hàng
                                                </span>
                                            </div>

                                            <p className="text-[11px] text-gray-600 italic font-semibold leading-relaxed">
                                                {order.note || "Không có ghi chú bổ sung."}
                                            </p>
                                        </div>

                                        {/* Totals */}
                                        <div className="space-y-2.5">
                                            <div className="flex justify-between items-center text-[12px] font-bold">
                                                <span className="text-gray-400 uppercase tracking-tight">Tạm tính:</span>
                                                <span className="text-gray-600">{formatCurrency(order.subTotal)}</span>
                                            </div>

                                            <div className="flex justify-between items-center text-[12px] font-bold">
                                                <span className="text-gray-400 uppercase tracking-tight">Vận chuyển:</span>
                                                <span className="text-gray-600">+{formatCurrency(order.shippingFee)}</span>
                                            </div>

                                            <div className="flex justify-between items-center text-[12px] font-bold">
                                                <span className="text-gray-400 uppercase tracking-tight">Khuyến mãi:</span>
                                                <span className="text-gray-600">-{formatCurrency(order.discountAmount)}</span>
                                            </div>

                                            <div className="pt-3 mt-1 border-t border-dashed border-gray-200 flex justify-between items-center">
                                                <div className="flex flex-col">
                                                    <span className="text-gray-900 font-black text-lg leading-none">
                                                        TỔNG CỘNG
                                                    </span>

                                                    <span className="text-[8px] font-black text-indigo-500 uppercase tracking-[0.18em] mt-1 flex items-center gap-1">
                                                        <IoCardOutline /> Final Amount
                                                    </span>
                                                </div>

                                                <span className="text-[32px] font-black bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent tracking-tight drop-shadow-sm">
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

export default OrderDetailDialog