import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { X, Calendar, AlertCircle, Check, Tag } from 'lucide-react';
import { DiscountType, type Voucher } from '../../../vouchers/types/voucher';
import { useSnackbar } from '../../../../../contexts';

interface VoucherDialogProps {
    isOpen: boolean;
    onClose: () => void;
    vouchers: Voucher[];
    selectedVoucher: Voucher | null;
    onSelectVoucher: (voucher: Voucher | null) => void;
    subTotal: number;
}

const backdropVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0, transition: { duration: 0.25, ease: "easeInOut" } },
};

const modalVariants: Variants = {
    hidden: { opacity: 0, scale: 0.96, y: 16 },
    visible: { 
        opacity: 1, 
        scale: 1, 
        y: 0, 
        transition: { type: 'spring', damping: 28, stiffness: 320 } 
    },
    exit: { opacity: 0, scale: 0.96, y: 16, transition: { duration: 0.2, ease: "easeInOut" } },
};

export const VoucherDialog: React.FC<VoucherDialogProps> = ({
    isOpen,
    onClose,
    vouchers = [],
    selectedVoucher,
    onSelectVoucher,
    subTotal,
}) => {
    const { showSnackbar } = useSnackbar();
    const [manualCode, setManualCode] = useState('');

    const formatCurrency = (amount: number) => amount.toLocaleString('vi-VN') + 'đ';

    const formatDate = (dateString: string) => {
        const d = new Date(dateString);
        return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    };

    const handleApplyManualCode = () => {
        if (!manualCode.trim()) return;
        const found = vouchers.find(v => v.code.toUpperCase() === manualCode.trim().toUpperCase());
        if (found) {
            if (subTotal >= found.minOrderValue) {
                onSelectVoucher(found);
                setManualCode('');
            } else {
                showSnackbar(`Đơn hàng chưa đủ giá trị tối thiểu ${formatCurrency(found.minOrderValue)}`, "warning");
            }
        } else {
            showSnackbar("Mã giảm giá không tồn tại hoặc đã hết hạn!", "error");
        }
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
                        className="absolute inset-0 bg-neutral-950/40 backdrop-blur-sm"
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
                                    const isEligible = subTotal >= voucher.minOrderValue;
                                    const isSelected = selectedVoucher?.id === voucher.id;

                                    return (
                                        <div 
                                            key={voucher.id}
                                            onClick={() => {
                                                if (isEligible) {
                                                    onSelectVoucher(isSelected ? null : voucher);
                                                }
                                            }}
                                            className={`relative flex rounded-2xl border transition-all duration-200 overflow-hidden ${
                                                !isEligible 
                                                    ? 'border-neutral-200 bg-neutral-50/50 opacity-55 cursor-not-allowed' 
                                                    : isSelected 
                                                        ? 'border-neutral-900 bg-neutral-900 text-white shadow-md cursor-pointer' 
                                                        : 'border-neutral-200 bg-white hover:border-neutral-300 cursor-pointer'
                                            }`}
                                        >
                                            {/* LEFT TICKET BADGE */}
                                            <div className={`w-24 shrink-0 flex flex-col items-center justify-center p-3 border-r border-dashed ${
                                                isSelected 
                                                    ? 'border-neutral-700 bg-neutral-800/60' 
                                                    : 'border-neutral-200 bg-neutral-50'
                                            }`}>
                                                <span className={`text-[11px] font-black uppercase tracking-wider ${
                                                    isSelected ? 'text-white' : 'text-neutral-800'
                                                }`}>
                                                    {voucher.code}
                                                </span>
                                                <span className={`text-xs font-extrabold mt-1 ${
                                                    isSelected ? 'text-emerald-400' : 'text-emerald-600'
                                                }`}>
                                                    {voucher.discountType === DiscountType.Percentage 
                                                        ? `-${voucher.discountAmount}%` 
                                                        : `-${formatCurrency(voucher.discountAmount)}`}
                                                </span>
                                            </div>

                                            {/* RIGHT MAIN CONTENT */}
                                            <div className="flex-1 p-3.5 flex flex-col justify-between min-w-0">
                                                <div>
                                                    <div className="flex items-start justify-between gap-2">
                                                        <h3 className="text-xs font-bold leading-snug line-clamp-1">{voucher.name}</h3>
                                                        
                                                        {/* CHECKBOX INDICATOR */}
                                                        <button
                                                            type="button"
                                                            disabled={!isEligible}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                if (isEligible) {
                                                                    onSelectVoucher(isSelected ? null : voucher);
                                                                }
                                                            }}
                                                            className={`shrink-0 flex h-5 w-5 items-center justify-center rounded-full border transition-all ${
                                                                !isEligible
                                                                    ? 'border-neutral-300 bg-neutral-100 text-transparent cursor-not-allowed'
                                                                    : isSelected
                                                                        ? 'border-white bg-white text-neutral-900'
                                                                        : 'border-neutral-300 bg-white text-transparent'
                                                            }`}
                                                        >
                                                            {isSelected && <Check size={12} strokeWidth={3} />}
                                                        </button>
                                                    </div>

                                                    <p className={`text-[11px] font-medium leading-relaxed mt-1 line-clamp-2 ${
                                                        isSelected ? 'text-neutral-300' : 'text-neutral-500'
                                                    }`}>
                                                        {voucher.description}
                                                    </p>
                                                </div>

                                                {/* FOOTER INFO OF ITEM */}
                                                <div className="mt-3 flex items-center justify-between text-[10px] font-medium">
                                                    <div className={`flex items-center gap-1 ${
                                                        isSelected ? 'text-neutral-400' : 'text-neutral-400'
                                                    }`}>
                                                        <Calendar size={11} />
                                                        <span>HSD: {formatDate(voucher.endDate)}</span>
                                                    </div>

                                                    {!isEligible && (
                                                        <div className="flex items-center gap-1 text-amber-600 font-semibold">
                                                            <AlertCircle size={11} />
                                                            <span>Thiếu {formatCurrency(voucher.minOrderValue - subTotal)}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* FOOTER */}
                        <div className="px-6 py-4 border-t border-neutral-100 bg-white flex items-center justify-between shrink-0">
                            <div className="text-xs">
                                <span className="text-neutral-400">Đã chọn: </span>
                                <span className="font-bold text-neutral-900">
                                    {selectedVoucher ? selectedVoucher.code : 'Chưa có'}
                                </span>
                            </div>

                            <button
                                type="button"
                                onClick={onClose}
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