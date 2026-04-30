import { ArrowRight, Truck } from 'lucide-react';
import type React from 'react';

interface Props {
    total: number;
}

const CartSummary: React.FC<Props> = ({ total }) => {
    return (
        <div className="space-y-6 sticky top-24">
            <div className="bg-white rounded-3xl p-8 border border-zinc-100 shadow-sm">
                <h2 className="text-lg font-bold text-zinc-900 mb-6">Chi tiết đơn hàng</h2>
                
                <div className="space-y-4">
                    <div className="flex justify-between text-sm text-zinc-600">
                        <span>Tổng tiền</span>
                        <span className="font-semibold text-zinc-900">{total.toLocaleString('vi-VN')}đ</span>
                    </div>
                    <div className="flex justify-between text-sm text-zinc-600">
                        <span>Giảm giá</span>
                        <span className="font-semibold text-zinc-900">0đ</span>
                    </div>
                    
                    <div className="border-t border-zinc-100 pt-5 mt-5">
                        <div className="flex justify-between items-baseline">
                            <span className="text-base font-bold text-zinc-900">Thành tiền</span>
                            <div className="text-right">
                                <div className="text-2xl font-extrabold text-zinc-900">
                                    {total.toLocaleString('vi-VN')}đ
                                </div>
                                <p className="text-[11px] text-zinc-400 italic mt-1 font-medium">Mua nhiều giảm nhiều</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-green-600 bg-green-50/50 p-4 rounded-2xl text-xs font-semibold border border-green-100/50">
                        <Truck size={18} />
                        <span>Đơn được miễn phí vận chuyển nhé!</span>
                    </div>

                    {/* Nút đặt hàng: Màu đen, hiệu ứng Hover và Active */}
                    <button 
                        disabled={total === 0}
                        className={`w-full font-bold py-5 rounded-2xl flex items-center justify-center gap-3 transition-all mt-6 shadow-lg group cursor-pointer 
                            ${total === 0 
                                ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed shadow-none' 
                                : 'bg-zinc-900 hover:bg-black active:scale-[0.98] text-white shadow-zinc-200'}`}
                    >
                        <span>Đặt hàng</span>
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartSummary;