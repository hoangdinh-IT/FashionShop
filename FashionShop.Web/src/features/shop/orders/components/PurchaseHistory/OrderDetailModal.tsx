import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    IoCallOutline, 
    IoCloseOutline, 
    IoLocationOutline, 
    IoQrCodeOutline, 
    IoTimeOutline 
} from "react-icons/io5";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

import type { OrderDetail } from "../../types/order";
import Loading from "../../../../../components/common/Loading";
import AddressString from "../../../addresses/components/AddressString";
import { useLockBodyScroll } from "../../../../../hooks/useLockBodyScroll";
import { BACKDROP_STYLES, backdropVariants, modalVariants } from "../../../../../utils/animation";

interface Props {
    order?: OrderDetail;
    isOpen: boolean;
    onClose: () => void;
    isLoading: boolean;
}

// Đưa hàm format currency ra ngoài để tránh khởi tạo lại khi re-render
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
};

const Row = ({ label, value, prefix = "" }: { label: string; value: number; prefix?: string }) => (
    <div className="flex justify-between items-center text-xs sm:text-sm text-zinc-500">
        <span>{label}</span>
        <span className="text-zinc-700 font-medium">
            {prefix}{formatCurrency(value)}
        </span>
    </div>
);

const OrderDetailModal: React.FC<Props> = ({ isOpen, onClose, order, isLoading }) => {
    useLockBodyScroll(isOpen);

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.src = "/placeholder.png";
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 font-sans select-none">
                    {/* BACKDROP */}
                    <motion.div
                        className={BACKDROP_STYLES}
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        onClick={onClose}
                    />

                    {/* MODAL */}
                    <motion.div
                        className="relative w-full max-w-4xl h-[92vh] sm:h-[85vh] md:h-[88vh] overflow-hidden rounded-t-[24px] sm:rounded-[28px] bg-white shadow-[0_40px_120px_rgba(0,0,0,0.25)] flex flex-col z-10"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {isLoading ? (
                            <Loading message="Đang tải dữ liệu đơn hàng..." />
                        ) : order ? (
                            <>
                                {/* HEADER */}
                                <div className="relative px-4 py-5 sm:px-6 sm:py-6 md:px-8 bg-gradient-to-b from-white to-zinc-50 border-b border-zinc-100 shrink-0">
                                    <div className="flex justify-between items-start gap-3">
                                        <div className="space-y-1.5 flex-1 min-w-0">
                                            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                                                <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-black text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.12em] sm:tracking-[0.15em]">
                                                    Chi tiết đơn hàng
                                                </span>

                                                <span className="text-[10px] sm:text-[11px] text-zinc-400 font-medium">
                                                    #{order.orderId.slice(0, 8).toUpperCase()}
                                                </span>

                                                {order.transferCode && (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] sm:text-[11px] font-bold tracking-tight">
                                                        <IoQrCodeOutline className="text-indigo-500" size={12} />
                                                        <span className="font-mono">{order.transferCode}</span>
                                                    </span>
                                                )}
                                            </div>

                                            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-zinc-900 tracking-tight truncate">
                                                {order.fullName}
                                            </h2>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={onClose}
                                            aria-label="Đóng modal"
                                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center transition cursor-pointer shrink-0"
                                        >
                                            <IoCloseOutline className="text-lg sm:text-xl" />
                                        </button>
                                    </div>

                                    {/* META INFO */}
                                    <div className="mt-3 sm:mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[11px] sm:text-[12px] text-zinc-500">
                                        <span className="flex items-center gap-1.5 shrink-0">
                                            <IoCallOutline className="text-[14px] sm:text-[15px] text-zinc-400" />
                                            {order.phoneNumber}
                                        </span>

                                        <span className="flex items-center gap-1.5 shrink-0">
                                            <IoTimeOutline className="text-[14px] sm:text-[15px] text-zinc-400" />
                                            {format(new Date(order.orderDate), "HH:mm, dd/MM/yyyy", { locale: vi })}
                                        </span>

                                        <span className="flex items-center gap-1.5 italic min-w-0 max-w-full">
                                            <IoLocationOutline className="shrink-0 text-[14px] sm:text-[15px] text-zinc-400" />
                                            <span className="truncate">
                                                <AddressString
                                                    addressDetail={order.shippingAddress}
                                                    communeCode={order.shippingCommune}
                                                    districtCode={order.shippingDistrict}
                                                    cityCode={order.shippingCity}
                                                />
                                            </span>
                                        </span>
                                    </div>
                                </div>

                                {/* BODY */}
                                <div className="flex-1 overflow-y-auto bg-zinc-50 p-4 sm:p-6 space-y-3 sm:space-y-4">
                                    {order.orderItems.map((item, index) => (
                                        <motion.div
                                            key={item.orderItemId}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.03 }}
                                            className="group relative flex items-center gap-3 sm:gap-5 rounded-xl sm:rounded-2xl bg-white p-3 sm:p-4 shadow-sm border border-zinc-100 hover:shadow-md transition"
                                        >
                                            {/* IMAGE */}
                                            <div className="relative shrink-0">
                                                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl overflow-hidden bg-zinc-100">
                                                    <img
                                                        src={item.imageUrl || "/placeholder.png"}
                                                        alt={item.productName}
                                                        onError={handleImageError}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition"
                                                    />
                                                </div>

                                                <div className="absolute -bottom-1.5 -right-1.5 sm:-bottom-2 sm:-right-2 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-black text-white text-[9px] sm:text-[10px] flex items-center justify-center border-2 border-white font-semibold">
                                                    {item.quantity}
                                                </div>
                                            </div>

                                            {/* INFO */}
                                            <div className="flex-1 min-w-0 pr-1">
                                                <h4 className="text-xs sm:text-sm font-medium text-zinc-900 line-clamp-2 sm:truncate">
                                                    {item.productName}
                                                </h4>
                                                <p className="text-[10px] sm:text-[11px] text-zinc-400 mt-0.5 sm:mt-1 truncate">
                                                    {item.variantName}
                                                </p>
                                            </div>

                                            {/* PRICE */}
                                            <div className="text-right shrink-0">
                                                <div className="text-xs sm:text-sm font-semibold text-zinc-900">
                                                    {formatCurrency(item.totalLine)}
                                                </div>
                                                <div className="text-[9px] sm:text-[10px] text-zinc-400">
                                                    {formatCurrency(item.unitPrice)}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* FOOTER */}
                                <div className="border-t border-zinc-100 bg-white px-4 py-4 sm:px-6 sm:py-5 md:px-8 md:py-6 shrink-0">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                        {/* TOTAL SUMMARY (Đưa lên đầu trên Mobile để dễ nhìn) */}
                                        <div className="space-y-2 text-xs sm:text-sm order-1 md:order-2">
                                            <Row label="Tiền hàng" value={order.subTotal} />
                                            <Row label="Phí vận chuyển" value={order.shippingFee} prefix="+" />
                                            {order.discountAmount > 0 && (
                                                <Row label="Giảm giá" value={order.discountAmount} prefix="-" />
                                            )}

                                            <div className="flex justify-between items-center pt-2.5 sm:pt-3 border-t border-zinc-200 mt-2">
                                                <span className="text-xs sm:text-sm font-semibold text-zinc-900">
                                                    Tổng cộng
                                                </span>
                                                <span className="text-lg sm:text-xl font-bold text-black">
                                                    {formatCurrency(order.totalAmount)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* NOTES & TRANSFER CODE */}
                                        <div className="space-y-2.5 sm:space-y-3 order-2 md:order-1">
                                            {/* MÃ CHUYỂN KHOẢN */}
                                            {order.transferCode && (
                                                <div className="rounded-xl sm:rounded-2xl bg-indigo-50/60 border border-indigo-100 p-3 sm:p-4 text-xs sm:text-sm text-indigo-950">
                                                    <div className="text-[9px] sm:text-[10px] uppercase tracking-[0.12em] sm:tracking-[0.15em] text-indigo-500 mb-0.5 sm:mb-1 font-bold flex items-center gap-1.5">
                                                        <IoQrCodeOutline size={13} />
                                                        Mã chuyển khoản
                                                    </div>
                                                    <div className="font-mono font-bold text-sm sm:text-base text-indigo-700 tracking-wide">
                                                        {order.transferCode}
                                                    </div>
                                                </div>
                                            )}

                                            {/* GHI CHÚ */}
                                            <div className="rounded-xl sm:rounded-2xl bg-zinc-50 p-3 sm:p-4 text-xs sm:text-sm text-zinc-600">
                                                <div className="text-[9px] sm:text-[10px] uppercase tracking-[0.12em] sm:tracking-[0.15em] text-zinc-400 mb-1 font-bold">
                                                    Ghi chú
                                                </div>
                                                <p className="break-words">
                                                    {order.note || "Không có ghi chú"}
                                                </p>
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

export default OrderDetailModal;