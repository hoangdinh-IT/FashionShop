import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import type { ProductDetail } from '../../products/types/product';
import type { CartItem } from '../types/cart';

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
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: "spring", stiffness: 300, damping: 25 }
    },
    exit: {
        opacity: 0,
        y: 20,
        scale: 0.95,
        transition: { duration: 0.2 }
    }
};

const UpdateVariantDialog: React.FC<Props> = ({
    isOpen,
    onClose,
    item,
    productDetail,
    onUpdate
}) => {
    const [selectedColorId, setSelectedColorId] = useState<number | null>(null);
    const [selectedSizeId, setSelectedSizeId] = useState<number | null>(null);

    // 1. Hiển thị đúng màu và size của cartItem khi mở dialog
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
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                    
                    {/* BACKDROP */}
                    <motion.div
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={onClose}
                        className="absolute inset-0 bg-black/30 backdrop-blur-[6px]"
                    />

                    {/* MODAL */}
                    <motion.div
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="relative z-10 w-full max-w-[460px] overflow-hidden rounded-[28px] border border-zinc-200/80 bg-white shadow-[0_25px_80px_-25px_rgba(0,0,0,0.18)]"
                    >
                        
                        {/* TOP BAR */}
                        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-5">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400">
                                    Update Variant
                                </p>

                                <h2 className="mt-1 text-[22px] font-semibold tracking-[-0.04em] text-zinc-900">
                                    Cập nhật sản phẩm
                                </h2>
                            </div>

                            <button
                                onClick={onClose}
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 transition-all hover:bg-zinc-900 hover:text-white"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* PRODUCT */}
                        <div className="flex gap-4 px-6 py-6">
                            
                            <div className="h-[118px] w-[92px] shrink-0 overflow-hidden rounded-2xl bg-zinc-100">
                                <img
                                    src={item?.imageUrl}
                                    alt={item?.productName}
                                    className="h-full w-full object-cover"
                                />
                            </div>

                            <div className="flex flex-1 flex-col justify-between">
                                
                                <div>
                                    <h4 className="line-clamp-2 text-[15px] font-semibold leading-6 tracking-[-0.02em] text-zinc-900">
                                        {item?.productName}
                                    </h4>

                                    <div className="mt-3 inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-[11px] font-medium text-zinc-500">
                                        {item?.colorName} · {item?.sizeName}
                                    </div>
                                </div>

                                <div className="mt-4 text-[11px] uppercase tracking-[0.18em] text-zinc-400">
                                    Select new variant
                                </div>
                            </div>
                        </div>

                        {/* CONTENT */}
                        <div className="space-y-7 border-t border-zinc-100 px-6 py-6">
                            
                            {/* COLOR */}
                            <div>
                                <div className="mb-4 flex items-center justify-between">
                                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-400">
                                        Màu sắc
                                    </p>

                                    {selectedColorId && (
                                        <span className="text-[12px] font-medium text-zinc-500">
                                            {
                                                productDetail?.productColors?.find(
                                                    c => c.colorId === selectedColorId
                                                )?.colorName
                                            }
                                        </span>
                                    )}
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    {productDetail?.productColors?.map((color) => (
                                        <button
                                            key={color.colorId}
                                            onClick={() => {
                                                setSelectedColorId(color.colorId);
                                                setSelectedSizeId(null);
                                            }}
                                            className={`relative flex h-11 w-11 items-center justify-center rounded-full transition-all duration-300 ${
                                                selectedColorId === color.colorId
                                                    ? 'scale-105 border border-zinc-900 bg-white shadow-md'
                                                    : 'border border-zinc-200 bg-white hover:scale-105 hover:border-zinc-400'
                                            }`}
                                        >
                                            <span
                                                className="h-8 w-8 rounded-full border border-black/5"
                                                style={{ backgroundColor: color.colorHexCode }}
                                            />

                                            {selectedColorId === color.colorId && (
                                                <motion.div
                                                    layoutId="activeColorRing"
                                                    className="absolute inset-0 rounded-full border border-zinc-900"
                                                />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* SIZE */}
                            <div>
                                <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-400">
                                    Kích thước
                                </p>

                                <div className="flex flex-wrap gap-2.5">
                                    {productDetail?.productSizes?.map((size) => {

                                        const variant = productDetail.productVariants?.find(
                                            (v) =>
                                                v.colorId === selectedColorId &&
                                                v.sizeId === size.sizeId
                                        );

                                        const isOutOfStock =
                                            !variant || variant.quantity <= 0;

                                        return (
                                            <button
                                                key={size.sizeId}
                                                disabled={isOutOfStock}
                                                onClick={() => setSelectedSizeId(size.sizeId)}
                                                className={`relative flex h-11 min-w-[58px] items-center justify-center overflow-hidden rounded-2xl border px-4 text-[13px] font-semibold transition-all duration-300 ${
                                                    isOutOfStock
                                                        ? 'cursor-not-allowed border-zinc-100 bg-zinc-50 text-zinc-300'
                                                        : selectedSizeId === size.sizeId
                                                        ? 'border-zinc-900 bg-zinc-900 text-white shadow-lg shadow-zinc-200'
                                                        : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-900 hover:bg-zinc-50'
                                                }`}
                                            >
                                                <span className={isOutOfStock ? 'opacity-40' : ''}>
                                                    {size.sizeName}
                                                </span>

                                                {isOutOfStock && (
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <div className="h-[1px] w-[140%] rotate-[28deg] bg-zinc-300" />
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* FOOTER */}
                        <div className="border-t border-zinc-100 px-6 py-5">
                            <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.985 }}
                                onClick={handleConfirm}
                                className="flex h-14 w-full items-center justify-center rounded-2xl bg-zinc-900 text-[13px] font-semibold uppercase tracking-[0.16em] text-white transition-all hover:bg-black"
                            >
                                Xác nhận thay đổi
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default UpdateVariantDialog;