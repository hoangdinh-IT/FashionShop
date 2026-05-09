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

    return (
    <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-100">
        {/* Header Chọn tất cả */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-50">
            <div className="flex items-center gap-4">
                <input 
                    type="checkbox" 
                    checked={isAllSelected}
                    onChange={handleToggleAll}
                    className="w-5 h-5 rounded-full border-zinc-300 text-zinc-900 focus:ring-zinc-900 cursor-pointer"
                />
                <span className="text-sm font-semibold tracking-wide uppercase text-zinc-500">
                    Chọn tất cả ({cartItems.length})
                </span>
            </div>
        </div>

        {/* Danh sách sản phẩm theo Brand */}
        <div className="space-y-12"> {/* Khoảng cách giữa các Brand */}
            {Object.entries(groupedItems).map(([brandName, items]) => (
                <div key={brandName} className="space-y-4">
                    {/* Tên thương hiệu hiển thị góc trên bên trái */}
                    <div className="flex items-center gap-2">
                        <span className="bg-zinc-900 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-tighter">Brand</span>
                        <h2 className="text-lg font-bold text-zinc-900 tracking-tight">
                            {brandName}
                        </h2>
                    </div>

                    {/* Danh sách sản phẩm của Brand này */}
                    <div className="divide-y divide-zinc-100 bg-zinc-50/30 rounded-2xl px-4 border border-zinc-50">
                        {items.map((item) => (
                            <div key={item.id} className="py-8 first:pt-6 last:pb-6 flex gap-6 group">
                                {/* Checkbox item */}
                                <div className="pt-2">
                                    <input 
                                        type="checkbox" 
                                        checked={item.isSelected}
                                        onChange={(e) => onUpdate(item.id, item, { isSelected: e.target.checked })}
                                        className="w-5 h-5 rounded-full border-zinc-300 text-zinc-900 focus:ring-zinc-900 cursor-pointer"
                                    />
                                </div>

                                {/* Ảnh sản phẩm */}
                                <div className="w-28 h-36 bg-white rounded-2xl overflow-hidden shrink-0 border border-zinc-100 shadow-sm">
                                    <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-cover" />
                                </div>

                                {/* Thông tin chi tiết */}
                                <div className="flex-1 flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-3">
                                            <h3 className="text-base font-semibold text-zinc-900 leading-snug">{item.productName}</h3>
                                            
                                            <button 
                                                onClick={() => handleOpenDialog(item)}
                                                className="group/variant flex items-center gap-2 bg-white hover:bg-zinc-100 px-3 py-1.5 rounded-full text-[13px] text-zinc-600 border border-zinc-100 transition-all cursor-pointer"
                                            >
                                                <span className="font-medium">{item.colorName} - {item.sizeName}</span>
                                                <ChevronDown size={14} className="group-hover/variant:rotate-180 transition-transform" />
                                            </button>
                                        </div>

                                        <button onClick={() => onDelete(item.id)} className="p-2 text-zinc-300 hover:text-red-500 transition-all cursor-pointer">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>

                                    {/* Số lượng & Giá */}
                                    <div className="flex justify-between items-end mt-4">
                                        <div className="flex items-center bg-white border border-zinc-200 rounded-full p-1">
                                            <button 
                                                onClick={() => item.quantity > 1 && onUpdate(item.id, item, { quantity: item.quantity - 1 })}
                                                className="w-8 h-8 flex items-center justify-center text-zinc-500 hover:bg-zinc-100 rounded-full cursor-pointer"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="w-10 text-center text-sm font-bold">{item.quantity}</span>
                                            <button 
                                                onClick={() => onUpdate(item.id, item, { quantity: item.quantity + 1 })}
                                                className="w-8 h-8 flex items-center justify-center text-zinc-500 hover:bg-zinc-100 rounded-full cursor-pointer"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                        <div className="text-xl font-bold text-zinc-900 tracking-tighter">
                                            {item.unitPrice.toLocaleString('vi-VN')} <span className="text-sm font-medium underline">đ</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>

        {/* --- COMPONENT DIALOG --- */}
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
    </div>
);
};

export default CartList;