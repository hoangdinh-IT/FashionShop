import React, { useEffect, useState } from 'react';
import SidebarFilter from '../../../features/shop/products/components/SidebarFilter';
import ProductCard from '../../../features/shop/products/components/ProductCard';
import { useFilterOptions, useProducts } from '../../../features/shop/products/hooks/useProducts';
import type { FilterOptionsRequest, ProductQueryParams } from '../../../features/shop/products/types/requests';
import ProductSkeleton from '../../../components/common/ProductSkeleton';
import { useParams, useSearchParams } from 'react-router-dom';

const ProductPage: React.FC = () => {
    const { brandSlug, categorySlug } = useParams<{ brandSlug: string; categorySlug: string }>();
    
    const [searchParams, setSearchParams] = useSearchParams();

    const urlColorId = Number(searchParams.get('colorId')) || 0;
    const urlSizeIds = searchParams.getAll('sizeIds').map(Number);
    const urlPrices = searchParams.getAll('price_range'); 

    const [queryParams, setQueryParams] = useState<ProductQueryParams>({
        keyword: undefined,
        categorySlug: categorySlug || undefined,
        brandSlug: brandSlug || undefined,
        colorId: urlColorId > 0 ? urlColorId : undefined,
        sizeIds: urlSizeIds.length > 0 ? urlSizeIds : undefined,
        priceRange: urlPrices.length > 0 ? urlPrices.join(',') : undefined,
        isBestSeller: undefined,
        isNew: undefined,
        isAscendingPrice: undefined,
        pageSize: 1, 
        pageIndex: 1,
        sortBy: "createddate",
        isAscending: false,
    });

    const [filterOptionParams, setFilterOptionParams] = useState<FilterOptionsRequest>({
        brandSlug: brandSlug || undefined,
        categorySlug: categorySlug || undefined,
    });

    const { pagedProducts, totalProducts, isLoading } = useProducts(queryParams);
    const { filterOptions } = useFilterOptions(filterOptionParams);

    useEffect(() => {
        setQueryParams(prev => ({
            ...prev,
            categorySlug: categorySlug || undefined,
            brandSlug: brandSlug || undefined,
            colorId: urlColorId > 0 ? urlColorId : undefined,
            sizeIds: urlSizeIds.length > 0 ? urlSizeIds : undefined,
            priceRange: urlPrices.length > 0 ? urlPrices.join(',') : undefined,
            pageSize: 1,
            pageIndex: 1
        }));

        setFilterOptionParams(prev => ({
            ...prev,
            brandSlug: brandSlug,
            categorySlug: categorySlug,
        }));
    }, [brandSlug, categorySlug, searchParams]);

    const handleFilterChange = (filters: { sizeIds: number[], colorId: number, priceRange: string[] }) => {
        const newParams = new URLSearchParams(searchParams);

        if (filters.colorId > 0) newParams.set('colorId', filters.colorId.toString());
        else newParams.delete('colorId');

        newParams.delete('sizeIds');
        filters.sizeIds.forEach(id => newParams.append('sizeIds', id.toString()));

        newParams.delete('price_range');
        filters.priceRange.forEach(p => newParams.append('price_range', p));

        setSearchParams(newParams);
    };

    const handleLoadMore = () => {
        setQueryParams(prev => ({ ...prev, pageSize: (prev.pageSize || 1) + 1 }));
    };

    const currentDisplayedCount = pagedProducts?.length || 0;
    const progressPercentage = totalProducts > 0 ? (currentDisplayedCount / totalProducts) * 100 : 0;

    return (
        <div className="w-full max-w-[1600px] mx-auto px-6 py-8">
            <div className="flex justify-between items-end mb-8 pb-4 border-b border-zinc-200">
                <div className="flex items-baseline gap-4">
                    <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Áo Nam</h1>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-sm text-zinc-500 font-medium uppercase tracking-wider">Phân loại</span>
                    <select className="bg-white border border-zinc-200 text-sm font-medium text-zinc-800 rounded-lg px-4 py-2.5 outline-none focus:border-zinc-500 appearance-none pr-10 relative cursor-pointer shadow-sm hover:border-zinc-300 transition-colors">
                        <option value="default">Mặc định</option>
                        <option value="price_asc">Giá tăng dần</option>
                        <option value="price_desc">Giá giảm dần</option>
                        <option value="newest">Mới nhất</option>
                    </select>
                </div>
            </div>

            <div className="flex items-start gap-10 relative">
                <SidebarFilter 
                    totalProducts={totalProducts} 
                    filterOptions={filterOptions}
                    // TRUYỀN GIÁ TRỊ TỪ URL XUỐNG SIDEBAR
                    selectedSizeIds={urlSizeIds}
                    selectedColorId={urlColorId}
                    selectedPrices={urlPrices}
                    onFilterChange={handleFilterChange}
                />

                {/* --- CODE MAIN GIỮ NGUYÊN KHÔNG ĐỔI --- */}
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