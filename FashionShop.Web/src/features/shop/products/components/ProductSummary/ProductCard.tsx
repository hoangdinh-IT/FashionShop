import React, { useState, useEffect } from "react";
import type { ProductGridItem } from "../../types/product";
import { Link } from "react-router-dom";

interface ProductCardProps {
    product: ProductGridItem & { slug?: string };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const [activeColorId, setActiveColorId] = useState(
        product.productColors?.[0]?.colorId
    );

    useEffect(() => {
        setActiveColorId(product.productColors?.[0]?.colorId);
    }, [product]);

    const currentImageUrl =
        product.productColors?.find((c) => c.colorId === activeColorId)
            ?.imageUrl || product.thumbnailUrl;

    const productUrl = `/shop/product/${product.slug}`;

    const hasDiscount = product.discountPercent > 0;

    return (
        <article className="flex flex-col h-full group/card">
            {/* IMAGE SECTION - DUY NHẤT bấm vào hình ảnh mới chuyển trang */}
            <Link to={productUrl} className="block w-full">
                <div className="group/image relative aspect-[3/4] w-full overflow-hidden rounded-xl sm:rounded-2xl bg-zinc-100/80 shadow-xs border border-zinc-200/60">
                    <img
                        src={currentImageUrl}
                        alt={product.name}
                        loading="lazy"
                        className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover/image:scale-105"
                    />

                    {/* LEFT BADGES (Mới, Bán chạy) */}
                    <div className="absolute left-2 top-2 sm:left-3 sm:top-3 z-10 flex flex-col gap-1 sm:gap-1.5">
                        {product.isNew && (
                            <span className="rounded-md border border-zinc-200/80 bg-white/90 px-1.5 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-zinc-900 shadow-2xs backdrop-blur-md">
                                Mới
                            </span>
                        )}

                        {product.isBestSeller && (
                            <span className="rounded-md bg-zinc-900 px-1.5 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white shadow-2xs">
                                Bán chạy
                            </span>
                        )}
                    </div>

                    {/* RIGHT BADGE - GIẢM GIÁ */}
                    {hasDiscount && (
                        <div className="absolute right-2 top-2 sm:right-3 sm:top-3 z-10">
                            <span className="rounded-md bg-gradient-to-r from-red-600 to-rose-500 px-1.5 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-[11px] font-extrabold text-white shadow-md">
                                -{product.discountPercent}%
                            </span>
                        </div>
                    )}

                    {/* QUICK SIZE PANEL */}
                    {product.productSizes && product.productSizes.length > 0 && (
                        <div className="hidden sm:block absolute inset-x-3 bottom-3 z-20 translate-y-2 opacity-0 transition-all duration-300 ease-out group-hover/image:translate-y-0 group-hover/image:opacity-100">
                            <div className="rounded-xl border border-zinc-200/80 bg-white/90 p-2 shadow-lg backdrop-blur-xl">
                                <div className="flex flex-wrap items-center justify-center gap-1.5">
                                    {product.productSizes?.map((s) => {
                                        const currentVariant =
                                            product.productVariants?.find(
                                                (v) =>
                                                    v.colorId === activeColorId &&
                                                    v.sizeId === s.sizeId
                                            );

                                        const isOutOfStock =
                                            !currentVariant ||
                                            currentVariant.quantity <= 0;

                                        return (
                                            <button
                                                key={s.sizeId}
                                                type="button"
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
                                                disabled={isOutOfStock}
                                                className={`relative flex h-8 min-w-[32px] items-center justify-center overflow-hidden rounded-lg border px-2 text-[11px] font-semibold transition-all ${
                                                    isOutOfStock
                                                        ? "cursor-not-allowed border-zinc-200 bg-zinc-100/60 text-zinc-400 opacity-60 " +
                                                          "before:absolute before:h-[1px] before:w-[140%] before:rotate-45 before:bg-zinc-400 " +
                                                          "after:absolute after:h-[1px] after:w-[140%] after:-rotate-45 after:bg-zinc-400"
                                                        : "cursor-pointer border-zinc-200 bg-white text-zinc-800 hover:border-zinc-900 hover:bg-zinc-900 hover:text-white"
                                                }`}
                                            >
                                                <span>{s.sizeName}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </Link>

            {/* PRODUCT INFO */}
            <div className="mt-2.5 sm:mt-4 flex flex-col gap-1.5 sm:gap-2.5 px-0.5">
                {/* COLOR SELECTOR */}
                {product.productColors &&
                    product.productColors.length > 0 && (
                        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1.5 px-1">
                            {product.productColors.map((color) => {
                                const isActive =
                                    activeColorId === color.colorId;

                                return (
                                    <button
                                        key={color.colorId}
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setActiveColorId(color.colorId);
                                        }}
                                        title={color.colorName}
                                        className={`relative flex h-4 w-4 sm:h-5 sm:w-5 shrink-0 items-center justify-center rounded-full transition-all active:scale-95 ${
                                            isActive
                                                ? "ring-2 ring-zinc-900 ring-offset-2 sm:ring-offset-2"
                                                : "hover:scale-105"
                                        }`}
                                    >
                                        <span
                                            className="h-full w-full rounded-full border border-zinc-200/80 shadow-2xs"
                                            style={{
                                                backgroundColor:
                                                    color.colorHexCode,
                                            }}
                                        />
                                    </button>
                                );
                            })}
                        </div>
                    )}

                {/* PRODUCT DETAILS */}
                <div className="space-y-0.5 sm:space-y-1">
                    <h3
                        title={product.name}
                        className="line-clamp-1 text-xs sm:text-sm font-semibold text-zinc-900 select-none"
                    >
                        {product.name}
                    </h3>

                    {/* PRICE DISPLAY */}
                    <div className="flex items-baseline gap-2">
                        <p
                            className={`text-xs sm:text-sm font-bold ${
                                hasDiscount ? "text-red-600" : "text-zinc-900"
                            }`}
                        >
                            {new Intl.NumberFormat("vi-VN").format(
                                product.finalPrice
                            )}
                            ₫
                        </p>
                        {hasDiscount && (
                            <p className="text-[11px] sm:text-xs text-zinc-600 line-through font-medium">
                                {new Intl.NumberFormat("vi-VN").format(
                                    product.originalPrice
                                )}
                                ₫
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </article>
    );
};

export default ProductCard;