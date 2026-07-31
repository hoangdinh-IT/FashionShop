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

const CategoryLevel2Item: React.FC<Level2Props> = ({
  category,
  isExpanded,
  onToggle,
  onFilter,
}) => {
  const hasChildren = category.children && category.children.length > 0;

  return (
    <div className="group/item border-b border-zinc-100 last:border-none lg:border-none">
      {/* Nút bấm Level 2 */}
      <button
        type="button"
        onClick={() => {
          if (hasChildren) {
            onToggle();
          } else {
            onFilter(category.slug);
          }
        }}
        className="w-full flex items-center justify-between py-3 lg:py-2.5 text-left group/btn cursor-pointer select-none active:bg-zinc-50 lg:active:bg-transparent rounded-lg px-2 lg:px-0 transition-colors"
      >
        {/* Trái: Hình đại diện + Tên danh mục */}
        <div className="flex items-center gap-3">
          {category.imageUrl && (
            <div className="w-8 h-8 rounded-full overflow-hidden bg-zinc-100 flex-shrink-0 opacity-80 group-hover/btn:opacity-100 transition-opacity">
              <img
                src={category.imageUrl}
                alt={category.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <span
            className={`text-sm lg:text-[15px] tracking-tight transition-colors duration-200 ${
              isExpanded
                ? 'text-black font-semibold'
                : 'text-zinc-600 font-normal group-hover/btn:text-black'
            }`}
          >
            {category.name}
          </span>
        </div>

        {/* Phải: Icon toggle (Chỉ hiển thị nếu có con) */}
        {hasChildren && (
          <div className="p-1 text-zinc-400 group-hover/btn:text-black transition-colors">
            <motion.svg
              animate={{ rotate: isExpanded ? 45 : 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 4v16m8-8H4"
              />
            </motion.svg>
          </div>
        )}
      </button>

      {/* Level 3 Animated Collapse */}
      <AnimatePresence initial={false}>
        {isExpanded && hasChildren && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden pl-4 lg:pl-4 border-l border-zinc-200 ml-3 lg:ml-2 my-1 flex flex-col gap-2 py-1"
          >
            {/* Nút Tất cả Level 2 */}
            <li>
              <button
                type="button"
                onClick={() => onFilter(category.slug)}
                className="text-xs lg:text-[13px] font-medium text-black hover:underline underline-offset-4 cursor-pointer py-1 block"
              >
                Tất cả {category.name}
              </button>
            </li>

            {/* Danh sách Level 3 */}
            {category.children.map((child: any) => (
              <li key={child.id}>
                <button
                  type="button"
                  onClick={() => onFilter(child.slug)}
                  className="text-xs lg:text-[13px] text-zinc-500 hover:text-black transition-colors cursor-pointer py-1 block text-left w-full"
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
// COMPONENT CHÍNH: MEGA MENU (Expressive Minimalism + Responsive)
// =======================================================================
const MegaMenu: React.FC<Props> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const [activeBrandId, setActiveBrandId] = useState<string>('');
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(null);

  const { brands, isLoadingBrands, categories, isLoadingCategories } =
    useBrands(activeBrandId);

  const activeBrand = useMemo(
    () => brands?.find((b: any) => b.id === activeBrandId),
    [brands, activeBrandId]
  );

  const handleFilter = (brandSlug?: string, categorySlug?: string) => {
    if (!brandSlug) return;

    let path = `/shop/collection/${brandSlug}`;
    if (categorySlug) {
      path += `/${categorySlug}`;
    }

    // Đóng menu trước khi điều hướng để giải phóngpointer-events ngay lập tức
    onClose();
    navigate(path);
  };

  useEffect(() => {
    if (brands?.length > 0 && !activeBrandId) {
      setActiveBrandId(brands[0].id);
    }
  }, [brands, activeBrandId]);

  useEffect(() => {
    setExpandedCategoryId(null);
  }, [activeBrandId]);

  // Vô hiệu hóa scroll trang chính khi menu mở trên Mobile & Desktop
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const defaultBanner =
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:top-[80px] pointer-events-auto">
          {/* Backdrop mờ */}
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />

          {/* Panel Menu Content */}
          <motion.div
            className="absolute inset-y-0 left-0 lg:right-0 lg:bottom-auto w-[88vw] max-w-[400px] lg:w-full lg:max-w-none bg-white border-r lg:border-r-0 lg:border-b border-zinc-200 shadow-2xl overflow-hidden flex flex-col h-full lg:h-auto max-h-screen lg:max-h-[calc(100vh-80px)] z-10"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {/* Wrapper cuộn trang */}
            <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-8 lg:px-16 pt-6 pb-8 flex flex-col h-full overflow-y-auto custom-scrollbar">
              
              {/* Header Bar: Mobile Close Button + Brand Navigation Tabs */}
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between border-b border-zinc-100 pb-4 mb-6 lg:mb-8 gap-4">
                
                {/* Title & Close button cho giao diện Mobile */}
                <div className="flex items-center justify-between lg:hidden pb-2 border-b border-zinc-100">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">
                    Thương hiệu
                  </span>
                  <button
                    onClick={onClose}
                    className="p-2 -mr-2 text-zinc-500 hover:text-black active:bg-zinc-100 rounded-full"
                    aria-label="Đóng menu"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Thanh chọn Brand (Tabs) */}
                <div className="flex items-center gap-6 lg:gap-12 overflow-x-auto no-scrollbar w-full lg:justify-center py-1">
                  {brands?.map((brand: any) => {
                    const isActive = activeBrandId === brand.id;
                    return (
                      <button
                        key={brand.id}
                        onMouseEnter={() => setActiveBrandId(brand.id)}
                        onClick={() => setActiveBrandId(brand.id)}
                        className={`relative pb-2 text-xs lg:text-[13px] uppercase tracking-[0.15em] lg:tracking-[0.2em] transition-colors cursor-pointer whitespace-nowrap flex-shrink-0 ${
                          isActive
                            ? 'text-black font-semibold'
                            : 'text-zinc-400 font-normal hover:text-black'
                        }`}
                      >
                        {brand.name}
                        {isActive && (
                          <motion.div
                            layoutId="activeBrandLine"
                            className="absolute left-0 right-0 bottom-0 h-[2px] lg:h-[1.5px] bg-black"
                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Main Grid Section */}
              <div className="grid grid-cols-12 gap-6 lg:gap-12 min-h-0 lg:min-h-[420px] mb-6 lg:mb-8 flex-1">
                
                {/* Categories Columns (8 cols trên Desktop) */}
                <div className="col-span-12 lg:col-span-8">
                  {isLoadingBrands || isLoadingCategories ? (
                    <div className="h-48 lg:h-full min-h-[200px] flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-zinc-300 border-t-black rounded-full animate-spin" />
                    </div>
                  ) : categories?.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 lg:gap-10">
                      {categories.map((level1: any, index: number) => (
                        <motion.div
                          key={level1.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.03, duration: 0.2 }}
                          className="flex flex-col"
                        >
                          {/* Title Level 1 */}
                          <button
                            type="button"
                            onClick={() => handleFilter(activeBrand?.slug, level1.slug)}
                            className="group flex items-center justify-between text-left mb-3 lg:mb-4 cursor-pointer pb-2 lg:pb-0 border-b border-zinc-200 lg:border-none"
                          >
                            <h4 className="text-xs lg:text-[14px] font-bold tracking-[0.15em] text-black uppercase transition-opacity group-hover:opacity-60">
                              {level1.name}
                            </h4>
                            <span className="text-xs text-zinc-400 group-hover:text-black group-hover:translate-x-0.5 transition-all">
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
                                onToggle={() =>
                                  setExpandedCategoryId((prev) =>
                                    prev === level2.id ? null : level2.id
                                  )
                                }
                                onFilter={(categorySlug) =>
                                  handleFilter(activeBrand?.slug, categorySlug)
                                }
                              />
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-48 lg:h-full flex items-center justify-center text-xs tracking-widest text-zinc-400 uppercase">
                      Bộ sưu tập đang được cập nhật
                    </div>
                  )}
                </div>

                {/* Banner bên phải */}
                <div className="col-span-12 lg:col-span-4 flex flex-col justify-end mt-4 lg:mt-0">
                  <div
                    className="relative w-full h-[220px] sm:h-[280px] lg:h-[380px] rounded-lg lg:rounded-none bg-zinc-100 overflow-hidden group cursor-pointer"
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
                        transition={{ duration: 0.3 }}
                      />
                    </AnimatePresence>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 transition-opacity group-hover:opacity-95" />

                    {/* Content Typo */}
                    <div className="absolute bottom-6 left-6 right-6 lg:bottom-8 lg:left-8 lg:right-8 flex flex-col items-start text-white">
                      <span className="text-[9px] lg:text-[10px] tracking-[0.3em] uppercase text-zinc-300 mb-1 lg:mb-2 font-medium">
                        Collection Spotlight
                      </span>
                      <h5 className="text-xl lg:text-2xl font-light tracking-tight mb-2 lg:mb-4 capitalize">
                        {activeBrand?.name || 'New Season'}
                      </h5>
                      <span className="text-[10px] lg:text-[11px] uppercase tracking-[0.2em] text-white border-b border-white/40 pb-0.5 lg:pb-1 group-hover:border-white transition-colors">
                        Khám phá ngay
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Nút Đóng ở bên dưới - Desktop */}
              <div className="hidden lg:flex justify-center pt-6 border-t border-zinc-100 mt-auto">
                <button
                  onClick={onClose}
                  className="group flex items-center gap-2.5 px-6 py-2.5 rounded-full border border-zinc-200 text-[11px] font-medium tracking-[0.2em] text-zinc-500 uppercase hover:text-black hover:border-black hover:bg-zinc-50 transition-all cursor-pointer"
                >
                  <span>Đóng Menu</span>
                  <svg
                    className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-90"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default MegaMenu;