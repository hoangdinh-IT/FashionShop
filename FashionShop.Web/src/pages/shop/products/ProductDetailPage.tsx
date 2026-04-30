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

const ProductDetailPage = () => {
    const { showSnackbar } = useSnackbar();

    const { productSlug } = useParams<{ productSlug: string }>();
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
        return <div className="text-center py-20 text-zinc-500 font-medium">Đang tải chi tiết sản phẩm...</div>;
    }

    if (!productDetail) {
        return <div className="text-center py-20 text-zinc-500 font-medium">Không tìm thấy thông tin sản phẩm.</div>;
    }

    return (
        <div className="w-[85%] max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 py-8 font-sans text-zinc-900">
            {/* MAIN CONTENT GRID */}
            <div className="flex flex-col lg:flex-row gap-10">
                
                {/* --- LEFT: GALLERY KHU VỰC ẢNH --- */}
                <div className="w-full lg:w-[60%] flex gap-2">
    
                    {/* List ảnh nhỏ */}
                    <div className="flex flex-col gap-2 w-[50px] shrink-0"> 
                        {currentImages.map((imgUrl, index) => (
                            <button 
                                key={index}
                                onClick={() => {
                                    setDirection(index > selectedImageIndex ? 1 : -1);
                                    setSelectedImageIndex(index);
                                }}
                                className={`w-full aspect-[3/4] rounded-md overflow-hidden border-2 transition-all duration-300 cursor-pointer ${
                                    selectedImageIndex === index 
                                        ? 'border-zinc-800' 
                                        : 'border-transparent hover:border-zinc-200'
                                }`}
                            >
                                <img 
                                    src={imgUrl} 
                                    alt={`Thumbnail ${index}`} 
                                    className="w-full h-full object-cover" 
                                />
                            </button>
                        ))}
                    </div>

                    {/* Ảnh lớn */}
                    <div className="relative flex-1">
                        
                        {/* Wrapper để giữ đúng positioning */}
                        <div className="relative w-full h-[600px] bg-[#f7f7f7] rounded-2xl overflow-hidden group flex items-center justify-center">
                            
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={selectedImageIndex}
                                    src={currentImages[selectedImageIndex] || "https://placehold.co/600x800/e2e8f0/64748b?text=No+Image"}
                                    alt={productDetail.name}
                                    className="w-full h-full object-contain absolute top-0 left-0"

                                    initial={{ 
                                        x: direction > 0 ? 300 : -300,
                                        opacity: 0 
                                    }}
                                    animate={{ 
                                        x: 0, 
                                        opacity: 1 
                                    }}
                                    exit={{ 
                                        x: direction > 0 ? -300 : 300,
                                        opacity: 0 
                                    }}
                                    transition={{ 
                                        duration: 0.25, 
                                        ease: "easeInOut" 
                                    }}
                                />
                            </AnimatePresence>

                            {/* ✅ Nút nằm CHẮC CHẮN trong góc dưới phải */}
                            {currentImages.length > 1 && (
                                <div className="absolute bottom-3 right-3 z-10 flex gap-2 
                                                bg-black/40 backdrop-blur-md rounded-full 
                                                p-1.5 border border-white/20 shadow-lg">
                                    
                                    <button 
                                        onClick={() => {
                                            setDirection(-1);
                                            setSelectedImageIndex(prev => 
                                                prev > 0 ? prev - 1 : currentImages.length - 1
                                            );
                                        }}
                                        className="w-8 h-8 flex items-center justify-center 
                                                rounded-full bg-white text-zinc-700 
                                                hover:bg-black hover:text-white transition cursor-pointer"
                                    >
                                        <ChevronLeft size={16} />
                                    </button>

                                    <button 
                                        onClick={() => {
                                            setDirection(1);
                                            setSelectedImageIndex(prev => 
                                                prev < currentImages.length - 1 ? prev + 1 : 0
                                            );
                                        }}
                                        className="w-8 h-8 flex items-center justify-center 
                                                rounded-full bg-white text-zinc-700 
                                                hover:bg-black hover:text-white transition cursor-pointer"
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            )}

                        </div>
                    </div>
                </div>

                {/* --- RIGHT: THÔNG TIN SẢN PHẨM --- */}
                <div className="w-full lg:w-[45%] flex flex-col gap-6">
                    
                    {/* Header: Giá & Tên */}
                    <div className="space-y-3">
                        <h1 className="text-2xl font-semibold text-zinc-800 tracking-tight">
                            {productDetail.name}
                        </h1>
                        <div className="flex items-center gap-3">
                            <span className="text-2xl font-bold text-red-600">
                                {new Intl.NumberFormat('vi-VN').format(productDetail.price)}đ
                            </span>
                            {/* Chỗ này nếu BE có trả về Giá Gốc (OriginalPrice) thì bạn lắp vào nhé */}
                            {productDetail.isNew && (
                                <span className="bg-red-600 text-white text-[11px] font-bold px-1.5 py-0.5 rounded">MỚI</span>
                            )}
                            {productDetail.isBestSeller && (
                                <span className="bg-yellow-500 text-white text-[11px] font-bold px-1.5 py-0.5 rounded">BÁN CHẠY</span>
                            )}
                        </div>
                    </div>

                    {/* Chọn Màu sắc */}
                    <div className="space-y-3">
                        <div className="text-sm font-medium">
                            Màu sắc: <span className="font-semibold">{selectedColorName}</span>
                        </div>
                        <div className="flex gap-3">
                            {productDetail.productColors?.map((color) => (
                                <button
                                    key={color.colorId}
                                    onClick={() => setActiveColorId(color.colorId)}
                                    title={color.colorName}
                                    className={`relative w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all cursor-pointer ${
                                        activeColorId === color.colorId ? 'border-blue-600' : 'border-transparent hover:border-zinc-300'
                                    }`}
                                >
                                    <span 
                                        className="w-8 h-8 rounded-full border border-black/10 shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]"
                                        style={{ backgroundColor: color.colorHexCode }}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Chọn Kích thước */}
                    <div className="space-y-3 mt-4">
                        <div className="flex justify-between items-center text-sm">
                            <span className="font-medium text-zinc-800">
                                Kích thước: <span className="font-normal text-zinc-600">{selectedSizeName}</span>
                            </span>
                            <a href="#" className="text-blue-600 hover:underline">Hướng dẫn chọn size</a>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {productDetail.productSizes?.map((size) => {
                                // Kiểm tra size này với màu hiện tại có tồn kho không
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
                                        className={`relative min-w-[4rem] h-11 px-4 rounded-xl text-sm font-bold transition-all overflow-hidden cursor-pointer ${
                                            activeSizeId === size.sizeId 
                                                ? 'bg-black text-white' 
                                                : sizeOutOfStock
                                                    ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed opacity-60'
                                                    : 'bg-[#e5e5e5] text-zinc-800 hover:bg-[#d4d4d4]'
                                        }`}
                                    >
                                        {size.sizeName}
                                        {/* Đường gạch chéo báo hết hàng */}
                                        {sizeOutOfStock && (
                                            <div className="absolute h-[1.5px] w-[150%] bg-zinc-400 origin-center rotate-[-30deg] pointer-events-none left-[-20%] top-1/2" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Trạng thái tồn kho của loại đang chọn */}
                    {isOutOfStock ? (
                        <div className="text-red-500 text-sm font-semibold mt-2">Sản phẩm tạm thời hết hàng</div>
                    ) : (
                        <div className="text-zinc-500 text-sm mt-2">Còn lại {stockQuantity} sản phẩm</div>
                    )}

                    {/* Số lượng & Nút Thêm vào giỏ */}
                    <div className="flex pt-4 w-full">
                        {/* Khuôn ngoài cùng: Hình viên thuốc màu đen (đóng vai trò là nền của cả cụm).
                          Thuộc tính p-1.5 (padding) tạo một lớp đệm mỏng màu đen bao quanh khối số lượng.
                        */}
                        <div className={`flex items-center w-full h-[60px] rounded-full transition-colors shadow-sm ${
                            isOutOfStock ? 'bg-zinc-200' : 'bg-black'
                        }`}>
                            
                            {/* KHỐI SỐ LƯỢNG: Nằm gọn bên trong, bo tròn 4 góc (rounded-full) */}
                            <div className="flex items-center justify-between bg-[#595959] text-white w-[130px] h-full px-2 shrink-0 rounded-full transition-opacity">
                                <button 
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setQuantity(Math.max(1, quantity - 1));
                                    }}
                                    disabled={isOutOfStock}
                                    className="w-10 h-full flex items-center justify-center hover:text-white/70 disabled:opacity-50 text-2xl font-light pb-1 cursor-pointer"
                                >
                                    -
                                </button>
                                <input 
                                    type="text" 
                                    value={isOutOfStock ? 0 : quantity} 
                                    readOnly
                                    className="w-8 text-center text-base font-semibold border-none outline-none focus:ring-0 bg-transparent text-white p-0 pointer-events-none"
                                />
                                <button 
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setQuantity(Math.min(stockQuantity, quantity + 1));
                                    }}
                                    disabled={isOutOfStock || quantity >= stockQuantity}
                                    className="w-10 h-full flex items-center justify-center hover:text-white/70 disabled:opacity-50 text-xl font-light cursor-pointer"
                                >
                                    +
                                </button>
                            </div>
                            
                            {/* NÚT THÊM VÀO GIỎ: Bắt trọn phần diện tích còn lại */}
                            <button 
                                onClick={handleAddToCart}
                                disabled={isOutOfStock || isCreating} // Vô hiệu hóa khi hết hàng hoặc đang gửi request
                                className={`flex-1 h-full flex items-center justify-center gap-2 font-bold text-base rounded-full transition-colors cursor-pointer ${
                                    isOutOfStock || isCreating
                                    ? 'text-zinc-500 cursor-not-allowed'
                                    : 'text-white hover:bg-white/10'
                                }`}
                            >
                                {isCreating ? (
                                    <span className="animate-pulse">Đang xử lý...</span>
                                ) : (
                                    <>
                                        {!isOutOfStock && <ShoppingBag size={20} strokeWidth={2} />}
                                        {isOutOfStock ? 'HẾT HÀNG' : 'Thêm vào giỏ'}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- TAB CHI TIẾT SẢN PHẨM Ở DƯỚI --- */}
            <div className="mt-16 border border-zinc-200 rounded-lg overflow-hidden">
                <div className="border-b border-zinc-200">
                    <button className="px-6 py-4 text-base font-bold text-zinc-900 border-b-2 border-zinc-900">
                        Chi tiết sản phẩm
                    </button>
                </div>
                {/* Dùng whitespace-pre-line để giữ nguyên dấu xuống dòng \r\n từ DB trả về */}
                <div className="p-6 bg-white text-zinc-700 text-sm leading-relaxed whitespace-pre-line">
                    {productDetail.content || "Chưa có thông tin chi tiết cho sản phẩm này."}
                    
                    {productDetail.material && (
                        <div className="mt-6 pt-6 border-t border-zinc-100">
                            <h3 className="font-bold text-zinc-900 mb-2">Chất liệu:</h3>
                            <p>{productDetail.material}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;