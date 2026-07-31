import React, { useMemo, useState } from 'react';
import { Trash2, ChevronDown, Minus, Plus, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import type { CartItem } from '../types/cart';
import type { UpdateCartItem } from '../types/requests';
import UpdateVariantModal from './UpdateVariantModal';
import { useProductDetail } from '../../products/hooks/useProducts';

interface Props {
  cartItems: CartItem[];
  onUpdate: (id: number, currentItem: CartItem, payload: Partial<UpdateCartItem>) => void;
  onDelete: (cartItemId: number) => void;
}

// Cấu hình Easing cao cấp (Editorial/Luxury Feel)
const customEase = [0.16, 1, 0.3, 1] as const;

// Variants cho từng Item trong giỏ hàng
const itemVariants: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.97,
    filter: "blur(4px)",
  },
  visible: (index: number) => ({
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.45,
      delay: index * 0.04,
      ease: customEase,
    },
  }),
  exit: {
    opacity: 0,
    scale: 0.96,
    filter: "blur(4px)",
    transition: {
      duration: 0.25,
      ease: customEase,
    },
  },
};

const CartList: React.FC<Props> = ({ cartItems, onUpdate, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CartItem | undefined>(undefined);

  const isAllSelected = cartItems.length > 0 && cartItems.every(i => i.isSelected);
  const { productDetail } = useProductDetail(selectedItem?.productSlug || '');

  const handleToggleAll = () => {
    const targetValue = !isAllSelected;
    cartItems.forEach(item => {
      if (item.isSelected !== targetValue) {
        onUpdate(item.id, item, { isSelected: targetValue });
      }
    });
  };

  const handleOpenModal = (item: CartItem) => {
    setIsModalOpen(true);
    setSelectedItem(item);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(undefined);
  };

  const groupedItems = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      const brand = item.brandName || "Thương hiệu khác";
      if (!acc[brand]) {
        acc[brand] = [];
      }
      acc[brand].push(item);
      return acc;
    }, {} as Record<string, CartItem[]>);
  }, [cartItems]);

  const selectedCount = cartItems.filter(i => i.isSelected).length;

  return (
    <>
      <div className="w-full bg-white rounded-2xl md:rounded-3xl border border-neutral-200/80 p-4 sm:p-6 md:p-8 space-y-6 md:space-y-8 font-sans shadow-sm">
        
        {/* HEADER - Tối giản & Responsive */}
        <div className="flex items-center justify-between pb-4 sm:pb-6 border-b border-neutral-100 gap-3">
          <div className="flex items-center gap-3 sm:gap-4">
            <label className="relative flex items-center cursor-pointer p-1 -m-1">
              <input 
                type="checkbox" 
                checked={isAllSelected}
                onChange={handleToggleAll}
                className="peer appearance-none w-5 h-5 rounded-md border border-neutral-300 checked:bg-neutral-900 checked:border-neutral-900 transition-all cursor-pointer"
              />
              <span className="absolute inset-0 flex items-center justify-center text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity text-xs font-bold">
                ✓
              </span>
            </label>

            <div>
              <span className="text-[9px] sm:text-[10px] uppercase font-mono tracking-widest text-neutral-400 block">
                Shopping Cart
              </span>
              <h2 className="text-sm sm:text-base font-medium text-neutral-900 mt-0.5">
                Tất cả sản phẩm <span className="text-neutral-400 font-normal">({cartItems.length})</span>
              </h2>
            </div>
          </div>

          {selectedCount > 0 && (
            <div className="text-[11px] sm:text-xs font-mono px-2.5 py-1 sm:px-3 sm:py-1 bg-neutral-100 rounded-full text-neutral-600 font-medium shrink-0">
              Đã chọn {selectedCount}
            </div>
          )}
        </div>

        {/* LIST SẢN PHẨM PHÂN NHÓM THƯƠNG HIỆU */}
        <div className="space-y-6 sm:space-y-8">
          {Object.entries(groupedItems).map(([brandName, items]) => (
            <div key={brandName} className="space-y-3 sm:space-y-4">
              
              {/* BRAND HEADER */}
              <div className="flex items-center gap-2 px-1">
                {items?.[0]?.brandLogoUrl ? (
                  <img
                    src={items[0].brandLogoUrl}
                    alt={brandName}
                    className="w-4 h-4 sm:w-5 sm:h-5 object-contain grayscale opacity-80"
                  />
                ) : (
                  <ShoppingBag size={16} className="text-neutral-400 shrink-0" />
                )}
                <h3 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-neutral-500 truncate">
                  {brandName}
                </h3>
              </div>

              {/* ITEMS LIST VỚI ANIMATION */}
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {items.map((item, index) => (
                    <motion.div 
                      key={item.id}
                      custom={index}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      layout
                      className={`group relative rounded-xl sm:rounded-2xl border transition-all duration-200 p-3 sm:p-4 md:p-5 ${
                        item.isSelected 
                          ? 'border-neutral-900/20 bg-neutral-50/60' 
                          : 'border-neutral-100 bg-white hover:border-neutral-200'
                      }`}
                    >
                      <div className="flex gap-3 sm:gap-4 md:gap-6 items-start">
                        
                        {/* CHECKBOX ITEM */}
                        <div className="pt-1 sm:pt-2 shrink-0">
                          <label className="relative flex items-center cursor-pointer p-1 -m-1">
                            <input 
                              type="checkbox" 
                              checked={item.isSelected}
                              onChange={(e) => onUpdate(item.id, item, { isSelected: e.target.checked })}
                              className="peer appearance-none w-5 h-5 rounded-md border border-neutral-300 checked:bg-neutral-900 checked:border-neutral-900 transition-all cursor-pointer"
                            />
                            <span className="absolute inset-0 flex items-center justify-center text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity text-xs font-bold">
                              ✓
                            </span>
                          </label>
                        </div>

                        {/* PRODUCT IMAGE */}
                        <div className="w-16 h-20 sm:w-20 sm:h-24 md:w-24 md:h-28 rounded-lg sm:rounded-xl overflow-hidden bg-neutral-100 shrink-0 border border-neutral-100">
                          <img 
                            src={item.imageUrl} 
                            alt={item.productName} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                          />
                        </div>

                        {/* PRODUCT INFO & ACTIONS */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch">
                          
                          {/* TOP SECTION: NAME & DELETE */}
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="text-xs sm:text-sm font-medium leading-tight sm:leading-snug text-neutral-900 line-clamp-2">
                                {item.productName}
                              </h4>

                              <button 
                                onClick={() => onDelete(item.id)}
                                className="text-neutral-300 hover:text-rose-600 transition-colors p-1 -mr-1 rounded-lg hover:bg-rose-50 cursor-pointer shrink-0"
                                title="Xóa sản phẩm"
                              >
                                <Trash2 className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                              </button>
                            </div>

                            {/* VARIANT BUTTON */}
                            <button 
                              onClick={() => handleOpenModal(item)}
                              className="mt-1.5 sm:mt-2 inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg bg-neutral-100 hover:bg-neutral-200/70 text-[10px] sm:text-[11px] font-medium text-neutral-700 transition-colors cursor-pointer max-w-full truncate"
                            >
                              <span className="truncate">{item.colorName} / {item.sizeName}</span>
                              <ChevronDown size={12} className="text-neutral-400 shrink-0" />
                            </button>
                          </div>

                          {/* BOTTOM SECTION: QUANTITY & PRICE */}
                          <div className="flex flex-wrap items-end justify-between gap-2 mt-3 sm:mt-4 pt-1 sm:pt-2">
                            
                            {/* QUANTITY CONTROL */}
                            <div className="flex items-center border border-neutral-200 rounded-full p-0.5 bg-white">
                              <button 
                                onClick={() => item.quantity > 1 && onUpdate(item.id, item, { quantity: item.quantity - 1 })}
                                disabled={item.quantity <= 1}
                                className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-neutral-600 hover:bg-neutral-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
                              >
                                <Minus size={12} />
                              </button>

                              <span className="w-6 sm:w-8 text-center text-xs font-mono font-medium text-neutral-900">
                                {item.quantity}
                              </span>

                              <button 
                                onClick={() => onUpdate(item.id, item, { quantity: item.quantity + 1 })}
                                className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-neutral-600 hover:bg-neutral-100 transition-colors cursor-pointer"
                              >
                                <Plus size={12} />
                              </button>
                            </div>

                            {/* PRICE */}
                            <div className="text-right">
                              <span className="text-sm sm:text-base md:text-lg font-semibold tracking-tight text-neutral-900 font-mono">
                                {item.unitPrice.toLocaleString('vi-VN')}
                                <span className="text-[10px] sm:text-xs font-normal text-neutral-500 ml-0.5">đ</span>
                              </span>
                            </div>
                          </div>

                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal CẬP NHẬT VARIANT */}
      <UpdateVariantModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        item={selectedItem}
        productDetail={productDetail}
        onUpdate={(newVariantId) => {
          if (selectedItem) {
            onUpdate(selectedItem.id, selectedItem, { productVariantId: newVariantId });
          }
        }}
      />
    </>
  );
};

export default CartList;