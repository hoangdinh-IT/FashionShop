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
        .reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

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

    return (
        <div className="bg-[#fafafa] min-h-screen pb-24 font-sans text-zinc-900">
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

                        <div className="w-full lg:w-[400px] lg:sticky lg:top-[100px] z-10">
                            <CartSummary 
                                total={selectedTotalPrice} 
                            />
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center py-24">
                        <div className="relative w-full max-w-xl">
                            <div className="absolute inset-0 bg-gradient-to-br from-zinc-100/60 via-white to-zinc-100/40 blur-3xl rounded-full scale-125 opacity-70" />
                            <div className="relative overflow-hidden rounded-[36px] border border-zinc-200/70 bg-white/80 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.04)] px-10 py-14 text-center">
                                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(0,0,0,0.03),transparent_35%)] pointer-events-none" />
                                <div className="relative mx-auto w-28 h-28 flex items-center justify-center">
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-zinc-50 to-zinc-100 border border-zinc-200 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)]" />
                                    <div className="relative w-16 h-16 rounded-2xl bg-white border border-zinc-200 flex items-center justify-center shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
                                        <svg 
                                            className="w-8 h-8 text-zinc-700" 
                                            fill="none" 
                                            stroke="currentColor" 
                                            viewBox="0 0 24 24"
                                        >
                                            <path 
                                                strokeLinecap="round" 
                                                strokeLinejoin="round" 
                                                strokeWidth={1.5} 
                                                d="M3 5h2l2.2 10.2a1 1 0 00.98.8h8.9a1 1 0 00.98-.8L21 8H7" 
                                            />
                                            <circle cx="10" cy="19" r="1.5" fill="currentColor" stroke="none" />
                                            <circle cx="18" cy="19" r="1.5" fill="currentColor" stroke="none" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="mt-10 space-y-3">
                                    <h2 className="text-3xl font-bold tracking-tight text-zinc-900">
                                        Giỏ hàng đang trống
                                    </h2>

                                    <p className="text-zinc-500 text-[15px] leading-relaxed max-w-md mx-auto font-medium">
                                        Hãy khám phá những sản phẩm mới và thêm vào giỏ hàng để bắt đầu trải nghiệm mua sắm của bạn.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;