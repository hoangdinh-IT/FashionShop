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
        <div className="flex flex-col gap-4 border-b border-zinc-200/80 pb-4 sm:gap-6 sm:pb-6 md:flex-row md:items-end md:justify-between">
            {/* LEFT: TITLE & CATEGORY */}
            <div className="flex flex-col gap-1 sm:gap-1.5 min-w-0">
                {/* Category Subtitle */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-900" />
                    <span className="truncate text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-zinc-500">
                        {categoryName || "Bộ sưu tập"}
                    </span>
                </div>

                {/* Main Title */}
                <h1 className="text-2xl font-black uppercase tracking-tight text-zinc-900 sm:text-3xl md:text-4xl line-clamp-2 break-words">
                    {brandName || customTitle || "Tất cả sản phẩm"}
                </h1>
            </div>

            {/* RIGHT: SORT DROPDOWN */}
            <div className="relative w-full sm:w-auto shrink-0" ref={sortDropdownRef}>
                <button
                    type="button"
                    onClick={() => setIsSortOpen(!isSortOpen)}
                    className="group flex h-10 w-full sm:w-auto items-center justify-between gap-3 rounded-xl border border-zinc-200/80 bg-white px-3.5 sm:px-4 text-xs font-semibold text-zinc-800 transition-all hover:border-zinc-900 hover:bg-zinc-50 active:scale-95 shadow-2xs"
                >
                    <span className="text-zinc-500 truncate">
                        Sắp xếp: <span className="font-bold text-zinc-900">{currentSortLabel}</span>
                    </span>
                    <ChevronDown
                        size={14}
                        className={`shrink-0 text-zinc-400 transition-transform duration-200 group-hover:text-zinc-900 ${
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
                            className="absolute right-0 z-50 mt-2 w-full sm:w-56 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-zinc-200/80 bg-white/95 p-1.5 shadow-xl backdrop-blur-md"
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
                                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 sm:py-2 text-xs transition-colors active:scale-98 ${
                                            isSelected
                                                ? 'bg-zinc-900 font-semibold text-white'
                                                : 'font-medium text-zinc-600 hover:bg-zinc-100/80 hover:text-zinc-900'
                                        }`}
                                    >
                                        <span className="truncate pr-2">{option.label}</span>
                                        {isSelected && <Check size={14} strokeWidth={2.5} className="shrink-0 text-white" />}
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