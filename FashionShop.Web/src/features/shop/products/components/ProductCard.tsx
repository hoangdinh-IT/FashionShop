import React, { useState, useEffect } from 'react';
import type { ProductGridItem } from '../types/product';

interface ProductCardProps {
    product: ProductGridItem;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    // 1. Khởi tạo state
    const [activeColorId, setActiveColorId] = useState(product.productColors?.[0]?.colorId);

    // 2. THÊM ĐOẠN NÀY: Lắng nghe sự thay đổi của props `product`
    // Khi bạn đổi bộ lọc ở trang ngoài, cục `product` mới được truyền vào đây,
    // useEffect sẽ kích hoạt và reset màu về lại màu đầu tiên của sản phẩm mới.
    useEffect(() => {
        setActiveColorId(product.productColors?.[0]?.colorId);
    }, [product]);

    // Lấy hình ảnh tương ứng với màu đang chọn
    const currentImageUrl = product.productColors?.find(c => c.colorId === activeColorId)?.imageUrl || product.thumbnailUrl;

    return (
        <div className="group flex flex-col gap-3 cursor-pointer">
            
            {/* 1. IMAGE CONTAINER */}
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F7F7F7] z-10">
                <img
                    src={currentImageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                />

                {/* Badges */}
                <div className="absolute top-0 left-0 p-3 flex flex-col items-start gap-2 pointer-events-none z-10">
                    {product.isNew && (
                        <span className="bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-zinc-900 rounded-sm shadow-[0_2px_4px_rgba(0,0,0,0.05)] border border-zinc-100">
                            Mới
                        </span>
                    )}
                    {product.isBestSeller && (
                        <span className="bg-zinc-900 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white rounded-sm shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
                            Bán chạy
                        </span>
                    )}
                </div>

                {/* Overlay Thêm nhanh */}
                <div className="absolute bottom-3 left-3 right-3 bg-black/60 backdrop-blur-sm p-3 flex flex-col justify-end rounded-lg
                                opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out
                                pointer-events-none group-hover:pointer-events-auto z-20">
                    
                    {/* Lưới kích thước */}
                    <div className="flex flex-wrap justify-center gap-1.5">
                        {product.productSizes?.map((s) => {
                            // 1. Tìm biến thể khớp với Color đang được chọn VÀ Size hiện tại
                            const currentVariant = product.productVariants?.find(
                                (v) => v.colorId === activeColorId && v.sizeId === s.sizeId
                            );
                            
                            // 2. Xác định hết hàng
                            const isOutOfStock = !currentVariant || currentVariant.quantity <= 0;

                            return (
                                <button
                                    key={s.sizeId}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (!isOutOfStock) {
                                            console.log("Thêm vào giỏ:", { color: activeColorId, size: s.sizeId });
                                        }
                                    }}
                                    className={`
                                        relative overflow-hidden flex items-center justify-center px-3 h-7 text-[11px] uppercase tracking-wider rounded shadow-sm
                                        transition-all hover:scale-105 active:scale-95
                                        ${isOutOfStock 
                                            ? 'bg-zinc-100/50 text-zinc-500 opacity-50 cursor-not-allowed' // Hết hàng
                                            : 'bg-white text-zinc-900 font-semibold cursor-pointer hover:bg-zinc-100' // Còn hàng
                                        }
                                    `}
                                >
                                    <span>{s.sizeName}</span>
                                    
                                    {/* Đường gạch chéo */}
                                    {isOutOfStock && (
                                        <div className="absolute h-[1px] w-[150%] bg-zinc-500 origin-center rotate-[-40deg] pointer-events-none" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* 2. PRODUCT INFO */}
            <div className="flex flex-col mt-4 px-1">
                {/* Khu vực chọn màu */}
                <div className="flex items-center gap-1.5 mb-3">
                    {product.productColors?.map((color) => (
                        <button
                            key={color.colorId}
                            onClick={(e) => {
                                e.preventDefault();
                                setActiveColorId(color.colorId);
                            }}
                            className={`
                                relative flex items-center justify-center w-12 h-7 rounded-full bg-white p-[2px] transition-all duration-200
                                ${activeColorId === color.colorId 
                                    ? 'border-2 border-blue-600' // Viền xanh dương đậm khi được chọn
                                    : 'border border-gray-200 hover:border-gray-400 hover:scale-105' // Viền xám nhạt khi bình thường
                                }
                            `}
                            title={color.colorName}
                        >
                            <span
                                className="w-full h-full block rounded-full shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]"
                                style={{ backgroundColor: color.colorHexCode }}
                            />
                        </button>
                    ))}
                </div>

                {/* Tên và Giá sản phẩm */}
                <div className="flex flex-col gap-1">
                    <h3 
                        className="text-base font-medium text-zinc-700 group-hover:text-black transition-colors" 
                        title={product.name}
                    >
                        {product.name}
                    </h3>

                    <div className="text-base font-bold text-black">
                        {new Intl.NumberFormat('vi-VN').format(product.price)}đ
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;