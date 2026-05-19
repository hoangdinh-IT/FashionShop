import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarts } from '../../../features/shop/carts/hooks/useCarts';
import { useAddresses } from '../../../features/shop/addresses/hooks/useAddresses';
import AddressDialog from '../../../features/shop/orders/components/Checkout/AddressDialog';
import CheckoutAddress from '../../../features/shop/orders/components/Checkout/CheckoutAddress';
import CheckoutItems from '../../../features/shop/orders/components/Checkout/CheckoutItems';
import CheckoutSummary from '../../../features/shop/orders/components/Checkout/CheckoutSummary';
import type { Address } from '../../../features/shop/addresses/types/address';
import { useOrderMutations } from '../../../features/shop/orders/hooks/useOrders';
import { PaymentMethod, type OrderRequest } from '../../../features/shop/orders/types/requests';
import { useSnackbar } from '../../../contexts';
import Loading from '../../../components/common/Loading';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();

    const { cartItems, isLoading: isCartLoading } = useCarts();
    const { addresses, isLoading: isAddrLoading } = useAddresses();
    const { createOrder, isCreating } = useOrderMutations();
    
    // 1. Quản lý địa chỉ đang được chọn
    const [selectedAddress, setSelectedAddress] = useState<Address | undefined>(undefined);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

    const [note, setNote] = useState("");
    // const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.COD);

    // 2. Tự động gán địa chỉ mặc định khi load dữ liệu xong lần đầu
    useEffect(() => {
        if (!isAddrLoading && addresses.length > 0 && !selectedAddress) {
            const defaultAddr = addresses.find(addr => addr.isDefault) || addresses[0];
            setSelectedAddress(defaultAddr);
        }
    }, [addresses, isAddrLoading, selectedAddress]);
    
    // Lọc các item được tích chọn từ giỏ hàng
    const selectedItems = cartItems.filter(item => item.isSelected);

    // Tính tổng tiền
    const subTotal = selectedItems.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);

    // Chặn nếu giỏ hàng trống (không có item được chọn)
    useEffect(() => {
        if (!isCartLoading && selectedItems.length === 0) {
            navigate('/cart');
        }
    }, [selectedItems, isCartLoading, navigate]);

    const handlePlaceOrder = (paymentMethod: PaymentMethod) => {
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
            note: note,
            voucherId: undefined,
            orderItems: selectedItems.map(item => ({
                productVariantId: item.productVariantId,
                quantity: item.quantity,
            }))
        };

        createOrder(orderRequest, {
            onSuccess: () => {
                navigate("/shop/account/purchase-histories");
            }
        })
    };

    if (isCartLoading || isAddrLoading) {
        return <Loading />
    }

    // CheckoutPage.tsx

return (
    <div className="min-h-screen bg-[#f6f6f4] text-zinc-900">
        
        {/* HEADER */}
        <div className="sticky top-[64px] z-30 border-b border-black/5 bg-white/80 backdrop-blur-xl">
            <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-4 flex items-center justify-between">
                
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center shadow-sm">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>

                    <div>
                        <h1 className="text-[24px] font-black tracking-[-0.05em] uppercase">
                            Thanh toán
                        </h1>

                        <p className="text-[10px] uppercase tracking-[0.24em] text-zinc-400 font-semibold mt-0.5">
                            Expressive Minimalism
                        </p>
                    </div>
                </div>

                <div className="hidden md:flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-zinc-500 font-semibold">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    Secure Checkout
                </div>
            </div>
        </div>

        {/* CONTENT */}
        <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-10">
            
            <div className="flex flex-col xl:flex-row gap-8 items-start">
                
                {/* LEFT */}
                <div className="flex-1 w-full space-y-6">
                    
                    <CheckoutAddress 
                        address={selectedAddress} 
                        onOpenAddressDialog={() => setIsAddressModalOpen(true)}
                        note={note}
                        onChangeNote={setNote}
                    />

                    <CheckoutItems items={selectedItems} />
                </div>

                {/* RIGHT */}
                <CheckoutSummary 
                    subTotal={subTotal}
                    shippingFee={30000}
                    discount={0}
                    onOrder={handlePlaceOrder}
                />
            </div>
        </div>

        {/* DIALOG */}
        <AddressDialog
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