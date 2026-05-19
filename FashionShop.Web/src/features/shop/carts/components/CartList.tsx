import React, { useMemo, useState } from 'react';
import { Trash2, ChevronDown, Minus, Plus } from 'lucide-react';
import type { CartItem } from '../types/cart';
import type { UpdateCartItem } from '../types/requests';
import UpdateVariantDialog from './UpdateVariantDialog'; // Import component Dialog bạn đã code
import { useProductDetail } from '../../products/hooks/useProducts';

interface Props {
    cartItems: CartItem[];
    onUpdate: (id: number, currentItem: CartItem, payload: Partial<UpdateCartItem>) => void;
    onDelete: (cartItemId: number) => void;
}

const CartList: React.FC<Props> = ({ cartItems, onUpdate, onDelete }) => {
    // --- States cho Dialog ---
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<CartItem | undefined>(undefined);

    // Logic kiểm tra chọn tất cả
    const isAllSelected = cartItems.length > 0 && cartItems.every(i => i.isSelected);

    // Lấy chi tiết sản phẩm dựa trên slug của món hàng đang được chọn để sửa
    // Lưu ý: selectedItem?.productSlug phải tồn tại trong DTO CartItem
    const { productDetail } = useProductDetail(selectedItem?.productSlug || '');

    const handleToggleAll = () => {
        const targetValue = !isAllSelected;
        cartItems.forEach(item => {
            if (item.isSelected !== targetValue) {
                onUpdate(item.id, item, { isSelected: targetValue });
            }
        });
    };

    const handleOpenDialog = (item: CartItem) => {
        setIsDialogOpen(true);
        setSelectedItem(item);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
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

    // CartList.tsx

return (
    <>
        <div className="rounded-[28px] border border-zinc-200/70 bg-white/90 backdrop-blur-xl p-6 shadow-[0_10px_40px_rgba(0,0,0,0.03)]">
            
            {/* HEADER */}
            <div className="flex items-center justify-between pb-5 border-b border-zinc-100">
                <div className="flex items-center gap-3">
                    
                    <input 
                        type="checkbox" 
                        checked={isAllSelected}
                        onChange={handleToggleAll}
                        className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-0 cursor-pointer"
                    />

                    <div>
                        <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-400 font-semibold">
                            Shopping cart
                        </p>

                        <h2 className="text-sm font-semibold text-zinc-900 mt-1">
                            Đã chọn {cartItems.length} sản phẩm
                        </h2>
                    </div>
                </div>
            </div>

            {/* ITEMS */}
            <div className="mt-8 space-y-10">
                {Object.entries(groupedItems).map(([brandName, items]) => (
                    <div key={brandName} className="space-y-4">
                        
                        <div className="flex items-center gap-3 px-1">
    
                        {/* BRAND LOGO */}
                        <div className="w-8 h-8 rounded-lg overflow-hidden bg-white border border-zinc-100 flex items-center justify-center">
                            <img
                                src={items?.[0]?.brandLogoUrl}
                                alt={brandName}
                                className="w-full h-full object-contain p-1"
                            />
                        </div>

                        {/* BRAND INFO */}
                        <div className="flex flex-col leading-tight">
                            <h2 className="text-base font-semibold tracking-tight text-zinc-900">
                                {brandName}
                            </h2>
                        </div>
                    </div>

                        <div className="space-y-4">
                            {items.map((item) => (
                                <div 
                                    key={item.id}
                                    className="group rounded-[24px] border border-zinc-100 bg-[#fafafa]/80 hover:bg-white transition-all duration-300 p-5"
                                >
                                    <div className="flex gap-5">
                                        
                                        <div className="pt-1">
                                            <input 
                                                type="checkbox" 
                                                checked={item.isSelected}
                                                onChange={(e) => onUpdate(item.id, item, { isSelected: e.target.checked })}
                                                className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-0 cursor-pointer"
                                            />
                                        </div>

                                        <div className="w-24 h-32 rounded-[20px] overflow-hidden bg-white border border-zinc-100 shrink-0">
                                            <img 
                                                src={item.imageUrl} 
                                                alt={item.productName} 
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        <div className="flex-1 flex flex-col justify-between min-w-0">
                                            
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="min-w-0">
                                                    <h3 className="text-[15px] font-semibold leading-6 tracking-tight text-zinc-900 line-clamp-2">
                                                        {item.productName}
                                                    </h3>

                                                    <button 
                                                        onClick={() => handleOpenDialog(item)}
                                                        className="mt-3 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-[12px] font-medium text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50 transition-all cursor-pointer"
                                                    >
                                                        <span>
                                                            {item.colorName} · {item.sizeName}
                                                        </span>

                                                        <ChevronDown size={13} />
                                                    </button>
                                                </div>

                                                <button 
                                                    onClick={() => onDelete(item.id)}
                                                    className="w-9 h-9 rounded-full flex items-center justify-center text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer shrink-0"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>

                                            <div className="flex items-end justify-between mt-6">
                                                
                                                <div className="flex items-center rounded-full border border-zinc-200 bg-white p-1">
                                                    <button 
                                                        onClick={() => item.quantity > 1 && onUpdate(item.id, item, { quantity: item.quantity - 1 })}
                                                        className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-500 hover:bg-zinc-100"
                                                    >
                                                        <Minus size={13} />
                                                    </button>

                                                    <span className="w-10 text-center text-sm font-semibold text-zinc-900">
                                                        {item.quantity}
                                                    </span>

                                                    <button 
                                                        onClick={() => onUpdate(item.id, item, { quantity: item.quantity + 1 })}
                                                        className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-500 hover:bg-zinc-100"
                                                    >
                                                        <Plus size={13} />
                                                    </button>
                                                </div>

                                                <div className="text-right">
                                                    <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-400 font-semibold">
                                                        Price
                                                    </p>

                                                    <div className="mt-1 text-xl font-bold tracking-tight text-zinc-900">
                                                        {item.unitPrice.toLocaleString('vi-VN')}đ
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <UpdateVariantDialog 
            isOpen={isDialogOpen}
            onClose={handleCloseDialog}
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