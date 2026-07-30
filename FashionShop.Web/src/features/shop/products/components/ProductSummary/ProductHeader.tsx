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
        <div className="flex flex-col gap-6 border-b border-zinc-200/80 pb-6 md:flex-row md:items-end md:justify-between">
            {/* LEFT: TITLE & CATEGORY */}
            <div className="flex flex-col gap-1.5">
                {/* Category Subtitle */}
                <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-zinc-900" />
                    <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-500">
                        {categoryName || "Bộ sưu tập"}
                    </span>
                </div>

                {/* Main Title */}
                <h1 className="text-3xl font-black uppercase tracking-tight text-zinc-900 md:text-4xl">
                    {brandName || customTitle || "Tất cả sản phẩm"}
                </h1>
            </div>

            {/* RIGHT: SORT DROPDOWN */}
            <div className="relative shrink-0" ref={sortDropdownRef}>
                <button
                    type="button"
                    onClick={() => setIsSortOpen(!isSortOpen)}
                    className="group flex h-10 items-center justify-between gap-3 rounded-xl border border-zinc-200/80 bg-white px-4 text-xs font-semibold text-zinc-800 transition-all hover:border-zinc-900 hover:bg-zinc-50 shadow-2xs"
                >
                    <span className="text-zinc-500">
                        Sắp xếp: <span className="font-bold text-zinc-900">{currentSortLabel}</span>
                    </span>
                    <ChevronDown
                        size={14}
                        className={`text-zinc-400 transition-transform duration-200 group-hover:text-zinc-900 ${
                            isSortOpen ? 'rotate-180' : ''
                        }`}
                    />
                </button>

                <AnimatePresence>
                    {isSortOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 6, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 6, scale: 0.98 }}
                            transition={{ duration: 0.15, ease: "easeOut" }}
                            className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-zinc-200/80 bg-white/95 p-1.5 shadow-xl backdrop-blur-md"
                        >
                            {sortOptions.map((option) => {
                                const isSelected = urlSort === option.value;
                                return (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => {
                                            onSortSelect(option.value);
                                            setIsSortOpen(false);
                                        }}
                                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-xs transition-colors ${
                                            isSelected
                                                ? 'bg-zinc-900 font-semibold text-white'
                                                : 'font-medium text-zinc-600 hover:bg-zinc-100/80 hover:text-zinc-900'
                                        }`}
                                    >
                                        <span>{option.label}</span>
                                        {isSelected && <Check size={14} strokeWidth={2.5} className="text-white" />}
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