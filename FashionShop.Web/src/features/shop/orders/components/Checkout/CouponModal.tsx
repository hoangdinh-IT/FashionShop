import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, AlertCircle, Check, Tag, Users } from 'lucide-react';
import { DiscountType, type Coupon } from '../../../coupons/types/coupon';
import { useSnackbar } from '../../../../../contexts';
import { useLockBodyScroll } from '../../../../../hooks/useLockBodyScroll';
import { BACKDROP_STYLES, backdropVariants, modalVariants } from '../../../../../utils/animation';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    Coupons: Coupon[];
    selectedCoupon: Coupon | null;
    onSelectCoupon: (Coupon: Coupon | null) => void;
    subTotal: number;
}

export const CouponModal: React.FC<Props> = ({
    isOpen,
    onClose,
    Coupons = [],
    selectedCoupon,
    onSelectCoupon,
    subTotal,
}) => {
    useLockBodyScroll(isOpen);

    const { showSnackbar } = useSnackbar();
    const [manualCode, setManualCode] = useState('');

    // State lưu Coupon đang chọn tạm thời trong Modal
    const [tempSelectedCoupon, setTempSelectedCoupon] = useState<Coupon | null>(selectedCoupon);

    // Đồng bộ lại tempSelectedCoupon mỗi khi Modal được mở ra
    useEffect(() => {
        if (isOpen) {
            setTempSelectedCoupon(selectedCoupon);
            setManualCode('');
        }
    }, [isOpen, selectedCoupon]);

    const formatCurrency = (amount: number) => amount.toLocaleString('vi-VN') + 'đ';

    const formatDate = (dateString: string) => {
        const d = new Date(dateString);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();

        return `${day}/${month}/${year}`;
    };

    const handleApplyManualCode = () => {
        if (!manualCode.trim()) return;
        const found = Coupons.find(v => v.code.toUpperCase() === manualCode.trim().toUpperCase());
        if (found) {
            const isOutOfStock = found.quantity > 0 && found.usedCount >= found.quantity;
            if (isOutOfStock) {
                showSnackbar("Mã giảm giá đã hết lượt sử dụng!", "error");
                return;
            }

            if (subTotal >= found.minOrderValue) {
                // Chỉ chọn tạm thời
                setTempSelectedCoupon(found);
                setManualCode('');
            } else {
                showSnackbar(`Đơn hàng chưa đủ giá trị tối thiểu ${formatCurrency(found.minOrderValue)}`, "warning");
            }
        } else {
            showSnackbar("Mã giảm giá không tồn tại hoặc đã hết hạn!", "error");
        }
    };

    // Hàm xử lý khi bấm nút "Xác nhận"
    const handleConfirm = () => {
        onSelectCoupon(tempSelectedCoupon);
        onClose();
    };

    const modalContent = (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center p-3 sm:p-4 md:p-6 font-sans select-none overflow-hidden">
                    {/* BACKDROP */}
                    <motion.div 
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className={BACKDROP_STYLES}
                        onClick={onClose}
                    />

                    {/* MODAL CONTAINER */}
                    <motion.div 
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="relative w-full max-w-[480px] bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-neutral-100 overflow-hidden z-10 flex flex-col max-h-[90vh] sm:max-h-[85vh]"
                    >
                        {/* HEADER */}
                        <div className="flex items-center justify-between border-b border-neutral-100 px-4 sm:px-6 py-3.5 sm:py-4 bg-white shrink-0">
                            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                                <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl sm:rounded-2xl bg-neutral-100 text-neutral-900 shrink-0">
                                    <Tag className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.2} />
                                </div>
                                <div className="min-w-0">
                                    <h2 className="text-base sm:text-lg font-bold text-neutral-900 tracking-tight leading-tight truncate">Mã ưu đãi</h2>
                                    <p className="text-[11px] sm:text-xs text-neutral-400 font-medium truncate">Chọn hoặc nhập mã giảm giá</p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={onClose}
                                className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 transition-colors hover:bg-neutral-200 hover:text-neutral-900 active:scale-95 cursor-pointer shrink-0 ml-2"
                            >
                                <X className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                        </div>

                        {/* INPUT MÃ THỦ CÔNG */}
                        <div className="px-4 sm:px-6 pt-3.5 sm:pt-4 pb-2 sm:pb-3 shrink-0 bg-white">
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    value={manualCode}
                                    onChange={(e) => setManualCode(e.target.value)}
                                    placeholder="MÃ GIẢM GIÁ"
                                    className="flex-1 h-10 sm:h-11 px-3.5 sm:px-4 text-xs font-bold uppercase tracking-wider bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-neutral-900 focus:bg-white transition-all placeholder:font-normal placeholder:normal-case placeholder:text-neutral-400 min-w-0"
                                />
                                <button 
                                    type="button"
                                    onClick={handleApplyManualCode}
                                    className="h-10 sm:h-11 px-3.5 sm:px-5 bg-neutral-900 text-white text-xs font-semibold rounded-xl hover:bg-neutral-800 transition-all active:scale-95 cursor-pointer shrink-0"
                                >
                                    Áp dụng
                                </button>
                            </div>
                        </div>

                        {/* DANH SÁCH Coupon */}
                        <div className="px-4 sm:px-6 py-2 sm:py-3 space-y-2.5 sm:space-y-3 overflow-y-auto flex-1 scrollbar-thin">
                            {Coupons.length === 0 ? (
                                <div className="text-center py-10 sm:py-12">
                                    <p className="text-xs font-medium text-neutral-400">Hiện không có mã ưu đãi nào sẵn có.</p>
                                </div>
                            ) : (
                                Coupons.map((Coupon) => {
                                    const isOutOfStock = Coupon.quantity > 0 && Coupon.usedCount >= Coupon.quantity;
                                    const isEligible = subTotal >= Coupon.minOrderValue && !isOutOfStock;
                                    
                                    // Kiểm tra Coupon theo trạng thái tạm thời (tempSelectedCoupon)
                                    const isSelected = tempSelectedCoupon?.id === Coupon.id;

                                    return (
                                        <motion.div 
                                            key={Coupon.id}
                                            whileTap={isEligible ? { scale: 0.985 } : undefined}
                                            onClick={() => {
                                                if (isEligible) {
                                                    // Chọn / Bỏ chọn tạm thời
                                                    setTempSelectedCoupon(isSelected ? null : Coupon);
                                                }
                                            }}
                                            className={`relative flex rounded-xl sm:rounded-2xl border bg-white transition-all duration-300 overflow-hidden ${
                                                !isEligible 
                                                    ? 'border-neutral-200 bg-neutral-50/50 opacity-60 cursor-not-allowed' 
                                                    : isSelected 
                                                        ? 'border-neutral-900 shadow-md ring-1 ring-neutral-900 cursor-pointer' 
                                                        : 'border-neutral-200 hover:border-neutral-300 hover:shadow-sm cursor-pointer'
                                            }`}
                                        >
                                            {/* TAG GIỚI HẠN LƯỢT DÙNG MỖI NGƯỜI (GÓC TRÊN BÊN TRÁI) */}
                                            {Coupon.remainingUsagePerUser > 0 && (
                                                <div className={`absolute top-0 left-0 z-10 px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-[11px] font-black rounded-br-lg sm:rounded-br-xl transition-colors ${
                                                    !isEligible 
                                                        ? 'bg-neutral-200 text-neutral-500' 
                                                        : isSelected 
                                                            ? 'bg-neutral-900 text-white' 
                                                            : 'bg-neutral-200/80 text-neutral-700'
                                                }`}>
                                                    x{Coupon.remainingUsagePerUser}
                                                </div>
                                            )}

                                            {/* LEFT TICKET BADGE (MÃ Coupon & GIẢM GIÁ) */}
                                            <div className="w-24 sm:w-28 shrink-0 flex flex-col items-center justify-center p-2 sm:p-3 border-r border-dashed border-neutral-200 bg-neutral-50 relative pt-4 sm:pt-5">
                                                <span 
                                                    title={Coupon.code}
                                                    className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-neutral-800 text-center leading-tight break-all max-w-full line-clamp-2"
                                                >
                                                    {Coupon.code}
                                                </span>
                                                <span className="text-[11px] sm:text-xs font-extrabold mt-1 text-emerald-600 text-center leading-tight break-all">
                                                    {Coupon.discountType === DiscountType.Percentage 
                                                        ? `-${Coupon.discountAmount}%` 
                                                        : `-${formatCurrency(Coupon.discountAmount)}`}
                                                </span>
                                            </div>

                                            {/* RIGHT MAIN CONTENT (TÊN & THÔNG TIN CHI TIẾT) */}
                                            <div className="flex-1 p-2.5 sm:p-3.5 flex flex-col justify-between min-w-0">
                                                <div>
                                                    <div className="flex items-start justify-between gap-1.5 sm:gap-2">
                                                        <h3 
                                                            title={Coupon.name}
                                                            className="text-xs font-bold text-neutral-900 leading-snug line-clamp-2 break-words flex-1 min-w-0"
                                                        >
                                                            {Coupon.name}
                                                        </h3>
                                                        
                                                        {/* NÚT TRÒN ĐEN / TICK CHECKMARK */}
                                                        <motion.button
                                                            type="button"
                                                            disabled={!isEligible}
                                                            animate={{ scale: isSelected ? [0.85, 1.15, 1] : 1 }}
                                                            transition={{ duration: 0.2 }}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                if (isEligible) {
                                                                    setTempSelectedCoupon(isSelected ? null : Coupon);
                                                                }
                                                            }}
                                                            className={`shrink-0 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full border transition-all duration-300 mt-0.5 ${
                                                                !isEligible
                                                                    ? 'border-neutral-300 bg-neutral-100 text-transparent cursor-not-allowed'
                                                                    : isSelected
                                                                        ? 'border-neutral-900 bg-neutral-900 text-white shadow-sm'
                                                                        : 'border-neutral-300 bg-white text-transparent hover:border-neutral-400'
                                                            }`}
                                                        >
                                                            {isSelected && <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" strokeWidth={3} />}
                                                        </motion.button>
                                                    </div>

                                                    <p className="text-[10px] sm:text-[11px] font-medium text-neutral-500 leading-relaxed mt-0.5 sm:mt-1 line-clamp-2 break-words">
                                                        {Coupon.description}
                                                    </p>

                                                    {/* THÔNG TIN LƯỢT DÙNG */}
                                                    <div className="mt-1.5 sm:mt-2 flex items-center gap-2 sm:gap-3 text-[9px] sm:text-[10px] font-medium text-neutral-500 flex-wrap">
                                                        <span className={`flex items-center gap-1 min-w-0 ${
                                                            isOutOfStock ? 'text-rose-500 font-bold' : ''
                                                        }`}>
                                                            <Users size={10} className="sm:w-3 sm:h-3 shrink-0" />
                                                            <span className="truncate">
                                                                {isOutOfStock 
                                                                    ? 'Đã hết lượt' 
                                                                    : `Đã dùng: ${Coupon.usedCount}/${Coupon.quantity || '∞'}`}
                                                            </span>
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* FOOTER CARD (HSD & ĐIỀU KIỆN) */}
                                                <div className="mt-2 flex items-center justify-between text-[9px] sm:text-[10px] font-medium gap-1 flex-wrap">
                                                    <div className="flex items-center gap-1 text-neutral-400 shrink-0">
                                                        <Calendar size={10} className="sm:w-3 sm:h-3 shrink-0" />
                                                        <span>HSD: {formatDate(Coupon.endDate)}</span>
                                                    </div>

                                                    {!isEligible && (
                                                        <div className="flex items-center gap-0.5 sm:gap-1 text-amber-600 font-semibold shrink-0 min-w-0">
                                                            <AlertCircle size={10} className="sm:w-3 sm:h-3 shrink-0" />
                                                            <span className="truncate">
                                                                {isOutOfStock 
                                                                    ? 'Hết lượt dùng' 
                                                                    : `Thiếu ${formatCurrency(Coupon.minOrderValue - subTotal)}`}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })
                            )}
                        </div>

                        {/* FOOTER MODAL */}
                        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-neutral-100 bg-white flex items-center justify-between shrink-0 gap-2">
                            <div className="flex flex-col text-[11px] sm:text-xs gap-0.5 min-w-0 flex-1">
                                <div className="flex items-center gap-1 min-w-0">
                                    <span className="text-neutral-400 shrink-0">Đã chọn:</span>
                                    <span 
                                        title={tempSelectedCoupon ? tempSelectedCoupon.code : 'Chưa có'}
                                        className="font-bold text-neutral-900 truncate"
                                    >
                                        {tempSelectedCoupon ? tempSelectedCoupon.code : 'Chưa có'}
                                    </span>
                                </div>

                                {/* Hiển thị số tiền tiết kiệm tạm thời khi chọn Coupon */}
                                {tempSelectedCoupon && (
                                    <div className="text-[10px] sm:text-[11px] font-semibold text-rose-600 truncate">
                                        <span>Tiết kiệm: </span>
                                        <span>
                                            -{tempSelectedCoupon.discountType === DiscountType.Percentage
                                                ? formatCurrency(Math.min((subTotal * tempSelectedCoupon.discountAmount) / 100, tempSelectedCoupon.maxDiscountAmount || Infinity))
                                                : formatCurrency(tempSelectedCoupon.discountAmount)}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={handleConfirm}
                                className="h-9 sm:h-10 px-4 sm:px-6 bg-neutral-900 text-white font-medium text-xs rounded-xl hover:bg-neutral-800 transition-colors active:scale-95 cursor-pointer shrink-0"
                            >
                                Xác nhận
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );

    return createPortal(modalContent, document.body);
};