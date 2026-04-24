import React from 'react';

const ProductSkeleton: React.FC = () => {
    return (
        <div className="group flex flex-col gap-4">
            {/* Image Skeleton */}
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-zinc-200 animate-pulse">
                {/* Lớp shimmer chạy xéo tạo hiệu ứng bóng loáng */}
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            </div>

            {/* Product Info Skeleton */}
            <div className="flex flex-col gap-2 px-1">
                {/* Colors Skeleton (3 chấm tròn) */}
                <div className="flex items-center gap-1.5 h-4">
                    <div className="w-4 h-4 rounded-full bg-zinc-200 animate-pulse"></div>
                    <div className="w-4 h-4 rounded-full bg-zinc-200 animate-pulse delay-75"></div>
                    <div className="w-4 h-4 rounded-full bg-zinc-200 animate-pulse delay-150"></div>
                </div>

                {/* Tên sản phẩm Skeleton (2 dòng chữ) */}
                <div className="space-y-1.5 mt-1">
                    <div className="h-3.5 bg-zinc-200 rounded-md w-full animate-pulse"></div>
                    <div className="h-3.5 bg-zinc-200 rounded-md w-2/3 animate-pulse"></div>
                </div>

                {/* Giá Skeleton */}
                <div className="mt-2">
                    <div className="h-5 bg-zinc-200 rounded-md w-1/3 animate-pulse"></div>
                </div>
            </div>
        </div>
    );
};

export default ProductSkeleton;