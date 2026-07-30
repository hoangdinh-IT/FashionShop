import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBrands } from '../../brands/hooks/useBrands';
import { useNavigate } from 'react-router-dom';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

// =======================================================================
// COMPONENT PHỤ: LEVEL 2 ITEM (Minimalist Accordion Style)
// =======================================================================
interface Level2Props {
    category: any;
    isExpanded: boolean;
    onToggle: () => void;
    onFilter: (categorySlug: string) => void;
}

const CategoryLevel2Item: React.FC<Level2Props> = ({ category, isExpanded, onToggle, onFilter }) => {
    const hasChildren = category.children && category.children.length > 0;

    return (
        <div className="group/item">
            <div className="flex items-center justify-between py-2.5">
                {/* Tên Category Level 2 */}
                <button
                    onClick={() => {
                        if (hasChildren) {
                            onToggle();
                        } else {
                            onFilter(category.slug);
                        }
                    }}
                    className="flex items-center gap-3 text-left group/btn cursor-pointer"
                >
                    {category.imageUrl && (
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-zinc-100 flex-shrink-0 opacity-80 group-hover/btn:opacity-100 transition-opacity">
                            <img src={category.imageUrl} alt={category.name} className="w-full h-full object-cover" />
                        </div>
                    )}
                    <span className={`text-[15px] tracking-tight transition-colors duration-200 ${
                        isExpanded ? 'text-black font-semibold' : 'text-zinc-600 font-normal hover:text-black'
                    }`}>
                        {category.name}
                    </span>
                </button>

                {/* Nút Toggle mở rộng nếu có con */}
                {hasChildren && (
                    <button
                        onClick={onToggle}
                        className="p-1 text-zinc-400 hover:text-black transition-colors cursor-pointer"
                        aria-label="Toggle Subcategories"
                    >
                        <motion.svg
                            animate={{ rotate: isExpanded ? 45 : 0 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="w-4 h-4"
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                        </motion.svg>
                    </button>
                )}
            </div>

            {/* Level 3 Animated Collapse */}
            <AnimatePresence initial={false}>
                {isExpanded && hasChildren && (
                    <motion.ul
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden pl-4 border-l border-zinc-200 ml-2 my-1 flex flex-col gap-2 py-1" 
                    >
                        {/* Nút Tất cả Level 2 */}
                        <li>
                            <button
                                onClick={() => onFilter(category.slug)} 
                                className="text-[13px] font-medium text-black hover:underline underline-offset-4 cursor-pointer py-0.5 block" 
                            >
                                Tất cả {category.name}
                            </button>
                        </li>

                        {/* Danh sách Level 3 */}
                        {category.children.map((child: any) => (
                            <li key={child.id}>
                                <button
                                    onClick={() => onFilter(child.slug)} 
                                    className="text-[13px] text-zinc-500 hover:text-black transition-colors cursor-pointer py-0.5 block text-left"
                                >
                                    {child.name}
                                </button>
                            </li>
                        ))}
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
    );
};

// =======================================================================
// COMPONENT CHÍNH: MEGA MENU (Expressive Minimalism)
// =======================================================================
const MegaMenu: React.FC<Props> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    const [activeBrandId, setActiveBrandId] = useState<string>('');
    const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(null);

    const { 
        brands,
        isLoadingBrands,
        categories,
        isLoadingCategories
    } = useBrands(activeBrandId);

    const activeBrand = useMemo(() => 
        brands?.find((b: any) => b.id === activeBrandId), 
    [brands, activeBrandId]);

    const handleFilter = (brandSlug?: string, categorySlug?: string) => {
        if (!brandSlug) return;

        let path = `/shop/collection/${brandSlug}`;
        if (categorySlug) {
            path += `/${categorySlug}`;
        }

        navigate(path);
        onClose();
    };

    useEffect(() => {
        if (brands?.length > 0 && !activeBrandId) {
            setActiveBrandId(brands[0].id);
        }
    }, [brands, activeBrandId]);

    useEffect(() => {
        setExpandedCategoryId(null);
    }, [activeBrandId]);

    const defaultBanner = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop';

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop mờ nhẹ nhàng */}
                    <motion.div
                        className="fixed inset-0 top-[80px] z-40 bg-black/20 backdrop-blur-md"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={onClose}
                    />

                    {/* Content Menu Panel */}
                    <motion.div
                        className="absolute left-0 right-0 top-[80px] z-50 bg-white border-b border-zinc-200 shadow-2xl overflow-hidden"
                        initial={{ opacity: 0, y: -12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <div className="max-w-[1400px] mx-auto px-8 lg:px-16 pt-6 pb-8 flex flex-col">
                            
                            {/* Header Bar: Brand Navigation Tabs */}
                            <div className="flex items-center justify-center border-b border-zinc-100 pb-4 mb-8">
                                <div className="flex items-center gap-12 overflow-x-auto no-scrollbar">
                                    {brands?.map((brand: any) => {
                                        const isActive = activeBrandId === brand.id;
                                        return (
                                            <button
                                                key={brand.id}
                                                onMouseEnter={() => setActiveBrandId(brand.id)}
                                                onClick={() => setActiveBrandId(brand.id)}
                                                className={`relative pb-2 text-[13px] uppercase tracking-[0.2em] transition-colors cursor-pointer whitespace-nowrap ${
                                                    isActive ? 'text-black font-semibold' : 'text-zinc-400 font-normal hover:text-black'
                                                }`}
                                            >
                                                {brand.name}
                                                {isActive && (
                                                    <motion.div
                                                        layoutId="activeBrandLine"
                                                        className="absolute left-0 right-0 bottom-0 h-[1.5px] bg-black"
                                                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                                    />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Main Grid Section */}
                            <div className="grid grid-cols-12 gap-12 min-h-[420px] mb-8">
                                
                                {/* Categories Columns (8 cols) */}
                                <div className="col-span-12 lg:col-span-8">
                                    {isLoadingBrands || isLoadingCategories ? (
                                        <div className="h-full min-h-[300px] flex items-center justify-center">
                                            <div className="w-5 h-5 border border-zinc-300 border-t-black rounded-full animate-spin" />
                                        </div>
                                    ) : categories?.length > 0 ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
                                            {categories.map((level1: any, index: number) => (
                                                <motion.div 
                                                    key={level1.id} 
                                                    initial={{ opacity: 0, y: 8 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.05, duration: 0.3 }}
                                                    className="flex flex-col"
                                                >
                                                    {/* Title Level 1 */}
                                                    <button 
                                                        type="button"
                                                        onClick={() => handleFilter(activeBrand?.slug, level1.slug)}
                                                        className="group flex items-center justify-between text-left mb-4 cursor-pointer"
                                                    >
                                                        <h4 className="text-[14px] font-bold tracking-[0.15em] text-black uppercase transition-opacity group-hover:opacity-60">
                                                            {level1.name}
                                                        </h4>
                                                        <span className="text-xs text-zinc-300 group-hover:text-black group-hover:translate-x-0.5 transition-all">
                                                            →
                                                        </span>
                                                    </button>
                                                    
                                                    {/* List Level 2 */}
                                                    <div className="flex flex-col divide-y divide-zinc-50">
                                                        {level1.children?.map((level2: any) => (
                                                            <CategoryLevel2Item 
                                                                key={level2.id} 
                                                                category={level2} 
                                                                isExpanded={expandedCategoryId === level2.id}
                                                                onToggle={() => setExpandedCategoryId(prev => prev === level2.id ? null : level2.id)}
                                                                onFilter={(categorySlug) => handleFilter(activeBrand?.slug, categorySlug)}
                                                            />
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-xs tracking-widest text-zinc-400 uppercase">
                                            Bộ sưu tập đang được cập nhật
                                        </div>
                                    )}
                                </div>

                                {/* Banner bên phải (4 cols) - Tối giản tinh tế */}
                                <div className="col-span-12 lg:col-span-4 flex flex-col justify-end">
                                    <div 
                                        className="relative w-full h-[380px] bg-zinc-100 overflow-hidden group cursor-pointer"
                                        onClick={() => handleFilter(activeBrand?.slug)}
                                    >
                                        <AnimatePresence mode="wait">
                                            <motion.img
                                                key={activeBrandId}
                                                src={defaultBanner}
                                                alt="Collection Banner"
                                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.4 }}
                                            />
                                        </AnimatePresence>
                                        
                                        {/* Light Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 transition-opacity group-hover:opacity-95" />
                                        
                                        {/* Typography Content */}
                                        <div className="absolute bottom-8 left-8 right-8 flex flex-col items-start text-white">
                                            <span className="text-[10px] tracking-[0.3em] uppercase text-zinc-300 mb-2 font-medium">
                                                Collection Spotlight
                                            </span>
                                            <h5 className="text-2xl font-light tracking-tight mb-4 capitalize">
                                                {activeBrand?.name || 'New Season'}
                                            </h5>
                                            <span className="text-[11px] uppercase tracking-[0.2em] text-white border-b border-white/40 pb-1 group-hover:border-white transition-colors">
                                                Khám phá ngay
                                            </span>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            {/* Nút Đóng ở bên dưới - Phong cách Minimalist pill button */}
                            <div className="flex justify-center pt-6 border-t border-zinc-100">
                                <button
                                    onClick={onClose}
                                    className="group flex items-center gap-2.5 px-6 py-2.5 rounded-full border border-zinc-200 text-[11px] font-medium tracking-[0.2em] text-zinc-500 uppercase hover:text-black hover:border-black hover:bg-zinc-50 transition-all cursor-pointer"
                                >
                                    <span>Đóng Menu</span>
                                    <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default MegaMenu;