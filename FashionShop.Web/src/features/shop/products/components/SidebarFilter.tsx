import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Check, X } from 'lucide-react';
import type { FilterOptionsResponse } from '../types/product';

interface Props {
    totalProducts: number;
    filterOptions?: FilterOptionsResponse;
    selectedSizeIds: number[];
    selectedColorId: number;
    selectedPrices: string[];
    onFilterChange: (filters: { sizeIds: number[], colorId: number, priceRange: string[] }) => void;
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
    selectedSizeIds, 
    selectedColorId, 
    selectedPrices, 
    onFilterChange 
}) => {
    const [openSections, setOpenSections] = useState({ size: true, color: true, price: true });

    const hasFilters = selectedSizeIds.length > 0 || selectedColorId > 0 || selectedPrices.length > 0;

    // --- CÁC HÀM XỬ LÝ CLICK SẼ GỌI onFilterChange NGAY LẬP TỨC ---
    const handleSizeToggle = (id: number) => {
        const newSizes = selectedSizeIds.includes(id) 
            ? selectedSizeIds.filter(item => item !== id) 
            : [...selectedSizeIds, id];
        onFilterChange({ sizeIds: newSizes, colorId: selectedColorId, priceRange: selectedPrices });
    };

    const handleColorToggle = (id: number) => {
        const newColor = selectedColorId === id ? 0 : id;
        onFilterChange({ sizeIds: selectedSizeIds, colorId: newColor, priceRange: selectedPrices });
    };

    const handlePriceToggle = (id: string) => {
        const newPrices = selectedPrices.includes(id)
            ? selectedPrices.filter(item => item !== id)
            : [...selectedPrices, id];
        onFilterChange({ sizeIds: selectedSizeIds, colorId: selectedColorId, priceRange: newPrices });
    };

    const handleClearFilters = () => {
        onFilterChange({ sizeIds: [], colorId: 0, priceRange: [] });
    };

    if (!filterOptions) return <div className="w-full h-64 animate-pulse bg-zinc-50/50" />;

    return (
        <aside className="hidden lg:block w-[22%] flex-shrink-0 sticky top-28 max-h-[90vh] pr-4 select-none">
            {/* --- HEADER --- */}
            <div className="mb-4 border-b border-zinc-100 pb-4 flex justify-between items-baseline">
                <h2 className="text-lg font-bold tracking-tight text-zinc-900">Bộ lọc</h2>
                <span className="text-[12px] font-medium text-zinc-700 uppercase tracking-widest">
                    {totalProducts} sản phẩm
                </span>
            </div>

            <div className="space-y-0">
                {/* --- 1. SIZE --- */}
                <FilterSection 
                    title="Kích thước" 
                    isOpen={openSections.size} 
                    onToggle={() => setOpenSections(prev => ({ ...prev, size: !prev.size }))}
                >
                    <div className="flex flex-wrap gap-1.5 pt-1">
                        {filterOptions.availableSizes.map((size) => {
                            const isActive = selectedSizeIds.includes(size.id); 
                            return (
                                <button
                                    key={size.id}
                                    onClick={() => handleSizeToggle(size.id)}
                                    className={`
                                        min-w-[70px] h-10 text-[12px] font-semibold border transition-all duration-300 cursor-pointer
                                        ${isActive 
                                            ? 'bg-zinc-900 border-zinc-900 text-white' 
                                            : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-900 hover:text-zinc-900'
                                        }
                                    `}
                                >
                                    {size.name}
                                </button>
                            );
                        })}
                    </div>
                </FilterSection>

                {/* --- 2. COLOR --- */}
                <FilterSection 
                    title="Màu sắc" 
                    isOpen={openSections.color} 
                    onToggle={() => setOpenSections(prev => ({ ...prev, color: !prev.color }))}
                >
                    <div className="grid grid-cols-5 gap-y-4 pt-2">
                        {filterOptions.availableColors.map((color) => {
                            const isActive = selectedColorId === color.id;
                            
                            return (
                                <button
                                    key={color.id}
                                    onClick={() => handleColorToggle(color.id)}
                                    className="group flex flex-col items-center gap-1.5 cursor-pointer outline-none"
                                >
                                    <div className="relative w-8 h-8 flex items-center justify-center">
                                        <div 
                                            className={`
                                                w-6 h-6 rounded-full border border-zinc-200 shadow-sm transition-all duration-300 
                                                ${isActive ? 'scale-[0.85]' : 'group-hover:scale-110'}
                                            `} 
                                            style={{ backgroundColor: color.hexCode }} 
                                        />
                                        
                                        {isActive && (
                                            <motion.div 
                                                layoutId="activeColorRing" 
                                                className="absolute inset-0 border border-zinc-900 rounded-full" 
                                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                            />
                                        )}
                                    </div>
                                    <span 
                                        className={`
                                            text-[10px] font-bold uppercase tracking-tight transition-colors 
                                            ${isActive ? 'text-zinc-900' : 'text-zinc-400 group-hover:text-zinc-600'}
                                        `}
                                    >
                                        {color.name}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </FilterSection>

                {/* --- 3. PRICE --- */}
                <FilterSection 
                    title="Khoảng giá" 
                    isOpen={openSections.price} 
                    onToggle={() => setOpenSections(prev => ({ ...prev, price: !prev.price }))}
                >
                    <div className="space-y-2.5 pt-1">
                        {PRICE_SEGMENTS.map((segment) => {
                            const isActive = selectedPrices.includes(segment.id);
                            return (
                                <button
                                    key={segment.id}
                                    onClick={() => handlePriceToggle(segment.id)}
                                    className="flex items-center w-full group cursor-pointer"
                                >
                                    <div 
                                        className={`
                                            w-4 h-4 border flex items-center justify-center transition-all mr-3 
                                            ${isActive ? 'bg-zinc-900 border-zinc-900' : 'border-zinc-200 group-hover:border-zinc-900'}
                                        `}
                                    >
                                        {isActive && <Check size={10} className="text-white" strokeWidth={4} />}
                                    </div>
                                    <span 
                                        className={`
                                            text-[13px] font-semibold transition-all 
                                            ${isActive ? 'text-zinc-900' : 'text-zinc-500 group-hover:text-zinc-900'}
                                        `}
                                    >
                                        {segment.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </FilterSection>
            </div>

            {/* --- NÚT XÓA LỌC --- */}
            <div className="h-20 mt-4">
                <AnimatePresence>
                    {hasFilters && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                        >
                            <button
                                onClick={handleClearFilters}
                                className="group relative w-full py-3.5 bg-white border border-zinc-900 overflow-hidden transition-all duration-500"
                            >
                                <div className="absolute inset-0 bg-zinc-900 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />

                                <div className="relative flex items-center justify-center gap-2 cursor-pointer">
                                    <X 
                                        size={12} 
                                        className="text-zinc-900 group-hover:text-white transition-colors duration-300" 
                                        strokeWidth={2.5} 
                                    />
                                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-900 group-hover:text-white transition-colors duration-300">
                                        Xóa bộ lọc
                                    </span>
                                </div>
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </aside>
    );
};

// --- COMPONENT TIÊU ĐỀ KHÔNG ĐỔI ---
interface FilterSectionProps {
    title: string;
    isOpen: boolean;
    onToggle: () => void;
    children: React.ReactNode;
}

const FilterSection: React.FC<FilterSectionProps> = ({ title, isOpen, onToggle, children }) => (
    <div className="border-b border-zinc-50">
        <button 
            onClick={onToggle} 
            className="flex justify-between items-center w-full py-4 group"
        >
            <span className="text-[13px] font-bold uppercase tracking-[0.15em] text-zinc-900 group-hover:text-zinc-500 transition-colors">
                {title}
            </span>
            <motion.div animate={{ rotate: isOpen ? 0 : 180 }} transition={{ duration: 0.3 }}>
                {isOpen 
                    ? <Minus size={12} strokeWidth={1.5} className="text-zinc-400" /> 
                    : <Plus size={12} strokeWidth={1.5} className="text-zinc-400" />
                }
            </motion.div>
        </button>
        <AnimatePresence initial={false}>
            {isOpen && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="overflow-hidden pb-5"
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);

export default SidebarFilter;