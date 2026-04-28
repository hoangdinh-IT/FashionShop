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
    const [openSections, setOpenSections] = useState({ size: true, color: true, price: true });

    const hasFilters = selectedSizeSlugs.length > 0 || selectedColorSlug !== "" || selectedPriceRange.length > 0;

    const handleSizeToggle = (slug: string) => {
        const newSizes = selectedSizeSlugs.includes(slug)
            ? selectedSizeSlugs.filter(item => item !== slug)
            : [...selectedSizeSlugs, slug];
        onFilterChange({ sizeSlugs: newSizes, colorSlug: selectedColorSlug, priceRange: selectedPriceRange });
    }
    
    const handleColorToggle = (slug: string) => {
        const newColor = selectedColorSlug === slug ? "" : slug;
        onFilterChange({ sizeSlugs: selectedSizeSlugs, colorSlug: newColor, priceRange: selectedPriceRange });
    }

    const handlePriceToggle = (id: string) => {
        const newPriceRange = selectedPriceRange.includes(id)
            ? selectedPriceRange.filter(item => item !== id)
            : [...selectedPriceRange, id];
        onFilterChange({ sizeSlugs: selectedSizeSlugs, colorSlug: selectedColorSlug, priceRange: newPriceRange });
    };

    const handleClearFilters = () => {
        onFilterChange({ sizeSlugs: [], colorSlug: "", priceRange: [] });
    };

    if (!filterOptions) return <div className="w-full h-64 animate-pulse bg-zinc-50/50" />;

    return (
        <aside className="hidden lg:block w-[22%] flex-shrink-0 sticky top-28 max-h-[90vh] pr-4 select-none">
            {/* --- HEADER --- */}
            <div className="mb-4 border-b border-zinc-400 pb-4 flex justify-between items-baseline">
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
                    <div className="flex flex-wrap gap-2.5 pt-2 pb-1">
                        {filterOptions.availableSizes.map((size) => {
                            const isActive = selectedSizeSlugs.includes(size.slug); 
                            return (
                                <button
                                    key={size.slug}
                                    type="button"
                                    onClick={() => handleSizeToggle(size.slug)}
                                    className={`
                                        relative flex items-center justify-center min-w-[3.5rem] px-3 h-10 
                                        text-[12px] uppercase tracking-wider transition-all duration-300 ease-out outline-none
                                        border rounded-md select-none overflow-hidden
                                        ${isActive 
                                            ? 'bg-zinc-900 border-zinc-900 text-white font-bold shadow-[0_2px_10px_-3px_rgba(0,0,0,0.3)] scale-[1.02]' 
                                            : 'bg-white border-zinc-200 text-zinc-500 font-medium hover:border-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 hover:-translate-y-0.5'
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
                    <div className="grid grid-cols-4 lg:grid-cols-4 gap-x-1 gap-y-5 pt-3 pb-2">
                        {filterOptions.availableColors.map((color) => {
                            const isActive = selectedColorSlug === color.slug;
                            
                            // Kiểm tra nếu màu là màu trắng/sáng thì viền đậm hơn một chút để không bị chìm vào nền
                            const isLightColor = color.hexCode.toUpperCase() === '#FFFFFF' || color.hexCode.toUpperCase() === '#FFF';
                            
                            return (
                                <button
                                    key={color.slug}
                                    type="button"
                                    onClick={() => handleColorToggle(color.slug)}
                                    className="group flex flex-col items-center gap-2 cursor-pointer outline-none"
                                    title={color.name} // Hiện tên đầy đủ khi di chuột vào
                                >
                                    <div className="relative w-8 h-8 flex items-center justify-center">
                                        {/* Chấm màu */}
                                        <div 
                                            className={`
                                                rounded-full transition-all duration-300 ease-out shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]
                                                ${isActive 
                                                    ? 'w-5 h-5' // Thu nhỏ khi active tạo offset
                                                    : 'w-7 h-7 group-hover:scale-105' // To ra nhẹ khi hover
                                                }
                                                ${isLightColor ? 'border border-zinc-300' : 'border border-black/10'}
                                            `} 
                                            style={{ backgroundColor: color.hexCode }} 
                                        />
                                        
                                        {/* Vòng viền bên ngoài khi Active (Framer Motion) */}
                                        {isActive && (
                                            <motion.div 
                                                layoutId="activeColorRing" 
                                                className="absolute inset-0 border-2 border-zinc-900 rounded-full" 
                                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                            />
                                        )}
                                    </div>
                                    
                                    {/* Tên màu */}
                                    <span 
                                        className={`
                                            text-[10px] uppercase tracking-wider text-center w-full px-0.5 transition-colors duration-300
                                            ${isActive ? 'text-zinc-900 font-bold' : 'text-zinc-500 font-medium group-hover:text-zinc-800'}
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
                            const isActive = selectedPriceRange.includes(segment.id);
                            return (
                                <button
                        key={segment.id}
                        type="button"
                        onClick={() => handlePriceToggle(segment.id)}
                        className="flex items-center w-full group cursor-pointer py-1"
                    >
                        {/* Ô Checkbox */}
                        <div 
                            className={`
                                relative w-[18px] h-[18px] rounded-[4px] border flex items-center justify-center transition-all duration-300 mr-3 shrink-0
                                ${isActive 
                                    ? 'bg-zinc-900 border-zinc-900 shadow-sm shadow-zinc-400/50' 
                                    : 'bg-white border-zinc-300 group-hover:border-zinc-500 shadow-sm'
                                }
                            `}
                        >
                            <AnimatePresence>
                                {isActive && (
                                    <motion.svg
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.15 } }}
                                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                        width="12" 
                                        height="12" 
                                        viewBox="0 0 14 14" 
                                        fill="none"
                                        className="absolute"
                                    >
                                        <motion.path
                                            d="M3 7.5L5.5 10L11 4"
                                            stroke="white"
                                            strokeWidth="2.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            initial={{ pathLength: 0 }}
                                            animate={{ pathLength: 1 }}
                                            transition={{ duration: 0.35, ease: "easeOut", delay: 0.05 }}
                                        />
                                    </motion.svg>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Label chữ */}
                        <span 
                            className={`
                                text-[13px] transition-all duration-300 tracking-wide
                                ${isActive ? 'text-zinc-900 font-bold' : 'text-zinc-500 font-medium group-hover:text-zinc-800'}
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