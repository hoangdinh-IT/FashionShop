import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import type { ProductDetail } from '../../products/types/product';
import type { CartItem } from '../types/cart';
import { useLockBodyScroll } from '../../../../hooks/useLockBodyScroll';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    item?: CartItem;
    productDetail?: ProductDetail;
    onUpdate: (variantId: string) => void;
}

const backdropVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
};

const modalVariants: Variants = {
    hidden: { opacity: 0, scale: 0.96, y: 12 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { type: "spring", stiffness: 350, damping: 28 }
    },
    exit: {
        opacity: 0,
        scale: 0.96,
        y: 12,
        transition: { duration: 0.15 }
    }
};

const UpdateVariantModal: React.FC<Props> = ({
    isOpen,
    onClose,
    item,
    productDetail,
    onUpdate
}) => {
    useLockBodyScroll(isOpen);

    const [selectedColorId, setSelectedColorId] = useState<number | null>(null);
    const [selectedSizeId, setSelectedSizeId] = useState<number | null>(null);

    // Hiển thị đúng màu và size của cartItem khi mở modal
    useEffect(() => {
        if (isOpen && item) {
            setSelectedColorId(item.colorId);
            setSelectedSizeId(item.sizeId);
        }
    }, [isOpen, item]);

    const handleConfirm = () => {
        if (!selectedColorId || !selectedSizeId) return;

        const variant = productDetail?.productVariants?.find(
            (v) => v.colorId === selectedColorId && v.sizeId === selectedSizeId
        );

        if (variant && variant.quantity > 0) {
            onUpdate(variant.productVariantId);
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-sans">
                    
                    {/* BACKDROP */}
                    <motion.div
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={onClose}
                        className="absolute inset-0 bg-black/40"
                    />

                    {/* MODAL */}
                    <motion.div
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="relative z-10 w-full max-w-[420px] overflow-hidden rounded-3xl border border-neutral-200/80 bg-white"
                    >
                        
                        {/* HEADER */}
                        <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-5">
                            <div>
                                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block">
                                    Update Variant
                                </span>
                                <h2 className="text-base font-semibold text-neutral-900 mt-0.5">
                                    Cập nhật phân loại
                                </h2>
                            </div>

                            <button
                                onClick={onClose}
                                className="w-8 h-8 rounded-full border border-neutral-200/80 flex items-center justify-center text-neutral-400 hover:text-neutral-900 hover:border-neutral-900 transition-colors cursor-pointer"
                            >
                                <X size={15} />
                            </button>
                        </div>

                        {/* SẢN PHẨM HIỆN TẠI */}
                        <div className="flex gap-4 p-6 bg-neutral-50/50 border-b border-neutral-100">
                            <div className="h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-neutral-100 border border-neutral-200/60">
                                <img
                                    src={item?.imageUrl}
                                    alt={item?.productName}
                                    className="h-full w-full object-cover"
                                />
                            </div>

                            <div className="flex flex-1 flex-col justify-center">
                                <h4 className="line-clamp-2 text-xs font-medium leading-relaxed text-neutral-900">
                                    {item?.productName}
                                </h4>

                                <div className="mt-2 inline-flex items-center gap-1.5 self-start px-2.5 py-0.5 rounded-md bg-white border border-neutral-200/80 text-[11px] font-mono text-neutral-600">
                                    <span>{item?.colorName}</span>
                                    <span>/</span>
                                    <span>{item?.sizeName}</span>
                                </div>
                            </div>
                        </div>

                        {/* LỰA CHỌN MỚI */}
                        <div className="space-y-6 p-6">
                            
                            {/* BỘ CHỌN MÀU SẮC */}
                            <div>
                                <div className="mb-3 flex items-center justify-between">
                                    <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">
                                        Màu sắc
                                    </span>
                                    {selectedColorId && (
                                        <span className="text-xs font-medium text-neutral-700">
                                            {
                                                productDetail?.productColors?.find(
                                                    c => c.colorId === selectedColorId
                                                )?.colorName
                                            }
                                        </span>
                                    )}
                                </div>

                                <div className="flex flex-wrap gap-2.5">
                                    {productDetail?.productColors?.map((color) => {
                                        const isSelected = selectedColorId === color.colorId;
                                        return (
                                            <button
                                                key={color.colorId}
                                                onClick={() => {
                                                    setSelectedColorId(color.colorId);
                                                    setSelectedSizeId(null);
                                                }}
                                                className={`relative p-0.5 rounded-full border transition-all duration-200 cursor-pointer ${
                                                    isSelected 
                                                        ? 'border-neutral-900 scale-105' 
                                                        : 'border-transparent hover:border-neutral-300'
                                                }`}
                                            >
                                                <span
                                                    className="block w-7 h-7 rounded-full border border-black/10"
                                                    style={{ backgroundColor: color.colorHexCode }}
                                                />
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* BỘ CHỌN KÍCH THƯỚC */}
                            <div>
                                <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block mb-3">
                                    Kích thước
                                </span>

                                <div className="flex flex-wrap gap-2">
                                    {productDetail?.productSizes?.map((size) => {
                                        const variant = productDetail.productVariants?.find(
                                            (v) => v.colorId === selectedColorId && v.sizeId === size.sizeId
                                        );

                                        const isOutOfStock = !variant || variant.quantity <= 0;
                                        const isSelected = selectedSizeId === size.sizeId;

                                        return (
                                            <button
                                                key={size.sizeId}
                                                disabled={isOutOfStock}
                                                onClick={() => setSelectedSizeId(size.sizeId)}
                                                className={`relative h-10 min-w-[48px] px-3.5 rounded-xl text-xs font-medium border transition-all duration-200 flex items-center justify-center cursor-pointer ${
                                                    isOutOfStock
                                                        ? 'cursor-not-allowed border-neutral-100 bg-neutral-50 text-neutral-300'
                                                        : isSelected
                                                        ? 'border-neutral-900 bg-neutral-900 text-white'
                                                        : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-900'
                                                }`}
                                            >
                                                <span className={isOutOfStock ? 'opacity-30' : ''}>
                                                    {size.sizeName}
                                                </span>

                                                {isOutOfStock && (
                                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                        <div className="h-[1px] w-full rotate-[-25deg] bg-neutral-300" />
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* FOOTER */}
                        <div className="p-6 pt-2">
                            <button
                                onClick={handleConfirm}
                                disabled={!selectedColorId || !selectedSizeId}
                                className="w-full h-12 rounded-full bg-neutral-900 text-white text-xs font-semibold uppercase tracking-wider transition-all duration-200 hover:bg-neutral-800 disabled:bg-neutral-100 disabled:text-neutral-400 disabled:cursor-not-allowed active:scale-[0.99] cursor-pointer"
                            >
                                Xác nhận thay đổi
                            </button>
                        </div>

                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default UpdateVariantModal;