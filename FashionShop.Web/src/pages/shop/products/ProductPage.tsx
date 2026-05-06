import React, { useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Imports từ project
import SidebarFilter from '../../../features/shop/products/components/SidebarFilter';
import ProductCard from '../../../features/shop/products/components/ProductCard';
import { useFilterOptions, useProducts } from '../../../features/shop/products/hooks/useProducts';
import type { FilterOptionsRequest, ProductQueryParams } from '../../../features/shop/products/types/requests';
import ProductSkeleton from '../../../components/common/ProductSkeleton';
import ProductHeader from '../../../features/shop/products/components/ProductHeader';

interface ProductPageProps {
    collectionType?: "new-arrivals" | "best-sellers";
}

const SORT_OPTIONS = [
    { value: "default", label: "Mặc định" },
    { value: "newest", label: "Mới nhất" },
    { value: "bestseller", label: "Bán chạy nhất" },
    { value: "price-asc", label: "Giá: Thấp đến cao" },
    { value: "price-desc", label: "Giá: Cao đến thấp" },
];

const CollectionBanner: React.FC<{ type: "new-arrivals" | "best-sellers" }> = ({ type }) => {
    const isNew = type === "new-arrivals";
    return (
        <div className="relative w-full h-[400px] md:h-[500px] bg-zinc-100 overflow-hidden mb-16 first:mt-4">
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 px-6">
                <motion.span 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] text-zinc-500 mb-4"
                >
                    {isNew ? "Spring // Summer 2026" : "Most Wanted Items"}
                </motion.span>
                <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl md:text-6xl font-black italic tracking-tighter text-zinc-900 mb-8 uppercase"
                >
                    {isNew ? "New Arrivals" : "Best Sellers"}
                </motion.h2>
                <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 bg-zinc-900 text-white text-[11px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors"
                >
                    Khám phá ngay
                </motion.button>
            </div>
            {/* Overlay giả lập ảnh */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5" />
        </div>
    );
};

const ProductPage: React.FC<ProductPageProps> = ({ collectionType }) => {
    const { brandSlug, categorySlug } = useParams<{ brandSlug: string, categorySlug: string }>();
    const [searchParams, setSearchParams] = useSearchParams();

    // KIỂM TRA CHẾ ĐỘ HIỂN THỊ
    const isShopView = !!brandSlug || !!categorySlug;

    // --- LOGIC HOÀN TOÀN GIỮ NGUYÊN NHƯ CODE CỦA BẠN ---
    const rawSizeSlugs = searchParams.get("size");
    const urlSizeSlugs = (rawSizeSlugs && rawSizeSlugs !== "undefined" && rawSizeSlugs !== "null")
        ? rawSizeSlugs.split(",").filter(Boolean)
        : [];

    const rawColorSlug = searchParams.get("color");
    const urlColorSlug = (rawColorSlug && rawColorSlug !== "null" && rawColorSlug !== "undefined")
        ? rawColorSlug
        : "";

    const rawPriceRange = searchParams.get("price_range");
    const urlPriceRange = (rawPriceRange && rawPriceRange !== "undefined" && rawPriceRange !== "null")
        ? rawPriceRange.split(",").filter(Boolean)
        : [];

    const urlSort = searchParams.get("sort") || "default";

    const [queryParams, setQueryParams] = useState<ProductQueryParams>({
        keyword: undefined,
        brandSlug: brandSlug || undefined,
        categorySlug: categorySlug || undefined,
        sizeSlugs: urlSizeSlugs.length > 0 ? urlSizeSlugs : [],
        colorSlug: urlColorSlug !== "" ? urlColorSlug : "",
        isBestSeller: collectionType === 'best-sellers' ? true : undefined,
        isNew: collectionType === 'new-arrivals' ? true : undefined,
        priceRange: urlPriceRange.length > 0 ? urlPriceRange : [],
        pageSize: 4,
        pageIndex: 1,
        sortBy: urlSort, 
    });

    const [filterOptionParams, setFilterOptionParams] = useState<FilterOptionsRequest>({
        brandSlug: brandSlug || undefined,
        categorySlug: categorySlug || undefined,
    });

    const { pagedProducts, totalProducts, isLoading } = useProducts(queryParams);
    const { filterOptions } = useFilterOptions(filterOptionParams);

    useEffect(() => {
        const freshSizeSlugs = searchParams.get("size");
        const cleanSizeSlugs = (freshSizeSlugs && freshSizeSlugs !== "null" && freshSizeSlugs !== "undefined")
            ? freshSizeSlugs.split(",").filter(Boolean)
            : [];

        const freshColorSlug = searchParams.get("color");
        const cleanColorSlug = (freshColorSlug && freshColorSlug !== "null" && freshColorSlug !== "undefined")
            ? freshColorSlug
            : "";

        const freshPriceRange = searchParams.get("price_range");
        const cleanPriceRange = (freshPriceRange && freshPriceRange !== "null" && freshPriceRange !== "undefined")
            ? freshPriceRange.split(",").filter(Boolean)
            : [];

        const cleanSort = searchParams.get("sort") || "default";

        setQueryParams(prev => ({
            ...prev,
            brandSlug: brandSlug || undefined,
            categorySlug: categorySlug || undefined,
            sizeSlugs: cleanSizeSlugs.length > 0 ? cleanSizeSlugs : [],
            colorSlug: cleanColorSlug !== "" ? cleanColorSlug : "",
            priceRange: cleanPriceRange.length > 0 ? cleanPriceRange : [],
            sortBy: cleanSort,
            pageIndex: 1,
        }));

        setFilterOptionParams({
            brandSlug: brandSlug || undefined,
            categorySlug: categorySlug || undefined,
        });
    }, [brandSlug, categorySlug, searchParams, collectionType]);

    const handleFilterChange = (filters: { sizeSlugs: string[], colorSlug: string, priceRange: string[] }) => {
        const newParams = new URLSearchParams(searchParams);

        const validSizes = filters.sizeSlugs?.filter(size => size && size !== "undefined") || [];
        if (validSizes.length > 0) 
            newParams.set("size", validSizes.join(","));
        else 
            newParams.delete("size");

        if (filters.colorSlug && filters.colorSlug !== "" && filters.colorSlug !== "undefined")
            newParams.set("color", filters.colorSlug);
        else
            newParams.delete("color");

        const validPrices = filters.priceRange.filter(price => price && price !== "undefined") || [];
        if (validPrices.length > 0) 
            newParams.set("price_range", validPrices.join(","));
        else 
            newParams.delete("price_range");

        setSearchParams(newParams);
    };

    const handleSortSelect = (value: string) => {
        const newParams = new URLSearchParams(searchParams);
        if (value === "default") {
            newParams.delete("sort");
        } else {
            newParams.set("sort", value);
        }
        setSearchParams(newParams);
    };

    const handleLoadMore = () => {
        setQueryParams(prev => ({ ...prev, pageSize: (prev.pageSize || 1) + 1 }));
    };

    const currentDisplayedCount = pagedProducts?.length || 0;
    const progressPercentage = totalProducts > 0 ? (currentDisplayedCount / totalProducts) * 100 : 0;

    // --- RENDER GIAO DIỆN MỚI ---
    return (
        <div className="w-full max-w-[1600px] mx-auto px-6 py-8">
            <AnimatePresence mode="wait">
                {!isShopView ? (
                    /* =========================================================
                       CHẾ ĐỘ 1: TRANG CHỦ (BANNER + SẢN PHẨM ĐÃ ĐƯỢC LỌC TỪ API) 
                    ============================================================ */
                    <motion.div 
                        key="landing"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    >
                        {/* ================= SECTION: NEW ARRIVALS ================= */}
                        {(!collectionType || collectionType === 'new-arrivals') && (
                            <div className="mb-24">
                                <CollectionBanner type="new-arrivals" />
                                <div className="mt-10">
                                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
                                        {isLoading && currentDisplayedCount === 0 ? (
                                            Array.from({ length: 4 }).map((_, i) => <ProductSkeleton key={`sk-new-${i}`} />)
                                        ) : (
                                            pagedProducts
                                                ?.filter(product => !collectionType ? product.isNew : true)
                                                .map((product) => (
                                                    <ProductCard key={`new-${product.productId}`} product={product} />
                                                ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ================= SECTION: BEST SELLERS ================= */}
                        {(!collectionType || collectionType === 'best-sellers') && (
                            <div className="mb-20">
                                <CollectionBanner type="best-sellers" />
                                <div className="mt-10">
                                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
                                        {isLoading && currentDisplayedCount === 0 ? (
                                            Array.from({ length: 4 }).map((_, i) => <ProductSkeleton key={`sk-best-${i}`} />)
                                        ) : (
                                            pagedProducts
                                                ?.filter(product => !collectionType ? product.isBestSeller : true)
                                                .map((product) => (
                                                    <ProductCard key={`best-${product.productId}`} product={product} />
                                                ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* State: Không có sản phẩm (Dùng chung) */}
                        {!isLoading && currentDisplayedCount === 0 && (
                            <div className="text-center py-20">
                                <p className="text-zinc-400 italic">Hiện tại chưa có sản phẩm nào trong bộ sưu tập này.</p>
                            </div>
                        )}

                        {/* Load More: Tiến trình & Nút Xem Thêm (Dùng chung) */}
                        {!isLoading && totalProducts > 0 && currentDisplayedCount < totalProducts && (
                            <div className="mb-20 flex flex-col items-center gap-6">
                                <div className="flex flex-col items-center gap-2">
                                    <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
                                        Bạn đã xem {currentDisplayedCount} trong tổng số {totalProducts}
                                    </p>
                                    <div className="w-64 h-[2px] bg-zinc-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-zinc-900 transition-all duration-700 ease-in-out"
                                            style={{ width: `${progressPercentage}%` }}
                                        />
                                    </div>
                                </div>
                                <button
                                    className="px-12 py-4 bg-white border border-zinc-200 text-zinc-900 font-bold rounded-full hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-all duration-300 shadow-sm disabled:opacity-50 uppercase text-xs tracking-widest"
                                    onClick={handleLoadMore}
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Đang tải...' : 'Xem thêm sản phẩm'}
                                </button>
                            </div>
                        )}
                    </motion.div>
                ) : (
                    /* =========================================================
                       CHẾ ĐỘ 2: TRANG CỬA HÀNG (HEADER + SIDEBAR + SẢN PHẨM)
                    ============================================================ */
                    <motion.div 
                        key="shop"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    >
                        <ProductHeader
                            brandName={filterOptions?.brandName}
                            categoryName={filterOptions?.categoryName}
                            urlSort={urlSort}
                            sortOptions={SORT_OPTIONS}
                            onSortSelect={handleSortSelect}
                            customTitle={collectionType === 'new-arrivals' ? "New Arrivals" : collectionType === 'best-sellers' ? "Best Sellers" : undefined}
                        />

                        <div className="flex flex-col md:flex-row gap-12 mt-10">
                            {/* CỘT TRÁI: SIDEBAR FILTER */}
                            <aside className="w-full md:w-[280px] shrink-0">
                                <div className="sticky top-24">
                                    <SidebarFilter
                                        totalProducts={totalProducts}
                                        filterOptions={filterOptions}
                                        selectedSizeSlugs={urlSizeSlugs} 
                                        selectedColorSlug={urlColorSlug} 
                                        selectedPriceRange={urlPriceRange} 
                                        onFilterChange={handleFilterChange}
                                    />
                                </div>
                            </aside>

                            {/* CỘT PHẢI: LƯỚI SẢN PHẨM */}
                            <main className="flex-1 min-w-0">
                                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
                                    {isLoading && currentDisplayedCount === 0 ? (
                                        Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)
                                    ) : (
                                        pagedProducts?.map((product) => (
                                            <ProductCard key={product.productId} product={product} />
                                        ))
                                    )}
                                </div>

                                {/* State: Không có sản phẩm */}
                                {!isLoading && currentDisplayedCount === 0 && (
                                    <div className="text-center py-40">
                                        <p className="text-zinc-400 italic">Không tìm thấy sản phẩm nào khớp với bộ lọc.</p>
                                    </div>
                                )}

                                {/* Load More */}
                                {!isLoading && totalProducts > 0 && currentDisplayedCount < totalProducts && (
                                    <div className="mt-20 flex flex-col items-center gap-6">
                                        <div className="flex flex-col items-center gap-2">
                                            <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
                                                Bạn đã xem {currentDisplayedCount} trong tổng số {totalProducts}
                                            </p>
                                            <div className="w-64 h-[2px] bg-zinc-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-zinc-900 transition-all duration-700 ease-in-out"
                                                    style={{ width: `${progressPercentage}%` }}
                                                />
                                            </div>
                                        </div>
                                        <button
                                            className="px-12 py-4 bg-white border border-zinc-200 text-zinc-900 font-bold rounded-full hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-all duration-300 shadow-sm disabled:opacity-50 uppercase text-xs tracking-widest"
                                            onClick={handleLoadMore}
                                            disabled={isLoading}
                                        >
                                            {isLoading ? 'Đang tải...' : 'Xem thêm sản phẩm'}
                                        </button>
                                    </div>
                                )}
                            </main>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProductPage;