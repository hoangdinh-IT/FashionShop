import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, X, SlidersHorizontal } from 'lucide-react';
import type { FilterOptionsResponse } from '../../types/product';

interface Props {
    totalProducts: number;
    filterOptions?: FilterOptionsResponse;
    selectedSizeSlugs: string[];
    selectedColorSlug: string;
    selectedPriceRange: string[];
    onFilterChange: (filters: { sizeSlugs: string[], colorSlug: string, priceRange: string[] }) => void;
}

const PRICE_SEGMENTS = [
    { id: '0-200000', label: '0 - 200.000đ' },
    { id: '200000-300000', label: '200.000đ - 300.000đ' },
    { id: '300000-500000', label: '300.000đ - 500.000đ' },
    { id: '>500000', label: 'Trên 500.000đ' },
];

const SidebarFilter: React.FC<Props> = ({
    totalProducts,
    filterOptions,
    selectedSizeSlugs,
    selectedColorSlug,
    selectedPriceRange,
    onFilterChange
}) => {
    const [openSections, setOpenSections] = useState<string[]>(['size', 'color', 'price']);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const activeFilterCount = selectedSizeSlugs.length + (selectedColorSlug ? 1 : 0) + selectedPriceRange.length;
    const hasFilters = activeFilterCount > 0;

    // Khóa cuộn trang chính khi đang mở Bottom Sheet trên Mobile
    useEffect(() => {
        if (isMobileOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileOpen]);

    const toggleSection = (id: string) => {
        setOpenSections(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
    };

    const handleSizeToggle = (slug: string) => {
        const newSizes = selectedSizeSlugs.includes(slug)
            ? selectedSizeSlugs.filter(item => item !== slug)
            : [...selectedSizeSlugs, slug];
        onFilterChange({ sizeSlugs: newSizes, colorSlug: selectedColorSlug, priceRange: selectedPriceRange });
    };

    const handleColorToggle = (slug: string) => {
        const newColor = selectedColorSlug === slug ? "" : slug;
        onFilterChange({ sizeSlugs: selectedSizeSlugs, colorSlug: newColor, priceRange: selectedPriceRange });
    };

    const handlePriceToggle = (id: string) => {
        const newPriceRange = selectedPriceRange.includes(id)
            ? selectedPriceRange.filter(item => item !== id)
            : [...selectedPriceRange, id];
        onFilterChange({ sizeSlugs: selectedSizeSlugs, colorSlug: selectedColorSlug, priceRange: newPriceRange });
    };

    const handleClearFilters = () => {
        onFilterChange({ sizeSlugs: [], colorSlug: "", priceRange: [] });
    };

    const filterContent = (
        <div className="flex flex-col gap-4 sm:gap-5">
            {/* PRODUCT COUNT HEADER (Desktop Only) */}
            <div className="hidden lg:flex items-center justify-between rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Sản phẩm tìm thấy
                </span>
                <span className="text-2xl font-black tracking-tight text-zinc-900">
                    {totalProducts}
                </span>
            </div>

            {/* FILTER MAIN WRAPPER */}
            <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-xs">

                {/* SIZE SECTION */}
                <FilterSection
                    title="Kích thước"
                    isOpen={openSections.includes('size')}
                    onToggle={() => toggleSection('size')}
                >
                    <div className="flex flex-wrap gap-2 pt-1 pb-5 sm:pb-6">
                        {filterOptions?.availableSizes?.map((size) => {
                            const isSelected = selectedSizeSlugs.includes(size.slug);
                            return (
                                <button
                                    key={size.slug}
                                    type="button"
                                    onClick={() => handleSizeToggle(size.slug)}
                                    className={`flex h-9 min-w-[42px] items-center justify-center rounded-xl border px-3 text-xs font-semibold transition-all duration-200 active:scale-95 ${
                                        isSelected
                                            ? 'border-zinc-900 bg-zinc-900 text-white shadow-xs'
                                            : 'border-zinc-200/80 bg-white text-zinc-700 hover:border-zinc-400 hover:bg-zinc-50'
                                    }`}
                                >
                                    {size.name}
                                </button>
                            );
                        })}
                    </div>
                </FilterSection>

                {/* COLOR SECTION */}
                <FilterSection
                    title="Màu sắc"
                    isOpen={openSections.includes('color')}
                    onToggle={() => toggleSection('color')}
                >
                    <div className="flex flex-wrap gap-3 pt-1 pb-5 sm:pb-6">
                        {filterOptions?.availableColors?.map((color) => {
                            const isSelected = selectedColorSlug === color.slug;
                            return (
                                <button
                                    key={color.slug}
                                    type="button"
                                    onClick={() => handleColorToggle(color.slug)}
                                    title={color.name}
                                    className={`relative flex h-8 w-8 sm:h-7 sm:w-7 items-center justify-center rounded-full transition-transform active:scale-90 ${
                                        isSelected
                                            ? 'scale-110 ring-2 ring-zinc-900 ring-offset-2'
                                            : 'hover:scale-105'
                                    }`}
                                >
                                    <span
                                        className="h-full w-full rounded-full border border-zinc-200/80 shadow-2xs"
                                        style={{ backgroundColor: color.hexCode }}
                                    />
                                </button>
                            );
                        })}
                    </div>
                </FilterSection>

                {/* PRICE SECTION */}
                <FilterSection
                    title="Khoảng giá"
                    isOpen={openSections.includes('price')}
                    onToggle={() => toggleSection('price')}
                >
                    <div className="flex flex-col gap-1 pt-1 pb-5 sm:pb-6">
                        {PRICE_SEGMENTS.map((segment) => {
                            const isSelected = selectedPriceRange.includes(segment.id);
                            return (
                                <label
                                    key={segment.id}
                                    className="group flex cursor-pointer items-center gap-3 rounded-xl px-2.5 py-2.5 sm:py-2 transition-colors hover:bg-zinc-50 active:bg-zinc-100/70"
                                >
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => handlePriceToggle(segment.id)}
                                        className="hidden"
                                    />

                                    {/* Custom Checkbox */}
                                    <div
                                        className={`flex h-4.5 w-4.5 sm:h-4 sm:w-4 items-center justify-center rounded-md border transition-all ${
                                            isSelected
                                                ? 'border-zinc-900 bg-zinc-900 text-white'
                                                : 'border-zinc-300 bg-white group-hover:border-zinc-400'
                                        }`}
                                    >
                                        {isSelected && (
                                            <div className="h-1.5 w-1.5 rounded-xs bg-white" />
                                        )}
                                    </div>

                                    <span
                                        className={`text-xs transition-colors ${
                                            isSelected
                                                ? 'font-semibold text-zinc-900'
                                                : 'font-medium text-zinc-600 group-hover:text-zinc-900'
                                        }`}
                                    >
                                        {segment.label}
                                    </span>
                                </label>
                            );
                        })}
                    </div>
                </FilterSection>
            </div>

            {/* CLEAR FILTER BUTTON */}
            {hasFilters && (
                <button
                    type="button"
                    onClick={handleClearFilters}
                    className="group flex h-11 items-center justify-center gap-2 rounded-xl border border-red-200/80 bg-red-50/50 text-xs font-semibold text-red-600 transition-all hover:border-red-300 hover:bg-red-100/60 active:scale-98"
                >
                    <X size={14} className="transition-transform duration-300 group-hover:rotate-90" />
                    <span>Xóa tất cả bộ lọc ({activeFilterCount})</span>
                </button>
            )}
        </div>
    );

    return (
        <>
            {/* MOBILE TRIGGER BUTTON (< lg) */}
            <div className="flex lg:hidden items-center justify-between gap-3 w-full mb-2">
                <button
                    type="button"
                    onClick={() => setIsMobileOpen(true)}
                    className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-zinc-200/80 bg-white px-4 text-xs font-semibold text-zinc-900 shadow-2xs transition-all active:scale-95"
                >
                    <SlidersHorizontal size={14} className="text-zinc-600" />
                    <span>Bộ lọc</span>
                    {activeFilterCount > 0 && (
                        <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-zinc-900 px-1.5 text-[10px] font-bold text-white">
                            {activeFilterCount}
                        </span>
                    )}
                </button>

                <div className="flex h-10 items-center px-3.5 rounded-xl border border-zinc-200/80 bg-white text-xs font-semibold text-zinc-600 shadow-2xs">
                    <span>{totalProducts} sản phẩm</span>
                </div>
            </div>

            {/* DESKTOP SIDEBAR (≥ lg) */}
            <aside className="hidden lg:block w-full">
                {filterContent}
            </aside>

            {/* MOBILE BOTTOM SHEET (< lg) */}
            <AnimatePresence>
                {isMobileOpen && (
                    <div className="fixed inset-0 z-50 lg:hidden">
                        {/* Backdrop Phông nền tối */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-xs"
                        />

                        {/* Sheet Container Ghim Dưới Cùng */}
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="absolute bottom-0 inset-x-0 z-10 flex max-h-[85vh] w-full flex-col rounded-t-[28px] bg-zinc-50 shadow-2xl overflow-hidden"
                        >
                            {/* Drag Indicator Bar */}
                            <div className="flex justify-center pt-3 pb-1 bg-white">
                                <div className="h-1.5 w-12 rounded-full bg-zinc-300" />
                            </div>

                            {/* Cố định HEADER */}
                            <div className="flex shrink-0 items-center justify-between px-5 pb-3 pt-1 border-b border-zinc-200/80 bg-white">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-base font-bold text-zinc-900">Bộ lọc sản phẩm</h3>
                                    {activeFilterCount > 0 && (
                                        <span className="rounded-full bg-zinc-900 px-2 py-0.5 text-[10px] font-bold text-white">
                                            {activeFilterCount}
                                        </span>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsMobileOpen(false)}
                                    className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 active:scale-90"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            {/* NỘI DUNG BỘ LỌC TỰ CUỘN (SCROLLABLE AREA) */}
                            <div className="flex-1 overflow-y-auto p-4 sm:p-5">
                                {filterContent}
                            </div>

                            {/* Cố định FOOTER (Ghim Đáy với Safe Area) */}
                            <div className="shrink-0 border-t border-zinc-200/80 bg-white p-4 pb-6">
                                <button
                                    type="button"
                                    onClick={() => setIsMobileOpen(false)}
                                    className="flex h-12 w-full items-center justify-center rounded-xl bg-zinc-900 text-xs font-bold text-white shadow-md active:scale-98"
                                >
                                    Xem {totalProducts} sản phẩm
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

// Helper Section Component
const FilterSection: React.FC<{
    title: string;
    isOpen: boolean;
    onToggle: () => void;
    children: React.ReactNode;
}> = ({ title, isOpen, onToggle, children }) => (
    <div className="border-b border-zinc-100 last:border-none">
        <button
            type="button"
            onClick={onToggle}
            className="flex w-full items-center justify-between p-4 sm:p-5 text-left transition-colors hover:bg-zinc-50/50 active:bg-zinc-100/50"
        >
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                {title}
            </span>

            <div className="flex h-6 w-6 items-center justify-center rounded-md text-zinc-400">
                {isOpen ? <Minus size={14} /> : <Plus size={14} />}
            </div>
        </button>

        <AnimatePresence initial={false}>
            {isOpen && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="overflow-hidden px-4 sm:px-5"
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);

export default SidebarFilter;