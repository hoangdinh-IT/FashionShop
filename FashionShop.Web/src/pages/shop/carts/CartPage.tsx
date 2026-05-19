import Loading from '../../../components/common/Loading';
import CartList from '../../../features/shop/carts/components/CartList';
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
            <Loading />
        );
    }

    // CartPage.tsx

return (
    <div className="min-h-screen bg-[#f6f6f4] text-zinc-900">
        
        {/* HEADER */}
        <div className="sticky top-[64px] z-30 border-b border-black/5 bg-white/80 backdrop-blur-xl">
            <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-4 flex items-center justify-between">
                
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-2xl bg-black text-white flex items-center justify-center text-sm font-bold">
                        {cartItems?.length || 0}
                    </div>

                    <div>
                        <h1 className="text-[22px] font-black tracking-[-0.05em] uppercase">
                            Giỏ hàng
                        </h1>

                        <p className="text-[10px] uppercase tracking-[0.24em] text-zinc-400 font-semibold mt-0.5">
                            Expressive Minimalism
                        </p>
                    </div>
                </div>

                {cartItems && cartItems.length > 0 && (
                    <div className="hidden md:flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-zinc-500 font-semibold">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        Ready to checkout
                    </div>
                )}
            </div>
        </div>

        {/* CONTENT */}
        <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-10">
            
            {cartItems && cartItems.length > 0 ? (

                <div className="flex flex-col xl:flex-row gap-8 items-start">
                    
                    {/* LEFT */}
                    <div className="flex-1 w-full space-y-5">
                        
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-[18px] font-bold tracking-tight">
                                    Sản phẩm đã chọn
                                </h2>

                                <p className="text-sm text-zinc-500 mt-1">
                                    {cartItems.length} sản phẩm trong giỏ hàng
                                </p>
                            </div>
                        </div>

                        <CartList
                            cartItems={cartItems}
                            onUpdate={handleUpdate}
                            onDelete={handleDelete}
                        />
                    </div>

                    {/* RIGHT */}
                    <div className="w-full xl:w-[360px] xl:sticky xl:top-[110px]">
                        
                        <div className="rounded-[28px] border border-zinc-200/70 bg-white/90 backdrop-blur-xl p-5 shadow-[0_10px_40px_rgba(0,0,0,0.03)]">
                            
                            <div className="flex items-center justify-between pb-5 border-b border-zinc-100">
                                
                                <div>
                                    <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-400 font-bold">
                                        Tổng thanh toán
                                    </p>

                                    <h3 className="mt-2 text-[28px] font-black tracking-[-0.05em]">
                                        {new Intl.NumberFormat('vi-VN').format(selectedTotalPrice)}đ
                                    </h3>
                                </div>

                                <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            </div>

                            <div className="mt-5">
                                <CartSummary total={selectedTotalPrice} />
                            </div>
                        </div>
                    </div>
                </div>

            ) : (

                <div className="flex items-center justify-center py-20">
                    <div className="relative w-full max-w-[640px]">
                        
                        <div className="absolute inset-0 bg-gradient-to-br from-zinc-200/40 via-white to-zinc-100/50 blur-3xl rounded-full scale-125 opacity-80" />

                        <div className="relative overflow-hidden rounded-[36px] border border-black/5 bg-white/85 backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,0.04)]">
                            
                            <div className="px-8 md:px-14 py-14 text-center">
                                
                                <div className="relative mx-auto w-24 h-24">
                                    <div className="absolute inset-0 rounded-full bg-zinc-100 border border-zinc-200" />

                                    <div className="absolute inset-[18px] rounded-2xl bg-white border border-zinc-200 flex items-center justify-center shadow-[0_8px_30px_rgba(0,0,0,0.05)]">
                                        <svg className="w-7 h-7 text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M3 5h2l2.2 10.2a1 1 0 00.98.8h8.9a1 1 0 00.98-.8L21 8H7" />
                                            <circle cx="10" cy="19" r="1.4" fill="currentColor" stroke="none" />
                                            <circle cx="18" cy="19" r="1.4" fill="currentColor" stroke="none" />
                                        </svg>
                                    </div>
                                </div>

                                <div className="mt-10">
                                    
                                    <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-zinc-400 font-bold">
                                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-300" />
                                        Cart Empty
                                    </span>

                                    <h2 className="mt-5 text-[34px] leading-none font-black tracking-[-0.06em] text-zinc-900">
                                        Giỏ hàng trống
                                    </h2>

                                    <p className="mt-5 max-w-md mx-auto text-[15px] leading-7 text-zinc-500 font-medium">
                                        Khám phá những sản phẩm mới và thêm vào giỏ hàng để bắt đầu trải nghiệm mua sắm của bạn.
                                    </p>
                                </div>
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