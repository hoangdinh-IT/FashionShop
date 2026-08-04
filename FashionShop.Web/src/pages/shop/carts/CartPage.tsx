import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

import Loading from '../../../components/common/Loading';
import CartList from '../../../features/shop/carts/components/CartList';
import CartSummary from '../../../features/shop/carts/components/CartSummary';
import { useCartMutations, useCarts } from '../../../features/shop/carts/hooks/useCarts';

import type { CartItem } from '../../../features/shop/carts/types/cart';
import type { UpdateCartItem } from '../../../features/shop/carts/types/requests';

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

    // Sử dụng useMemo để tối ưu hiệu năng tính tổng tiền
    const selectedTotalPrice = useMemo(() => {
        if (!cartItems) return 0;
        return cartItems
            .filter(item => item.isSelected)
            .reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
    }, [cartItems]);

    if (isLoading) {
        return <Loading />;
    }

    const hasItems = Boolean(cartItems && cartItems.length > 0);

    return (
        <div className="min-h-screen bg-[#f6f6f4] text-zinc-900 font-sans selection:bg-zinc-900 selection:text-white antialiased pb-12 sm:pb-16 md:pb-20">
            
            {/* HEADER GIỎ HÀNG - CỐ ĐỊNH KHI SCROLL */}
            <header className="sticky top-0 sm:top-[60px] md:top-[80px] z-30 border-b border-black/5 bg-[#f6f6f4]/90 backdrop-blur-md transition-all">
                <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2">
                    
                    {/* BÊN TRÁI: Số lượng mục */}
                    <div className="flex items-center gap-1.5 sm:gap-2">
                        <ShoppingBag size={16} className="text-zinc-700 sm:w-[18px] sm:h-[18px]" />
                        <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-zinc-600 whitespace-nowrap">
                            Giỏ hàng ({cartItems?.length || 0})
                        </span>
                    </div>

                    {/* GIỮA: TIÊU ĐỀ */}
                    <div className="text-center">
                        <h1 className="text-xs sm:text-sm font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-zinc-900 truncate">
                            Giỏ hàng
                        </h1>
                    </div>

                    {/* BÊN PHẢI: BADGE TRẠNG THÁI */}
                    <div className="flex items-center justify-end">
                        <div className="hidden sm:flex items-center gap-2 text-[11px] sm:text-xs font-semibold tracking-wider text-zinc-500 uppercase">
                            {hasItems ? (
                                <>
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span>Sẵn sàng thanh toán</span>
                                </>
                            ) : (
                                <span>Trống</span>
                            )}
                        </div>
                        
                        {/* Hiển thị điểm chấm nhỏ báo trạng thái trên màn hình điện thoại */}
                        {hasItems && (
                            <span className="sm:hidden w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" title="Sẵn sàng thanh toán" />
                        )}
                    </div>
                </div>
            </header>

            {/* MAIN CONTENT */}
            <main className="max-w-[1200px] mx-auto px-3 sm:px-6 py-4 sm:py-6 md:py-8">
                {hasItems ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-start relative">
                        
                        {/* CỘT TRÁI: CART LIST */}
                        <section className="w-full lg:col-span-7 xl:col-span-8 space-y-4 sm:space-y-6">
                            <CartList
                                cartItems={cartItems}
                                onUpdate={handleUpdate}
                                onDelete={handleDelete}
                            />
                        </section>

                        {/* CỘT PHẢI: CART SUMMARY (Chỉ Sticky trên Desktop/Laptop lớn) */}
                        <aside className="w-full lg:col-span-5 xl:col-span-4">
                            <div className="lg:sticky lg:top-[160px] z-10 space-y-4">
                                <CartSummary total={selectedTotalPrice} />
                            </div>
                        </aside>

                    </div>
                ) : (
                    
                    /* EMPTY STATE (Trạng thái giỏ hàng trống) */
                    <div className="flex items-center justify-center py-12 sm:py-16 md:py-24 px-2">
                        <div className="relative w-full max-w-[560px]">
                            {/* Blur hiệu ứng nền */}
                            <div className="absolute inset-0 bg-gradient-to-br from-zinc-200/40 via-white to-zinc-100/50 blur-2xl sm:blur-3xl rounded-full scale-110 sm:scale-125 opacity-80 pointer-events-none" />

                            <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-black/5 bg-white/85 backdrop-blur-2xl p-6 sm:p-10 md:p-12 text-center shadow-xs">
                                
                                {/* Icon Giỏ hàng rỗng */}
                                <div className="relative mx-auto w-16 h-16 sm:w-20 sm:h-20 mb-4 sm:mb-6">
                                    <div className="absolute inset-0 rounded-full bg-zinc-100 border border-zinc-200" />
                                    <div className="absolute inset-2.5 sm:inset-3 rounded-xl bg-white border border-zinc-200 flex items-center justify-center shadow-2xs">
                                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M3 5h2l2.2 10.2a1 1 0 00.98.8h8.9a1 1 0 00.98-.8L21 8H7" />
                                            <circle cx="10" cy="19" r="1.2" fill="currentColor" stroke="none" />
                                            <circle cx="18" cy="19" r="1.2" fill="currentColor" stroke="none" />
                                        </svg>
                                    </div>
                                </div>

                                <span className="inline-flex items-center gap-1.5 sm:gap-2 text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-zinc-400 font-bold">
                                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-300" />
                                    Cart Empty
                                </span>

                                <h2 className="mt-2 sm:mt-3 text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-zinc-900">
                                    Giỏ hàng của bạn đang trống
                                </h2>

                                <p className="mt-2 sm:mt-3 max-w-sm mx-auto text-xs sm:text-sm leading-relaxed text-zinc-500">
                                    Khám phá những sản phẩm mới và thêm vào giỏ hàng để bắt đầu trải nghiệm mua sắm.
                                </p>

                                <div className="mt-6 sm:mt-8">
                                    <Link
                                        to="/shop/collection"
                                        className="inline-flex items-center justify-center px-6 sm:px-8 h-10 sm:h-11 rounded-full bg-black text-white text-xs font-bold uppercase tracking-wider transition-transform active:scale-95 hover:bg-zinc-800 shadow-xs"
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