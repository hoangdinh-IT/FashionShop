import React, { useState } from 'react';
import { IoSearchOutline, IoFilterOutline, IoClose, IoRefreshOutline } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import type { Category } from '../types/category'; // Đảm bảo đường dẫn import đúng
import type { CategoryFilters } from '../types/requests';

interface CategoryToolbarProps {
    onSearch?: (value: string) => void;
    onFilterChange: (filters: CategoryFilters) => void;
    parentCategories: Category[];
}

const CategoryToolbar: React.FC<CategoryToolbarProps> = ({ 
    onSearch, 
    onFilterChange, 
    parentCategories 
}) => {

    const defaultValues = {
        isActive: undefined,
        parentId: "",
    };

    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const [filters, setFilters] = useState<CategoryFilters>(defaultValues);

    const handleFilterChange = (key: keyof CategoryFilters, value: any) => {
        const newValues = { ...filters, [key]: value };
        setFilters(newValues);
        onFilterChange(newValues);
    }

    const handleReset = () => {
        setFilters(defaultValues);
        onFilterChange(defaultValues);
    };

    const handleBooleanSelect = (key: keyof CategoryFilters, value: string) => {
        handleFilterChange(key, value === "all" ? undefined : value === "true");
    }

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
                        placeholder="Tìm kiếm danh mục..."
                    />
                </div>

                <button 
                    onClick={() => {
                        setIsFilterOpen(!isFilterOpen)
                        if (isFilterOpen) handleReset()
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
                        <div className="p-3">
                            <div className="flex flex-col sm:flex-row gap-3 items-end">

                                {/* DANH MỤC */}
                                <div className="w-full sm:w-1/3 space-y-1">
                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                                        Thuộc danh mục
                                    </label>
                                    <select
                                        value={filters.parentId || ""}
                                        onChange={(e) => handleFilterChange('parentId', e.target.value)}
                                        className="block w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-700 focus:border-indigo-500 outline-none cursor-pointer"
                                    >
                                        <option value="">Tất cả danh mục</option>
                                        {parentCategories.map((cate) => (
                                            <option key={cate.id} value={cate.id}>
                                                {cate.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                
                                {/* TRẠNG THÁI */}
                                <div className="w-full sm:w-1/3 space-y-1">
                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                                        Trạng thái
                                    </label>
                                    <select
                                        value={filters.isActive === undefined ? "all" : filters.isActive.toString()}
                                        onChange={(e) => handleBooleanSelect("isActive", e.target.value)}
                                        className="block w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-700 focus:border-indigo-500 outline-none cursor-pointer"
                                    >
                                        <option value="all">Tất cả trạng thái</option>
                                        <option value="true">Hoạt động</option>
                                        <option value="false">Tạm ngưng</option>
                                    </select>
                                </div>

                                {/* NÚT RESET */}
                                <div className="w-full sm:w-auto">
                                    <button
                                        onClick={handleReset}
                                        className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-semibold text-rose-600 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 hover:border-rose-300 transition-all shadow-sm"
                                    >
                                        <IoRefreshOutline className="text-lg" />
                                        <span>Đặt lại bộ lọc</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CategoryToolbar;