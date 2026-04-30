import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBrands } from '../../brands/hooks/useBrands';
import { useNavigate } from 'react-router-dom';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

// =======================================================================
// COMPONENT PHỤ: LEVEL 2 ITEM
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
        <div className="mb-1">
            <button
                onClick={() => hasChildren && onToggle()}
                className={`flex items-center justify-between w-full py-3 text-left group cursor-pointer ${hasChildren ? 'cursor-pointer' : 'cursor-default'}`}
            >
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-md bg-zinc-50 overflow-hidden flex-shrink-0 border border-zinc-100 shadow-sm transition-transform duration-500 group-hover:scale-105">
                        {category.imageUrl ? (
                            <img src={category.imageUrl} alt={category.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-zinc-100 flex items-center justify-center text-[11px] font-bold uppercase tracking-widest text-zinc-400">Img</div>
                        )}
                    </div>
                    
                    <span className={`text-[16px] transition-all duration-300 transform group-hover:translate-x-1 ${isExpanded ? 'text-black font-bold' : 'text-zinc-700 font-semibold group-hover:text-black'}`}>
                        {category.name}
                    </span>
                </div>

                {hasChildren && (
                    <motion.svg
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className={`w-5 h-5 text-zinc-400 group-hover:text-black transition-colors`}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </motion.svg>
                )}
            </button>

            <AnimatePresence initial={false}>
                {isExpanded && hasChildren && (
                    <motion.ul
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden ml-[4.5rem] flex flex-col gap-3.5 pb-4 pt-1" 
                    >
                        {/* Nút Tất cả (Level 2) - Dùng Slug của chính nó */}
                        <li>
                            <button
                                onClick={() => onFilter(category.slug)} 
                                className="text-[14px] font-semibold text-black hover:text-black transition-all duration-300 flex items-center gap-2 group/link cursor-pointer" 
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-black opacity-0 -ml-3.5 transition-all duration-300 group-hover/link:opacity-100 group-hover/link:ml-0" />
                                Tất cả {category.name.toLowerCase()}
                            </button>
                        </li>

                        {/* Danh sách Level 3 - Dùng Slug của con */}
                        {category.children.map((child: any) => (
                            <li key={child.id}>
                                <button
                                    onClick={() => onFilter(child.slug)} 
                                    className="text-[14px] font-medium text-zinc-500 hover:text-black hover:font-semibold transition-all duration-300 flex items-center gap-2 group/link cursor-pointer"
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-black opacity-0 -ml-3.5 transition-all duration-300 group-hover/link:opacity-100 group-hover/link:ml-0" />
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
// COMPONENT CHÍNH: MEGA MENU
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

    // Lấy thông tin Brand đang chọn để lấy Slug và Name
    const activeBrand = useMemo(() => 
        brands?.find((b: any) => b.id === activeBrandId), 
    [brands, activeBrandId]);

    // Hàm điều hướng theo format: /shop/collection/brand-slug/category-slug
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
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 top-[80px] z-100 bg-black/50 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        onClick={onClose}
                    />

                    {/* Menu Content */}
                    <motion.div
                        className="absolute left-0 right-0 top-[80px] z-100 bg-white shadow-2xl border-t border-zinc-200 origin-top"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <div className="max-w-[1300px] mx-auto px-6 lg:px-12 flex flex-col">
                            
                            {/* Tabs Thương Hiệu */}
                            <div className="flex items-center justify-center gap-16 py-8 border-b border-zinc-200">
                                {brands?.map((brand: any) => {
                                    const isActive = activeBrandId === brand.id;
                                    return (
                                        <button
                                            key={brand.id}
                                            onMouseEnter={() => setActiveBrandId(brand.id)}
                                            className={`relative pb-3 text-[15px] uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                                                isActive ? 'text-black font-extrabold' : 'text-zinc-400 font-bold hover:text-black'
                                            }`}
                                        >
                                            {brand.name}
                                            {isActive && (
                                                <motion.div
                                                    layoutId="activeBrandIndicator"
                                                    className="absolute left-0 right-0 bottom-0 h-[2px] bg-black"
                                                    transition={{ duration: 0.3 }}
                                                />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="py-12 flex gap-16 min-h-[550px]">
                                
                                <div className="flex-1">
                                    {isLoadingBrands || isLoadingCategories ? (
                                        <div className="h-full flex items-center justify-center">
                                            <div className="w-6 h-6 border-2 border-zinc-300 border-t-black rounded-full animate-spin" />
                                        </div>
                                    ) : categories?.length > 0 ? (
                                        <div className="flex flex-wrap gap-12 lg:gap-16">
                                            {categories.map((level1: any, index: number) => (
                                                <motion.div 
                                                    key={level1.id} 
                                                    className="flex-1 min-w-[260px]"
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.1, duration: 0.4 }}
                                                >
                                                    <button 
                                                        type="button"
                                                        onClick={() => handleFilter(activeBrand?.slug, level1.slug)}
                                                        className="w-full text-[18px] font-extrabold tracking-wide text-black mb-6 uppercase flex items-center justify-between pb-4 border-b-2 border-black/5 cursor-pointer hover:text-zinc-500 hover:border-zinc-300 transition-all duration-300 group/title select-none"
                                                    >
                                                        <span>{level1.name}</span>
                                                        
                                                        <svg 
                                                            className="w-5 h-5 opacity-0 -translate-x-3 group-hover/title:opacity-100 group-hover/title:translate-x-0 transition-all duration-300 text-zinc-400" 
                                                            fill="none" 
                                                            viewBox="0 0 24 24" 
                                                            stroke="currentColor"
                                                        >
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                        </svg>
                                                    </button>
                                                    
                                                    <div className="flex flex-col gap-2">
                                                        {level1.children?.map((level2: any) => (
                                                            <CategoryLevel2Item 
                                                                key={level2.id} 
                                                                category={level2} 
                                                                isExpanded={expandedCategoryId === level2.id}
                                                                onToggle={() => setExpandedCategoryId(prev => prev === level2.id ? null : level2.id)}
                                                                // Truyền slug của Brand hiện tại và slug của Category con
                                                                onFilter={(categorySlug) => handleFilter(activeBrand?.slug, categorySlug)}
                                                            />
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-base text-zinc-400 flex items-center justify-center h-full font-medium">
                                            Bộ sưu tập đang được cập nhật.
                                        </div>
                                    )}
                                </div>

                                {/* Banner bên phải */}
                                <div className="w-[380px] flex-shrink-0">
                                    <div 
                                        className="relative w-full h-[420px] bg-zinc-100 overflow-hidden group cursor-pointer rounded-lg shadow-xl"
                                        onClick={() => handleFilter(activeBrand?.slug)}
                                    >
                                        <AnimatePresence mode="wait">
                                            <motion.img
                                                key={activeBrandId}
                                                src={defaultBanner}
                                                alt="Collection Banner"
                                                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-[2s] group-hover:scale-105"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.6 }}
                                            />
                                        </AnimatePresence>
                                        
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />
                                        
                                        <div className="absolute bottom-10 left-10 right-10 flex flex-col items-start transform transition-transform duration-500 group-hover:-translate-y-2">
                                            <span className="px-4 py-1.5 bg-white text-black text-[11px] font-bold tracking-widest uppercase rounded-sm mb-4">
                                                Bộ Sưu Tập Mới
                                            </span>
                                            <h5 className="text-white text-4xl font-extrabold tracking-tight leading-tight mb-4">
                                                {activeBrand?.name || ''}
                                            </h5>
                                            <p className="text-white/80 text-[14px] font-medium flex items-center gap-2 group/btn">
                                                Khám phá ngay 
                                                <svg className="w-4 h-4 group-hover/btn:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                </svg>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            {/* Nút Đóng */}
                            <div className="flex justify-center pb-8 border-t border-zinc-200 pt-6">
                                <button
                                    onClick={onClose}
                                    className="group flex items-center gap-3 px-8 py-3 bg-zinc-50 rounded-full border border-zinc-200 text-[13px] font-bold tracking-wider text-zinc-600 uppercase hover:text-black hover:bg-zinc-100 transition-all shadow-sm cursor-pointer"
                                >
                                    Đóng Menu
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:rotate-90">
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
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