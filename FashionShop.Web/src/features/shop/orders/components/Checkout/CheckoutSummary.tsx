import React, { useState } from 'react';
import { 
    ChevronRight, 
    CreditCard, 
    Ticket, 
    ArrowRight, 
    Landmark, 
    Check 
} from 'lucide-react';
import type { PaymentMethod } from '../../types/requests';

interface Props {
    subTotal: number;
    shippingFee: number;
    discount: number;
    onOrder: (paymentMethod: PaymentMethod) => void; // Truyền method ra ngoài khi đặt hàng
    isLoading?: boolean;
}

const CheckoutSummary = ({ subTotal, shippingFee = 30000, discount, onOrder, isLoading }: Props) => {
    // 1. Quản lý trạng thái phương thức thanh toán
    const [selectedPayment, setSelectedPayment] = useState<"COD" | "Banking">("COD");

    // 2. Tính toán tổng tiền
    const finalTotal = subTotal + shippingFee - discount;

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

    return (
        <div className="w-full lg:w-[420px] lg:sticky lg:top-8 space-y-4">
            
            {/* Khối Voucher & Payment Method */}
            <div className="bg-white rounded-3xl p-6 border border-zinc-100 shadow-sm space-y-4">
                {/* Voucher Button */}
                <button className="w-full flex items-center justify-between p-4 bg-zinc-50 rounded-2xl group hover:bg-zinc-100 transition-all cursor-pointer border border-transparent hover:border-zinc-200">
                    <div className="flex items-center gap-3 text-zinc-700 font-semibold text-sm">
                        <Ticket size={20} className="text-zinc-400" />
                        <span>Dùng mã khuyến mãi</span>
                    </div>
                    <ChevronRight size={18} className="text-zinc-300 group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="h-[1px] bg-zinc-100 w-full" />

                {/* Danh sách phương thức thanh toán */}
                <div className="space-y-2">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.15em] ml-1 mb-3">
                        Phương thức thanh toán
                    </p>
                    
                    {paymentOptions.map((option) => {
                        const isActive = selectedPayment === option.id;
                        return (
                            <button
                                key={option.id}
                                onClick={() => setSelectedPayment(option.id as any)}
                                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 border-2 cursor-pointer group
                                    ${isActive 
                                        ? 'bg-indigo-50 border-indigo-600 text-indigo-700' // Màu Indigo nhạt thanh lịch
                                        : 'bg-zinc-50 border-transparent text-zinc-600 hover:bg-zinc-100'}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`${isActive ? 'text-indigo-600' : 'text-zinc-400'} transition-colors`}>
                                        {option.icon}
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-sm leading-none">{option.label}</p>
                                        <p className={`text-[10px] mt-1.5 font-medium ${isActive ? 'text-indigo-400' : 'text-zinc-400'}`}>
                                            {option.description}
                                        </p>
                                    </div>
                                </div>
                                
                                {isActive ? (
                                    <div className="bg-indigo-600 rounded-full p-1">
                                        <Check size={12} className="text-white" strokeWidth={4} />
                                    </div>
                                ) : (
                                    <ChevronRight size={18} className="text-zinc-300 group-hover:translate-x-1 transition-transform" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Khối Tổng kết giá tiền */}
            <div className="bg-white rounded-3xl p-8 border border-zinc-100 shadow-sm">
                <h2 className="text-lg font-bold mb-6 text-zinc-900">Tóm tắt thanh toán</h2>
                
                <div className="space-y-4 text-sm font-medium">
                    <div className="flex justify-between text-zinc-500">
                        <span>Tiền hàng</span>
                        <span className="text-zinc-900 font-bold">{subTotal.toLocaleString('vi-VN')}đ</span>
                    </div>

                    <div className="flex justify-between text-zinc-500 pb-4 border-b border-zinc-50">
                        <span>Phí vận chuyển</span>
                        <span className="text-zinc-900 font-bold">{shippingFee.toLocaleString('vi-VN')}đ</span>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                        <span className="text-zinc-700 font-bold text-base">Thành tiền</span>
                        <div className="text-right">
                            <p className="text-2xl font-black text-zinc-900 tracking-tighter">
                                {finalTotal.toLocaleString('vi-VN')}đ
                            </p>
                            <p className="text-[10px] text-zinc-400 uppercase font-bold mt-1">Đã bao gồm phí vận chuyển</p>
                        </div>
                    </div>
                </div>

                {/* Nút đặt hàng thiết kế Luxury Black */}
                <button 
                    onClick={() => onOrder(selectedPayment)}
                    disabled={isLoading}
                    className="w-full mt-8 relative group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {/* Glow Effect */}
                    <div className="absolute inset-0 bg-black rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
                    
                    <div className="relative bg-zinc-900 border-2 border-zinc-900 text-white hover:bg-black hover:border-black font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 shadow-2xl">
                        
                        {/* Shine Animation */}
                        <div className="absolute inset-0 overflow-hidden rounded-2xl">
                            <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                        </div>

                        <span className="relative z-10 tracking-[0.2em] text-sm uppercase">
                            {isLoading ? 'Đang xử lý...' : 'Xác nhận đặt hàng'}
                        </span>
                        
                        {!isLoading && (
                            <ArrowRight 
                                size={20} 
                                className="relative z-10 group-hover:rotate-[-45deg] group-hover:translate-x-1 transition-transform duration-300 text-zinc-400 group-hover:text-white" 
                            />
                        )}
                    </div>
                </button>
            </div>
        </div>
    );
};

export default CheckoutSummary;