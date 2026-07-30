import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import type { CartItem } from "../../../carts/types/cart";

interface Props {
    items: CartItem[];
}

// Cấu hình Easing cao cấp (Editorial Design System)
const customEase = [0.16, 1, 0.3, 1] as const;

// Variants cho Container tổng
const sectionVariants: Variants = {
    hidden: { 
        opacity: 0, 
        scale: 0.98,
        filter: "blur(4px)",
    },
    visible: {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        transition: {
            duration: 0.5,
            ease: customEase,
        },
    },
};

// Variants cho từng dòng sản phẩm
const itemVariants: Variants = {
    hidden: { 
        opacity: 0, 
        scale: 0.97,
        filter: "blur(4px)",
    },
    visible: (index: number) => ({
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        transition: {
            duration: 0.4,
            delay: index * 0.05,
            ease: customEase,
        },
    }),
    exit: {
        opacity: 0,
        scale: 0.96,
        filter: "blur(4px)",
        transition: {
            duration: 0.2,
            ease: customEase,
        },
    },
};

const CheckoutItems: React.FC<Props> = ({ items }) => {
    return (
        <motion.section 
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-2xl border border-zinc-200/80 p-5 sm:p-6 shadow-xs font-sans space-y-5"
        >
            
            {/* HEADER */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-zinc-100 text-zinc-900 flex items-center justify-center shrink-0">
                        <ShoppingBag size={16} strokeWidth={2} />
                    </div>
                    <h2 className="text-base font-bold tracking-tight text-zinc-900">
                        Sản phẩm đã chọn
                    </h2>
                </div>

                <motion.span 
                    key={items.length}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3, ease: customEase }}
                    className="text-xs font-medium text-zinc-500 bg-zinc-100 px-2.5 py-1 rounded-full"
                >
                    {items.length} sản phẩm
                </motion.span>
            </div>

            {/* LIST ITEMS */}
            <div className="divide-y divide-zinc-100">
                <AnimatePresence mode="popLayout">
                    {items.map((item, index) => (
                        <motion.div 
                            key={item.id}
                            custom={index}
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            layout
                            className="py-4 first:pt-0 last:pb-0 flex gap-4 items-center group"
                        >
                            {/* IMAGE */}
                            <div className="w-16 h-20 sm:w-20 sm:h-24 rounded-xl overflow-hidden bg-zinc-50 border border-zinc-200/60 shrink-0 relative">
                                <img
                                    src={item.imageUrl}
                                    alt={item.productName}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                                />
                            </div>

                            {/* CONTENT */}
                            <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5 self-stretch">
                                <div>
                                    <h3 className="text-xs sm:text-sm font-semibold text-zinc-900 line-clamp-2 leading-snug">
                                        {item.productName}
                                    </h3>

                                    <div className="mt-1.5 flex items-center gap-2 text-[11px] text-zinc-500 font-medium">
                                        <span className="bg-zinc-100 px-2 py-0.5 rounded-md text-zinc-600">
                                            {item.colorName} / {item.sizeName}
                                        </span>
                                    </div>
                                </div>

                                {/* PRICE & QUANTITY */}
                                <div className="flex items-baseline justify-between mt-2">
                                    <span className="text-xs text-zinc-400 font-mono">
                                        Số lượng: <strong className="text-zinc-800 font-bold">x{item.quantity}</strong>
                                    </span>

                                    <div className="text-right">
                                        <span className="text-sm sm:text-base font-bold font-mono text-zinc-900">
                                            {(item.unitPrice * item.quantity).toLocaleString('vi-VN')}
                                            <span className="text-xs font-normal text-zinc-500 ml-0.5">đ</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

        </motion.section>
    );
};

export default CheckoutItems;