import React, { useState, useEffect } from 'react';
import type { ProductGridItem } from '../types/product';
import { Link } from 'react-router-dom';

interface ProductCardProps {
    product: ProductGridItem & { slug?: string };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const [activeColorId, setActiveColorId] = useState(product.productColors?.[0]?.colorId);

    useEffect(() => {
        setActiveColorId(product.productColors?.[0]?.colorId);
    }, [product]);

    const currentImageUrl = product.productColors?.find(c => c.colorId === activeColorId)?.imageUrl || product.thumbnailUrl;

    const productUrl = `/shop/product/${product.slug}`;

    return (
        <Link 
            to={productUrl} 
            className="group/product flex flex-col gap-3 cursor-pointer"
        >
            {/* 1. IMAGE CONTAINER */}
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F7F7F7] z-10">
                <img
                    src={currentImageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover object-center group-hover/product:scale-105 transition-transform duration-700 ease-out"
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
                                opacity-0 group-hover/product:opacity-100 transition-opacity duration-300 ease-out
                                pointer-events-none group-hover/product:pointer-events-auto z-20">
                    
                    {/* Lưới kích thước */}
                    <div className="flex flex-wrap justify-center gap-1.5">
                        {product.productSizes?.map((s) => {
                            const currentVariant = product.productVariants?.find(
                                (v) => v.colorId === activeColorId && v.sizeId === s.sizeId
                            );
                            const isOutOfStock = !currentVariant || currentVariant.quantity <= 0;

                            return (
                                <button
                                    key={s.sizeId}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation(); // 3. CHẶN SỰ KIỆN CLICK LAN RA THẺ LINK
                                        if (!isOutOfStock) {
                                            console.log("Thêm vào giỏ:", { color: activeColorId, size: s.sizeId });
                                        }
                                    }}
                                    className={`
                                        relative overflow-hidden flex items-center justify-center px-3 h-7 text-[11px] uppercase tracking-wider rounded shadow-sm
                                        transition-all hover:scale-105 active:scale-95
                                        ${isOutOfStock 
                                            ? 'bg-zinc-100/50 text-zinc-500 opacity-50 cursor-not-allowed' 
                                            : 'bg-white text-zinc-900 font-semibold cursor-pointer hover:bg-zinc-100'
                                        }
                                    `}
                                >
                                    <span>{s.sizeName}</span>
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
                                e.stopPropagation(); // 3. CHẶN SỰ KIỆN CLICK LAN RA THẺ LINK
                                setActiveColorId(color.colorId);
                            }}
                            className={`
                                relative flex items-center justify-center w-12 h-7 rounded-full bg-white p-[2px] transition-all duration-200
                                ${activeColorId === color.colorId 
                                    ? 'border-2 border-blue-600' 
                                    : 'border border-gray-200 hover:border-gray-400 hover:scale-105'
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
                        className="text-base font-medium text-zinc-700 group-hover/product:text-black transition-colors" 
                        title={product.name}
                    >
                        {product.name}
                    </h3>

                    <div className="text-base font-bold text-black">
                        {new Intl.NumberFormat('vi-VN').format(product.price)}đ
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;