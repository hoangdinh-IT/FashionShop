import { useState, useEffect, useMemo } from "react";
import { ShoppingBag } from "lucide-react";
import { useParams } from "react-router-dom";

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
        productDetail?.productColors?.find(
            (c) => c.colorId === activeColorId
        )?.colorName || "";

    const selectedSizeName =
        productDetail?.productSizes?.find(
            (s) => s.sizeId === activeSizeId
        )?.sizeName || "";

    const currentVariant = productDetail?.productVariants?.find(
        (v) =>
            v.colorId === activeColorId &&
            v.sizeId === activeSizeId
    );

    const stockQuantity = currentVariant?.quantity || 0;

    const isOutOfStock = stockQuantity === 0;

    useEffect(() => {
        setQuantity(1);
        setSelectedImageIndex(0);
    }, [activeColorId, activeSizeId]);

    const handleAddToCart = () => {
        const currentVariant = productDetail?.productVariants?.find(
            (v) =>
                v.colorId === activeColorId &&
                v.sizeId === activeSizeId
        );

        if (!currentVariant) {
            showSnackbar(
                "Không tìm thấy biến thể sản phẩm!",
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

    if (!productDetail) {
        return (
            <div className="min-h-screen bg-[#fcfcfc] flex items-center justify-center px-6 py-16 overflow-hidden">
                <div className="relative w-full max-w-2xl">
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-[420px] h-[420px] rounded-full bg-zinc-100 blur-3xl opacity-70" />
                    </div>

                    <div className="relative bg-white border border-zinc-200 rounded-[40px] px-10 md:px-16 py-20 text-center shadow-[0_30px_80px_rgba(0,0,0,0.04)] overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-zinc-200 to-transparent" />

                        <div className="relative mx-auto w-28 h-28 rounded-full border border-zinc-200 bg-white flex items-center justify-center">
                            <div className="absolute inset-2 rounded-full border border-zinc-100" />

                            <div className="relative z-10 w-16 h-16 rounded-2xl bg-zinc-900 flex items-center justify-center shadow-lg shadow-zinc-900/10">
                                <ShoppingBag
                                    size={28}
                                    className="text-white"
                                    strokeWidth={2}
                                />
                            </div>
                        </div>

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
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-[1500px] mx-auto px-4 md:px-6 py-6 text-zinc-900">
            <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_0.8fr] gap-8">
                <ProductImages
                    productDetail={productDetail}
                    currentImages={currentImages}
                    selectedImageIndex={selectedImageIndex}
                    setSelectedImageIndex={setSelectedImageIndex}
                    direction={direction}
                    setDirection={setDirection}
                />

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

            <div className="space-y-8">
                <ProductDescription productDetail={productDetail} />
                <ProductReviews productSlug={productSlug || ""} />
            </div>
        </div>
    );
};

export default ProductDetailPage;