import type React from "react";
import { IoClose, IoFilterOutline, IoRefreshOutline, IoSearchOutline } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import type { ColorFilters } from "../types/requests";

interface ColorToolbarProps {
    onSearch?: (value: string) => void;
    onFilterChange: (filters: ColorFilters) => void;
}

const ColorToolbar: React.FC<ColorToolbarProps> = ({
    onSearch,
    onFilterChange,
}) => {

    const defaultValues = { isActive: undefined }

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filters, setFilters] = useState<ColorFilters>(defaultValues);

    const handleFilterChange = (key: keyof ColorFilters, value: any) => {
        const newValues = { ...filters, [key]: value };
        setFilters(newValues);
        onFilterChange(newValues);
    }

    const handleReset = () => {
        setFilters(defaultValues);
        onFilterChange(defaultValues);
    }

    const handleBooleanSelect = (key: keyof ColorFilters, value: string) => {
        handleFilterChange(key, value === "all" ? undefined : value === "true");
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-2.5 flex gap-2.5 justify-between items-center">
                
                <div className="relative w-full md:max-w-sm group">
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600">
                        <IoSearchOutline className="text-base" />
                    </div>

                    <input
                        type="text"
                        onChange={(e) => onSearch?.(e.target.value)}
                        className="block w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-transparent focus:bg-white focus:border-indigo-500 rounded-md text-slate-700 text-[13px] font-medium transition-all outline-none placeholder-slate-400"
                        placeholder="Tìm kiếm màu sắc..."
                    />
                </div>

                <button 
                    onClick={() => {
                        setIsFilterOpen(!isFilterOpen)
                        if (isFilterOpen) handleReset() 
                    }}
                    className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md font-medium text-[13px] transition-all border ${
                        isFilterOpen 
                            ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                >
                    {isFilterOpen ? <IoClose className="text-base" /> : <IoFilterOutline className="text-base" />}
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
                        <div className="p-2.5">
                            <div className="flex flex-col sm:flex-row gap-2.5 items-end">
                                
                                {/* TRẠNG THÁI */}
                                <div className="w-full sm:w-1/3 space-y-1">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                                        Trạng thái
                                    </label>

                                    <select
                                        value={filters.isActive === undefined ? "all" : filters.isActive.toString()}
                                        onChange={(e) => handleBooleanSelect("isActive", e.target.value)}
                                        className="block w-full px-2.5 py-1.5 text-[13px] bg-white border border-slate-200 rounded-md text-slate-700 focus:border-indigo-500 outline-none cursor-pointer"
                                    >
                                        <option value="all">Tất cả</option>
                                        <option value="true">Hoạt động</option>
                                        <option value="false">Tạm ngưng</option>
                                    </select>
                                </div>

                                {/* NÚT RESET */}
                                <div className="w-full sm:w-auto">
                                    <button
                                        onClick={handleReset}
                                        className="flex items-center justify-center gap-1.5 w-full px-3 py-1.5 text-[13px] font-semibold text-rose-600 bg-rose-50 border border-rose-200 rounded-md hover:bg-rose-100 hover:border-rose-300 transition-all shadow-sm"
                                    >
                                        <IoRefreshOutline className="text-base" />
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
}

export default ColorToolbar;