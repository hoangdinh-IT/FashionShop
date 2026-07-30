import { useState } from 'react';
import { 
    ChevronRight, 
    CreditCard, 
    Ticket, 
    ArrowRight, 
    Landmark, 
    Check, 
    Loader2,
    ShieldCheck,
    Truck
} from 'lucide-react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import type { PaymentMethod } from '../../types/requests';
import { VoucherModal } from './VoucherModal';
import { BankTransferModal } from './BankTransferModal'; 
import { DiscountType, type Voucher } from '../../../vouchers/types/voucher';
import { useVoucher } from '../../../vouchers/hooks/useVoucher';

interface Props {
    subTotal: number;
    shippingFee?: number;
    onOrder: (paymentMethod: PaymentMethod, voucherId?: string, transferContent?: string) => void;
    isLoading?: boolean;
}

const FREE_SHIPPING_THRESHOLD = 500000;

// Custom Easing (Editorial Design System)
const customEase = [0.16, 1, 0.3, 1] as const;

// Container Animation Variants
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
        },
    },
};

// Section / Card Variants
const cardVariants: Variants = {
    hidden: { 
        opacity: 0, 
        scale: 0.98,
        filter: "blur(4px)",
    },
    visible: {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        transition: {
            duration: 0.5,
            ease: customEase,
        },
    },
};

// Element Inner Fade/Blur
const elementVariants: Variants = {
    hidden: { 
        opacity: 0, 
        scale: 0.96,
        filter: "blur(4px)",
    },
    visible: {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        transition: {
            duration: 0.35,
            ease: customEase,
        },
    },
    exit: {
        opacity: 0,
        scale: 0.96,
        filter: "blur(4px)",
        transition: {
            duration: 0.2,
            ease: customEase,
        },
    },
};

const CheckoutSummary = ({ subTotal, shippingFee = 30000, onOrder, isLoading }: Props) => {
    const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>("COD" as PaymentMethod);
    const [isVoucherOpen, setIsVoucherOpen] = useState(false);
    const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);

    // STATE QUẢN LÝ MODAL CHUYỂN KHOẢN
    const [isBankModalOpen, setIsBankModalOpen] = useState(false);
    const [orderCode, setOrderCode] = useState('');

    // Gọi API lấy danh sách voucher
    const { vouchers, isLoading: isVouchersLoading } = useVoucher();

    // THÔNG TIN TÀI KHOẢN NGÂN HÀNG
    const myBankInfo = {
        bankId: '970436', // Mã BIN Vietcombank
        accountNo: '1031286526', // Số tài khoản VCB
        accountName: 'NGUYEN DINH HOANG' // Tên chủ tài khoản
    };

    // LOGIC TÍNH PHÍ VẬN CHUYỂN
    const isFreeShip = subTotal >= FREE_SHIPPING_THRESHOLD;
    const actualShippingFee = isFreeShip ? 0 : shippingFee;
    const amountNeededForFreeShip = FREE_SHIPPING_THRESHOLD - subTotal;

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
    const finalTotal = Math.max(0, subTotal + actualShippingFee - calculatedDiscount);

    const paymentOptions = [
        {
            id: "COD",
            label: "Thanh toán khi nhận hàng",
            subLabel: "COD",
            icon: <CreditCard size={18} />,
            description: "Thanh toán bằng tiền mặt khi nhận hàng"
        },
        {
            id: "Banking",
            label: "Chuyển khoản ngân hàng",
            subLabel: "Banking",
            icon: <Landmark size={18} />,
            description: "Thanh toán nhanh qua mã QR / STK"
        }
    ];

    const formatCurrency = (amount: number) => amount.toLocaleString('vi-VN') + 'đ';

    // HÀM TẠO MÃ NỘI DUNG CHUYỂN KHOẢN (8 KÝ TỰ UUID + NGÀY THÁNG)
    const generateOrderCode = () => {
        const rawUuid = crypto.randomUUID(); 
        const shortUuid = rawUuid.split('-')[0].toUpperCase(); // Lấy 8 ký tự đầu
        const now = new Date();
        const dateStr = String(now.getUTCDate()).padStart(2, '0') +
                        String(now.getUTCMonth() + 1).padStart(2, '0') +
                        String(now.getUTCFullYear()).slice(-2); 
        
        return `RKA ${shortUuid} ${dateStr}`; 
    };

    // XỬ LÝ KHI BẤM NÚT ĐẶT HÀNG
    const handleCheckoutClick = () => {
        if (selectedPayment === 'Banking') {
            const code = generateOrderCode();
            setOrderCode(code);
            setIsBankModalOpen(true); // Mở Modal QR Ngân hàng
        } else {
            // Thanh toán COD thì đặt hàng luôn (không cần transferCode)
            onOrder(selectedPayment, selectedVoucher?.id);
        }
    };

    // XỬ LÝ SAU KHI KHÁCH BẤM "ĐÃ CHUYỂN KHOẢN" TRONG MODAL
    const handleConfirmBankTransfer = () => {
        setIsBankModalOpen(false);
        // TRUYỀN ORDERCODE VÀO THAM SỐ THỨ 3
        onOrder('Banking', selectedVoucher?.id, orderCode);
    };

    return (
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full space-y-4 select-none font-sans"
        >
            {/* THẺ THANH TOÁN & VOUCHER */}
            <motion.div 
                variants={cardVariants}
                className="bg-white rounded-2xl border border-zinc-200/80 p-5 shadow-xs space-y-5"
            >
                {/* VOUCHER BUTTON */}
                <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-2">
                        Ưu đãi
                    </span>
                    <motion.button 
                        type="button"
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsVoucherOpen(true)}
                        disabled={isVouchersLoading}
                        className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 hover:bg-white hover:border-zinc-900 p-3.5 transition-colors flex items-center justify-between group cursor-pointer disabled:opacity-70"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-white border border-zinc-200 flex items-center justify-center text-zinc-700 group-hover:border-zinc-900 transition-colors shadow-2xs">
                                {isVouchersLoading ? <Loader2 className="animate-spin" size={16} /> : <Ticket size={16} />}
                            </div>

                            <div className="text-left">
                                <div className="flex items-center gap-2">
                                    <p className="text-xs font-bold text-zinc-900">Mã giảm giá</p>
                                    <AnimatePresence>
                                        {selectedVoucher && (
                                            <motion.span 
                                                variants={elementVariants}
                                                initial="hidden"
                                                animate="visible"
                                                exit="exit"
                                                className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold"
                                            >
                                                Đã chọn
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </div>
                                <p className="text-[11px] text-zinc-500 font-medium line-clamp-1">
                                    {selectedVoucher ? selectedVoucher.code : (isVouchersLoading ? "Đang tải..." : "Chọn hoặc nhập mã ưu đãi")}
                                </p>
                            </div>
                        </div>

                        <ChevronRight size={16} className="text-zinc-400 group-hover:text-zinc-900 group-hover:translate-x-0.5 transition-all" />
                    </motion.button>
                </div>

                {/* PAYMENT METHODS */}
                <div className="space-y-2 pt-1 border-t border-zinc-100">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block pt-2 mb-2">
                        Phương thức thanh toán
                    </span>

                    <div className="space-y-2">
                        {paymentOptions.map((option) => {
                            const isActive = selectedPayment === option.id;
                            return (
                                <motion.div
                                    key={option.id}
                                    whileTap={{ scale: 0.99 }}
                                    onClick={() => setSelectedPayment(option.id as PaymentMethod)}
                                    className={`relative w-full rounded-xl border p-3.5 transition-all duration-300 cursor-pointer flex items-center justify-between ${
                                        isActive
                                            ? 'border-zinc-900 bg-zinc-900 text-white shadow-xs'
                                            : 'border-zinc-200 bg-white hover:border-zinc-400 text-zinc-700'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                                            isActive ? 'bg-white/10 text-white' : 'bg-zinc-100 text-zinc-600'
                                        }`}>
                                            {option.icon}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold leading-none">{option.label}</p>
                                            <p className={`mt-1 text-[11px] transition-colors ${isActive ? 'text-zinc-300' : 'text-zinc-500'}`}>
                                                {option.description}
                                            </p>
                                        </div>
                                    </div>

                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                                        isActive ? 'border-white bg-white text-black' : 'border-zinc-300'
                                    }`}>
                                        {isActive && <Check size={10} strokeWidth={3} />}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </motion.div>

            {/* THẺ TÓM TẮT CHI PHÍ & ĐẶT HÀNG */}
            <motion.div 
                variants={cardVariants}
                className="bg-white rounded-2xl border border-zinc-200/80 p-5 shadow-xs space-y-4"
            >
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 pb-2 border-b border-zinc-100">
                    Chi tiết thanh toán
                </h3>

                {/* THÔNG BÁO FREESHIP */}
                <AnimatePresence mode="wait">
                    {!isFreeShip && amountNeededForFreeShip > 0 && (
                        <motion.div 
                            variants={elementVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200/60 text-amber-900 text-[11px]"
                        >
                            <Truck size={15} className="shrink-0 text-amber-600" />
                            <span>Mua thêm <strong className="font-semibold">{formatCurrency(amountNeededForFreeShip)}</strong> để được <strong>Miễn phí vận chuyển</strong></span>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="space-y-2.5 text-xs font-medium">
                    <div className="flex justify-between text-zinc-600">
                        <span>Tiền hàng</span>
                        <span className="font-mono font-semibold text-zinc-900">{formatCurrency(subTotal)}</span>
                    </div>

                    <div className="flex justify-between text-zinc-600 items-center">
                        <span>Phí vận chuyển</span>
                        {isFreeShip ? (
                            <span className="font-mono font-bold text-emerald-600 flex items-center gap-1">
                                Miễn phí
                            </span>
                        ) : (
                            <span className="font-mono font-semibold text-zinc-900">{formatCurrency(shippingFee)}</span>
                        )}
                    </div>

                    <AnimatePresence>
                        {calculatedDiscount > 0 && (
                            <motion.div 
                                variants={elementVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="flex justify-between text-emerald-700 overflow-hidden"
                            >
                                <span>Giảm giá ({selectedVoucher?.code})</span>
                                <span className="font-mono font-bold">-{formatCurrency(calculatedDiscount)}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="pt-3 border-t border-zinc-100">
                    <div className="flex items-baseline justify-between mb-4">
                        <div>
                            <span className="text-xs font-bold text-zinc-900 block">Thành tiền</span>
                            <span className="text-[10px] text-zinc-400">Đã bao gồm VAT</span>
                        </div>
                        <AnimatePresence mode="wait">
                            <motion.span 
                                key={finalTotal}
                                initial={{ opacity: 0, scale: 0.95, filter: "blur(2px)" }}
                                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                                exit={{ opacity: 0, scale: 0.95, filter: "blur(2px)" }}
                                transition={{ duration: 0.25, ease: customEase }}
                                className="text-2xl font-black font-mono tracking-tight text-zinc-900"
                            >
                                {formatCurrency(finalTotal)}
                            </motion.span>
                        </AnimatePresence>
                    </div>

                    <motion.button 
                        type="button"
                        whileTap={{ scale: 0.98 }}
                        onClick={handleCheckoutClick}
                        disabled={isLoading}
                        className="w-full h-12 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="animate-spin" size={16} />
                                Đang xử lý...
                            </span>
                        ) : (
                            <>
                                <span>Đặt hàng ngay</span>
                                <ArrowRight size={16} />
                            </>
                        )}
                    </motion.button>

                    <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-zinc-400">
                        <ShieldCheck size={13} className="text-emerald-600" />
                        <span>Thanh toán an toàn & bảo mật</span>
                    </div>
                </div>
            </motion.div>

            {/* VOUCHER MODAL */}
            <VoucherModal
                isOpen={isVoucherOpen}
                onClose={() => setIsVoucherOpen(false)}
                vouchers={vouchers}
                selectedVoucher={selectedVoucher}
                onSelectVoucher={(voucher) => setSelectedVoucher(voucher)}
                subTotal={subTotal}
            />

            {/* BANK TRANSFER MODAL */}
            <BankTransferModal
                isOpen={isBankModalOpen}
                onClose={() => setIsBankModalOpen(false)}
                onConfirm={handleConfirmBankTransfer}
                bankInfo={myBankInfo}
                amount={finalTotal}
                orderCode={orderCode}
                isLoading={isLoading}
            />

        </motion.div>
    );
};

export default CheckoutSummary;