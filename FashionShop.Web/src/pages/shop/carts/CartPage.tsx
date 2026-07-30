import React from 'react';
import { Link } from 'react-router-dom';
import Loading from '../../../components/common/Loading';
import CartList from '../../../features/shop/carts/components/CartList';
import CartSummary from '../../../features/shop/carts/components/CartSummary';
import { useCartMutations, useCarts } from '../../../features/shop/carts/hooks/useCarts';
import type { CartItem } from '../../../features/shop/carts/types/cart';
import type { UpdateCartItem } from '../../../features/shop/carts/types/requests';
import { ShoppingBag } from 'lucide-react';

const CartPage: React.FC = () => {
    const { cartItems, isLoading } = useCarts();
    const { updateCartItem, deleteCartItem } = useCartMutations();

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
        ? cartItems
            .filter(item => item.isSelected)
            .reduce((acc, item) => acc + item.unitPrice * item.quantity, 0)
        : 0;

    if (isLoading) {
        return <Loading />;
    }

    const hasItems = cartItems && cartItems.length > 0;

    return (
        <div className="min-h-screen bg-[#f6f6f4] text-zinc-900 font-sans selection:bg-zinc-900 selection:text-white antialiased pb-20">
            
            {/* HEADER GIỎ HÀNG - CỐ ĐỊNH KHI SCROLL */}
            <header className="sticky top-[80px] z-30 border-b border-black/5 bg-[#f6f6f4]/85 backdrop-blur-md">
                <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    
                    {/* BÊN TRÁI: Số lượng mục */}
                    <div className="flex items-center gap-2">
                        <ShoppingBag size={18} className="text-zinc-700" />
                        <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                            Giỏ hàng ({cartItems?.length || 0})
                        </span>
                    </div>

                    {/* GIỮA: TIÊU ĐỀ TƯƠNG TỰ CHECKOUT */}
                    <div className="text-center">
                        <h1 className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-900">
                            Giỏ hàng
                        </h1>
                    </div>

                    {/* BÊN PHẢI: BADGE TRẠNG THÁI */}
                    <div className="hidden sm:flex items-center gap-2 text-xs font-semibold tracking-wider text-zinc-500 uppercase">
                        {hasItems ? (
                            <>
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span>Sẵn sàng thanh toán</span>
                            </>
                        ) : (
                            <span>Trống</span>
                        )}
                    </div>
                </div>
            </header>

            {/* MAIN CONTENT */}
            <main className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6 md:py-8">
                {hasItems ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative">
                        
                        {/* CỘT TRÁI: CART LIST */}
                        <section className="lg:col-span-7 xl:col-span-8 space-y-6">
                            <CartList
                                cartItems={cartItems}
                                onUpdate={handleUpdate}
                                onDelete={handleDelete}
                            />
                        </section>

                        {/* CỘT PHẢI: CART SUMMARY (Cố định đứng yên) */}
                        <aside className="lg:col-span-5 xl:col-span-4 h-full">
                            <div className="sticky top-[176px] z-10 space-y-4">
                                <CartSummary total={selectedTotalPrice} />
                            </div>
                        </aside>

                    </div>
                ) : (
                    
                    /* EMPTY STATE */
                    <div className="flex items-center justify-center py-16 md:py-24">
                        <div className="relative w-full max-w-[560px]">
                            <div className="absolute inset-0 bg-gradient-to-br from-zinc-200/40 via-white to-zinc-100/50 blur-3xl rounded-full scale-125 opacity-80" />

                            <div className="relative overflow-hidden rounded-3xl border border-black/5 bg-white/85 backdrop-blur-2xl p-8 sm:p-12 text-center shadow-xs">
                                <div className="relative mx-auto w-20 h-20 mb-6">
                                    <div className="absolute inset-0 rounded-full bg-zinc-100 border border-zinc-200" />
                                    <div className="absolute inset-3 rounded-xl bg-white border border-zinc-200 flex items-center justify-center shadow-2xs">
                                        <svg className="w-6 h-6 text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M3 5h2l2.2 10.2a1 1 0 00.98.8h8.9a1 1 0 00.98-.8L21 8H7" />
                                            <circle cx="10" cy="19" r="1.2" fill="currentColor" stroke="none" />
                                            <circle cx="18" cy="19" r="1.2" fill="currentColor" stroke="none" />
                                        </svg>
                                    </div>
                                </div>

                                <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-zinc-400 font-bold">
                                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-300" />
                                    Cart Empty
                                </span>

                                <h2 className="mt-3 text-2xl sm:text-3xl font-black tracking-tight text-zinc-900">
                                    Giỏ hàng của bạn đang trống
                                </h2>

                                <p className="mt-3 max-w-sm mx-auto text-sm leading-relaxed text-zinc-500">
                                    Khám phá những sản phẩm mới và thêm vào giỏ hàng để bắt đầu trải nghiệm mua sắm.
                                </p>

                                <div className="mt-8">
                                    <Link
                                        to="/products"
                                        className="inline-flex items-center justify-center px-7 h-11 rounded-full bg-black text-white text-xs font-bold uppercase tracking-wider transition-transform active:scale-95 hover:bg-zinc-800"
                                    >
                                        Khám phá ngay
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default CartPage;