import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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

// Bộ ảnh thời trang rõ nét & sang trọng
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
    autoPlayInterval?: number; // Mặc định 5000ms = 5 giây
}

const CollectionBanner: React.FC<CollectionBannerProps> = React.memo(
    ({ type, customImages, autoPlayInterval = 5000 }) => {
        const isNew = type === 'new-arrivals';
        const images = customImages && customImages.length > 0 ? customImages : BANNER_IMAGES[type];

        const [currentIndex, setCurrentIndex] = useState(0);

        // Chuyển slide đúng định kỳ 5 giây
        useEffect(() => {
            if (!images || images.length === 0) return;

            const timer = setInterval(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
            }, autoPlayInterval);

            return () => clearInterval(timer);
        }, [images, autoPlayInterval]);

        return (
            <div className="relative mb-12 h-[280px] w-full overflow-hidden rounded-2xl border border-zinc-200/60 bg-zinc-900 shadow-[0_4px_25px_rgba(0,0,0,0.05)] md:h-[340px]">
                
                {/* 1. SLIDER ẢNH CHUYỂN PHỦ TRỰC TIẾP (Cross-fade không lộ nền) */}
                <AnimatePresence initial={false}>
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.75 }} // Đã tăng từ 0.3 lên 0.75 để hình ảnh hiện RÕ NÉT hơn nhiều
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.0, ease: 'easeInOut' }}
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${images[currentIndex]})` }}
                    />
                </AnimatePresence>

                {/* 2. LỚP PHỦ CHE MỜ NHẸ GIÚP CHỮ NỔI BẬT NGHỆ THUẬT */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/30 to-black/20" />

                {/* 3. NỘI DUNG CHỮ TRUNG TÂM */}
                <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white">
                    {/* Subtitle */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="mb-3 flex items-center gap-3"
                    >
                        <span className="h-[1px] w-6 bg-white/60 md:w-10" />
                        <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-zinc-200 md:text-xs">
                            {isNew ? 'Spring // Summer 2026' : 'Curated Selection'}
                        </span>
                        <span className="h-[1px] w-6 bg-white/60 md:w-10" />
                    </motion.div>

                    {/* Title */}
                    <motion.h2
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="mb-6 font-serif text-3xl font-light tracking-tight text-white md:text-5xl"
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

                    {/* Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <button className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-white bg-white px-7 py-2.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-900 transition-all duration-300 hover:bg-transparent hover:text-white md:text-[11px]">
                            <span>Khám phá bộ sưu tập</span>
                            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                                &rarr;
                            </span>
                        </button>
                    </motion.div>

                    {/* Dấu chấm chuyển slide phía dưới */}
                    <div className="absolute bottom-4 flex gap-2">
                        {images.map((_, dotIdx) => (
                            <span
                                key={dotIdx}
                                className={`h-1.5 rounded-full transition-all duration-500 ${
                                    dotIdx === currentIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/40'
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

    const isShopView = !!brandSlug || !!categorySlug;

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
            const scrollAmount = newArrivalsRef.current.offsetWidth;
            newArrivalsRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    }, []);

    const currentDisplayedCount = pagedProducts?.length || 0;
    const progressPercentage = totalProducts > 0 ? (currentDisplayedCount / totalProducts) * 100 : 0;

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#f6f6f4] text-zinc-900 font-sans">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute left-[-5%] top-[-10%] h-[420px] w-[420px] rounded-full bg-[#eae7e1]/60 opacity-70 blur-3xl" />
                <div className="absolute bottom-[-10%] right-[-5%] h-[320px] w-[320px] rounded-full bg-[#f0ece1]/80 opacity-80 blur-3xl" />
            </div>

            <div className="relative z-10 mx-auto w-full max-w-[1600px] px-5 py-10 md:px-8">
                <AnimatePresence mode="wait">
                    {!isShopView ? (
                        <motion.div
                            key="landing"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.35 }}
                            className="space-y-28"
                        >
                            {/* NEW ARRIVALS - Đổi hình mượt mỗi 5s */}
                            {(!collectionType || collectionType === 'new-arrivals') && (
                                <section className="relative">
                                    <CollectionBanner type="new-arrivals" autoPlayInterval={5000} />

                                    <div className="group relative mt-12">
                                        <button
                                            aria-label="Cuộn sang trái"
                                            onClick={() => scrollNewArrivals('left')}
                                            className="absolute left-0 top-1/2 z-20 hidden h-12 w-12 -translate-x-5 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-200/80 bg-white/90 text-zinc-700 opacity-0 shadow-[0_10px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl transition-all duration-300 hover:bg-zinc-900 hover:text-white group-hover:opacity-100 lg:flex"
                                        >
                                            <ChevronLeft size={20} />
                                        </button>

                                        <div
                                            ref={newArrivalsRef}
                                            className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                                        >
                                            {isLoading && currentDisplayedCount === 0 ? (
                                                Array.from({ length: 4 }).map((_, i) => (
                                                    <div
                                                        key={`sk-new-${i}`}
                                                        className="w-full shrink-0 snap-start sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)] xl:w-[calc(25%-16px)]"
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
                                                            className="w-full shrink-0 snap-start sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)] xl:w-[calc(25%-16px)]"
                                                        >
                                                            <ProductCard product={product} />
                                                        </div>
                                                    ))
                                            )}
                                        </div>

                                        <button
                                            aria-label="Cuộn sang phải"
                                            onClick={() => scrollNewArrivals('right')}
                                            className="absolute right-0 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 translate-x-5 items-center justify-center rounded-full border border-zinc-200/80 bg-white/90 text-zinc-700 opacity-0 shadow-[0_10px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl transition-all duration-300 hover:bg-zinc-900 hover:text-white group-hover:opacity-100 lg:flex"
                                        >
                                            <ChevronRight size={20} />
                                        </button>
                                    </div>
                                </section>
                            )}

                            {/* BEST SELLERS - Đổi hình mượt mỗi 5s */}
                            {(!collectionType || collectionType === 'best-sellers') && (
                                <section>
                                    <CollectionBanner type="best-sellers" autoPlayInterval={5000} />

                                    <div className="mt-12">
                                        <div className="grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-3 xl:grid-cols-4">
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

                            {!isLoading && currentDisplayedCount === 0 && (
                                <div className="flex flex-col items-center py-28 text-center">
                                    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-[28px] border border-zinc-200 bg-white shadow-sm">
                                        <div className="h-3 w-3 rounded-full bg-zinc-300" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-zinc-900">Chưa có sản phẩm</h3>
                                    <p className="mt-2 text-sm text-zinc-400">
                                        Hiện tại chưa có sản phẩm trong bộ sưu tập này.
                                    </p>
                                </div>
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

                            <div className="flex flex-col gap-10 lg:flex-row xl:gap-14">
                                <aside className="w-full shrink-0 lg:w-[280px]">
                                    <div className="sticky top-24">
                                        <div className="rounded-[32px] border border-zinc-200/70 bg-white/80 p-5 shadow-[0_8px_30px_rgba(0,0,0,0.03)] backdrop-blur-xl">
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

                                <main className="min-w-0 flex-1">
                                    <div className="grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-3 xl:grid-cols-4">
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

                                    {!isLoading && currentDisplayedCount === 0 && (
                                        <div className="flex flex-col items-center py-40 text-center">
                                            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-[28px] border border-zinc-200 bg-white shadow-sm">
                                                <div className="h-3 w-3 rounded-full bg-zinc-300" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-zinc-900">
                                                Không tìm thấy sản phẩm
                                            </h3>
                                            <p className="mt-2 text-sm text-zinc-400">
                                                Hãy thử thay đổi bộ lọc của bạn.
                                            </p>
                                        </div>
                                    )}

                                    {!isLoading && totalProducts > 0 && currentDisplayedCount < totalProducts && (
                                        <div className="mt-24 flex flex-col items-center">
                                            <div className="mb-7 flex flex-col items-center gap-3">
                                                <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-400">
                                                    {currentDisplayedCount} / {totalProducts} sản phẩm
                                                </p>
                                                <div className="h-[3px] w-64 overflow-hidden rounded-full bg-zinc-200/60">
                                                    <div
                                                        className="h-full rounded-full bg-zinc-900 transition-all duration-700"
                                                        style={{ width: `${progressPercentage}%` }}
                                                    />
                                                </div>
                                            </div>

                                            <button
                                                className="group relative overflow-hidden rounded-full border border-zinc-200 bg-white px-10 py-4 text-[11px] font-black uppercase tracking-[0.25em] text-zinc-900 shadow-sm transition-all duration-300 hover:border-zinc-900 hover:bg-zinc-900 hover:text-white disabled:opacity-50"
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