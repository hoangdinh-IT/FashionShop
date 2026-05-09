import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { X, MapPin, Phone, Check } from 'lucide-react';
import type { Address } from '../../../addresses/types/address';
import AddressString from '../../../addresses/components/AddressString';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    addresses: Address[];
    currentSelectedAddress?: Address;
    onSelect: (address: Address) => void;
}

// 1. Định nghĩa Variants với Exit Animation chậm rãi
const backdropVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { 
        opacity: 0,
        transition: { duration: 0.4, ease: "easeInOut" } 
    },
};

const modalVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9, y: 30 },
    visible: { 
        opacity: 1, 
        scale: 1, 
        y: 0,
        transition: { 
            type: 'spring', 
            damping: 25, 
            stiffness: 300,
            duration: 0.5 
        } 
    },
    exit: { 
        opacity: 0, 
        scale: 0.9, 
        y: 30, // Chạy ngược xuống dưới khi đóng
        transition: { 
            duration: 0.4, 
            ease: "easeInOut" 
        }
    },
};

const AddressDialog: React.FC<Props> = ({
    isOpen,
    onClose,
    addresses,
    onSelect,
    currentSelectedAddress
}) => {
    const [localSelected, setLocalSelected] = useState<Address | undefined>(currentSelectedAddress);

    // Đồng bộ local state khi dialog mở
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
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    
                    {/* Overlay: Tắt mượt mà */}
                    <motion.div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={onClose}
                    />

                    {/* Modal Content: Chuyển động xuống và mờ dần chậm rãi khi exit */}
                    <motion.div
                        className="relative bg-white w-full max-w-[550px] rounded-[40px] overflow-hidden shadow-[0_20px_70px_rgba(0,0,0,0.15)] border border-zinc-100 flex flex-col"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-10 py-8 border-b border-zinc-50 shrink-0">
                            <div>
                                <h2 className="text-2xl font-black text-zinc-900 tracking-tight uppercase">Sổ địa chỉ</h2>
                                <p className="text-zinc-400 text-[10px] font-bold mt-1 tracking-[0.2em] uppercase">Chọn địa chỉ nhận hàng của bạn</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-3 hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900 rounded-full transition-all cursor-pointer"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="px-8 py-8 max-h-[55vh] overflow-y-auto scrollbar-hide flex-1">
                            <div className="space-y-4">
                                {addresses.map((addr) => {
                                    const isTicked = localSelected?.id === addr.id;
                                    return (
                                        <motion.div
                                            key={addr.id}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setLocalSelected(addr)}
                                            className={`group relative p-6 rounded-[30px] border-2 transition-all duration-300 cursor-pointer
                                                ${isTicked ? 'border-zinc-900 bg-zinc-50/50' : 'border-zinc-100 hover:border-zinc-300 bg-white'}`}
                                        >
                                            <div className="flex items-start gap-5">
                                                <div className={`mt-1.5 w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all
                                                    ${isTicked ? 'border-zinc-900 bg-zinc-900' : 'border-zinc-200'}`}>
                                                    {isTicked && <Check size={14} className="text-white font-bold" />}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div className="space-y-0.5">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-zinc-900 font-bold text-lg">{addr.fullName}</span>
                                                                {addr.isDefault && (
                                                                    <span className="bg-zinc-100 text-zinc-500 text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider border border-zinc-200">
                                                                        Mặc định
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-2 text-zinc-500 text-sm">
                                                                <Phone size={14} className="text-zinc-400" />
                                                                <span>{addr.phoneNumber}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-2 text-zinc-600 text-sm leading-relaxed mt-3">
                                                        <MapPin size={16} className="shrink-0 mt-0.5 text-zinc-300" />
                                                        <AddressString
                                                            addressDetail={addr.addressDetail}
                                                            communeCode={addr.commune}
                                                            districtCode={addr.district}
                                                            cityCode={addr.city}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-8 pt-2 shrink-0">
                            <button
                                onClick={handleConfirmUpdate}
                                className="w-full py-5 bg-zinc-900 hover:bg-black text-white font-bold rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.1)] transition-all active:scale-[0.97] cursor-pointer uppercase tracking-widest text-sm"
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

export default AddressDialog;