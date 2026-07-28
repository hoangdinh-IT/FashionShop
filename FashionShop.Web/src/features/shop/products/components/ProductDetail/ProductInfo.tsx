import { ShoppingBag } from "lucide-react";
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

const ProductInfo = ({
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
}: Props) => {
    return (
        <div className="flex flex-col">
            <div className="flex flex-col">

                {/* TITLE */}
                <div className="pb-6 border-b border-zinc-100">
                    <span className="text-[10px] uppercase tracking-[0.28em] font-bold text-zinc-400">
                        Fashion Collection
                    </span>

                    <h1 className="mt-3 text-[28px] leading-tight font-black tracking-[-0.04em] text-zinc-900">
                        {productDetail.name}
                    </h1>

                    <div className="mt-5 flex items-center gap-3">
                        <span className="text-[26px] font-black tracking-tight text-zinc-900">
                            {new Intl.NumberFormat('vi-VN').format(productDetail.price)}đ
                        </span>

                        {isOutOfStock ? (
                            <span className="px-2.5 py-1 rounded-full bg-red-50 text-[10px] font-bold uppercase tracking-[0.2em] text-red-500 border border-red-100">
                                Out stock
                            </span>
                        ) : (
                            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600 border border-emerald-100">
                                {stockQuantity} available
                            </span>
                        )}
                    </div>
                </div>

                {/* COLORS */}
                <div className="pt-6">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-[11px] uppercase tracking-[0.22em] font-bold text-zinc-400">
                            Color
                        </span>

                        <span className="text-sm font-medium text-zinc-700">
                            {selectedColorName}
                        </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {productDetail.productColors?.map((color) => (
                            <button
                                key={color.colorId}
                                onClick={() => setActiveColorId(color.colorId)}
                                title={color.colorName}
                                className={`w-10 h-10 rounded-full p-1 transition-all duration-300 cursor-pointer ${
                                    activeColorId === color.colorId
                                        ? 'border-2 border-zinc-900 scale-105'
                                        : 'border border-zinc-200 hover:border-zinc-400'
                                }`}
                            >
                                <span
                                    className="block w-full h-full rounded-full border border-black/5"
                                    style={{ backgroundColor: color.colorHexCode }}
                                />
                            </button>
                        ))}
                    </div>
                </div>

                {/* SIZES */}
                <div className="pt-8">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-[11px] uppercase tracking-[0.22em] font-bold text-zinc-400">
                            Size
                        </span>

                        <span className="text-sm font-medium text-zinc-700">
                            {selectedSizeName}
                        </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {productDetail.productSizes?.map((size) => {
                            const variantCheck = productDetail.productVariants?.find(
                                v => v.colorId === activeColorId && v.sizeId === size.sizeId
                            );

                            const sizeOutOfStock = !variantCheck || variantCheck.quantity <= 0;

                            return (
                                <button
                                    key={size.sizeId}
                                    onClick={() => {
                                        if (!sizeOutOfStock) setActiveSizeId(size.sizeId);
                                    }}
                                    className={`relative min-w-[56px] h-10 px-4 rounded-2xl text-xs font-bold transition-all overflow-hidden cursor-pointer ${
                                        activeSizeId === size.sizeId
                                            ? 'bg-zinc-900 text-white'
                                            : sizeOutOfStock
                                                ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed opacity-60'
                                                : 'bg-zinc-50 text-zinc-700 border border-zinc-200 hover:border-zinc-900'
                                    }`}
                                >
                                    {size.sizeName}

                                    {sizeOutOfStock && (
                                        <div className="absolute w-[140%] h-px bg-zinc-400 rotate-[-30deg] left-[-20%] top-1/2" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* ACTIONS */}
                <div className="mt-10">

                    <div className={`flex items-center gap-2 p-1.5 rounded-full border transition-all ${
                        isOutOfStock
                            ? 'border-zinc-200 bg-zinc-100'
                            : 'border-zinc-900 bg-zinc-900'
                    }`}>

                        {/* QUANTITY */}
                        <div className="flex items-center justify-between w-[120px] h-[52px] rounded-full bg-white px-2">

                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    setQuantity(Math.max(1, quantity - 1));
                                }}
                                disabled={isOutOfStock}
                                className="w-9 h-9 rounded-full flex items-center justify-center text-lg text-zinc-700 hover:bg-zinc-100 disabled:opacity-40 cursor-pointer"
                            >
                                -
                            </button>

                            <input
                                type="text"
                                value={isOutOfStock ? 0 : quantity}
                                readOnly
                                className="w-8 bg-transparent text-center text-sm font-bold outline-none border-none"
                            />

                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    setQuantity(Math.min(stockQuantity, quantity + 1));
                                }}
                                disabled={isOutOfStock || quantity >= stockQuantity}
                                className="w-9 h-9 rounded-full flex items-center justify-center text-lg text-zinc-700 hover:bg-zinc-100 disabled:opacity-40 cursor-pointer"
                            >
                                +
                            </button>
                        </div>

                        {/* BUTTON */}
                        <button
                            onClick={handleAddToCart}
                            disabled={isOutOfStock || isCreating}
                            className={`flex-1 h-[52px] rounded-full flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-[0.15em] transition-all ${
                                isOutOfStock || isCreating
                                    ? 'text-zinc-500 cursor-not-allowed'
                                    : 'text-white hover:bg-white/10 cursor-pointer'
                            }`}
                        >
                            {isCreating ? (
                                <span className="animate-pulse">Đang xử lý...</span>
                            ) : (
                                <>
                                    {!isOutOfStock && <ShoppingBag size={17} strokeWidth={2} />}
                                    {isOutOfStock ? 'Hết hàng' : 'Thêm vào giỏ'}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductInfo;