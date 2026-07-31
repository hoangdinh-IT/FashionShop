import React, { useMemo } from "react";
import { ShoppingBag, Minus, Plus, Loader2 } from "lucide-react";
import type { ProductDetail } from "../../types/product";

interface Props {
    productDetail: ProductDetail;
    activeColorId: number | null;
    setActiveColorId: React.Dispatch<React.SetStateAction<number | null>>;
    activeSizeId: number | null;
    setActiveSizeId: React.Dispatch<React.SetStateAction<number | null>>;
    selectedColorName: string;
    selectedSizeName: string;
    stockQuantity: number;
    isOutOfStock: boolean;
    quantity: number;
    setQuantity: React.Dispatch<React.SetStateAction<number>>;
    handleAddToCart: () => void;
    isCreating: boolean;
}

const ProductInfo: React.FC<Props> = ({
    productDetail,
    activeColorId,
    setActiveColorId,
    activeSizeId,
    setActiveSizeId,
    selectedColorName,
    selectedSizeName,
    stockQuantity,
    isOutOfStock,
    quantity,
    setQuantity,
    handleAddToCart,
    isCreating,
}) => {
    const currentPrice = useMemo(() => {
        if (!productDetail?.productVariants?.length) {
            return productDetail?.originalPrice || 0;
        }

        // Tìm variant khớp cả ColorId và SizeId đang chọn
        const matchedVariant = productDetail.productVariants.find(
            (variant) =>
                variant.colorId === activeColorId && variant.sizeId === activeSizeId
        );

        // Trả về giá tương ứng -> Giá variant đầu tiên -> Giá gốc (originalPrice)
        return (
            matchedVariant?.price ??
            productDetail.productVariants[0]?.price ??
            productDetail.originalPrice
        );
    }, [productDetail, activeColorId, activeSizeId]);

    return (
        <div className="flex flex-col gap-5 sm:gap-6 w-full">
            
            {/* PRODUCT HEADER & PRICE */}
            <div className="flex flex-col gap-2 sm:gap-3 border-b border-zinc-200/80 pb-4 sm:pb-6">
                <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-zinc-900" />
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-zinc-500">
                        Fashion Collection
                    </span>
                </div>

                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-zinc-900 leading-tight">
                    {productDetail?.name}
                </h1>

                <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-zinc-900">
                        {new Intl.NumberFormat('vi-VN').format(currentPrice)}đ
                    </span>

                    {isOutOfStock ? (
                        <span className="rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-red-600">
                            Hết hàng
                        </span>
                    ) : (
                        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                            Còn {stockQuantity} sản phẩm
                        </span>
                    )}
                </div>
            </div>

            {/* COLOR SELECTION */}
            <div className="flex flex-col gap-2.5 sm:gap-3">
                <div className="flex items-center justify-between">
                    <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-zinc-500">
                        Màu sắc
                    </span>
                    <span className="text-xs font-semibold text-zinc-900">
                        {selectedColorName || "Chưa chọn"}
                    </span>
                </div>

                <div className="flex flex-wrap gap-2 sm:gap-2.5">
                    {productDetail?.productColors?.map((color) => {
                        const isSelected = activeColorId === color.colorId;
                        return (
                            <button
                                key={color.colorId}
                                type="button"
                                onClick={() => setActiveColorId(color.colorId)}
                                title={color.colorName}
                                className={`relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full transition-transform cursor-pointer ${
                                    isSelected
                                        ? 'scale-110 ring-2 ring-zinc-900 ring-offset-2'
                                        : 'hover:scale-105 opacity-90'
                                }`}
                            >
                                <span
                                    className="h-full w-full rounded-full border border-zinc-200/80 shadow-2xs"
                                    style={{ backgroundColor: color.colorHexCode }}
                                />
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* SIZE SELECTION */}
            <div className="flex flex-col gap-2.5 sm:gap-3 pt-1 sm:pt-2">
                <div className="flex items-center justify-between">
                    <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-zinc-500">
                        Kích thước
                    </span>
                    <span className="text-xs font-semibold text-zinc-900">
                        {selectedSizeName || "Chưa chọn"}
                    </span>
                </div>

                <div className="flex flex-wrap gap-2">
                    {productDetail?.productSizes?.map((size) => {
                        const variantCheck = productDetail.productVariants?.find(
                            v => v.colorId === activeColorId && v.sizeId === size.sizeId
                        );
                        const sizeOutOfStock = !variantCheck || variantCheck.quantity <= 0;
                        const isSelected = activeSizeId === size.sizeId;

                        return (
                            <button
                                key={size.sizeId}
                                type="button"
                                onClick={() => {
                                    if (!sizeOutOfStock) setActiveSizeId(size.sizeId);
                                }}
                                disabled={sizeOutOfStock}
                                className={`relative flex h-9 sm:h-10 min-w-[44px] sm:min-w-[48px] items-center justify-center rounded-xl border px-3 text-xs font-semibold transition-all cursor-pointer ${
                                    isSelected
                                        ? 'border-zinc-900 bg-zinc-900 text-white shadow-xs'
                                        : sizeOutOfStock
                                            ? 'cursor-not-allowed border-zinc-100 bg-zinc-50 text-zinc-300'
                                            : 'border-zinc-200/80 bg-white text-zinc-700 hover:border-zinc-400 hover:bg-zinc-50'
                                }`}
                            >
                                {size.sizeName}

                                {sizeOutOfStock && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="h-[1px] w-4/5 -rotate-45 bg-zinc-300" />
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* QUANTITY & ADD TO CART ACTIONS */}
            {/* Trên Mobile (< sm): Tự động ghim xuống đáy màn hình (Sticky Bottom Bar) giúp dễ thao tác bằng ngón tay */}
            <div className="fixed bottom-0 left-0 right-0 z-40 flex items-center gap-2.5 border-t border-zinc-200/80 bg-white/95 p-3 backdrop-blur-md shadow-lg sm:relative sm:bottom-auto sm:left-auto sm:right-auto sm:z-0 sm:border-t-0 sm:bg-transparent sm:p-0 sm:shadow-none sm:pt-4">
                
                {/* QUANTITY COUNTER */}
                <div className="flex h-11 sm:h-12 items-center rounded-xl border border-zinc-200/80 bg-white p-1 shadow-2xs">
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            setQuantity(Math.max(1, quantity - 1));
                        }}
                        disabled={isOutOfStock || quantity <= 1}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-600 transition-colors hover:bg-zinc-100 active:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-30 cursor-pointer"
                        aria-label="Decrease quantity"
                    >
                        <Minus size={14} />
                    </button>

                    <input
                        type="text"
                        value={isOutOfStock ? 0 : quantity}
                        readOnly
                        className="w-8 sm:w-10 text-center text-xs font-bold text-zinc-900 outline-none"
                    />

                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            setQuantity(Math.min(stockQuantity, quantity + 1));
                        }}
                        disabled={isOutOfStock || quantity >= stockQuantity}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-600 transition-colors hover:bg-zinc-100 active:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-30 cursor-pointer"
                        aria-label="Increase quantity"
                    >
                        <Plus size={14} />
                    </button>
                </div>

                {/* ADD TO CART BUTTON */}
                <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={isOutOfStock || isCreating}
                    className={`flex h-11 sm:h-12 flex-1 items-center justify-center gap-2 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        isOutOfStock || isCreating
                            ? 'cursor-not-allowed bg-zinc-100 text-zinc-400'
                            : 'bg-zinc-900 text-white shadow-xs hover:bg-zinc-800 active:scale-[0.99]'
                    }`}
                >
                    {isCreating ? (
                        <>
                            <Loader2 size={16} className="animate-spin" />
                            <span>Đang xử lý...</span>
                        </>
                    ) : (
                        <>
                            {!isOutOfStock && <ShoppingBag size={16} />}
                            <span>{isOutOfStock ? 'Hết hàng' : 'Thêm vào giỏ'}</span>
                        </>
                    )}
                </button>
            </div>
            
            {/* Khoảng đệm giả trên Mobile để nội dung trang không bị che mất bởi Sticky Bar */}
            <div className="h-14 sm:hidden" />
        </div>
    );
};

export default ProductInfo;