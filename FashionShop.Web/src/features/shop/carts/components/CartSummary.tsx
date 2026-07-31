import React from 'react';
import { ArrowRight, ShieldCheck, Truck, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, type Variants } from 'framer-motion';

interface Props {
    total: number;
}

// Cấu hình Easing cao cấp (Editorial / Luxury Design System)
const customEase = [0.16, 1, 0.3, 1] as const;

// Variants cho thanh thông báo Freeship & Giá tiền
const fadeScaleVariants: Variants = {
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
            duration: 0.4,
            ease: customEase,
        },
    },
    exit: {
        opacity: 0,
        scale: 0.97,
        filter: "blur(4px)",
        transition: {
            duration: 0.2,
            ease: customEase,
        },
    },
};

const CartSummary: React.FC<Props> = ({ total }) => {
    const navigate = useNavigate();
    const freeShippingThreshold = 500000;
    const shippingFee = 30000;

    // Đơn hàng đủ điều kiện freeship nếu tổng tiền >= 500.000đ
    const isFreeShipping = total >= freeShippingThreshold;

    // Phí ship thực tế: Nếu total = 0 hoặc đủ freeship thì = 0, ngược lại = 30.000đ
    const actualShippingFee = total > 0 && !isFreeShipping ? shippingFee : 0;

    // Tổng thành tiền đã bao gồm phí ship
    const finalTotal = total + actualShippingFee;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98, filter: "blur(4px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.5, ease: customEase }}
            className="w-full rounded-2xl sm:rounded-3xl border border-neutral-200/80 bg-white p-4 sm:p-6 md:p-8 shadow-sm font-sans space-y-5 sm:space-y-6 lg:sticky lg:top-6"
        >

            {/* HEADER */}
            <div className="pb-3.5 sm:pb-4 border-b border-neutral-100 flex justify-between items-end gap-2">
                <div>
                    <span className="text-[9px] sm:text-[10px] uppercase font-mono tracking-widest text-neutral-400 block">
                        Order Summary
                    </span>
                    <h2 className="text-base sm:text-lg font-bold text-neutral-900 mt-0.5">
                        Tóm tắt đơn hàng
                    </h2>
                </div>
                <span className="text-[11px] sm:text-xs text-neutral-400 font-medium shrink-0">
                    Tạm tính
                </span>
            </div>

            {/* BẢNG TÍNH GIÁ */}
            <div className="space-y-3 sm:space-y-3.5 text-xs font-medium">
                <div className="flex justify-between items-center text-neutral-600">
                    <span className="text-xs sm:text-sm">Tổng tiền hàng</span>
                    <motion.span
                        key={total}
                        variants={fadeScaleVariants}
                        initial="hidden"
                        animate="visible"
                        className="font-mono text-xs sm:text-sm font-semibold text-neutral-900 inline-block"
                    >
                        {total.toLocaleString('vi-VN')}đ
                    </motion.span>
                </div>

                <div className="flex justify-between items-center text-neutral-600">
                    <span className="flex items-center gap-1.5 text-xs sm:text-sm">
                        <Truck size={14} className="text-neutral-400 shrink-0" />
                        Phí vận chuyển
                    </span>
                    <div className="font-mono text-xs sm:text-sm text-neutral-500 overflow-hidden">
                        <AnimatePresence mode="wait">
                            {total === 0 ? (
                                <motion.span
                                    key="shipping-zero"
                                    variants={fadeScaleVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    className="text-neutral-400 block"
                                >
                                    0đ
                                </motion.span>
                            ) : isFreeShipping ? (
                                <motion.span
                                    key="shipping-free"
                                    variants={fadeScaleVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    className="text-emerald-600 font-semibold uppercase text-[10px] sm:text-[11px] block"
                                >
                                    Miễn phí
                                </motion.span>
                            ) : (
                                <motion.span
                                    key="shipping-fee"
                                    variants={fadeScaleVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    className="text-neutral-900 font-semibold block"
                                >
                                    {shippingFee.toLocaleString('vi-VN')}đ
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* THANH THÔNG BÁO FREESHIP */}
                <div className="pt-1 sm:pt-2">
                    <AnimatePresence mode="wait">
                        {total === 0 ? (
                            <motion.div
                                key="notice-empty"
                                variants={fadeScaleVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="p-2 sm:p-2.5 rounded-xl bg-neutral-50 border border-neutral-100 text-[10px] sm:text-[11px] text-neutral-400 text-center"
                            >
                                Vui lòng chọn sản phẩm để thanh toán
                            </motion.div>
                        ) : isFreeShipping ? (
                            <motion.div
                                key="notice-free"
                                variants={fadeScaleVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="p-2 sm:p-2.5 rounded-xl bg-emerald-50 border border-emerald-100 text-[10px] sm:text-[11px] text-emerald-700 flex items-center gap-1.5 justify-center leading-tight"
                            >
                                <Tag size={13} className="shrink-0" />
                                <span>Đơn hàng của bạn đủ điều kiện <strong>Freeship</strong>!</span>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="notice-need-more"
                                variants={fadeScaleVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="p-2 sm:p-2.5 rounded-xl bg-neutral-50 border border-neutral-100 text-[10px] sm:text-[11px] text-neutral-500 text-center leading-tight"
                            >
                                Mua thêm <strong className="text-neutral-900 font-mono">{(freeShippingThreshold - total).toLocaleString('vi-VN')}đ</strong> để được Freeship
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* TỔNG TIỀN (TOTAL INCLUDING SHIPPING) */}
            <div className="pt-3.5 sm:pt-4 border-t border-neutral-100 space-y-1">
                <div className="flex items-baseline justify-between gap-2">
                    <div>
                        <span className="text-[11px] sm:text-xs uppercase tracking-wider font-bold text-neutral-400 block">
                            Thành tiền
                        </span>
                        <p className="text-[9px] sm:text-[10px] text-neutral-400 font-normal leading-tight mt-0.5">
                            (Đã bao gồm phí vận chuyển & VAT)
                        </p>
                    </div>

                    <div className="text-right shrink-0">
                        <motion.span
                            key={finalTotal}
                            variants={fadeScaleVariants}
                            initial="hidden"
                            animate="visible"
                            className="text-xl sm:text-2xl font-black tracking-tight text-neutral-900 font-mono inline-block"
                        >
                            {finalTotal.toLocaleString('vi-VN')}
                            <span className="text-xs sm:text-sm font-normal text-neutral-500 ml-0.5">đ</span>
                        </motion.span>
                    </div>
                </div>
            </div>

            {/* BUTTON ĐẶT HÀNG */}
            <motion.button
                whileTap={total > 0 ? { scale: 0.98 } : {}}
                disabled={total === 0}
                onClick={() => navigate("/shop/order")}
                className={`group relative w-full h-11 sm:h-12 rounded-xl sm:rounded-2xl text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-xs ${total === 0
                        ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                        : 'bg-neutral-900 text-white hover:bg-black active:bg-neutral-800'
                    }`}
            >
                <span>Thanh toán ngay</span>
                <ArrowRight
                    size={16}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                />
            </motion.button>

            {/* FOOTER CAM KẾT */}
            <div className="pt-1 sm:pt-2 flex items-center justify-center gap-1.5 text-[10px] sm:text-[11px] text-neutral-400 font-medium">
                <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
                <span>Bảo mật thanh toán 100%</span>
            </div>

        </motion.div>
    );
};

export default CartSummary;