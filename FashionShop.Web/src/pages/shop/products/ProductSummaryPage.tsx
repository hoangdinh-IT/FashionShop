import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Filter, X } from 'lucide-react';

// Imports từ project
import SidebarFilter from '../../../features/shop/products/components/ProductSummary/SidebarFilter';
import ProductCard from '../../../features/shop/products/components/ProductSummary/ProductCard';
import ProductHeader from '../../../features/shop/products/components/ProductSummary/ProductHeader';
import ProductSkeleton from '../../../components/common/ProductSkeleton';

import {
    useFilterOptions,
    useProductCollections,
    useProducts,
} from '../../../features/shop/products/hooks/useProducts';

import type {
    FilterOptionsRequest,
    ProductCollectionsQueryParams,
    ProductQueryParams,
} from '../../../features/shop/products/types/requests';

interface Props {
    collectionType?: 'new-arrivals' | 'best-sellers';
}

const SORT_OPTIONS = [
    { value: 'default', label: 'Mặc định' },
    { value: 'newest', label: 'Mới nhất' },
    { value: 'bestseller', label: 'Bán chạy nhất' },
    { value: 'price-asc', label: 'Giá: Thấp đến cao' },
    { value: 'price-desc', label: 'Giá: Cao đến thấp' },
];

const DEFAULT_PAGE_SIZE = 8;

const BANNER_IMAGES = {
    'new-arrivals': [
        'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1600&auto=format&fit=crop',
    ],
    'best-sellers': [
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1600&auto=format&fit=crop',
    ],
};

interface CollectionBannerProps {
    type: 'new-arrivals' | 'best-sellers';
    customImages?: string[];
    autoPlayInterval?: number;
}

const CollectionBanner: React.FC<CollectionBannerProps> = React.memo(
    ({ type, customImages, autoPlayInterval = 5000 }) => {
        const isNew = type === 'new-arrivals';
        const images = customImages && customImages.length > 0 ? customImages : BANNER_IMAGES[type];
        const [currentIndex, setCurrentIndex] = useState(0);

        useEffect(() => {
            if (!images || images.length === 0) return;

            const timer = setInterval(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
            }, autoPlayInterval);

            return () => clearInterval(timer);
        }, [images, autoPlayInterval]);

        return (
            <div className="relative mb-8 h-[220px] w-full overflow-hidden rounded-xl border border-zinc-200/60 bg-zinc-900 shadow-sm sm:h-[280px] md:mb-12 md:h-[340px] md:rounded-2xl lg:h-[400px]">
                <AnimatePresence initial={false}>
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.75 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.0, ease: 'easeInOut' }}
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${images[currentIndex]})` }}
                    />
                </AnimatePresence>

                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/85 via-zinc-950/40 to-black/20" />

                <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center text-white sm:px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="mb-2 flex items-center gap-2 sm:mb-3 sm:gap-3"
                    >
                        <span className="h-[1px] w-4 bg-white/60 sm:w-6 md:w-10" />
                        <span className="text-[9px] font-semibold uppercase tracking-[0.25em] text-zinc-200 sm:text-[10px] md:text-xs md:tracking-[0.35em]">
                            {isNew ? 'Spring // Summer 2026' : 'Curated Selection'}
                        </span>
                        <span className="h-[1px] w-4 bg-white/60 sm:w-6 md:w-10" />
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="mb-4 font-serif text-2xl font-light tracking-tight text-white sm:text-3xl md:mb-6 md:text-5xl"
                    >
                        {isNew ? (
                            <>
                                New <span className="font-normal italic text-zinc-200">Arrivals</span>
                            </>
                        ) : (
                            <>
                                Best <span className="font-normal italic text-zinc-200">Sellers</span>
                            </>
                        )}
                    </motion.h2>

                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <button className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-white bg-white px-5 py-2 text-[9px] font-semibold uppercase tracking-[0.15em] text-zinc-900 transition-all duration-300 hover:bg-transparent hover:text-white sm:px-7 sm:py-2.5 sm:text-[10px] md:text-[11px] md:tracking-[0.2em]">
                            <span>Khám phá bộ sưu tập</span>
                            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                                &rarr;
                            </span>
                        </button>
                    </motion.div>

                    <div className="absolute bottom-3 flex gap-1.5 sm:bottom-4 sm:gap-2">
                        {images.map((_, dotIdx) => (
                            <span
                                key={dotIdx}
                                className={`h-1 rounded-full transition-all duration-500 sm:h-1.5 ${
                                    dotIdx === currentIndex ? 'w-4 bg-white sm:w-6' : 'w-1 bg-white/40 sm:w-1.5'
                                }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        );
    }
);

CollectionBanner.displayName = 'CollectionBanner';

const ProductSummaryPage: React.FC<Props> = ({ collectionType }) => {
    const { brandSlug, categorySlug } = useParams<{ brandSlug: string; categorySlug: string }>();
    const [searchParams, setSearchParams] = useSearchParams();

    // State bật/tắt Modal bộ lọc trên Mobile
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    const isShopView = !!brandSlug || !!categorySlug;

    // Khóa cuộn màn hình chính khi Modal lọc bật lên
    useEffect(() => {
        if (isMobileFilterOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMobileFilterOpen]);

    const getCleanParamArray = (paramName: string) => {
        const val = searchParams.get(paramName);
        return val && val !== 'undefined' && val !== 'null' ? val.split(',').filter(Boolean) : [];
    };

    const urlSizeSlugs = getCleanParamArray('size');
    const urlPriceRange = getCleanParamArray('price_range');
    const rawColor = searchParams.get('color');
    const urlColorSlug = rawColor && rawColor !== 'null' && rawColor !== 'undefined' ? rawColor : '';
    const urlSort = searchParams.get('sort') || 'default';

    const [queryParams, setQueryParams] = useState<ProductQueryParams>({
        keyword: undefined,
        brandSlug: brandSlug || undefined,
        categorySlug: categorySlug || undefined,
        sizeSlugs: urlSizeSlugs,
        colorSlug: urlColorSlug,
        isBestSeller: collectionType === 'best-sellers' ? true : undefined,
        isNew: collectionType === 'new-arrivals' ? true : undefined,
        priceRange: urlPriceRange,
        pageSize: DEFAULT_PAGE_SIZE,
        pageIndex: 1,
        sortBy: urlSort,
    });

    const [collectionQueryParams] = useState<ProductCollectionsQueryParams>({
        isNew: collectionType === 'new-arrivals' ? true : undefined,
        isBestSeller: collectionType === 'best-sellers' ? true : undefined,
    });

    const [filterOptionParams, setFilterOptionParams] = useState<FilterOptionsRequest>({
        brandSlug: brandSlug || undefined,
        categorySlug: categorySlug || undefined,
    });

    const { pagedProducts, totalProducts, isLoading } = useProducts(queryParams);
    const { collectionProducts } = useProductCollections(collectionQueryParams);
    const { filterOptions } = useFilterOptions(filterOptionParams);

    useEffect(() => {
        setQueryParams((prev) => ({
            ...prev,
            brandSlug: brandSlug || undefined,
            categorySlug: categorySlug || undefined,
            sizeSlugs: urlSizeSlugs,
            colorSlug: urlColorSlug,
            priceRange: urlPriceRange,
            sortBy: urlSort,
            pageIndex: 1,
        }));

        setFilterOptionParams({
            brandSlug: brandSlug || undefined,
            categorySlug: categorySlug || undefined,
        });
    }, [brandSlug, categorySlug, searchParams, collectionType]);

    const handleFilterChange = useCallback(
        (filters: { sizeSlugs: string[]; colorSlug: string; priceRange: string[] }) => {
            const newParams = new URLSearchParams(searchParams);

            const validSizes = filters.sizeSlugs?.filter((s) => s && s !== 'undefined') || [];
            if (validSizes.length > 0) newParams.set('size', validSizes.join(','));
            else newParams.delete('size');

            if (filters.colorSlug && filters.colorSlug !== 'undefined') {
                newParams.set('color', filters.colorSlug);
            } else {
                newParams.delete('color');
            }

            const validPrices = filters.priceRange?.filter((p) => p && p !== 'undefined') || [];
            if (validPrices.length > 0) newParams.set('price_range', validPrices.join(','));
            else newParams.delete('price_range');

            setSearchParams(newParams);
        },
        [searchParams, setSearchParams]
    );

    const handleSortSelect = useCallback(
        (value: string) => {
            const newParams = new URLSearchParams(searchParams);
            if (value === 'default') {
                newParams.delete('sort');
            } else {
                newParams.set('sort', value);
            }
            setSearchParams(newParams);
        },
        [searchParams, setSearchParams]
    );

    const handleLoadMore = useCallback(() => {
        setQueryParams((prev) => ({ ...prev, pageSize: (prev.pageSize || DEFAULT_PAGE_SIZE) + DEFAULT_PAGE_SIZE }));
    }, []);

    const newArrivalsRef = useRef<HTMLDivElement>(null);
    const scrollNewArrivals = useCallback((direction: 'left' | 'right') => {
        if (newArrivalsRef.current) {
            const scrollAmount = newArrivalsRef.current.offsetWidth * 0.8;
            newArrivalsRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    }, []);

    const currentDisplayedCount = pagedProducts?.length || 0;
    const progressPercentage = totalProducts > 0 ? (currentDisplayedCount / totalProducts) * 100 : 0;

    return (
        <div className="relative min-h-screen overflow-x-hidden bg-[#f6f6f4] font-sans text-zinc-900">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute left-[-10%] top-[-10%] h-[300px] w-[300px] rounded-full bg-[#eae7e1]/60 opacity-70 blur-3xl sm:h-[420px] sm:w-[420px]" />
                <div className="absolute bottom-[-10%] right-[-10%] h-[250px] w-[250px] rounded-full bg-[#f0ece1]/80 opacity-80 blur-3xl sm:h-[320px] sm:w-[320px]" />
            </div>

            <div className="relative z-10 mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 sm:py-10 md:px-8">
                <AnimatePresence mode="wait">
                    {!isShopView ? (
                        <motion.div
                            key="landing"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.35 }}
                            className="space-y-16 md:space-y-28"
                        >
                            {/* SECTION: NEW ARRIVALS */}
                            {(!collectionType || collectionType === 'new-arrivals') && (
                                <section className="relative">
                                    <CollectionBanner type="new-arrivals" autoPlayInterval={5000} />

                                    <div className="group relative mt-6 md:mt-12">
                                        <button
                                            aria-label="Cuộn sang trái"
                                            onClick={() => scrollNewArrivals('left')}
                                            className="absolute left-0 top-1/2 z-20 hidden h-10 w-10 -translate-x-3 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-200/80 bg-white/90 text-zinc-700 opacity-0 shadow-md backdrop-blur-xl transition-all duration-300 hover:bg-zinc-900 hover:text-white group-hover:opacity-100 md:flex lg:h-12 lg:w-12 lg:-translate-x-5"
                                        >
                                            <ChevronLeft size={20} />
                                        </button>

                                        <div
                                            ref={newArrivalsRef}
                                            className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-4 [scrollbar-width:none] [-ms-overflow-style:none] sm:gap-5 [&::-webkit-scrollbar]:hidden"
                                        >
                                            {isLoading && currentDisplayedCount === 0 ? (
                                                Array.from({ length: 4 }).map((_, i) => (
                                                    <div
                                                        key={`sk-new-${i}`}
                                                        className="w-[75%] shrink-0 snap-start xs:w-[60%] sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)] xl:w-[calc(25%-16px)]"
                                                    >
                                                        <ProductSkeleton />
                                                    </div>
                                                ))
                                            ) : (
                                                collectionProducts
                                                    ?.filter((product) => (!collectionType ? product.isNew : true))
                                                    .map((product) => (
                                                        <div
                                                            key={`new-${product.productId}`}
                                                            className="w-[75%] shrink-0 snap-start xs:w-[60%] sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)] xl:w-[calc(25%-16px)]"
                                                        >
                                                            <ProductCard product={product} />
                                                        </div>
                                                    ))
                                            )}
                                        </div>

                                        <button
                                            aria-label="Cuộn sang phải"
                                            onClick={() => scrollNewArrivals('right')}
                                            className="absolute right-0 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 translate-x-3 items-center justify-center rounded-full border border-zinc-200/80 bg-white/90 text-zinc-700 opacity-0 shadow-md backdrop-blur-xl transition-all duration-300 hover:bg-zinc-900 hover:text-white group-hover:opacity-100 md:flex lg:h-12 lg:w-12 lg:translate-x-5"
                                        >
                                            <ChevronRight size={20} />
                                        </button>
                                    </div>
                                </section>
                            )}

                            {/* SECTION: BEST SELLERS */}
                            {(!collectionType || collectionType === 'best-sellers') && (
                                <section>
                                    <CollectionBanner type="best-sellers" autoPlayInterval={5000} />

                                    <div className="mt-6 md:mt-12">
                                        <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-5 sm:gap-y-10 md:grid-cols-3 xl:grid-cols-4">
                                            {isLoading && currentDisplayedCount === 0 ? (
                                                Array.from({ length: 4 }).map((_, i) => (
                                                    <ProductSkeleton key={`sk-best-${i}`} />
                                                ))
                                            ) : (
                                                pagedProducts
                                                    ?.filter((product) => (!collectionType ? product.isBestSeller : true))
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
                        </motion.div>
                    ) : (
                        <motion.div
                            key="shop"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.35 }}
                        >
                            <div className="mb-6 md:mb-12">
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

                            {/* NÚT BỘ LỌC + SỐ LƯỢNG TRÊN MOBILE */}
                            <div className="mb-6 flex items-center justify-between lg:hidden">
                                <button
                                    onClick={() => setIsMobileFilterOpen(true)}
                                    className="flex items-center gap-2 rounded-xl border border-zinc-200/80 bg-white px-4 py-2.5 text-xs font-semibold text-zinc-900 shadow-sm active:bg-zinc-50"
                                >
                                    <Filter size={16} />
                                    <span>Bộ lọc</span>
                                </button>

                                <span className="text-xs font-medium text-zinc-500">
                                    {totalProducts} sản phẩm
                                </span>
                            </div>

                            {/* MODAL SIDEBAR FILTER KHI BẤM NÚT */}
                            <AnimatePresence>
                                {isMobileFilterOpen && (
                                    <div className="fixed inset-0 z-50 lg:hidden">
                                        {/* Overlay làm mờ */}
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            onClick={() => setIsMobileFilterOpen(false)}
                                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                                        />

                                        {/* Drawer SidebarFilter */}
                                        <motion.div
                                            initial={{ y: '100%' }}
                                            animate={{ y: 0 }}
                                            exit={{ y: '100%' }}
                                            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
                                            className="absolute bottom-0 left-0 right-0 flex max-h-[85vh] flex-col rounded-t-2xl bg-white shadow-2xl"
                                        >
                                            {/* Header Modal */}
                                            <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-3.5">
                                                <div className="flex items-center gap-2 font-semibold text-zinc-900">
                                                    <Filter size={18} />
                                                    <span>Bộ lọc</span>
                                                </div>
                                                <button
                                                    onClick={() => setIsMobileFilterOpen(false)}
                                                    className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                                                >
                                                    <X size={18} />
                                                </button>
                                            </div>

                                            {/* Thân Modal chứa trực tiếp SidebarFilter */}
                                            <div className="flex-1 overflow-y-auto p-5">
                                                <SidebarFilter
                                                    totalProducts={totalProducts}
                                                    filterOptions={filterOptions}
                                                    selectedSizeSlugs={urlSizeSlugs}
                                                    selectedColorSlug={urlColorSlug}
                                                    selectedPriceRange={urlPriceRange}
                                                    onFilterChange={handleFilterChange}
                                                />
                                            </div>
                                        </motion.div>
                                    </div>
                                )}
                            </AnimatePresence>

                            <div className="flex flex-col gap-8 lg:flex-row lg:gap-10 xl:gap-14">
                                {/* SIDEBAR TRÊN LAPTOP / DESKTOP */}
                                <aside className="hidden w-[260px] shrink-0 lg:block xl:w-[280px]">
                                    <div className="sticky top-24">
                                        <div className="rounded-[28px] border border-zinc-200/70 bg-white/80 p-5 shadow-sm backdrop-blur-xl">
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

                                {/* DANH SÁCH SẢN PHẨM */}
                                <main className="min-w-0 flex-1">
                                    <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-5 sm:gap-y-10 md:grid-cols-3 xl:grid-cols-4">
                                        {isLoading && currentDisplayedCount === 0 ? (
                                            Array.from({ length: 8 }).map((_, i) => (
                                                <ProductSkeleton key={i} />
                                            ))
                                        ) : (
                                            pagedProducts?.map((product) => (
                                                <ProductCard key={product.productId} product={product} />
                                            ))
                                        )}
                                    </div>

                                    {!isLoading && totalProducts > 0 && currentDisplayedCount < totalProducts && (
                                        <div className="mt-12 flex flex-col items-center md:mt-20">
                                            <div className="mb-5 flex flex-col items-center gap-2 sm:mb-7 sm:gap-3">
                                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 sm:text-[11px] sm:tracking-[0.25em]">
                                                    {currentDisplayedCount} / {totalProducts} sản phẩm
                                                </p>
                                                <div className="h-[3px] w-48 overflow-hidden rounded-full bg-zinc-200/60 sm:w-64">
                                                    <div
                                                        className="h-full rounded-full bg-zinc-900 transition-all duration-700"
                                                        style={{ width: `${progressPercentage}%` }}
                                                    />
                                                </div>
                                            </div>

                                            <button
                                                className="group relative overflow-hidden rounded-full border border-zinc-200 bg-white px-7 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-900 shadow-sm transition-all duration-300 hover:border-zinc-900 hover:bg-zinc-900 hover:text-white disabled:opacity-50 sm:px-10 sm:py-4 sm:text-[11px] sm:tracking-[0.25em]"
                                                onClick={handleLoadMore}
                                                disabled={isLoading}
                                            >
                                                <span className="relative z-10">
                                                    {isLoading ? 'Đang tải...' : 'Xem thêm sản phẩm'}
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

export default ProductSummaryPage;