import CartList from '../../../features/shop/carts/components/CartList';
import CartSkeleton from '../../../features/shop/carts/components/CartSkeleton';
import CartSummary from '../../../features/shop/carts/components/CartSummary';
import { useCartMutations, useCarts } from '../../../features/shop/carts/hooks/useCarts';
import type { CartItem } from '../../../features/shop/carts/types/cart';
import type { UpdateCartItem } from '../../../features/shop/carts/types/requests'; 

const CartPage = () => {
    const { cartItems, isLoading } = useCarts();
    const { 
        updateCartItem,
        deleteCartItem, 
    } = useCartMutations();

    const handleUpdate = (cartItemId: number, currentItem: CartItem, payload: Partial<UpdateCartItem>) => {
        const request: UpdateCartItem = {
            productVariantId: payload.productVariantId ?? currentItem.productVariantId,
            quantity: payload.quantity ?? currentItem.quantity,
            isSelected: payload.isSelected ?? currentItem.isSelected
        };
        updateCartItem({ cartItemId, request });
    };

    const handleDelete = (cartItemId: number) => {
        deleteCartItem(cartItemId);
    };

    const selectedTotalPrice = cartItems
        .filter(item => item.isSelected)
        .reduce((acc, item) => acc + item.price * item.quantity, 0);

    if (isLoading) {
        return (
            <div className="bg-[#fafafa] min-h-screen">
                {/* Header giả lập để tránh bị "giật" trang khi load xong */}
                <div className="bg-white border-b border-zinc-100">
                    <div className="max-w-[1200px] mx-auto px-6 py-5">
                        <div className="h-8 bg-zinc-100 rounded-md w-32 animate-pulse" />
                    </div>
                </div>
                <CartSkeleton />
            </div>
        );
    }

    // --- TRẠNG THÁI HOÀN TẤT ---
    return (
        <div className="bg-[#fafafa] min-h-screen pb-24 font-sans text-zinc-900">
            {/* 1. Header Giỏ hàng: 
            - sticky top-[chiều cao header tổng]: Giả sử Header tổng cao 64px (h-16).
            - z-20: Đảm bảo cao hơn nội dung item nhưng thấp hơn MegaMenu (z-100).
            */}
            <div className="bg-white/80 backdrop-blur-md sticky top-[64px] z-20 border-b border-zinc-100">
                <div className="max-w-[1200px] mx-auto px-6 py-5 flex justify-center items-center">
                    <h1 className="text-2xl font-extrabold tracking-tighter uppercase">Giỏ hàng</h1>
                </div>
            </div>

            <div className="max-w-[1200px] mx-auto px-6 mt-12">
                {cartItems && cartItems.length > 0 ? (
                    /* items-start là bắt buộc để sticky sidebar hoạt động */
                    <div className="flex flex-col lg:flex-row gap-12 items-start">
                        
                        {/* Danh sách sản phẩm: Cuộn tự nhiên theo trang */}
                        <div className="flex-1 w-full">
                            <CartList
                                cartItems={cartItems} 
                                onUpdate={handleUpdate}
                                onDelete={handleDelete}
                            />
                        </div>

                        {/* 2. Sidebar Thanh toán: 
                        - sticky: Cố định khi cuộn.
                        - top-[100px]: Cách mép trên trình duyệt một khoảng để không dính sát Header.
                        */}
                        <div className="w-full lg:w-[400px] lg:sticky lg:top-[100px] z-10">
                            <CartSummary 
                                total={selectedTotalPrice} 
                            />
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-zinc-400 font-medium">Giỏ hàng của bạn đang trống.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;