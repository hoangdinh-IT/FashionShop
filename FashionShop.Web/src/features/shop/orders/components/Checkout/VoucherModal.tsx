import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, AlertCircle, Check, Tag, Users } from 'lucide-react';
import { DiscountType, type Voucher } from '../../../vouchers/types/voucher';
import { useSnackbar } from '../../../../../contexts';
import { useLockBodyScroll } from '../../../../../hooks/useLockBodyScroll';
import { BACKDROP_STYLES, backdropVariants, modalVariants } from '../../../../../utils/animation';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    vouchers: Voucher[];
    selectedVoucher: Voucher | null;
    onSelectVoucher: (voucher: Voucher | null) => void;
    subTotal: number;
}

export const VoucherModal: React.FC<Props> = ({
    isOpen,
    onClose,
    vouchers = [],
    selectedVoucher,
    onSelectVoucher,
    subTotal,
}) => {
    useLockBodyScroll(isOpen);

    const { showSnackbar } = useSnackbar();
    const [manualCode, setManualCode] = useState('');

    // State lưu voucher đang chọn tạm thời trong Modal
    const [tempSelectedVoucher, setTempSelectedVoucher] = useState<Voucher | null>(selectedVoucher);

    // Đồng bộ lại tempSelectedVoucher mỗi khi Modal được mở ra
    useEffect(() => {
        if (isOpen) {
            setTempSelectedVoucher(selectedVoucher);
            setManualCode('');
        }
    }, [isOpen, selectedVoucher]);

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
        const found = vouchers.find(v => v.code.toUpperCase() === manualCode.trim().toUpperCase());
        if (found) {
            const isOutOfStock = found.quantity > 0 && found.usedCount >= found.quantity;
            if (isOutOfStock) {
                showSnackbar("Mã giảm giá đã hết lượt sử dụng!", "error");
                return;
            }

            if (subTotal >= found.minOrderValue) {
                // Chỉ chọn tạm thời
                setTempSelectedVoucher(found);
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
        onSelectVoucher(tempSelectedVoucher);
        onClose();
    };

    const modalContent = (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 font-sans select-none">
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
                        className="relative w-full max-w-[460px] bg-white rounded-3xl shadow-2xl border border-neutral-100 overflow-hidden z-10 flex flex-col max-h-[85vh]"
                    >
                        {/* HEADER */}
                        <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-5 bg-white shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-900">
                                    <Tag size={18} strokeWidth={2.2} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-neutral-900 tracking-tight">Mã ưu đãi</h2>
                                    <p className="text-xs text-neutral-400 font-medium">Chọn hoặc nhập mã giảm giá</p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={onClose}
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 transition-colors hover:bg-neutral-200 hover:text-neutral-900 active:scale-95 cursor-pointer"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* INPUT MÃ THỦ CÔNG */}
                        <div className="px-6 pt-5 pb-3 shrink-0 bg-white">
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    value={manualCode}
                                    onChange={(e) => setManualCode(e.target.value)}
                                    placeholder="MÃ GIẢM GIÁ"
                                    className="flex-1 h-11 px-4 text-xs font-bold uppercase tracking-wider bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-neutral-900 focus:bg-white transition-all placeholder:font-normal placeholder:normal-case placeholder:text-neutral-400"
                                />
                                <button 
                                    type="button"
                                    onClick={handleApplyManualCode}
                                    className="h-11 px-5 bg-neutral-900 text-white text-xs font-semibold rounded-xl hover:bg-neutral-800 transition-all active:scale-95 cursor-pointer shrink-0"
                                >
                                    Áp dụng
                                </button>
                            </div>
                        </div>

                        {/* DANH SÁCH VOUCHER */}
                        <div className="px-6 py-3 space-y-3 overflow-y-auto flex-1">
                            {vouchers.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-xs font-medium text-neutral-400">Hiện không có mã ưu đãi nào sẵn có.</p>
                                </div>
                            ) : (
                                vouchers.map((voucher) => {
                                    const isOutOfStock = voucher.quantity > 0 && voucher.usedCount >= voucher.quantity;
                                    const isEligible = subTotal >= voucher.minOrderValue && !isOutOfStock;
                                    
                                    // Kiểm tra voucher theo trạng thái tạm thời (tempSelectedVoucher)
                                    const isSelected = tempSelectedVoucher?.id === voucher.id;

                                    return (
                                        <motion.div 
                                            key={voucher.id}
                                            whileTap={isEligible ? { scale: 0.985 } : undefined}
                                            onClick={() => {
                                                if (isEligible) {
                                                    // Chọn / Bỏ chọn tạm thời
                                                    setTempSelectedVoucher(isSelected ? null : voucher);
                                                }
                                            }}
                                            className={`relative flex rounded-2xl border bg-white transition-all duration-300 overflow-hidden ${
                                                !isEligible 
                                                    ? 'border-neutral-200 bg-neutral-50/50 opacity-60 cursor-not-allowed' 
                                                    : isSelected 
                                                        ? 'border-neutral-900 shadow-md ring-1 ring-neutral-900 cursor-pointer' 
                                                        : 'border-neutral-200 hover:border-neutral-300 hover:shadow-sm cursor-pointer'
                                            }`}
                                        >
                                            {/* TAG GIỚI HẠN LƯỢT DÙNG MỖI NGƯỜI (GÓC TRÊN BÊN TRÁI) */}
                                            {voucher.remainingUsagePerUser > 0 && (
                                                <div className={`absolute top-0 left-0 z-10 px-2 py-0.5 text-[11px] font-black rounded-br-xl transition-colors ${
                                                    !isEligible 
                                                        ? 'bg-neutral-200 text-neutral-500' 
                                                        : isSelected 
                                                            ? 'bg-neutral-900 text-white' 
                                                            : 'bg-neutral-200/80 text-neutral-700'
                                                }`}>
                                                    x{voucher.remainingUsagePerUser}
                                                </div>
                                            )}

                                            {/* LEFT TICKET BADGE */}
                                            <div className="w-24 shrink-0 flex flex-col items-center justify-center p-3 border-r border-dashed border-neutral-200 bg-neutral-50 relative pt-5">
                                                <span className="text-[11px] font-black uppercase tracking-wider text-neutral-800 text-center leading-tight">
                                                    {voucher.code}
                                                </span>
                                                <span className="text-xs font-extrabold mt-1 text-emerald-600">
                                                    {voucher.discountType === DiscountType.Percentage 
                                                        ? `-${voucher.discountAmount}%` 
                                                        : `-${formatCurrency(voucher.discountAmount)}`}
                                                </span>
                                            </div>

                                            {/* RIGHT MAIN CONTENT */}
                                            <div className="flex-1 p-3.5 flex flex-col justify-between min-w-0">
                                                <div>
                                                    <div className="flex items-start justify-between gap-2">
                                                        <h3 className="text-xs font-bold text-neutral-900 leading-snug line-clamp-1">{voucher.name}</h3>
                                                        
                                                        {/* NÚT TRÒN ĐEN / TICK CHECKMARK */}
                                                        <motion.button
                                                            type="button"
                                                            disabled={!isEligible}
                                                            animate={{ scale: isSelected ? [0.85, 1.15, 1] : 1 }}
                                                            transition={{ duration: 0.2 }}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                if (isEligible) {
                                                                    setTempSelectedVoucher(isSelected ? null : voucher);
                                                                }
                                                            }}
                                                            className={`shrink-0 flex h-5 w-5 items-center justify-center rounded-full border transition-all duration-300 ${
                                                                !isEligible
                                                                    ? 'border-neutral-300 bg-neutral-100 text-transparent cursor-not-allowed'
                                                                    : isSelected
                                                                        ? 'border-neutral-900 bg-neutral-900 text-white shadow-sm'
                                                                        : 'border-neutral-300 bg-white text-transparent hover:border-neutral-400'
                                                            }`}
                                                        >
                                                            {isSelected && <Check size={11} strokeWidth={3} />}
                                                        </motion.button>
                                                    </div>

                                                    <p className="text-[11px] font-medium text-neutral-500 leading-relaxed mt-1 line-clamp-2">
                                                        {voucher.description}
                                                    </p>

                                                    {/* THÔNG TIN THÊM */}
                                                    <div className="mt-2 flex items-center gap-3 text-[10px] font-medium text-neutral-500 flex-wrap">
                                                        {/* Lượt dùng tổng */}
                                                        <span className={`flex items-center gap-1 ${
                                                            isOutOfStock ? 'text-rose-500 font-bold' : ''
                                                        }`}>
                                                            <Users size={11} />
                                                            {isOutOfStock 
                                                                ? 'Đã hết lượt' 
                                                                : `Đã dùng: ${voucher.usedCount}/${voucher.quantity || '∞'}`}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* FOOTER INFO */}
                                                <div className="mt-2.5 flex items-center justify-between text-[10px] font-medium">
                                                    <div className="flex items-center gap-1 text-neutral-400">
                                                        <Calendar size={11} />
                                                        <span>HSD: {formatDate(voucher.endDate)}</span>
                                                    </div>

                                                    {!isEligible && (
                                                        <div className="flex items-center gap-1 text-amber-600 font-semibold">
                                                            <AlertCircle size={11} />
                                                            <span>
                                                                {isOutOfStock 
                                                                    ? 'Hết lượt dùng' 
                                                                    : `Thiếu ${formatCurrency(voucher.minOrderValue - subTotal)}`}
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

                        {/* FOOTER */}
                        <div className="px-6 py-4 border-t border-neutral-100 bg-white flex items-center justify-between shrink-0">
                            <div className="flex flex-col text-xs gap-0.5">
                                <div>
                                    <span className="text-neutral-400">Đã chọn: </span>
                                    <span className="font-bold text-neutral-900">
                                        {tempSelectedVoucher ? tempSelectedVoucher.code : 'Chưa có'}
                                    </span>
                                </div>

                                {/* Hiển thị số tiền tiết kiệm tạm thời khi chọn voucher */}
                                {tempSelectedVoucher && (
                                    <div className="text-[11px] font-semibold text-rose-600">
                                        <span>Tiết kiệm: </span>
                                        <span>
                                            -{tempSelectedVoucher.discountType === DiscountType.Percentage
                                                ? formatCurrency(Math.min((subTotal * tempSelectedVoucher.discountAmount) / 100, tempSelectedVoucher.maxDiscountAmount || Infinity))
                                                : formatCurrency(tempSelectedVoucher.discountAmount)}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={handleConfirm}
                                className="h-10 px-6 bg-neutral-900 text-white font-medium text-xs rounded-xl hover:bg-neutral-800 transition-colors active:scale-95 cursor-pointer"
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