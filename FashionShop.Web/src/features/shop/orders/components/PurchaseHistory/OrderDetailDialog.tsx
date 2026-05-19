import { motion, AnimatePresence, type Variants } from "framer-motion";
import { IoCloseOutline } from "react-icons/io5";
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

    const Row = ({ label, value, prefix = "" }: any) => (
        <div className="flex justify-between text-zinc-500">
            <span>{label}</span>
            <span className="text-zinc-700 font-medium">
                {prefix}{formatCurrency(value)}
            </span>
        </div>
    );

    return (
        <AnimatePresence>
            {isOpen && order && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-sans">

                    {/* BACKDROP */}
                    <motion.div
                        className="absolute inset-0 bg-black/40 backdrop-blur-md"
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        onClick={onClose}
                    />

                    {/* MODAL */}
                    <motion.div
                        className="relative w-full max-w-4xl h-[88vh] overflow-hidden rounded-[28px] bg-white shadow-[0_40px_120px_rgba(0,0,0,0.25)] flex flex-col"
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

                                {/* HEADER */}
                                <div className="relative px-8 py-6 bg-gradient-to-b from-white to-zinc-50 border-b border-zinc-100">

                                    <div className="flex justify-between items-start">

                                        <div className="space-y-1">

                                            <div className="flex items-center gap-3">
                                                <span className="px-3 py-1 rounded-full bg-black text-white text-[10px] font-bold uppercase tracking-[0.2em]">
                                                    Order Detail
                                                </span>

                                                <span className="text-[11px] text-zinc-400 font-medium">
                                                    #{order.orderId.slice(0, 8).toUpperCase()}
                                                </span>
                                            </div>

                                            <h2 className="text-2xl font-semibold text-zinc-900 tracking-tight">
                                                {order.fullName}
                                            </h2>

                                        </div>

                                        <button
                                            onClick={onClose}
                                            className="w-10 h-10 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center transition"
                                        >
                                            <IoCloseOutline size={20} />
                                        </button>

                                    </div>

                                    {/* meta */}
                                    <div className="mt-5 flex flex-wrap gap-4 text-[12px] text-zinc-500">

                                        <span className="flex items-center gap-2">
                                            📞 {order.phoneNumber}
                                        </span>

                                        <span>
                                            🕒 {format(new Date(order.orderDate), "HH:mm, dd/MM/yyyy", { locale: vi })}
                                        </span>

                                        <span className="italic">
                                            <AddressString
                                                addressDetail={order.shippingAddress}
                                                communeCode={order.shippingCommune}
                                                districtCode={order.shippingDistrict}
                                                cityCode={order.shippingCity}
                                            />
                                        </span>

                                    </div>

                                </div>

                                {/* BODY */}
                                <div className="flex-1 overflow-y-auto bg-zinc-50 px-6 py-6 space-y-4">

                                    {order.orderItems.map((item, index) => (
                                        <motion.div
                                            key={item.orderItemId}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.03 }}
                                            className="group relative flex items-center gap-5 rounded-2xl bg-white p-4 shadow-sm border border-zinc-100 hover:shadow-md transition"
                                        >

                                            {/* IMAGE */}
                                            <div className="relative">
                                                <div className="w-16 h-16 rounded-xl overflow-hidden bg-zinc-100">
                                                    <img
                                                        src={item.imageUrl || "/placeholder.png"}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition"
                                                    />
                                                </div>

                                                <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-black text-white text-[10px] flex items-center justify-center border-2 border-white">
                                                    {item.quantity}
                                                </div>
                                            </div>

                                            {/* INFO */}
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-medium text-zinc-900 truncate">
                                                    {item.productName}
                                                </h4>

                                                <p className="text-[11px] text-zinc-400 mt-1">
                                                    {item.variantName}
                                                </p>
                                            </div>

                                            {/* PRICE */}
                                            <div className="text-right">
                                                <div className="text-sm font-semibold text-zinc-900">
                                                    {formatCurrency(item.totalLine)}
                                                </div>

                                                <div className="text-[10px] text-zinc-400">
                                                    {formatCurrency(item.unitPrice)}
                                                </div>
                                            </div>

                                        </motion.div>
                                    ))}

                                </div>

                                {/* FOOTER */}
                                <div className="border-t border-zinc-100 bg-white px-8 py-6">

                                    <div className="grid md:grid-cols-2 gap-6">

                                        {/* NOTE */}
                                        <div className="rounded-2xl bg-zinc-50 p-4 text-sm text-zinc-600">
                                            <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 mb-2">
                                                Note
                                            </div>
                                            {order.note || "Không có ghi chú"}
                                        </div>

                                        {/* TOTAL */}
                                        <div className="space-y-2 text-sm">

                                            <Row label="Subtotal" value={order.subTotal} />
                                            <Row label="Shipping" value={order.shippingFee} prefix="+" />
                                            <Row label="Discount" value={order.discountAmount} prefix="-" />

                                            <div className="flex justify-between pt-3 border-t border-zinc-200">
                                                <span className="text-sm font-semibold text-zinc-900">
                                                    Total
                                                </span>

                                                <span className="text-xl font-bold text-black">
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