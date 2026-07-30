import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, X } from 'lucide-react';
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

    // --- LOGIC GIỮ NGUYÊN ---
    const hasFilters = selectedSizeSlugs.length > 0 || selectedColorSlug !== "" || selectedPriceRange.length > 0;

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

    return (
        <div className="w-full flex flex-col gap-5">

            {/* PRODUCT COUNT HEADER */}
            <div className="flex items-center justify-between rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs">
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
                    <div className="flex flex-wrap gap-2 pt-1 pb-6">
                        {filterOptions?.availableSizes?.map((size) => {
                            const isSelected = selectedSizeSlugs.includes(size.slug);
                            return (
                                <button
                                    key={size.slug}
                                    type="button"
                                    onClick={() => handleSizeToggle(size.slug)}
                                    className={`flex h-9 min-w-[42px] items-center justify-center rounded-xl border px-3 text-xs font-semibold transition-all duration-200 ${
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
                    <div className="flex flex-wrap gap-3 pt-1 pb-6">
                        {filterOptions?.availableColors?.map((color) => {
                            const isSelected = selectedColorSlug === color.slug;
                            return (
                                <button
                                    key={color.slug}
                                    type="button"
                                    onClick={() => handleColorToggle(color.slug)}
                                    title={color.name}
                                    className={`relative flex h-7 w-7 items-center justify-center rounded-full transition-transform ${
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
                    <div className="flex flex-col gap-1 pt-1 pb-6">
                        {PRICE_SEGMENTS.map((segment) => {
                            const isSelected = selectedPriceRange.includes(segment.id);
                            return (
                                <label
                                    key={segment.id}
                                    className="group flex cursor-pointer items-center gap-3 rounded-xl px-2.5 py-2 transition-colors hover:bg-zinc-50"
                                >
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => handlePriceToggle(segment.id)}
                                        className="hidden"
                                    />

                                    {/* Custom Checkbox */}
                                    <div
                                        className={`flex h-4 w-4 items-center justify-center rounded-md border transition-all ${
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
                    className="group flex h-11 items-center justify-center gap-2 rounded-xl border border-red-200/80 bg-red-50/50 text-xs font-semibold text-red-600 transition-all hover:border-red-300 hover:bg-red-100/60"
                >
                    <X size={14} className="transition-transform duration-300 group-hover:rotate-90" />
                    <span>Xóa tất cả bộ lọc</span>
                </button>
            )}
        </div>
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
            className="flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-zinc-50/50"
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
                    className="overflow-hidden px-5"
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);

export default SidebarFilter;