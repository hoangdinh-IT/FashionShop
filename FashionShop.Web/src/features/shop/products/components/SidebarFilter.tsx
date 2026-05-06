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
        <div className="w-full flex flex-col overflow-hidden">
            <div className="pb-8 mb-2 border-b border-zinc-100">
                <div className="flex items-center gap-2">
                    <span className="text-3xl font-black italic tracking-tighter text-zinc-900">{totalProducts}</span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mt-2">Sản phẩm</span>
                </div>
            </div>

            {/* Section Size: Sửa filterOptions.sizes -> filterOptions.availableSizes */}
            <FilterSection title="Kích thước" isOpen={openSections.includes('size')} onToggle={() => toggleSection('size')}>
                <div className="flex flex-wrap gap-2 pt-2 pb-6">
                    {filterOptions?.availableSizes?.map((size) => (
                        <button
                            key={size.slug}
                            onClick={() => handleSizeToggle(size.slug)}
                            className={`min-w-[42px] h-10 px-2 flex items-center justify-center text-[12px] font-bold border transition-all ${
                                selectedSizeSlugs.includes(size.slug) 
                                ? 'bg-zinc-900 border-zinc-900 text-white' 
                                : 'bg-white border-zinc-200 text-zinc-500 hover:border-zinc-900 hover:text-zinc-900'
                            }`}
                        >
                            {size.name}
                        </button>
                    ))}
                </div>
            </FilterSection>

            {/* Section Color: Sửa filterOptions.colors -> filterOptions.availableColors */}
            <FilterSection title="Màu sắc" isOpen={openSections.includes('color')} onToggle={() => toggleSection('color')}>
                <div className="flex flex-wrap gap-3 pt-2 pb-6">
                    {filterOptions?.availableColors?.map((color) => (
                        <button
                            key={color.slug}
                            onClick={() => handleColorToggle(color.slug)}
                            className={`w-8 h-8 rounded-full border-2 transition-all ${
                                selectedColorSlug === color.slug ? 'border-zinc-900 p-0.5' : 'border-transparent hover:border-zinc-200'
                            }`}
                        >
                            <div className="w-full h-full rounded-full border border-black/5" style={{ backgroundColor: color.hexCode }} />
                        </button>
                    ))}
                </div>
            </FilterSection>

            {/* Section Price: Giữ nguyên logic handlePriceToggle */}
            <FilterSection title="Giá" isOpen={openSections.includes('price')} onToggle={() => toggleSection('price')}>
                <div className="flex flex-col gap-3 pt-2 pb-6">
                    {PRICE_SEGMENTS.map((segment) => (
                        <label key={segment.id} className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={selectedPriceRange.includes(segment.id)}
                                onChange={() => handlePriceToggle(segment.id)}
                                className="w-4 h-4 rounded border-zinc-300 focus:ring-0 text-zinc-900"
                            />
                            <span className="text-sm text-zinc-600 group-hover:text-zinc-900">{segment.label}</span>
                        </label>
                    ))}
                </div>
            </FilterSection>

            {hasFilters && (
                <button
                    onClick={handleClearFilters}
                    className="mt-4 flex items-center justify-center gap-2 py-3 w-full border border-zinc-200 text-[11px] font-bold uppercase tracking-widest text-zinc-500 hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-all duration-300"
                >
                    <X size={14} /> Xóa tất cả bộ lọc
                </button>
            )}
        </div>
    );
};

// Helper Component GIỮ NGUYÊN
const FilterSection: React.FC<{ title: string; isOpen: boolean; onToggle: () => void; children: React.ReactNode }> = ({ title, isOpen, onToggle, children }) => (
    <div className="border-b border-zinc-50">
        <button onClick={onToggle} className="flex justify-between items-center w-full py-4 group">
            <span className="text-[13px] font-bold uppercase tracking-[0.15em] text-zinc-900 group-hover:text-zinc-500 transition-colors">{title}</span>
            <motion.div animate={{ rotate: isOpen ? 0 : 180 }}>
                {isOpen ? <Minus size={12} className="text-zinc-400" /> : <Plus size={12} className="text-zinc-400" />}
            </motion.div>
        </button>
        <AnimatePresence>
            {isOpen && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);

export default SidebarFilter;