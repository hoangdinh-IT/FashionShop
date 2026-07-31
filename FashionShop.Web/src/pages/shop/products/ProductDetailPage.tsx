import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { useProductDetail } from "../../../features/shop/products/hooks/useProducts";
import { useCartMutations } from "../../../features/shop/carts/hooks/useCarts";

import type { CartFormInputs } from "../../../features/shop/carts/types/requests";

import { useSnackbar } from "../../../contexts";

import Loading from "../../../components/common/Loading";
import ProductImages from "../../../features/shop/products/components/ProductDetail/ProductImages";
import ProductInfo from "../../../features/shop/products/components/ProductDetail/ProductInfo";
import ProductDescription from "../../../features/shop/products/components/ProductDetail/ProductDescription";
import ProductReviews from "../../../features/shop/products/components/ProductDetail/ProductReviews";

const ProductDetailPage = () => {
    const { showSnackbar } = useSnackbar();
    const { productSlug } = useParams<{ productSlug: string }>();

    // Tự động cuộn lên đầu trang mỗi khi chuyển sản phẩm
    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "instant",
        });
    }, [productSlug]);

    const { productDetail, isLoading } = useProductDetail(productSlug);
    const { createCartItem, isCreating } = useCartMutations();

    const [activeColorId, setActiveColorId] = useState<number | null>(null);
    const [activeSizeId, setActiveSizeId] = useState<number | null>(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [direction, setDirection] = useState(0);

    // Khởi tạo biến thể mặc định khi tải xong dữ liệu sản phẩm
    useEffect(() => {
        if (productDetail) {
            const defaultColor = productDetail.productColors?.[0]?.colorId ?? null;
            const defaultSize = productDetail.productSizes?.[0]?.sizeId ?? null;

            setActiveColorId(defaultColor);
            setActiveSizeId(defaultSize);
            setSelectedImageIndex(0);
            setQuantity(1);
        }
    }, [productDetail]);

    // Danh sách hình ảnh ứng với màu sắc đang chọn
    const currentImages = useMemo(() => {
        if (!productDetail) return [];

        const imagesForColor = productDetail.productImages
            ?.filter((img) => img.colorId === activeColorId)
            ?.sort((a, b) => a.sortOrder - b.sortOrder)
            ?.map((img) => img.imageUrl);

        if (imagesForColor && imagesForColor.length > 0) {
            return imagesForColor;
        }

        if (productDetail.thumbnailUrl) {
            return [productDetail.thumbnailUrl];
        }

        return [];
    }, [productDetail, activeColorId]);

    // Tên màu sắc & kích thước hiện tại
    const selectedColorName = useMemo(() => {
        return (
            productDetail?.productColors?.find((c) => c.colorId === activeColorId)
                ?.colorName || ""
        );
    }, [productDetail, activeColorId]);

    const selectedSizeName = useMemo(() => {
        return (
            productDetail?.productSizes?.find((s) => s.sizeId === activeSizeId)
                ?.sizeName || ""
        );
    }, [productDetail, activeSizeId]);

    // Biến thể (Variant) hiện tại dựa trên màu và size
    const currentVariant = useMemo(() => {
        return productDetail?.productVariants?.find(
            (v) => v.colorId === activeColorId && v.sizeId === activeSizeId
        );
    }, [productDetail, activeColorId, activeSizeId]);

    const stockQuantity = currentVariant?.quantity || 0;
    const isOutOfStock = stockQuantity === 0;

    // Xử lý Thêm vào giỏ hàng với kiểm tra ràng buộc
    const handleAddToCart = () => {
        if (!currentVariant) {
            showSnackbar("Vui lòng chọn đầy đủ màu sắc và kích thước!", "error");
            return;
        }

        if (isOutOfStock) {
            showSnackbar("Sản phẩm hiện tại đã hết hàng!", "error");
            return;
        }

        if (quantity > stockQuantity) {
            showSnackbar(
                `Chỉ còn ${stockQuantity} sản phẩm trong kho. Vui lòng chọn lại!`,
                "error"
            );
            return;
        }

        const cartData: CartFormInputs = {
            productVariantId: currentVariant.productVariantId,
            quantity: quantity,
        };

        createCartItem(cartData);
    };

    if (isLoading) {
        return <Loading />;
    }

    /* TRẠNG THÁI KHÔNG TÌM THẤY SẢN PHẨM (EMPTY STATE) */
    if (!productDetail) {
        return (
            <div className="flex min-h-[60vh] sm:min-h-[70vh] items-center justify-center px-4 py-8 sm:py-16">
                <div className="w-full max-w-md rounded-2xl border border-zinc-200/80 bg-white p-6 sm:p-8 text-center shadow-2xs">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 text-zinc-900">
                        <ShoppingBag size={20} />
                    </div>

                    <div className="mt-4">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                            Không khả dụng
                        </span>
                        <h1 className="mt-1 text-lg sm:text-xl font-black tracking-tight text-zinc-900">
                            Không tìm thấy sản phẩm
                        </h1>
                        <p className="mt-2 text-xs font-medium leading-relaxed text-zinc-500">
                            Sản phẩm bạn tìm kiếm có thể đã bị gỡ khỏi cửa hàng hoặc đường dẫn không khả dụng.
                        </p>
                    </div>

                    <div className="mt-6">
                        <Link
                            to="/products"
                            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-zinc-900 px-5 py-2.5 text-xs font-bold text-white transition-all hover:bg-zinc-800 active:scale-98"
                        >
                            <ArrowLeft size={14} />
                            <span>Quay lại cửa hàng</span>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8 text-zinc-900">
            {/* GRID CHÍNH (ẢNH + THÔNG TIN MUA HÀNG) */}
            <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-12 lg:gap-10 xl:gap-12 items-start">
                {/* BỘ BỘ BỘ BỘ BỘ BỘ ẢNH SẢN PHẨM */}
                <div className="w-full lg:col-span-7">
                    <ProductImages
                        productDetail={productDetail}
                        currentImages={currentImages}
                        selectedImageIndex={selectedImageIndex}
                        setSelectedImageIndex={setSelectedImageIndex}
                        direction={direction}
                        setDirection={setDirection}
                    />
                </div>

                {/* THÔNG TIN VÀ NÚT MUA HÀNG (Sticky khi cuộn trang trên màn hình lớn) */}
                <div className="w-full lg:col-span-5 lg:sticky lg:top-24">
                    <ProductInfo
                        productDetail={productDetail}
                        activeColorId={activeColorId}
                        setActiveColorId={setActiveColorId}
                        activeSizeId={activeSizeId}
                        setActiveSizeId={setActiveSizeId}
                        selectedColorName={selectedColorName}
                        selectedSizeName={selectedSizeName}
                        stockQuantity={stockQuantity}
                        isOutOfStock={isOutOfStock}
                        quantity={quantity}
                        setQuantity={setQuantity}
                        handleAddToCart={handleAddToCart}
                        isCreating={isCreating}
                    />
                </div>
            </div>

            {/* MÔ TẢ & ĐÁNH GIÁ SẢN PHẨM */}
            <div className="mt-8 sm:mt-12 lg:mt-16 space-y-8 sm:space-y-12">
                <ProductDescription productDetail={productDetail} />
                <ProductReviews productSlug={productSlug || ""} />
            </div>
        </div>
    );
};

export default ProductDetailPage;