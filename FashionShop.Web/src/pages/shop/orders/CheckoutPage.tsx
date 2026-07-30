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
import { ShieldCheck, ArrowLeft } from 'lucide-react';

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
        voucherId?: string, 
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
            transferCode: transferCode || "", // Gán mã chuyển khoản được truyền từ CheckoutSummary
            note: note,
            voucherId: voucherId,
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
        <div className="min-h-screen bg-[#f6f6f4] text-zinc-900 font-sans selection:bg-zinc-900 selection:text-white antialiased pb-20">
            {/* HEADER CỐ ĐỊNH KHI SCROLL */}
            <header className="sticky top-[80px] z-20 border-b border-black/5 bg-[#f6f6f4]/85 backdrop-blur-md">
                <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <button 
                        onClick={() => navigate('/shop/cart')}
                        className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 hover:text-zinc-900 transition-colors group cursor-pointer"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        <span>Giỏ hàng</span>
                    </button>

                    <div className="text-center">
                        <h1 className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-900">
                            Thanh toán
                        </h1>
                    </div>

                    <div className="hidden sm:flex items-center gap-2 text-xs font-semibold tracking-wider text-zinc-500 uppercase">
                        <ShieldCheck size={14} className="text-emerald-600" />
                        <span>Thanh toán an toàn</span>
                    </div>
                </div>
            </header>

            {/* MAIN CONTENT AREA */}
            <main className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6 md:py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative">
                    
                    {/* LEFT COLUMN: Địa chỉ & Sản phẩm */}
                    <div className="lg:col-span-7 xl:col-span-8 space-y-6">
                        <section>
                            <CheckoutAddress 
                                address={selectedAddress} 
                                onOpenAddressModal={() => setIsAddressModalOpen(true)}
                                note={note}
                                onChangeNote={setNote}
                            />
                        </section>

                        <section>
                            <CheckoutItems items={selectedItems} />
                        </section>
                    </div>

                    {/* RIGHT COLUMN: Tóm tắt thanh toán */}
                    <aside className="lg:col-span-5 xl:col-span-4 h-full">
                        <div className="sticky top-[160px] z-10 space-y-4">
                            <CheckoutSummary 
                                subTotal={subTotal}
                                shippingFee={SHIPPING_FEE}
                                onOrder={handlePlaceOrder}
                                isLoading={isOrderCreating}
                            />
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