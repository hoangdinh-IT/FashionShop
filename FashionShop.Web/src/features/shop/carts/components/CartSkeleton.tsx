import React from 'react';
import { motion, type Variants } from 'framer-motion';

const CartSkeleton: React.FC = () => {
    const shimmerVariants: Variants = {
        initial: { x: '-100%' },
        animate: { 
            x: '100%',
            transition: { 
                repeat: Infinity, 
                duration: 1.5, 
                ease: "linear" as const 
            }
        }
    };

    const SkeletonItem = () => (
        <div className="relative overflow-hidden bg-white rounded-3xl p-8 mb-6 flex gap-6 border border-zinc-100">
            {/* 1. Ảnh sản phẩm: Dùng bg-zinc-200 để vệt sáng hiện rõ hơn */}
            <div className="w-24 h-32 bg-zinc-200/60 rounded-2xl flex-shrink-0" />
            
            <div className="flex-1 space-y-4">
                <div className="h-5 bg-zinc-200/60 rounded-md w-3/4" />
                <div className="h-4 bg-zinc-200/60 rounded-md w-1/4" />
                <div className="flex justify-between items-center pt-6">
                    <div className="h-10 bg-zinc-200/60 rounded-full w-28" />
                    <div className="h-7 bg-zinc-200/60 rounded-md w-24" />
                </div>
            </div>

            {/* HIỆU ỨNG SÁNG CHO BÊN TRÁI (NỀN TRẮNG) */}
            <motion.div 
                variants={shimmerVariants}
                initial="initial"
                animate="animate"
                className="absolute inset-0 w-[200%]"
                style={{
                    // Dùng white/80 để cực kỳ sáng trên nền xám nhạt
                    backgroundImage: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.8) 50%, transparent 100%)',
                    skewX: -20
                }}
            />
        </div>
    );

    return (
        <div className="max-w-[1200px] mx-auto px-6 mt-12">
            <div className="flex flex-col lg:flex-row gap-12">
                <div className="flex-1">
                    {/* Header giả lập */}
                    <div className="mb-8 flex items-center gap-4">
                        <div className="w-5 h-5 rounded-full bg-zinc-200/60" />
                        <div className="h-4 bg-zinc-200/60 rounded w-32" />
                    </div>
                    {[1, 2, 3].map((i) => <SkeletonItem key={i} />)}
                </div>

                {/* BÊN PHẢI (SIDEBAR THANH TOÁN - ĐÃ CHUYỂN SANG MÀU SÁNG) */}
                    <div className="w-full lg:w-[400px]">
                        {/* Đổi bg-zinc-900 -> bg-white và border cho đồng bộ */}
                        <div className="bg-white rounded-[32px] p-8 h-[450px] relative overflow-hidden border border-zinc-100 shadow-sm">
                            <div className="space-y-8 relative z-10">
                                {/* Tiêu đề "Tóm tắt đơn hàng" giả lập */}
                                <div className="h-6 bg-zinc-200/60 rounded-md w-1/2" />
                                
                                <div className="space-y-4">
                                    {/* Các dòng chi tiết tiền */}
                                    <div className="h-4 bg-zinc-200/60 rounded-md w-full" />
                                    <div className="h-4 bg-zinc-200/60 rounded-md w-full" />
                                </div>

                                {/* Nút thanh toán giả lập */}
                                <div className="border-t border-zinc-100 pt-8 mt-auto">
                                    <div className="h-14 bg-zinc-200/60 rounded-2xl w-full" />
                                </div>
                            </div>

                            {/* HIỆU ỨNG SÁNG (SHIMMER) CHO SIDEBAR MÀU SÁNG */}
                            <motion.div 
                                variants={shimmerVariants}
                                initial="initial"
                                animate="animate"
                                className="absolute inset-0 w-[200%]"
                                style={{
                                    // Dùng rgba 0.8 giống hệt bên trái để đồng bộ độ rực rỡ
                                    backgroundImage: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.8) 50%, transparent 100%)',
                                    skewX: -20
                                }}
                            />
                        </div>
                    </div>
            </div>
        </div>
    );
};

export default CartSkeleton;