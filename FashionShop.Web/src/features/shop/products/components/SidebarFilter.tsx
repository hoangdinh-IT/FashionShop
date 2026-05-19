import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, X } from 'lucide-react';
import type { FilterOptionsResponse } from '../types/product';

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
        <div className="w-full flex flex-col gap-6">
            
            {/* Product Count */}
            <div className="relative overflow-hidden rounded-[2rem] border border-zinc-200/70 bg-white px-6 py-7 shadow-[0_10px_40px_rgba(0,0,0,0.03)]">
                <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full bg-zinc-100 blur-3xl opacity-70" />

                <div className="relative flex items-end gap-3">
                    <span className="text-4xl font-black tracking-[-0.08em] text-zinc-900 leading-none">
                        {totalProducts}
                    </span>

                    <span className="pb-1 text-[10px] font-bold uppercase tracking-[0.35em] text-zinc-400">
                        Sản phẩm
                    </span>
                </div>
            </div>

            {/* Filter Wrapper */}
            <div className="overflow-hidden rounded-[2rem] border border-zinc-200/70 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.03)]">
                
                {/* SIZE */}
                <FilterSection title="Kích thước" isOpen={openSections.includes('size')} onToggle={() => toggleSection('size')}>
                    <div className="flex flex-wrap gap-3 px-1 pt-2 pb-7">
                        {filterOptions?.availableSizes?.map((size) => (
                            <button
                                key={size.slug}
                                onClick={() => handleSizeToggle(size.slug)}
                                className={`min-w-[52px] h-11 px-4 rounded-2xl text-[12px] font-bold tracking-wide border transition-all duration-300 ${
                                    selectedSizeSlugs.includes(size.slug)
                                        ? 'bg-zinc-900 border-zinc-900 text-white shadow-lg shadow-zinc-900/10'
                                        : 'bg-zinc-50 border-zinc-100 text-zinc-500 hover:border-zinc-300 hover:bg-white hover:text-zinc-900'
                                }`}
                            >
                                {size.name}
                            </button>
                        ))}
                    </div>
                </FilterSection>

                {/* COLOR */}
                <FilterSection title="Màu sắc" isOpen={openSections.includes('color')} onToggle={() => toggleSection('color')}>
                    <div className="flex flex-wrap gap-4 px-1 pt-2 pb-7">
                        {filterOptions?.availableColors?.map((color) => (
                            <button
                                key={color.slug}
                                onClick={() => handleColorToggle(color.slug)}
                                className={`relative flex items-center justify-center w-11 h-11 rounded-full transition-all duration-300 ${
                                    selectedColorSlug === color.slug
                                        ? 'scale-110'
                                        : 'hover:scale-105'
                                }`}
                            >
                                <span
                                    className={`absolute inset-0 rounded-full border-2 transition-all ${
                                        selectedColorSlug === color.slug
                                            ? 'border-zinc-900'
                                            : 'border-zinc-200'
                                    }`}
                                />

                                <span
                                    className="w-7 h-7 rounded-full border border-black/5 shadow-sm"
                                    style={{ backgroundColor: color.hexCode }}
                                />
                            </button>
                        ))}
                    </div>
                </FilterSection>

                {/* PRICE */}
                <FilterSection title="Giá" isOpen={openSections.includes('price')} onToggle={() => toggleSection('price')}>
                    <div className="flex flex-col gap-3 px-1 pt-2 pb-7">
                        {PRICE_SEGMENTS.map((segment) => (
                            <label
                                key={segment.id}
                                className={`group relative flex items-center gap-4 rounded-2xl border px-4 py-4 cursor-pointer transition-all duration-300 ${
                                    selectedPriceRange.includes(segment.id)
                                        ? 'border-zinc-900 bg-zinc-900 text-white'
                                        : 'border-zinc-100 bg-zinc-50 hover:border-zinc-200 hover:bg-white'
                                }`}
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedPriceRange.includes(segment.id)}
                                    onChange={() => handlePriceToggle(segment.id)}
                                    className="hidden"
                                />

                                <div
                                    className={`flex items-center justify-center w-5 h-5 rounded-full border transition-all ${
                                        selectedPriceRange.includes(segment.id)
                                            ? 'border-white bg-white'
                                            : 'border-zinc-300 bg-white'
                                    }`}
                                >
                                    {selectedPriceRange.includes(segment.id) && (
                                        <div className="w-2 h-2 rounded-full bg-zinc-900" />
                                    )}
                                </div>

                                <span
                                    className={`text-[13px] font-medium transition-colors ${
                                        selectedPriceRange.includes(segment.id)
                                            ? 'text-white'
                                            : 'text-zinc-600 group-hover:text-zinc-900'
                                    }`}
                                >
                                    {segment.label}
                                </span>
                            </label>
                        ))}
                    </div>
                </FilterSection>
            </div>

            {/* CLEAR FILTER */}
            {hasFilters && (
                <button
                    onClick={handleClearFilters}
                    className="group flex items-center justify-center gap-2 h-14 rounded-2xl border border-red-100 bg-white text-[11px] font-bold uppercase tracking-[0.25em] text-red-500 transition-all duration-300 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                >
                    <X size={14} className="transition-transform duration-300 group-hover:rotate-90" />
                    Xóa bộ lọc
                </button>
            )}
        </div>
    );
};

// Helper Component
const FilterSection: React.FC<{
    title: string;
    isOpen: boolean;
    onToggle: () => void;
    children: React.ReactNode;
}> = ({ title, isOpen, onToggle, children }) => (
    <div className="border-b border-zinc-100 last:border-none">
        <button
            onClick={onToggle}
            className="group flex items-center justify-between w-full px-6 py-6"
        >
            <div className="flex flex-col items-start">
                <span className="text-[12px] font-black uppercase tracking-[0.25em] text-zinc-900">
                    {title}
                </span>

                <span className="mt-1 text-[10px] text-zinc-400 tracking-wide">
                    Filter collection
                </span>
            </div>

            <motion.div
                animate={{ rotate: isOpen ? 0 : 180 }}
                transition={{ duration: 0.25 }}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-100 text-zinc-500 group-hover:bg-zinc-900 group-hover:text-white transition-all duration-300"
            >
                {isOpen ? <Minus size={13} /> : <Plus size={13} />}
            </motion.div>
        </button>

        <AnimatePresence initial={false}>
            {isOpen && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden px-6"
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);

export default SidebarFilter;