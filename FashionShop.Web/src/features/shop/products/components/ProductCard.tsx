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
        <Link to={productUrl} className="group/product block">
            <article className="relative flex flex-col">
                
                {/* IMAGE SECTION */}
                <div className="relative overflow-hidden rounded-[2rem] bg-[#F5F5F3] aspect-[3/4]">
                    
                    <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/[0.03] z-[1]" />

                    <img
                        src={currentImageUrl}
                        alt={product.name}
                        loading="lazy"
                        className="relative z-[2] h-full w-full object-cover object-center transition-all duration-700 ease-out group-hover/product:scale-[1.04]"
                    />

                    {/* BADGES */}
                    <div className="absolute top-5 left-5 z-20 flex flex-col gap-2">
                        {product.isNew && (
                            <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-black uppercase tracking-[0.2em] text-zinc-900 border border-white/50 shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
                                New
                            </span>
                        )}

                        {product.isBestSeller && (
                            <span className="px-3 py-1 rounded-full bg-zinc-900 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-[0_6px_20px_rgba(0,0,0,0.15)]">
                                Best Seller
                            </span>
                        )}
                    </div>

                    {/* SIZE PANEL */}
                    <div className="absolute left-4 right-4 bottom-4 z-30 translate-y-6 opacity-0 group-hover/product:translate-y-0 group-hover/product:opacity-100 transition-all duration-500 ease-out">
                        <div className="rounded-[1.5rem] bg-zinc-700/70 backdrop-blur-xl border border-zinc-600/40 shadow-[0_10px_30px_rgba(0,0,0,0.18)] p-3">
                            <div className="flex flex-wrap justify-center gap-2">
                                {product.productSizes?.map((s) => {
                                    const currentVariant = product.productVariants?.find(
                                        (v) =>
                                            v.colorId === activeColorId &&
                                            v.sizeId === s.sizeId
                                    );

                                    const isOutOfStock =
                                        !currentVariant || currentVariant.quantity <= 0;

                                    return (
                                        <button
                                            key={s.sizeId}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();

                                                if (!isOutOfStock) {
                                                    console.log("Thêm vào giỏ:", {
                                                        color: activeColorId,
                                                        size: s.sizeId,
                                                    });
                                                }
                                            }}
                                            className={`relative overflow-hidden min-w-[42px] h-9 px-3 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all duration-300 ${
                                                isOutOfStock
                                                    ? "bg-zinc-600 text-zinc-400 cursor-not-allowed opacity-60"
                                                    : "bg-zinc-500/30 text-white hover:bg-white hover:text-zinc-900 hover:scale-105 active:scale-95 cursor-pointer"
                                            }`}
                                        >
                                            <span>{s.sizeName}</span>

                                            {isOutOfStock && (
                                                <div className="absolute w-[160%] h-[1px] bg-zinc-400 rotate-[-35deg]" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* PRODUCT INFO */}
                <div className="pt-5 px-1 flex flex-col gap-4">

                    {/* COLOR SELECTOR */}
                    <div className="flex items-center gap-2">
                        {product.productColors?.map((color) => (
                            <button
                                key={color.colorId}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setActiveColorId(color.colorId);
                                }}
                                title={color.colorName}
                                className={`relative w-7 h-7 rounded-full transition-all duration-300 ${
                                    activeColorId === color.colorId
                                        ? "scale-110 ring-2 ring-white ring-offset-2 ring-offset-zinc-900"
                                        : "hover:scale-105 opacity-70 hover:opacity-100"
                                }`}
                            >
                                <span
                                    className="block w-full h-full rounded-full border border-white/10 shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]"
                                    style={{ backgroundColor: color.colorHexCode }}
                                />
                            </button>
                        ))}
                    </div>

                    {/* PRODUCT TEXT */}
                    <div className="flex flex-col gap-2">
                        <h3
                            title={product.name}
                            className="text-[15px] md:text-base font-semibold text-zinc-800 leading-relaxed tracking-[-0.01em] transition-colors duration-300 group-hover/product:text-black line-clamp-2"
                        >
                            {product.name}
                        </h3>

                        <div className="flex items-center gap-3">
                            <span className="text-lg font-black tracking-tight text-zinc-950">
                                {new Intl.NumberFormat("vi-VN").format(product.price)}đ
                            </span>
                        </div>
                    </div>
                </div>
            </article>
        </Link>
    );
};

export default ProductCard;