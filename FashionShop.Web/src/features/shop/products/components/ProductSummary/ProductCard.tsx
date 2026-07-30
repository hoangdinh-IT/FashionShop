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

    return (
        <Link to={productUrl} className="block">
            <article className="flex flex-col">
                {/* IMAGE SECTION - Đã thêm class `group/image` tại đây */}
                <div className="group/image relative aspect-[3/4] overflow-hidden rounded-2xl bg-zinc-100/80 shadow-xs border border-zinc-200/60">
                    <img
                        src={currentImageUrl}
                        alt={product.name}
                        loading="lazy"
                        className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover/image:scale-105"
                    />

                    {/* BADGES */}
                    <div className="absolute left-3 top-3 z-10 flex flex-col gap-1.5">
                        {product.isNew && (
                            <span className="rounded-md border border-zinc-200/80 bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-900 shadow-2xs backdrop-blur-md">
                                Mới
                            </span>
                        )}

                        {product.isBestSeller && (
                            <span className="rounded-md bg-zinc-900 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-2xs">
                                Bán chạy
                            </span>
                        )}
                    </div>

                    {/* QUICK SIZE PANEL - Chỉ hiển thị khi hover vào phần ảnh (group-hover/image) */}
                    <div className="absolute inset-x-3 bottom-3 z-20 translate-y-2 opacity-0 transition-all duration-300 ease-out group-hover/image:translate-y-0 group-hover/image:opacity-100">
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
                </div>

                {/* PRODUCT INFO */}
                <div className="mt-4 flex flex-col gap-2.5 px-0.5">
                    {/* COLOR SELECTOR */}
                    {product.productColors &&
                        product.productColors.length > 0 && (
                            <div className="flex items-center gap-1.5">
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
                                            className={`relative flex h-5 w-5 items-center justify-center rounded-full transition-transform ${
                                                isActive
                                                    ? "scale-110 ring-2 ring-zinc-900 ring-offset-2"
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
                    <div className="space-y-1">
                        <h3
                            title={product.name}
                            className="line-clamp-1 text-sm font-semibold text-zinc-900 transition-colors hover:text-zinc-600"
                        >
                            {product.name}
                        </h3>

                        <p className="text-sm font-bold text-zinc-900">
                            {new Intl.NumberFormat("vi-VN").format(
                                product.price
                            )}
                            ₫
                        </p>
                    </div>
                </div>
            </article>
        </Link>
    );
};

export default ProductCard;