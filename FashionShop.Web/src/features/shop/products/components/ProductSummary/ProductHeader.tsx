import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';

interface SortOption {
    value: string;
    label: string;
}

interface Props {
    customTitle?: string;
    brandName?: string;
    categoryName?: string;
    urlSort: string;
    sortOptions: SortOption[];
    onSortSelect: (value: string) => void;
}

const ProductHeader: React.FC<Props> = ({
    customTitle,
    brandName,
    categoryName,
    urlSort,
    sortOptions,
    onSortSelect,
}) => {
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

    const currentSortLabel = sortOptions.find(opt => opt.value === urlSort)?.label || "Mặc định";

    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-8 border-b border-zinc-100">
            <div className="flex-1">
                {/* Main Title: Hiển thị Brand Name (Ưu tiên) hoặc Custom Title */}
                <h1 className="text-4xl md:text-5xl font-black text-zinc-900 uppercase italic tracking-tighter leading-none">
                    {brandName || customTitle || "Tất cả sản phẩm"}
                    <span className="text-blue-600 not-italic ml-1">.</span>
                </h1>

                {/* Sub Title: Hiển thị Category Name nhỏ phía trên */}
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-[2px] bg-blue-600"></div>
                    <span className="text-[11px] font-black uppercase tracking-[0.3em] text-blue-600">
                        {categoryName || "Bộ sưu tập"}
                    </span>
                </div>
            </div>

            {/* Sort Dropdown */}
            <div className="relative shrink-0" ref={sortDropdownRef}>
                <button
                    onClick={() => setIsSortOpen(!isSortOpen)}
                    className="group flex items-center gap-4 px-6 py-3 bg-white border border-zinc-200 rounded-full hover:border-zinc-900 transition-all duration-300"
                >
                    <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 group-hover:text-zinc-900">
                        Sắp xếp: <span className="text-zinc-900 ml-1">{currentSortLabel}</span>
                    </span>
                    <ChevronDown size={14} className={`transition-transform duration-300 ${isSortOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                    {isSortOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute right-0 mt-2 w-56 bg-white border border-zinc-100 rounded-2xl shadow-xl z-[100] py-2 overflow-hidden"
                        >
                            {sortOptions.map((option) => {
                                const isSelected = urlSort === option.value;
                                return (
                                    <button
                                        key={option.value}
                                        onClick={() => {
                                            onSortSelect(option.value);
                                            setIsSortOpen(false);
                                        }}
                                        className={`w-full text-left flex items-center justify-between px-5 py-3 text-[13px] transition-colors ${
                                            isSelected ? 'bg-zinc-50 text-zinc-900 font-bold' : 'text-zinc-600 font-medium hover:bg-zinc-50'
                                        }`}
                                    >
                                        {option.label}
                                        {isSelected && <Check size={14} strokeWidth={2.5} className="text-blue-600" />}
                                    </button>
                                );
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ProductHeader;