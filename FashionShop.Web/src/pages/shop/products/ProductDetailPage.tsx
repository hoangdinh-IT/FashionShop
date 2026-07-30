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

    const selectedColorName =
        productDetail?.productColors?.find((c) => c.colorId === activeColorId)
            ?.colorName || "";

    const selectedSizeName =
        productDetail?.productSizes?.find((s) => s.sizeId === activeSizeId)
            ?.sizeName || "";

    const currentVariant = productDetail?.productVariants?.find(
        (v) => v.colorId === activeColorId && v.sizeId === activeSizeId
    );

    const stockQuantity = currentVariant?.quantity || 0;
    const isOutOfStock = stockQuantity === 0;

    useEffect(() => {
        setQuantity(1);
        setSelectedImageIndex(0);
    }, [activeColorId, activeSizeId]);

    const handleAddToCart = () => {
        const currentVariant = productDetail?.productVariants?.find(
            (v) => v.colorId === activeColorId && v.sizeId === activeSizeId
        );

        if (!currentVariant) {
            showSnackbar("Không tìm thấy biến thể sản phẩm!", "error");
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

    /* EMPTY STATE (NOT FOUND) */
    if (!productDetail) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
                <div className="w-full max-w-md text-center rounded-2xl border border-zinc-200/80 bg-white p-8 shadow-2xs">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 text-zinc-900">
                        <ShoppingBag size={20} />
                    </div>

                    <div className="mt-4">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                            Không khả dụng
                        </span>
                        <h1 className="mt-1 text-xl font-black tracking-tight text-zinc-900">
                            Không tìm thấy sản phẩm
                        </h1>
                        <p className="mt-2 text-xs leading-relaxed text-zinc-500 font-medium">
                            Sản phẩm bạn tìm kiếm có thể đã bị gỡ khỏi cửa hàng hoặc đường dẫn không khả dụng.
                        </p>
                    </div>

                    <div className="mt-6">
                        <Link
                            to="/products"
                            className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-xs font-bold text-white transition-all hover:bg-zinc-800 active:scale-98"
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
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 text-zinc-900">
            {/* MAIN LAYOUT GRID */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
                {/* PRODUCT IMAGES GALLERY */}
                <div className="lg:col-span-7">
                    <ProductImages
                        productDetail={productDetail}
                        currentImages={currentImages}
                        selectedImageIndex={selectedImageIndex}
                        setSelectedImageIndex={setSelectedImageIndex}
                        direction={direction}
                        setDirection={setDirection}
                    />
                </div>

                {/* PRODUCT PURCHASING INFORMATION */}
                <div className="lg:col-span-5">
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

            {/* DESCRIPTION & REVIEWS SECTION */}
            <div className="mt-12 space-y-4">
                <ProductDescription productDetail={productDetail} />
                <ProductReviews productSlug={productSlug || ""} />
            </div>
        </div>
    );
};

export default ProductDetailPage;