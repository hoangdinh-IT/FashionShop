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
            shippingAddress: selectedAddress.addressDetail,
            shippingCommune: selectedAddress.commune,
            shippingDistrict: selectedAddress.district,
            shippingCity: selectedAddress.city,
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
        return <div className="min-h-screen flex items-center justify-center font-bold text-zinc-500">Đang tải thông tin đơn hàng...</div>;
    }

    return (
        <div className="min-h-screen bg-[#f4f5f6] py-12 px-6">
            <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row gap-8 items-start">
                
                {/* Cột trái: Địa chỉ và Sản phẩm */}
                <div className="flex-1 space-y-6 w-full">
                    <CheckoutAddress 
                        address={selectedAddress} 
                        onOpenAddressDialog={() => setIsAddressModalOpen(true)}
                        note={note}
                        onChangeNote={setNote}
                    />
                    <CheckoutItems items={selectedItems} />
                </div>

                {/* Cột phải: Tổng kết đơn hàng */}
                <CheckoutSummary 
                    subTotal={subTotal}
                    shippingFee={30000}
                    discount={0}
                    onOrder={handlePlaceOrder}
                />
            </div>

            {/* Dialog chọn địa chỉ */}
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