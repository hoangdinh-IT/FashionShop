import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Phone, Check } from 'lucide-react';
import type { Address } from '../../../addresses/types/address';
import AddressString from '../../../addresses/components/AddressString';
import { useLockBodyScroll } from '../../../../../hooks/useLockBodyScroll';
import { BACKDROP_STYLES, backdropVariants, modalVariants } from '../../../../../utils/animation';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    addresses: Address[];
    currentSelectedAddress?: Address;
    onSelect: (address: Address) => void;
}

const AddressModal: React.FC<Props> = ({
    isOpen,
    onClose,
    addresses,
    onSelect,
    currentSelectedAddress
}) => {
    useLockBodyScroll(isOpen);

    const [localSelected, setLocalSelected] = useState<Address | undefined>(currentSelectedAddress);

    useEffect(() => {
        if (isOpen) {
            setLocalSelected(currentSelectedAddress);
        }
    }, [isOpen, currentSelectedAddress]);

    const handleConfirmUpdate = () => {
        if (localSelected) {
            onSelect(localSelected);
        }
    };

    return (
        <AnimatePresence mode="wait">
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 md:p-6">
                    
                    {/* Backdrop */}
                    <motion.div
                        className={BACKDROP_STYLES}
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={onClose}
                    />

                    {/* Modal Container */}
                    <motion.div
                        className="relative bg-white w-full max-w-[500px] max-h-[85vh] sm:max-h-[90vh] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-zinc-100 flex flex-col z-10"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        {/* Header */}
                        <div className="flex items-start justify-between px-4 sm:px-6 md:px-7 pt-4 sm:pt-6 md:pt-7 pb-3 sm:pb-4 border-b border-zinc-100/80 shrink-0">
                            <div className="pr-2">
                                <h2 className="text-base sm:text-lg md:text-xl font-semibold tracking-tight text-zinc-900">
                                    Địa chỉ giao hàng
                                </h2>
                                <p className="text-[11px] sm:text-xs text-zinc-400 mt-0.5 font-normal">
                                    Chọn địa chỉ bạn muốn nhận đơn hàng này
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-all cursor-pointer shrink-0"
                                aria-label="Đóng"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Body - Address List */}
                        <div className="px-4 sm:px-6 md:px-7 py-3 sm:py-4 overflow-y-auto flex-1 space-y-2.5 sm:space-y-3 max-h-[55vh] sm:max-h-[60vh]">
                            {addresses.length === 0 ? (
                                <div className="text-center py-8 text-xs sm:text-sm text-zinc-500">
                                    Chưa có địa chỉ nào được lưu.
                                </div>
                            ) : (
                                addresses.map((addr) => {
                                    const isSelected = localSelected?.id === addr.id;
                                    return (
                                        <motion.div
                                            key={addr.id}
                                            whileTap={{ scale: 0.99 }}
                                            onClick={() => setLocalSelected(addr)}
                                            className={`group relative p-3.5 sm:p-4 md:p-5 rounded-xl sm:rounded-2xl border transition-all duration-200 cursor-pointer ${
                                                isSelected 
                                                    ? 'border-zinc-900 bg-zinc-50/70 shadow-2xs' 
                                                    : 'border-zinc-200/80 hover:border-zinc-300 bg-white'
                                            }`}
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                {/* Info */}
                                                <div className="space-y-1.5 sm:space-y-2 flex-1 min-w-0">
                                                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                                                        <span className="font-semibold text-sm sm:text-base tracking-tight text-zinc-900 break-words">
                                                            {addr.fullName}
                                                        </span>
                                                        {addr.isDefault && (
                                                            <span className="text-[9px] sm:text-[10px] font-medium px-1.5 sm:px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-500 border border-zinc-200/60 shrink-0">
                                                                Mặc định
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                                                        <Phone size={12} className="opacity-70 shrink-0" />
                                                        <span className="font-mono">{addr.phoneNumber}</span>
                                                    </div>

                                                    <div className="flex items-start gap-1.5 text-xs text-zinc-600 leading-relaxed pt-0.5 break-words">
                                                        <MapPin size={13} className="shrink-0 mt-0.5 opacity-60 text-zinc-500" />
                                                        <AddressString
                                                            addressDetail={addr.addressDetail}
                                                            communeCode={addr.commune}
                                                            districtCode={addr.district}
                                                            cityCode={addr.city}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Radio Selection Indicator */}
                                                <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border flex items-center justify-center shrink-0 transition-all mt-0.5 ${
                                                    isSelected 
                                                        ? 'border-zinc-900 bg-zinc-900 text-white' 
                                                        : 'border-zinc-300 group-hover:border-zinc-400 bg-transparent'
                                                }`}>
                                                    {isSelected && <Check size={11} className="sm:w-[12px] sm:h-[12px] stroke-[3]" />}
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-4 sm:p-6 md:p-7 pt-3 sm:pt-4 bg-white border-t border-zinc-100/80 shrink-0">
                            <button
                                onClick={handleConfirmUpdate}
                                disabled={!localSelected || addresses.length === 0}
                                className="w-full py-3 sm:py-3.5 md:py-4 bg-zinc-900 hover:bg-black disabled:bg-zinc-300 text-white text-xs font-semibold uppercase tracking-widest rounded-xl sm:rounded-2xl shadow-md transition-all active:scale-[0.98] cursor-pointer disabled:cursor-not-allowed"
                            >
                                Xác nhận địa chỉ
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AddressModal;