import { useState } from 'react';
import { 
    ChevronRight, 
    CreditCard, 
    Ticket, 
    ArrowRight, 
    Landmark, 
    Check, 
    Loader2
} from 'lucide-react';
import type { PaymentMethod } from '../../types/requests';
import { VoucherDialog } from './VoucherDialog';
import { DiscountType, type Voucher } from '../../../vouchers/types/voucher';
import { useVoucher } from '../../../vouchers/hooks/useVoucher'; // Import custom hook

interface Props {
    subTotal: number;
    shippingFee?: number;
    onOrder: (paymentMethod: PaymentMethod, voucherId?: string) => void;
    isLoading?: boolean;
}

const CheckoutSummary = ({ subTotal, shippingFee = 30000, onOrder, isLoading }: Props) => {
    const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>("COD" as PaymentMethod);
    const [isVoucherOpen, setIsVoucherOpen] = useState(false);
    const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);

    // Gọi API lấy danh sách voucher
    const { vouchers, isLoading: isVouchersLoading } = useVoucher();

    // TÍNH TOÁN GIÁ TRỊ GIẢM GIÁ
    const calculateDiscount = (): number => {
        if (!selectedVoucher || subTotal < selectedVoucher.minOrderValue) return 0;

        if (selectedVoucher.discountType === DiscountType.FixedAmount) {
            return selectedVoucher.discountAmount;
        } else if (selectedVoucher.discountType === DiscountType.Percentage) {
            const calculated = (subTotal * selectedVoucher.discountAmount) / 100;
            if (selectedVoucher.maxDiscountAmount && calculated > selectedVoucher.maxDiscountAmount) {
                return selectedVoucher.maxDiscountAmount;
            }
            return calculated;
        }
        return 0;
    };

    const calculatedDiscount = calculateDiscount();
    const finalTotal = Math.max(0, subTotal + shippingFee - calculatedDiscount);

    const paymentOptions = [
        {
            id: "COD",
            label: "Thanh toán khi nhận hàng (COD)",
            icon: <CreditCard size={20} />,
            description: "Thanh toán tiền mặt khi giao hàng"
        },
        {
            id: "Banking",
            label: "Chuyển khoản ngân hàng",
            icon: <Landmark size={20} />,
            description: "Chuyển khoản qua QR hoặc STK"
        }
    ];

    const formatCurrency = (amount: number) => amount.toLocaleString('vi-VN') + 'đ';

    return (
        <div className="w-full lg:w-[380px] xl:sticky xl:top-[110px] space-y-5 select-none font-sans">
            
            {/* PAYMENT + VOUCHER CARD */}
            <div className="rounded-[30px] border border-zinc-200/70 bg-white/90 backdrop-blur-xl p-5 shadow-[0_10px_35px_rgba(0,0,0,0.03)]">
                <div className="pb-5 border-b border-zinc-100">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-400 font-bold">Payment</p>
                    <h2 className="mt-1 text-[20px] font-bold tracking-tight text-zinc-900">Thanh toán</h2>
                </div>

                {/* VOUCHER BUTTON */}
                <button 
                    type="button"
                    onClick={() => setIsVoucherOpen(true)}
                    disabled={isVouchersLoading}
                    className="mt-5 w-full rounded-[24px] border border-zinc-200 bg-[#fafafa] p-4 transition-all duration-300 hover:border-zinc-900 hover:bg-white group cursor-pointer disabled:opacity-70"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3.5">
                            <div className="w-11 h-11 rounded-2xl bg-white border border-zinc-200 flex items-center justify-center text-zinc-600 group-hover:text-zinc-900 group-hover:border-zinc-300 transition-colors shadow-sm">
                                {isVouchersLoading ? <Loader2 className="animate-spin" size={19} /> : <Ticket size={19} />}
                            </div>

                            <div className="text-left">
                                <div className="flex items-center gap-2">
                                    <p className="text-sm font-bold text-zinc-900">Mã khuyến mãi</p>
                                    {selectedVoucher && (
                                        <span className="px-2 py-0.5 rounded-full bg-zinc-900 text-white text-[10px] font-bold tracking-wider uppercase">
                                            Đã chọn
                                        </span>
                                    )}
                                </div>
                                <p className="mt-0.5 text-[11px] text-zinc-400 font-medium line-clamp-1">
                                    {selectedVoucher ? `Đang dùng: ${selectedVoucher.code}` : (isVouchersLoading ? "Đang tải voucher..." : "Thêm voucher hoặc ưu đãi")}
                                </p>
                            </div>
                        </div>
                        <ChevronRight size={18} className="text-zinc-300 group-hover:text-zinc-900 group-hover:translate-x-1 transition-all" />
                    </div>
                </button>

                {/* PAYMENT METHODS */}
                <div className="mt-7">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-300" />
                        <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold">Payment Method</span>
                    </div>

                    <div className="space-y-3">
                        {paymentOptions.map((option) => {
                            const isActive = selectedPayment === option.id;
                            return (
                                <button
                                    key={option.id}
                                    type="button"
                                    onClick={() => setSelectedPayment(option.id as PaymentMethod)}
                                    className={`relative w-full overflow-hidden rounded-[24px] border transition-all duration-300 px-5 py-4 text-left cursor-pointer ${
                                        isActive
                                            ? 'border-zinc-900 bg-zinc-900 text-white shadow-lg shadow-zinc-900/10'
                                            : 'border-zinc-200 bg-[#fafafa] hover:border-zinc-900 hover:bg-white text-zinc-700'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border transition-all ${
                                                isActive ? 'bg-white/10 border-white/10 text-white' : 'bg-white border-zinc-200 text-zinc-500'
                                            }`}>
                                                {option.icon}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold tracking-tight">{option.label}</p>
                                                <p className={`mt-0.5 text-[11px] font-medium ${isActive ? 'text-zinc-300' : 'text-zinc-400'}`}>
                                                    {option.description}
                                                </p>
                                            </div>
                                        </div>
                                        {isActive ? (
                                            <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center shrink-0">
                                                <Check size={13} strokeWidth={3} />
                                            </div>
                                        ) : (
                                            <ChevronRight size={17} className="text-zinc-300" />
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* SUMMARY CARD */}
            <div className="rounded-[30px] border border-zinc-200/70 bg-white/90 backdrop-blur-xl p-6 shadow-[0_10px_35px_rgba(0,0,0,0.03)]">
                <div className="pb-5 border-b border-zinc-100">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-400 font-bold">Order Summary</p>
                    <h2 className="mt-1 text-[20px] font-bold tracking-tight text-zinc-900">Tóm tắt thanh toán</h2>
                </div>

                <div className="mt-6 space-y-4">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-zinc-500 font-medium">Tiền hàng</span>
                        <span className="font-semibold text-zinc-900">{formatCurrency(subTotal)}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <span className="text-zinc-500 font-medium">Phí vận chuyển</span>
                        <span className="font-semibold text-zinc-900">{formatCurrency(shippingFee)}</span>
                    </div>

                    {calculatedDiscount > 0 && (
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-zinc-500 font-medium">Giảm giá ({selectedVoucher?.code})</span>
                            <span className="font-bold text-emerald-600">-{formatCurrency(calculatedDiscount)}</span>
                        </div>
                    )}

                    <div className="rounded-[24px] border border-zinc-200 bg-[#fafafa] p-5 mt-2">
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold">Final Total</p>
                                <p className="mt-1.5 text-[15px] font-semibold text-zinc-700">Thành tiền</p>
                            </div>
                            <div className="text-right">
                                <div className="text-[28px] leading-none font-black tracking-[-0.04em] text-zinc-900">
                                    {formatCurrency(finalTotal)}
                                </div>
                                <p className="mt-1.5 text-[10px] uppercase tracking-[0.15em] text-zinc-400 font-semibold">
                                    VAT Included
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <button 
                    type="button"
                    onClick={() => onOrder(selectedPayment, selectedVoucher?.id)}
                    disabled={isLoading}
                    className="relative mt-7 w-full overflow-hidden rounded-[24px] bg-zinc-900 text-white transition-all duration-300 hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
                >
                    <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    <div className="relative flex h-14 items-center justify-center gap-3">
                        <span className="text-[12px] font-bold uppercase tracking-[0.22em]">
                            {isLoading ? 'Đang xử lý...' : 'Xác nhận đặt hàng'}
                        </span>
                        {!isLoading && (
                            <ArrowRight size={18} className="text-zinc-400 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white" />
                        )}
                    </div>
                </button>
            </div>

            {/* VOUCHER DIALOG */}
            <VoucherDialog
                isOpen={isVoucherOpen}
                onClose={() => setIsVoucherOpen(false)}
                vouchers={vouchers}
                selectedVoucher={selectedVoucher}
                onSelectVoucher={(voucher) => setSelectedVoucher(voucher)}
                subTotal={subTotal}
            />
        </div>
    );
};

export default CheckoutSummary;