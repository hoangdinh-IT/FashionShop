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
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    
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
                        className="relative bg-white w-full max-w-[500px] rounded-3xl overflow-hidden shadow-2xl border border-zinc-100 flex flex-col"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-7 pt-7 pb-5">
                            <div>
                                <h2 className="text-xl font-semibold tracking-tight text-zinc-900">
                                    Địa chỉ giao hàng
                                </h2>
                                <p className="text-xs text-zinc-400 mt-1 font-normal">
                                    Chọn địa chỉ bạn muốn nhận đơn hàng này
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-9 h-9 flex items-center justify-center rounded-full text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100/80 transition-all cursor-pointer"
                                aria-label="Đóng"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Body - Address List */}
                        <div className="px-7 py-2 max-h-[50vh] overflow-y-auto scrollbar-none flex-1 space-y-3">
                            {addresses.map((addr) => {
                                const isSelected = localSelected?.id === addr.id;
                                return (
                                    <motion.div
                                        key={addr.id}
                                        whileTap={{ scale: 0.99 }}
                                        onClick={() => setLocalSelected(addr)}
                                        className={`group relative p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                                            isSelected 
                                                ? 'border-zinc-900 bg-zinc-50/50 shadow-sm' 
                                                : 'border-zinc-200/70 hover:border-zinc-300 bg-white'
                                        }`}
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            {/* Info */}
                                            <div className="space-y-2 flex-1">
                                                <div className="flex items-center gap-2.5">
                                                    <span className="font-semibold text-base tracking-tight text-zinc-900">
                                                        {addr.fullName}
                                                    </span>
                                                    {addr.isDefault && (
                                                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-500 border border-zinc-200/60">
                                                            Mặc định
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-2 text-xs text-zinc-500">
                                                    <Phone size={13} className="opacity-70" />
                                                    <span>{addr.phoneNumber}</span>
                                                </div>

                                                <div className="flex items-start gap-2 text-xs text-zinc-600 leading-relaxed pt-1">
                                                    <MapPin size={14} className="shrink-0 mt-0.5 opacity-60 text-zinc-500" />
                                                    <AddressString
                                                        addressDetail={addr.addressDetail}
                                                        communeCode={addr.commune}
                                                        districtCode={addr.district}
                                                        cityCode={addr.city}
                                                    />
                                                </div>
                                            </div>

                                            {/* Chỉ tô đen ô tròn tại đây */}
                                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all mt-0.5 ${
                                                isSelected 
                                                    ? 'border-zinc-900 bg-zinc-900 text-white' 
                                                    : 'border-zinc-300 group-hover:border-zinc-400 bg-transparent'
                                            }`}>
                                                {isSelected && <Check size={12} className="stroke-[3]" />}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Footer */}
                        <div className="p-7 pt-4 bg-white">
                            <button
                                onClick={handleConfirmUpdate}
                                className="w-full py-4 bg-zinc-900 hover:bg-black text-white text-xs font-semibold uppercase tracking-widest rounded-2xl shadow-md transition-all active:scale-[0.98] cursor-pointer"
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