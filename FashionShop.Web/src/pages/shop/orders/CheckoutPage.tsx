import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarts } from '../../../features/shop/carts/hooks/useCarts';
import { useAddresses } from '../../../features/shop/addresses/hooks/useAddresses';
import AddressModal from '../../../features/shop/orders/components/Checkout/AddressModal';
import CheckoutAddress from '../../../features/shop/orders/components/Checkout/CheckoutAddress';
import CheckoutItems from '../../../features/shop/orders/components/Checkout/CheckoutItems';
import CheckoutSummary from '../../../features/shop/orders/components/Checkout/CheckoutSummary';
import type { Address } from '../../../features/shop/addresses/types/address';
import { useOrderMutations } from '../../../features/shop/orders/hooks/useOrders';
import { PaymentMethod, type OrderRequest } from '../../../features/shop/orders/types/requests';
import { useSnackbar } from '../../../contexts';
import Loading from '../../../components/common/Loading';
import { ShieldCheck, ArrowLeft, ShoppingBag } from 'lucide-react';

const SHIPPING_FEE = 30000;

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();

    const { cartItems, isLoading: isCartLoading } = useCarts();
    const { addresses, isLoading: isAddrLoading } = useAddresses();
    const { createOrder, isCreating: isOrderCreating } = useOrderMutations();
    
    const [selectedAddress, setSelectedAddress] = useState<Address | undefined>(undefined);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [note, setNote] = useState("");

    useEffect(() => {
        if (!isAddrLoading && addresses.length > 0 && !selectedAddress) {
            const defaultAddr = addresses.find(addr => addr.isDefault) || addresses[0];
            setSelectedAddress(defaultAddr);
        }
    }, [addresses, isAddrLoading, selectedAddress]);
    
    const selectedItems = cartItems.filter(item => item.isSelected);
    const subTotal = selectedItems.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);

    useEffect(() => {
        if (!isCartLoading && selectedItems.length === 0) {
            navigate('/cart');
        }
    }, [selectedItems, isCartLoading, navigate]);

    // LẤY TRANSFER CODE TRỰC TIẾP TỪ THAM SỐ THỨ 3 CỦA ONORDER
    const handlePlaceOrder = (
        paymentMethod: PaymentMethod, 
        couponId?: string, 
        transferCode?: string
    ) => {
        if (!selectedAddress) {
            showSnackbar("Vui lòng chọn địa chỉ giao hàng", "warning");
            return;
        }

        if (selectedItems.length === 0) {
            showSnackbar("Không có sản phẩm nào để đặt hàng", "error");
            return;
        }

        const orderRequest: OrderRequest = {
            addressId: selectedAddress.id,
            paymentMethod: paymentMethod,
            transferCode: transferCode || "",
            note: note,
            couponId: couponId,
            orderItems: selectedItems.map(item => ({
                productVariantId: item.productVariantId,
                quantity: item.quantity,
            }))
        };

        createOrder(orderRequest, {
            onSuccess: () => {
                navigate("/shop/account/purchase-histories");
            }
        });
    };

    if (isCartLoading || isAddrLoading) {
        return <Loading />;
    }

    return (
        <div className="min-h-screen bg-[#f6f6f4] text-zinc-900 font-sans selection:bg-zinc-900 selection:text-white antialiased pb-24 lg:pb-20">
            
            {/* HEADER CỐ ĐỊNH KHI SCROLL */}
            <header className="sticky top-0 sm:top-[80px] z-30 border-b border-black/5 bg-[#f6f6f4]/90 backdrop-blur-md transition-all">
                <div className="max-w-[1200px] mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2">
                    
                    {/* NÚT QUAY LẠI GIỎ HÀNG */}
                    <button 
                        onClick={() => navigate('/shop/cart')}
                        className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-zinc-500 hover:text-zinc-900 transition-colors group cursor-pointer shrink-0"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="hidden sm:inline">Giỏ hàng</span>
                        <span className="sm:hidden">Trở về</span>
                    </button>

                    {/* TIÊU ĐỀ TRANG */}
                    <div className="text-center truncate">
                        <h1 className="text-xs sm:text-sm font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-zinc-900 truncate">
                            Thanh toán
                        </h1>
                    </div>

                    {/* BẢO MẬT & ĐẮC TÍNH */}
                    <div className="flex items-center justify-end gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-semibold tracking-wider text-zinc-500 uppercase shrink-0">
                        <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
                        <span className="hidden md:inline">Thanh toán an toàn</span>
                        <span className="md:hidden text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Bảo mật</span>
                    </div>
                </div>
            </header>

            {/* MAIN CONTENT AREA */}
            <main className="max-w-[1200px] mx-auto px-3 sm:px-6 py-4 sm:py-6 md:py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-8 items-start relative">
                    
                    {/* LEFT COLUMN: Địa chỉ & Danh sách Sản phẩm */}
                    <div className="lg:col-span-7 xl:col-span-8 space-y-4 sm:space-y-6 order-1">
                        
                        {/* THÔNG TIN VẬN CHUYỂN & ĐỊA CHỈ */}
                        <section className="bg-white rounded-2xl p-4 sm:p-6 shadow-xs border border-black/5">
                            <CheckoutAddress 
                                address={selectedAddress} 
                                onOpenAddressModal={() => setIsAddressModalOpen(true)}
                                note={note}
                                onChangeNote={setNote}
                            />
                        </section>

                        {/* DANH SÁCH SẢN PHẨM */}
                        <section className="bg-white rounded-2xl p-4 sm:p-6 shadow-xs border border-black/5">
                            <div className="flex items-center justify-between pb-3 sm:pb-4 mb-3 sm:mb-4 border-b border-zinc-100">
                                <div className="flex items-center gap-2">
                                    <ShoppingBag size={18} className="text-zinc-700" />
                                    <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-900">
                                        Sản phẩm chọn mua ({selectedItems.length})
                                    </h2>
                                </div>
                            </div>
                            <CheckoutItems items={selectedItems} />
                        </section>
                    </div>

                    {/* RIGHT COLUMN: Tóm tắt thanh toán & Phương thức thanh toán */}
                    <aside className="lg:col-span-5 xl:col-span-4 h-full order-2">
                        <div className="lg:sticky lg:top-[160px] z-10 space-y-4">
                            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-xs border border-black/5">
                                <CheckoutSummary 
                                    subTotal={subTotal}
                                    shippingFee={SHIPPING_FEE}
                                    onOrder={handlePlaceOrder}
                                    isLoading={isOrderCreating}
                                />
                            </div>
                        </div>
                    </aside>

                </div>
            </main>

            {/* MODAL CHỌN ĐỊA CHỈ */}
            <AddressModal
                isOpen={isAddressModalOpen}
                onClose={() => setIsAddressModalOpen(false)}
                addresses={addresses}
                currentSelectedAddress={selectedAddress}
                onSelect={(address) => {
                    setSelectedAddress(address); 
                    setIsAddressModalOpen(false);
                }}
            />
        </div>
    );
};

export default CheckoutPage;