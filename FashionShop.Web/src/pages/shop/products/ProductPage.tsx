import React, { useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Imports từ project
import SidebarFilter from '../../../features/shop/products/components/SidebarFilter';
import ProductCard from '../../../features/shop/products/components/ProductCard';
import { useFilterOptions, useProductCollections, useProducts } from '../../../features/shop/products/hooks/useProducts';
import type { FilterOptionsRequest, ProductCollectionsQueryParams, ProductQueryParams } from '../../../features/shop/products/types/requests';
import ProductSkeleton from '../../../components/common/ProductSkeleton';
import ProductHeader from '../../../features/shop/products/components/ProductHeader';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
        pageSize: 5,
        pageIndex: 1,
        sortBy: urlSort,
    });

    const [collectionQueryParams, setCollectionQueryParams] = useState<ProductCollectionsQueryParams>({
        isNew: collectionType === 'new-arrivals' ? true : undefined,
        isBestSeller: collectionType === 'best-sellers' ? true : undefined,
    })

    const [filterOptionParams, setFilterOptionParams] = useState<FilterOptionsRequest>({
        brandSlug: brandSlug || undefined,
        categorySlug: categorySlug || undefined,
    });

    const { pagedProducts, totalProducts, isLoading } = useProducts(queryParams);
    const { collectionProducts } = useProductCollections(collectionQueryParams);
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

    const newArrivalsRef = useRef<HTMLDivElement>(null);
    const scrollNewArrivals = (direction: 'left' | 'right') => {
        if (newArrivalsRef.current) {
            const scrollAmount = newArrivalsRef.current.offsetWidth; // Cuộn đúng bằng 1 màn hình hiển thị
            newArrivalsRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#fcfcfc]">

            {/* BACKGROUND DECOR */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute top-[-10%] left-[-5%] w-[420px] h-[420px] rounded-full bg-zinc-100 blur-3xl opacity-70" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[320px] h-[320px] rounded-full bg-stone-100 blur-3xl opacity-80" />
            </div>

            <div className="relative z-10 w-full max-w-[1600px] mx-auto px-5 md:px-8 py-10">

                <AnimatePresence mode="wait">
                    {!isShopView ? (
                        /* =========================================================
                        LANDING MODE
                        ============================================================ */
                        <motion.div
                            key="landing"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.35 }}
                            className="space-y-28"
                        >

                            {/* ================= NEW ARRIVALS ================= */}
                            {(!collectionType || collectionType === 'new-arrivals') && (
                                <section className="relative">

                                    <CollectionBanner type="new-arrivals" />

                                    <div className="relative mt-12 group">

                                        {/* LEFT ARROW */}
                                        <button
                                            onClick={() => scrollNewArrivals('left')}
                                            className="
                                                hidden lg:flex
                                                absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5
                                                z-20
                                                w-12 h-12
                                                items-center justify-center
                                                rounded-full
                                                border border-zinc-200/80
                                                bg-white/90 backdrop-blur-xl
                                                shadow-[0_10px_30px_rgba(0,0,0,0.06)]
                                                text-zinc-700
                                                opacity-0 group-hover:opacity-100
                                                hover:bg-zinc-900 hover:text-white
                                                transition-all duration-300
                                            "
                                        >
                                            <ChevronLeft size={20} />
                                        </button>

                                        {/* PRODUCTS */}
                                        <div
                                            ref={newArrivalsRef}
                                            className="
                                                flex gap-5 overflow-x-auto
                                                scroll-smooth snap-x snap-mandatory
                                                pb-3
                                                [&::-webkit-scrollbar]:hidden
                                                [-ms-overflow-style:none]
                                                [scrollbar-width:none]
                                            "
                                        >
                                            {isLoading && currentDisplayedCount === 0 ? (
                                                Array.from({ length: 4 }).map((_, i) => (
                                                    <div
                                                        key={`sk-new-${i}`}
                                                        className="
                                                            w-full
                                                            sm:w-[calc(50%-10px)]
                                                            lg:w-[calc(33.333%-14px)]
                                                            xl:w-[calc(25%-16px)]
                                                            shrink-0 snap-start
                                                        "
                                                    >
                                                        <ProductSkeleton />
                                                    </div>
                                                ))
                                            ) : (
                                                collectionProducts
                                                    ?.filter(product =>
                                                        !collectionType
                                                            ? product.isNew
                                                            : true
                                                    )
                                                    .map((product) => (
                                                        <div
                                                            key={`new-${product.productId}`}
                                                            className="
                                                                w-full
                                                                sm:w-[calc(50%-10px)]
                                                                lg:w-[calc(33.333%-14px)]
                                                                xl:w-[calc(25%-16px)]
                                                                shrink-0 snap-start
                                                            "
                                                        >
                                                            <ProductCard product={product} />
                                                        </div>
                                                    ))
                                            )}
                                        </div>

                                        {/* RIGHT ARROW */}
                                        <button
                                            onClick={() => scrollNewArrivals('right')}
                                            className="
                                                hidden lg:flex
                                                absolute right-0 top-1/2 -translate-y-1/2 translate-x-5
                                                z-20
                                                w-12 h-12
                                                items-center justify-center
                                                rounded-full
                                                border border-zinc-200/80
                                                bg-white/90 backdrop-blur-xl
                                                shadow-[0_10px_30px_rgba(0,0,0,0.06)]
                                                text-zinc-700
                                                opacity-0 group-hover:opacity-100
                                                hover:bg-zinc-900 hover:text-white
                                                transition-all duration-300
                                            "
                                        >
                                            <ChevronRight size={20} />
                                        </button>
                                    </div>
                                </section>
                            )}

                            {/* ================= BEST SELLERS ================= */}
                            {(!collectionType || collectionType === 'best-sellers') && (
                                <section>

                                    <CollectionBanner type="best-sellers" />

                                    <div className="mt-12">
                                        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-12">

                                            {isLoading && currentDisplayedCount === 0 ? (
                                                Array.from({ length: 4 }).map((_, i) => (
                                                    <ProductSkeleton key={`sk-best-${i}`} />
                                                ))
                                            ) : (
                                                pagedProducts
                                                    ?.filter(product =>
                                                        !collectionType
                                                            ? product.isBestSeller
                                                            : true
                                                    )
                                                    .map((product) => (
                                                        <ProductCard
                                                            key={`best-${product.productId}`}
                                                            product={product}
                                                        />
                                                    ))
                                            )}
                                        </div>
                                    </div>
                                </section>
                            )}

                            {/* EMPTY */}
                            {!isLoading && currentDisplayedCount === 0 && (
                                <div className="py-28 flex flex-col items-center text-center">

                                    <div className="w-20 h-20 rounded-[28px] border border-zinc-200 bg-white shadow-sm flex items-center justify-center mb-6">
                                        <div className="w-3 h-3 rounded-full bg-zinc-300" />
                                    </div>

                                    <h3 className="text-lg font-semibold text-zinc-900">
                                        Chưa có sản phẩm
                                    </h3>

                                    <p className="mt-2 text-sm text-zinc-400">
                                        Hiện tại chưa có sản phẩm trong bộ sưu tập này.
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        /* =========================================================
                        SHOP MODE
                        ============================================================ */
                        <motion.div
                            key="shop"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.35 }}
                        >

                            {/* HEADER */}
                            <div className="mb-12">
                                <ProductHeader
                                    brandName={filterOptions?.brandName}
                                    categoryName={filterOptions?.categoryName}
                                    urlSort={urlSort}
                                    sortOptions={SORT_OPTIONS}
                                    onSortSelect={handleSortSelect}
                                    customTitle={
                                        collectionType === 'new-arrivals'
                                            ? 'New Arrivals'
                                            : collectionType === 'best-sellers'
                                                ? 'Best Sellers'
                                                : undefined
                                    }
                                />
                            </div>

                            {/* LAYOUT */}
                            <div className="flex flex-col lg:flex-row gap-10 xl:gap-14">

                                {/* SIDEBAR */}
                                <aside className="w-full lg:w-[280px] shrink-0">
                                    <div className="sticky top-24">
                                        <div className="rounded-[32px] border border-zinc-200/70 bg-white/80 backdrop-blur-xl p-5 shadow-[0_8px_30px_rgba(0,0,0,0.03)]">
                                            <SidebarFilter
                                                totalProducts={totalProducts}
                                                filterOptions={filterOptions}
                                                selectedSizeSlugs={urlSizeSlugs}
                                                selectedColorSlug={urlColorSlug}
                                                selectedPriceRange={urlPriceRange}
                                                onFilterChange={handleFilterChange}
                                            />
                                        </div>
                                    </div>
                                </aside>

                                {/* PRODUCTS */}
                                <main className="flex-1 min-w-0">

                                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-12">

                                        {isLoading && currentDisplayedCount === 0 ? (
                                            Array.from({ length: 8 }).map((_, i) => (
                                                <ProductSkeleton key={i} />
                                            ))
                                        ) : (
                                            pagedProducts?.map((product) => (
                                                <ProductCard
                                                    key={product.productId}
                                                    product={product}
                                                />
                                            ))
                                        )}
                                    </div>

                                    {/* EMPTY */}
                                    {!isLoading && currentDisplayedCount === 0 && (
                                        <div className="py-40 flex flex-col items-center text-center">

                                            <div className="w-20 h-20 rounded-[28px] border border-zinc-200 bg-white shadow-sm flex items-center justify-center mb-6">
                                                <div className="w-3 h-3 rounded-full bg-zinc-300" />
                                            </div>

                                            <h3 className="text-lg font-semibold text-zinc-900">
                                                Không tìm thấy sản phẩm
                                            </h3>

                                            <p className="mt-2 text-sm text-zinc-400">
                                                Hãy thử thay đổi bộ lọc của bạn.
                                            </p>
                                        </div>
                                    )}

                                    {/* LOAD MORE */}
                                    {!isLoading &&
                                        totalProducts > 0 &&
                                        currentDisplayedCount < totalProducts && (
                                            <div className="mt-24 flex flex-col items-center">

                                                {/* PROGRESS */}
                                                <div className="mb-7 flex flex-col items-center gap-3">

                                                    <p className="text-[11px] font-bold tracking-[0.25em] uppercase text-zinc-400">
                                                        {currentDisplayedCount} / {totalProducts} sản phẩm
                                                    </p>

                                                    <div className="w-64 h-[3px] rounded-full bg-zinc-100 overflow-hidden">
                                                        <div
                                                            className="h-full rounded-full bg-zinc-900 transition-all duration-700"
                                                            style={{
                                                                width: `${progressPercentage}%`,
                                                            }}
                                                        />
                                                    </div>
                                                </div>

                                                {/* BUTTON */}
                                                <button
                                                    className="
                                                        group
                                                        relative overflow-hidden
                                                        px-10 py-4
                                                        rounded-full
                                                        border border-zinc-200
                                                        bg-white
                                                        text-[11px]
                                                        font-black
                                                        uppercase
                                                        tracking-[0.25em]
                                                        text-zinc-900
                                                        shadow-sm
                                                        hover:bg-zinc-900
                                                        hover:text-white
                                                        hover:border-zinc-900
                                                        transition-all duration-300
                                                        disabled:opacity-50
                                                    "
                                                    onClick={handleLoadMore}
                                                    disabled={isLoading}
                                                >
                                                    <span className="relative z-10">
                                                        {isLoading
                                                            ? 'Đang tải...'
                                                            : 'Xem thêm sản phẩm'}
                                                    </span>
                                                </button>
                                            </div>
                                        )}
                                </main>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ProductPage;