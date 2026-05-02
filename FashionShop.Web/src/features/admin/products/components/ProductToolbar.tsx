import type React from "react";
import { useState } from "react";
import { IoClose, IoFilterOutline, IoRefreshOutline, IoSearchOutline } from "react-icons/io5";
import type { Category } from "../../categories/types/category";
import type { Brand } from "../../brands/types/brand";
import { motion, AnimatePresence } from "framer-motion";
import type { ProductFilters } from "../types/requests";

interface ProductToolbarProps {
    onSearch?: (text: string) => void;
    onFilterChange: (filters: ProductFilters) => void;
    leafCategories: Category[],
    brands: Brand[],
}

const ProductToolbar: React.FC<ProductToolbarProps> = ({
    onSearch,
    onFilterChange,
    leafCategories = [],
    brands = [],
}) => {
    
    const defaultValues: ProductFilters = {
        categoryId: "",
        brandId: "",
        isActive: undefined,
        isBestSeller: undefined,
        isNew: undefined,
        minPrice: undefined,
        maxPrice: undefined,
    }

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filters, setFilters] = useState<ProductFilters>(defaultValues);

    const handleFilterChange = (key: keyof ProductFilters, value: any) => {
        const newValues: ProductFilters = { ...filters, [key]: value };
        setFilters(newValues);
        onFilterChange(newValues);
    }

    const handleReset = () => {
        setFilters(defaultValues);
        onFilterChange(defaultValues);
    }

    const handleBooleanSelect = (key: keyof ProductFilters, value: string) => {
        handleFilterChange(key, value === "all" ? undefined : value === "true");
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-3 flex gap-3 justify-between items-center">
                
                <div className="relative w-full md:max-w-sm group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600">
                        <IoSearchOutline className="text-lg" />
                    </div>
                    <input
                        type="text"
                        onChange={(e) => onSearch?.(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 bg-slate-50 border border-transparent focus:bg-white focus:border-indigo-500 rounded-lg text-slate-700 text-sm font-medium transition-all outline-none placeholder-slate-400"
                        placeholder="Tìm kiếm sản phẩm..."
                    />
                </div>

                <button 
                    onClick={() => {
                        setIsFilterOpen(!isFilterOpen);
                        if (isFilterOpen) handleReset();
                    }}
                    className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all border ${
                        isFilterOpen 
                            ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                >
                    {isFilterOpen ? <IoClose className="text-lg" /> : <IoFilterOutline className="text-lg" />}
                    <span className="hidden sm:inline">{isFilterOpen ? 'Đóng' : 'Bộ lọc'}</span>
                </button>
            </div>

            <AnimatePresence>
                {isFilterOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="bg-slate-50/50 border-t border-slate-100"
                    >
                        <div className="p-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                
                                {/* DANH MỤC */}
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Danh mục</label>
                                    <select
                                        value={filters.categoryId || ''}
                                        onChange={(e) => handleFilterChange('categoryId', e.target.value)}
                                        className="block w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-700 focus:border-indigo-500 outline-none cursor-pointer"
                                    >
                                        <option value="">Tất cả danh mục</option>
                                        {leafCategories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* THƯƠNG HIỆU */}
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Thương hiệu</label>
                                    <select
                                        value={filters.brandId || ''}
                                        onChange={(e) => handleFilterChange('brandId', e.target.value)}
                                        className="block w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-700 focus:border-indigo-500 outline-none cursor-pointer"
                                    >
                                        <option value="">Tất cả thương hiệu</option>
                                        {brands.map(brand => (
                                            <option key={brand.id} value={brand.id}>{brand.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* TRẠNG THÁI */}
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Trạng thái</label>
                                    <select
                                        value={filters.isActive === undefined ? "all" : filters.isActive.toString()}
                                        onChange={(e) => handleBooleanSelect('isActive', e.target.value)}
                                        className="block w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-700 focus:border-indigo-500 outline-none cursor-pointer"
                                    >
                                        <option value="all">Tất cả</option>
                                        <option value="true">Hoạt động</option>
                                        <option value="false">Tạm ngưng</option>
                                    </select>
                                </div>

                                {/* NÚT RESET */}
                                <div className="flex items-end">
                                    <button
                                        onClick={handleReset}
                                        className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-semibold text-rose-600 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 hover:border-rose-300 transition-all shadow-sm"
                                    >
                                        <IoRefreshOutline className="text-lg" />
                                        <span>Đặt lại bộ lọc</span>
                                    </button>
                                </div>

                                {/* BESTSELLER */}
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Bán chạy nhất</label>
                                    <select
                                        value={filters.isBestSeller === undefined ? "all" : filters.isBestSeller.toString()}
                                        onChange={(e) => handleBooleanSelect('isBestSeller', e.target.value)}
                                        className="block w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-700 focus:border-indigo-500 outline-none cursor-pointer"
                                    >
                                        <option value="all">Tất cả</option>
                                        <option value="true">Có</option>
                                        <option value="false">Không</option>
                                    </select>
                                </div>

                                {/* NEW */}
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Mới nhất</label>
                                    <select
                                        value={filters.isNew === undefined ? "all" : filters.isNew.toString()}
                                        onChange={(e) => handleBooleanSelect('isNew', e.target.value)}
                                        className="block w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-700 focus:border-indigo-500 outline-none cursor-pointer"
                                    >
                                        <option value="all">Tất cả</option>
                                        <option value="true">Có</option>
                                        <option value="false">Không</option>
                                    </select>
                                </div>

                                {/* PRICE */}
                                <div className="space-y-1 sm:col-span-2">
                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Khoảng giá (VNĐ)</label>
                                    <div className="flex gap-2 items-center">
                                        <input
                                            type="number"
                                            placeholder="Thấp nhất"
                                            value={filters.minPrice || ''}
                                            onChange={(e) => handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                                            className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:border-indigo-500 outline-none"
                                        />
                                        <span className="text-slate-400">-</span>
                                        <input
                                            type="number"
                                            placeholder="Cao nhất"
                                            value={filters.maxPrice || ''}
                                            onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                                            className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:border-indigo-500 outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default ProductToolbar;