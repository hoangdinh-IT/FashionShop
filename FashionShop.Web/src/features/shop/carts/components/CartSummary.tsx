import { ArrowRight, Truck } from 'lucide-react';
import type React from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
    total: number;
}

const CartSummary: React.FC<Props> = ({ total }) => {
    const navigate = useNavigate();

    return (
        <div className="sticky top-24">
            <div className="rounded-[28px] border border-zinc-200/70 bg-white/90 backdrop-blur-xl p-6 shadow-[0_10px_40px_rgba(0,0,0,0.03)]">
                
                {/* Header */}
                <div className="pb-5 border-b border-zinc-100">
                    <p className="text-[10px] uppercase tracking-[0.24em] text-zinc-400 font-semibold">
                        Order summary
                    </p>

                    <h2 className="mt-2 text-xl font-bold tracking-tight text-zinc-900">
                        Chi tiết đơn hàng
                    </h2>
                </div>

                {/* Info */}
                <div className="mt-6 space-y-5">
                    
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-zinc-500">Tổng tiền</span>

                        <span className="font-semibold text-zinc-900">
                            {total.toLocaleString('vi-VN')}đ
                        </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <span className="text-zinc-500">Giảm giá</span>

                        <span className="font-semibold text-zinc-900">
                            0đ
                        </span>
                    </div>

                    <div className="pt-5 border-t border-zinc-100">
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-semibold">
                                    Total
                                </p>

                                <h3 className="mt-2 text-sm font-semibold text-zinc-900">
                                    Thành tiền
                                </h3>
                            </div>

                            <div className="text-right">
                                <div className="text-3xl font-black tracking-[-0.04em] text-zinc-900">
                                    {total.toLocaleString('vi-VN')}đ
                                </div>

                                <p className="mt-1 text-[11px] text-zinc-400">
                                    Đã bao gồm ưu đãi hiện tại
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Shipping */}
                    <div className="flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
                        <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center border border-emerald-100 shrink-0">
                            <Truck size={16} className="text-emerald-600" />
                        </div>

                        <div>
                            <p className="text-sm font-semibold text-emerald-700">
                                Miễn phí vận chuyển
                            </p>

                            <p className="mt-1 text-xs leading-5 text-emerald-600">
                                Đơn hàng của bạn đủ điều kiện freeship toàn quốc.
                            </p>
                        </div>
                    </div>

                    {/* Button */}
                    <button 
                        disabled={total === 0}
                        onClick={() => navigate("/shop/order")}
                        className={`group relative mt-2 flex h-[56px] w-full items-center justify-center gap-3 overflow-hidden rounded-full text-sm font-semibold tracking-wide transition-all duration-300 ${
                            total === 0
                                ? 'cursor-not-allowed bg-zinc-100 text-zinc-400'
                                : 'bg-zinc-900 text-white hover:-translate-y-[1px] hover:shadow-[0_12px_30px_rgba(0,0,0,0.12)]'
                        }`}
                    >
                        <span>Đặt hàng ngay</span>

                        <ArrowRight 
                            size={17} 
                            className="transition-transform duration-300 group-hover:translate-x-1" 
                        />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartSummary;