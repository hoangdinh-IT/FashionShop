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
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
                    />

                    <motion.div
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="relative w-full max-w-md bg-white rounded-[32px] p-8 shadow-2xl z-10"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-extrabold text-zinc-900 tracking-tight">Cập nhật sản phẩm</h2>
                            <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex gap-5 mb-8">
                            <img src={item?.imageUrl} className="w-24 h-32 object-cover rounded-2xl border" alt="" />
                            <div className="flex-1">
                                <h4 className="font-bold text-zinc-900 leading-tight line-clamp-2">{item?.productName}</h4>
                                <div className="mt-2 inline-block px-3 py-1 bg-zinc-100 rounded-lg text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                                    {item?.colorName} / {item?.sizeName}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8 border-t border-zinc-100 pt-6">
                            {/* Danh sách màu sắc */}
                            <div className="space-y-4">
                                <p className="text-[11px] font-black uppercase text-zinc-400 tracking-widest">Màu sắc</p>
                                <div className="flex flex-wrap gap-4">
                                    {productDetail?.productColors?.map((color) => (
                                        <button
                                            key={color.colorId}
                                            onClick={() => {
                                                setSelectedColorId(color.colorId);
                                                setSelectedSizeId(null); // Reset size khi đổi màu giống logic file ProductDetail
                                            }}
                                            className={`w-10 h-10 rounded-full border-2 p-0.5 transition-all ${
                                                selectedColorId === color.colorId ? 'border-zinc-900' : 'border-transparent'
                                            }`}
                                        >
                                            <div className="w-full h-full rounded-full border" style={{ backgroundColor: color.colorHexCode }} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Danh sách kích thước với logic gạch chéo */}
                            <div className="space-y-4">
                                <p className="text-[11px] font-black uppercase text-zinc-400 tracking-widest">Kích thước</p>
                                <div className="flex flex-wrap gap-2">
                                    {productDetail?.productSizes?.map((size) => {
                                        // LOGIC TỪ PRODUCTDETAILPAGE.TSX
                                        const variant = productDetail.productVariants?.find(
                                            (v) => v.colorId === selectedColorId && v.sizeId === size.sizeId
                                        );
                                        const isOutOfStock = !variant || variant.quantity <= 0;

                                        return (
                                            <button
                                                key={size.sizeId}
                                                disabled={isOutOfStock}
                                                onClick={() => setSelectedSizeId(size.sizeId)}
                                                className={`relative px-6 py-2.5 rounded-xl text-sm font-bold border transition-all overflow-hidden ${
                                                    isOutOfStock
                                                        ? 'bg-zinc-50 border-zinc-100 text-zinc-300 cursor-not-allowed'
                                                        : selectedSizeId === size.sizeId
                                                        ? 'bg-zinc-900 border-zinc-900 text-white'
                                                        : 'border-zinc-200 text-zinc-500 hover:border-zinc-900'
                                                }`}
                                            >
                                                <span className={isOutOfStock ? 'opacity-40' : ''}>{size.sizeName}</span>
                                                
                                                {/* Hiệu ứng gạch chéo */}
                                                {isOutOfStock && (
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <div className="w-[120%] h-[1.2px] bg-zinc-300 rotate-[25deg]" />
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleConfirm}
                            className="w-full bg-[#FCAF17] text-zinc-900 font-black py-4 rounded-2xl mt-10 shadow-lg shadow-yellow-100 uppercase text-sm tracking-widest"
                        >
                            Xác nhận thay đổi
                        </motion.button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default UpdateVariantDialog;