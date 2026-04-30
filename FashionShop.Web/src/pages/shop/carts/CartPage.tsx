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

    if (isLoading) return <div className="p-10 text-center">Đang tải giỏ hàng...</div>;

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
            {/* Header chính thức */}
            <div className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-zinc-100">
                <div className="max-w-[1200px] mx-auto px-6 py-5 flex justify-between items-center">
                    <h1 className="text-2xl font-extrabold tracking-tighter uppercase">Giỏ hàng</h1>
                    <div className="text-sm font-medium text-zinc-400">
                        Sản phẩm của bạn ({cartItems?.length || 0})
                    </div>
                </div>
            </div>

            <div className="max-w-[1200px] mx-auto px-6 mt-12">
                {cartItems && cartItems.length > 0 ? (
                    <div className="flex flex-col lg:flex-row gap-12">
                        {/* Danh sách sản phẩm */}
                        <div className="flex-1">
                            <CartList
                                cartItems={cartItems} 
                                onUpdate={handleUpdate}
                                onDelete={handleDelete}
                            />
                        </div>

                        {/* Tổng kết giỏ hàng */}
                        <div className="w-full lg:w-[400px]">
                            <CartSummary 
                                total={selectedTotalPrice} 
                            />
                        </div>
                    </div>
                ) : (
                    /* Trạng thái giỏ hàng trống (Optional) */
                    <div className="text-center py-20">
                        <p className="text-zinc-400 font-medium">Giỏ hàng của bạn đang trống.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;