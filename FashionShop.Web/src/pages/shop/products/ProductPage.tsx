import React, { useEffect, useRef, useState } from 'react';
import SidebarFilter from '../../../features/shop/products/components/SidebarFilter';
import ProductCard from '../../../features/shop/products/components/ProductCard';
import { useFilterOptions, useProducts } from '../../../features/shop/products/hooks/useProducts';
import type { FilterOptionsRequest, ProductQueryParams } from '../../../features/shop/products/types/requests';
import ProductSkeleton from '../../../components/common/ProductSkeleton';
import { useParams, useSearchParams } from 'react-router-dom';
import { Check, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SORT_OPTIONS = [
    { value: "default", label: "Mặc định" },
    { value: "newest", label: "Mới nhất" },
    { value: "bestseller", label: "Bán chạy nhất" },
    { value: "price-asc", label: "Giá: Thấp đến cao" },
    { value: "price-desc", label: "Giá: Cao đến thấp" },
];

const ProductPage: React.FC = () => {
    const { brandSlug, categorySlug } = useParams<{ brandSlug: string, categorySlug: string }>();

    const [searchParams, setSearchParams] = useSearchParams();

    const rawSizeSlugs = searchParams.get("size");
    const urlSizeSlugs = (rawSizeSlugs && rawSizeSlugs !== "undefined")
        ? rawSizeSlugs.split(",").filter(Boolean)
        : [];

    const rawColorSlug = searchParams.get("color");
    const urlColorSlug = (rawColorSlug && rawColorSlug !== "null" && rawColorSlug !== "undefined")
        ? rawColorSlug
        : "";

    const rawPriceRange = searchParams.get("price_range");
    const urlPriceRange = (rawPriceRange && rawPriceRange !== "undefined")
        ? rawPriceRange.split(",").filter(Boolean)
        : [];

    const urlSort = searchParams.get("sort") || "default";

    const [isSortOpen, setIsSortOpen] = useState(false);
    const sortDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
                setIsSortOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // 2. KHỞI TẠO STATE ĐỂ GỌI API (Truyền thẳng Array vào priceRange)
    const [queryParams, setQueryParams] = useState<ProductQueryParams>({
        keyword: undefined,
        brandSlug: brandSlug || undefined,
        categorySlug: categorySlug || undefined,
        sizeSlugs: urlSizeSlugs.length > 0 ? urlSizeSlugs : [],
        colorSlug: urlColorSlug !== "" ? urlColorSlug : "",
        isBestSeller: undefined,
        isNew: undefined,
        priceRange: urlPriceRange.length > 0 ? urlPriceRange : [],
        isAscendingPrice: undefined,
        pageSize: 1,
        pageIndex: 1,
        sortBy: urlSort, 
    })

    const [filterOptionParams, setFilterOptionParams] = useState<FilterOptionsRequest>({
        brandSlug: brandSlug || undefined,
        categorySlug: categorySlug || undefined,
    });

    const { pagedProducts, totalProducts, isLoading } = useProducts(queryParams);
    const { filterOptions } = useFilterOptions(filterOptionParams);

    // 3. CẬP NHẬT STATE KHI URL THAY ĐỔI
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
            sizeSlugs: cleanSizeSlugs.length > 0 ? cleanSizeSlugs : undefined,
            colorSlug: cleanColorSlug !== "" ? cleanColorSlug : undefined,
            priceRange: cleanPriceRange.length > 0 ? cleanPriceRange : undefined,
            pageSize: 1,
            pageIndex: 1,
            sortBy: cleanSort,
        }))

        setFilterOptionParams(prev => ({
            ...prev,
            brandSlug: brandSlug,
            categorySlug: categorySlug,
        }));
    }, [brandSlug, categorySlug, searchParams]);

    // 4. LƯU BỘ LỌC LÊN URL KHI CLICK TỪ SIDEBAR
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
    }

    const handleSortSelect = (value: string) => {
        const newParams = new URLSearchParams(searchParams);
        if (value === "default") {
            newParams.delete("sort");
        } else {
            newParams.set("sort", value);
        }
        setSearchParams(newParams);
        setIsSortOpen(false);
    };

    const currentSortLabel = SORT_OPTIONS.find(opt => opt.value === urlSort)?.label || "Mặc định";

    const handleLoadMore = () => {
        setQueryParams(prev => ({ ...prev, pageSize: (prev.pageSize || 1) + 1 }));
    };

    const currentDisplayedCount = pagedProducts?.length || 0;
    const progressPercentage = totalProducts > 0 ? (currentDisplayedCount / totalProducts) * 100 : 0;

    return (
        <div className="w-full max-w-[1600px] mx-auto px-6 py-8">
            <div className="flex justify-between items-end mb-8 pb-5 border-b border-zinc-200">
                {/* --- TIÊU ĐỀ --- */}
                <div className="flex items-baseline gap-4">
                    <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">
                        {filterOptions?.brandName} \/ {filterOptions?.categoryName}
                    </h1>
                </div>

                {/* --- KHU VỰC PHÂN LOẠI --- */}
                <div className="flex items-center gap-3.5">
                    <span className="text-[12px] text-zinc-500 font-bold uppercase tracking-widest">
                        Sắp xếp theo
                    </span>
                    
                    {/* Custom Dropdown Wrapper */}
                    <div className="relative" ref={sortDropdownRef}>
                        {/* Nút bấm để mở Dropdown */}
                        <button 
                            onClick={() => setIsSortOpen(!isSortOpen)}
                            className={`
                                flex items-center justify-between w-48 bg-white border text-[13px] font-semibold text-zinc-800 
                                rounded-lg pl-4 pr-3 py-2.5 outline-none cursor-pointer shadow-sm
                                transition-all duration-200 ease-in-out
                                hover:border-zinc-300 hover:bg-zinc-50
                                ${isSortOpen ? 'border-zinc-900 ring-1 ring-zinc-900' : 'border-zinc-200'}
                            `}
                        >
                            <span className="truncate">{currentSortLabel}</span>
                            <motion.div
                                animate={{ rotate: isSortOpen ? 180 : 0 }}
                                transition={{ duration: 0.2, ease: "easeInOut" }}
                            >
                                <ChevronDown size={16} strokeWidth={2} className="text-zinc-500" />
                            </motion.div>
                        </button>

                        {/* Menu Dropdown với Framer Motion */}
                        <AnimatePresence>
                            {isSortOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                    transition={{ duration: 0.15, ease: "easeOut" }}
                                    className="absolute z-50 right-0 top-full mt-2 w-56 bg-white border border-zinc-200 rounded-xl shadow-lg overflow-hidden py-1.5"
                                >
                                    {SORT_OPTIONS.map((option) => {
                                        const isSelected = urlSort === option.value;
                                        return (
                                            <button
                                                key={option.value}
                                                onClick={() => handleSortSelect(option.value)}
                                                className={`
                                                    w-full text-left flex items-center justify-between px-4 py-2.5 text-[13px] transition-colors
                                                    ${isSelected 
                                                        ? 'bg-zinc-50 text-zinc-900 font-bold' 
                                                        : 'text-zinc-600 font-medium hover:bg-zinc-50 hover:text-zinc-900'
                                                    }
                                                `}
                                            >
                                                {option.label}
                                                {isSelected && <Check size={14} strokeWidth={2.5} className="text-zinc-900" />}
                                            </button>
                                        );
                                    })}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            <div className="flex items-start gap-10 relative">
                <SidebarFilter
                    totalProducts={totalProducts}
                    filterOptions={filterOptions}
                    selectedSizeSlugs={urlSizeSlugs} 
                    selectedColorSlug={urlColorSlug} 
                    selectedPriceRange={urlPriceRange} 
                    onFilterChange={handleFilterChange}
                />

                <main className="flex-1 w-full pb-20">
                    {isLoading && currentDisplayedCount === 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
                            {Array.from({ length: 8 }).map((_, index) => (
                                <ProductSkeleton key={index} />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
                            {pagedProducts?.map((product) => (
                                <ProductCard key={product.productId} product={product} />
                            ))}
                        </div>
                    )}

                    {!isLoading && currentDisplayedCount === 0 && (
                        <div className="text-center py-20 text-zinc-500">
                            Không tìm thấy sản phẩm nào phù hợp.
                        </div>
                    )}

                    {currentDisplayedCount > 0 && currentDisplayedCount < totalProducts && (
                        <div className="mt-16 flex flex-col items-center justify-center space-y-4">
                            <p className="text-sm font-medium text-zinc-500">
                                Hiển thị {currentDisplayedCount} trên {totalProducts} sản phẩm
                            </p>
                            <div className="w-64 h-1 bg-zinc-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-zinc-900 rounded-full transition-all duration-500"
                                    style={{ width: `${progressPercentage}%` }}
                                ></div>
                            </div>
                            <button
                                className="mt-4 px-10 py-3.5 bg-white border border-zinc-300 text-zinc-900 font-semibold rounded-full hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-all duration-300 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={handleLoadMore}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Đang tải...' : 'Xem thêm sản phẩm'}
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default ProductPage;