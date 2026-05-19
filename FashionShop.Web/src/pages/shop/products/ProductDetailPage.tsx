import { useState, useEffect, useMemo } from 'react';
import { 
    ShoppingBag, 
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useProductDetail } from '../../../features/shop/products/hooks/useProducts';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartMutations } from '../../../features/shop/carts/hooks/useCarts';
import type { CartFormInputs } from '../../../features/shop/carts/types/requests';
import { useSnackbar } from '../../../contexts';
import Loading from '../../../components/common/Loading';

const ProductDetailPage = () => {
    const { showSnackbar } = useSnackbar();

    const { productSlug } = useParams<{ productSlug: string }>();

    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant' // Dùng 'smooth' nếu muốn cuộn mượt, 'instant' để nhảy ngay lập tức
        });
    }, [productSlug]);
    
    const { productDetail, isLoading } = useProductDetail(productSlug);
    const { createCartItem, isCreating } = useCartMutations();
    
    // --- UI STATES ---
    const [activeColorId, setActiveColorId] = useState<number | null>(null);
    const [activeSizeId, setActiveSizeId] = useState<number | null>(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [direction, setDirection] = useState(0);

    // 1. Khởi tạo giá trị mặc định khi dữ liệu vừa load xong
    useEffect(() => {
        if (productDetail) {
            if (productDetail.productColors?.length > 0) {
                setActiveColorId(productDetail.productColors[0].colorId);
            }
            if (productDetail.productSizes?.length > 0) {
                setActiveSizeId(productDetail.productSizes[0].sizeId);
            }
            setSelectedImageIndex(0);
            setQuantity(1);
        }
    }, [productDetail]);

    // 2. Lọc danh sách ảnh theo Màu Sắc đang chọn
    const currentImages = useMemo(() => {
        if (!productDetail) return [];
        const imagesForColor = productDetail.productImages
            ?.filter(img => img.colorId === activeColorId)
            ?.sort((a, b) => a.sortOrder - b.sortOrder)
            ?.map(img => img.imageUrl);

        // Nếu không có ảnh nào của màu này, dùng ảnh thumbnail bù vào
        if (imagesForColor && imagesForColor.length > 0) return imagesForColor;
        if (productDetail.thumbnailUrl) return [productDetail.thumbnailUrl];
        return [];
    }, [productDetail, activeColorId]);

    // Lấy thông tin Tên Màu, Tên Size đang chọn
    const selectedColorName = productDetail?.productColors?.find(c => c.colorId === activeColorId)?.colorName || '';
    const selectedSizeName = productDetail?.productSizes?.find(s => s.sizeId === activeSizeId)?.sizeName || '';

    // 3. Kiểm tra tồn kho của Biến thể (Màu + Size) đang chọn
    const currentVariant = productDetail?.productVariants?.find(
        v => v.colorId === activeColorId && v.sizeId === activeSizeId
    );
    const stockQuantity = currentVariant?.quantity || 0;
    const isOutOfStock = stockQuantity === 0;

    // Reset Số lượng mua nếu đổi biến thể
    useEffect(() => {
        setQuantity(1);
        setSelectedImageIndex(0);
    }, [activeColorId, activeSizeId]);

    const handleAddToCart = () => {
        // Tìm biến thể hiện tại dựa trên màu và size đã chọn
        const currentVariant = productDetail?.productVariants?.find(
            v => v.colorId === activeColorId && v.sizeId === activeSizeId
        );

        if (!currentVariant) {
            showSnackbar("Không tìm thấy biến thể sản phẩm!", "error");
            return;
        }

        const cartData: CartFormInputs = {
            productVariantId: currentVariant.productVariantId, // Đảm bảo tên trường khớp với API (thường là id hoặc productVariantId)
            quantity: quantity
        };

        createCartItem(cartData);
    };


    // --- RENDERING ---
    if (isLoading) {
        return <Loading />
    }

    if (!productDetail) {
        return (
            <div className="min-h-screen bg-[#fcfcfc] flex items-center justify-center px-6 py-16 overflow-hidden">
                <div className="relative w-full max-w-2xl">
                    
                    {/* Background Glow */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-[420px] h-[420px] rounded-full bg-zinc-100 blur-3xl opacity-70" />
                    </div>

                    {/* Card */}
                    <div className="relative bg-white border border-zinc-200 rounded-[40px] px-10 md:px-16 py-20 text-center shadow-[0_30px_80px_rgba(0,0,0,0.04)] overflow-hidden">
                        
                        {/* Decorative Line */}
                        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-zinc-200 to-transparent" />

                        {/* Icon */}
                        <div className="relative mx-auto w-28 h-28 rounded-full border border-zinc-200 bg-white flex items-center justify-center">
                            <div className="absolute inset-2 rounded-full border border-zinc-100" />

                            <div className="relative z-10 w-16 h-16 rounded-2xl bg-zinc-900 flex items-center justify-center shadow-lg shadow-zinc-900/10">
                                <ShoppingBag size={28} className="text-white" strokeWidth={2} />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="mt-10">
                            <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-zinc-400">
                                Product unavailable
                            </span>

                            <h1 className="mt-5 text-[36px] md:text-[48px] leading-none font-black tracking-[-0.06em] text-zinc-900">
                                Không tìm thấy sản phẩm
                            </h1>

                            <p className="mt-6 max-w-xl mx-auto text-[15px] leading-8 text-zinc-500 font-medium">
                                Sản phẩm bạn đang tìm kiếm có thể đã được gỡ khỏi cửa hàng hoặc hiện không còn khả dụng.
                            </p>
                        </div>

                        {/* Divider */}
                        <div className="flex items-center justify-center gap-4 mt-12">
                            <div className="w-14 h-px bg-zinc-200" />
                            <div className="w-1.5 h-1.5 rounded-full bg-zinc-300" />
                            <div className="w-14 h-px bg-zinc-200" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
    <div className="w-full max-w-[1500px] mx-auto px-4 md:px-6 py-6 text-zinc-900">
        {!productDetail ? (
            <div className="min-h-[70vh] flex items-center justify-center">
                <div className="relative w-full max-w-xl overflow-hidden rounded-[32px] border border-zinc-200 bg-white px-8 py-14 text-center shadow-[0_10px_40px_rgba(0,0,0,0.04)]">

                    <div className="absolute top-[-80px] left-1/2 -translate-x-1/2 w-[260px] h-[260px] rounded-full bg-zinc-100 blur-3xl opacity-70" />

                    <div className="relative z-10">
                        <div className="mx-auto w-20 h-20 rounded-[24px] bg-zinc-900 flex items-center justify-center shadow-lg shadow-zinc-900/10">
                            <ShoppingBag size={22} className="text-white" strokeWidth={2} />
                        </div>

                        <div className="mt-8">
                            <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-zinc-400">
                                Product unavailable
                            </span>

                            <h1 className="mt-3 text-[30px] md:text-[36px] font-black tracking-[-0.04em] text-zinc-900">
                                Không tìm thấy sản phẩm
                            </h1>

                            <p className="mt-4 text-sm leading-7 text-zinc-500 max-w-md mx-auto">
                                Sản phẩm bạn đang tìm kiếm có thể đã được gỡ khỏi cửa hàng hoặc hiện không còn khả dụng.
                            </p>
                        </div>

                        <div className="flex items-center justify-center gap-3 mt-8">
                            <div className="w-12 h-px bg-zinc-200" />
                            <div className="w-1.5 h-1.5 rounded-full bg-zinc-300" />
                            <div className="w-12 h-px bg-zinc-200" />
                        </div>
                    </div>
                </div>
            </div>
        ) : (
            <>
                {/* MAIN */}
                <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_0.8fr] gap-8">

                    {/* LEFT */}
                    <div className="flex gap-3">

                        {/* THUMBNAILS */}
                        <div className="flex flex-col gap-2 w-[58px] shrink-0">
                            {currentImages.map((imgUrl, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setDirection(index > selectedImageIndex ? 1 : -1);
                                        setSelectedImageIndex(index);
                                    }}
                                    className={`relative overflow-hidden rounded-2xl aspect-[3/4] border transition-all duration-300 ${
                                        selectedImageIndex === index
                                            ? 'border-zinc-900 shadow-sm'
                                            : 'border-zinc-200 hover:border-zinc-400'
                                    }`}
                                >
                                    <img src={imgUrl} alt={`Thumbnail ${index}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>

                        {/* MAIN IMAGE */}
                        <div className="relative flex-1 overflow-hidden rounded-[32px] border border-zinc-200 bg-[#f5f5f5]">

                            <div className="absolute top-5 left-5 z-20 flex flex-col gap-2">
                                {productDetail.isNew && (
                                    <span className="px-3 py-1 rounded-full bg-white text-[10px] font-bold uppercase tracking-[0.2em] border border-zinc-200">
                                        New
                                    </span>
                                )}

                                {productDetail.isBestSeller && (
                                    <span className="px-3 py-1 rounded-full bg-zinc-900 text-white text-[10px] font-bold uppercase tracking-[0.2em]">
                                        Best Seller
                                    </span>
                                )}
                            </div>

                            <div className="relative h-[520px] overflow-hidden">
                                <AnimatePresence mode="wait">
                                    <motion.img
                                        key={selectedImageIndex}
                                        src={currentImages[selectedImageIndex] || "https://placehold.co/600x800/e2e8f0/64748b?text=No+Image"}
                                        alt={productDetail.name}
                                        className="absolute inset-0 w-full h-full object-contain p-8"

                                        initial={{
                                            opacity: 0,
                                            x: direction > 0 ? 80 : -80
                                        }}
                                        animate={{
                                            opacity: 1,
                                            x: 0
                                        }}
                                        exit={{
                                            opacity: 0,
                                            x: direction > 0 ? -80 : 80
                                        }}
                                        transition={{
                                            duration: 0.25,
                                            ease: "easeInOut"
                                        }}
                                    />
                                </AnimatePresence>
                            </div>

                            {currentImages.length > 1 && (
                                <div className="absolute bottom-5 right-5 flex items-center gap-2 rounded-full border border-white/20 bg-black/40 backdrop-blur-md p-1.5">

                                    <button
                                        onClick={() => {
                                            setDirection(-1);
                                            setSelectedImageIndex(prev =>
                                                prev > 0 ? prev - 1 : currentImages.length - 1
                                            );
                                        }}
                                        className="w-9 h-9 rounded-full bg-white text-zinc-700 flex items-center justify-center hover:bg-zinc-900 hover:text-white transition-all cursor-pointer"
                                    >
                                        <ChevronLeft size={15} />
                                    </button>

                                    <button
                                        onClick={() => {
                                            setDirection(1);
                                            setSelectedImageIndex(prev =>
                                                prev < currentImages.length - 1 ? prev + 1 : 0
                                            );
                                        }}
                                        className="w-9 h-9 rounded-full bg-white text-zinc-700 flex items-center justify-center hover:bg-zinc-900 hover:text-white transition-all cursor-pointer"
                                    >
                                        <ChevronRight size={15} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT */}
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

                {/* DESCRIPTION */}
                <div className="mt-14 overflow-hidden rounded-[28px] border border-zinc-200 bg-white">

                    <div className="px-6 py-5 border-b border-zinc-100 flex items-center justify-between">
                        <div>
                            <span className="text-[10px] uppercase tracking-[0.28em] font-bold text-zinc-400">
                                Product Details
                            </span>

                            <h2 className="mt-2 text-xl font-black tracking-tight text-zinc-900">
                                Chi tiết sản phẩm
                            </h2>
                        </div>
                    </div>

                    <div className="px-6 py-6 text-sm leading-8 text-zinc-600 whitespace-pre-line">
                        {productDetail.description || "Chưa có thông tin chi tiết cho sản phẩm này."}

                        {productDetail.material && (
                            <div className="mt-8 pt-8 border-t border-zinc-100">
                                <h3 className="mb-2 text-sm font-bold uppercase tracking-[0.15em] text-zinc-900">
                                    Chất liệu
                                </h3>

                                <p>{productDetail.material}</p>
                            </div>
                        )}
                    </div>
                </div>
            </>
        )}
    </div>
);
};

export default ProductDetailPage;