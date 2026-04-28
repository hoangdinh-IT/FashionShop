import React from 'react';
import { 
    Trash2, 
    ChevronDown, 
    ArrowRight, 
    RefreshCcw, 
    Truck 
} from 'lucide-react';

const CartPage = () => {
    // Mock data cho danh sách sản phẩm trong giỏ
    const cartItems = [
        {
            id: 1,
            name: "Áo Phông Dream Team - Be 009 - 98",
            variant: "Be 009, 98",
            price: 199000,
            quantity: 1,
            image: "https://placehold.co/100x120/e2e8f0/64748b?text=Product+1"
        },
        {
            id: 2,
            name: "Quần Jeans Nữ Baggy Xếp Ly - Màu chàm 002 - 26",
            variant: "Màu chàm 002, 26",
            price: 399000,
            quantity: 1,
            image: "https://placehold.co/100x120/e2e8f0/64748b?text=Product+2"
        }
    ];

    return (
        <div className="bg-[#f8f8f8] min-h-screen pb-20">
            {/* Tiêu đề trang */}
            <div className="bg-white py-4 border-b border-zinc-100">
                <h1 className="text-center text-xl font-bold text-zinc-900">Giỏ hàng</h1>
            </div>

            <div className="max-w-[1200px] mx-auto px-4 mt-8">
                <div className="flex flex-col lg:flex-row gap-6">
                    
                    {/* BÊN TRÁI: DANH SÁCH SẢN PHẨM */}
                    <div className="flex-1 space-y-4">
                        <div className="bg-white rounded-2xl p-6 shadow-sm">
                            {/* Chọn tất cả */}
                            <div className="flex items-center gap-3 mb-6 border-b border-zinc-50 pb-4">
                                <input 
                                    type="checkbox" 
                                    className="w-5 h-5 rounded border-zinc-300 text-yellow-500 focus:ring-yellow-500 cursor-pointer"
                                />
                                <span className="text-sm font-medium text-zinc-800">Chọn tất cả</span>
                            </div>

                            {/* Danh sách Item */}
                            <div className="space-y-8">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        {/* Checkbox */}
                                        <div className="pt-2">
                                            <input 
                                                type="checkbox" 
                                                className="w-5 h-5 rounded border-zinc-300 text-yellow-500 focus:ring-yellow-500 cursor-pointer"
                                            />
                                        </div>

                                        {/* Ảnh */}
                                        <div className="w-24 h-32 bg-zinc-100 rounded-xl overflow-hidden shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>

                                        {/* Thông tin sản phẩm */}
                                        <div className="flex-1 flex flex-col justify-between py-1">
                                            <div className="flex justify-between items-start">
                                                <div className="space-y-2">
                                                    <h3 className="text-[15px] font-medium text-zinc-900 leading-tight">
                                                        {item.name}
                                                    </h3>
                                                    {/* Biến thể */}
                                                    <button className="flex items-center gap-1 bg-zinc-50 px-2 py-1 rounded text-xs text-zinc-600 border border-zinc-100 hover:bg-zinc-100 transition-colors">
                                                        {item.variant}
                                                        <ChevronDown size={14} />
                                                    </button>
                                                </div>
                                                {/* Nút xóa */}
                                                <button className="text-zinc-400 hover:text-red-500 transition-colors">
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>

                                            <div className="flex justify-between items-end">
                                                {/* Bộ chọn số lượng (Pill style) */}
                                                <div className="flex items-center bg-zinc-50 rounded-full px-3 py-1 border border-zinc-100">
                                                    <button className="w-6 h-6 flex items-center justify-center text-zinc-400 hover:text-zinc-900">-</button>
                                                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                                    <button className="w-6 h-6 flex items-center justify-center text-zinc-400 hover:text-zinc-900">+</button>
                                                </div>
                                                {/* Giá tiền */}
                                                <div className="text-lg font-bold text-zinc-900">
                                                    {item.price.toLocaleString('vi-VN')}đ
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* BÊN PHẢI: CHI TIẾT ĐƠN HÀNG */}
                    <div className="w-full lg:w-[380px] space-y-4">
                        {/* Box thanh toán */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-4">
                            <h2 className="text-lg font-bold text-zinc-900 mb-6">Chi tiết đơn hàng</h2>
                            
                            <div className="space-y-4">
                                <div className="flex justify-between text-sm text-zinc-600">
                                    <span>Tổng tiền</span>
                                    <span className="font-medium text-zinc-900">598.000đ</span>
                                </div>
                                <div className="flex justify-between text-sm text-zinc-600">
                                    <span>Giảm giá</span>
                                    <span className="font-medium text-zinc-900">0đ</span>
                                </div>
                                
                                <div className="border-t border-dashed border-zinc-200 pt-4 mt-4">
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-base font-medium text-zinc-900">Thành tiền</span>
                                        <div className="text-right">
                                            <div className="text-xl font-extrabold text-zinc-900">598.000đ</div>
                                            <p className="text-[11px] text-zinc-500 italic mt-1">Mua nhiều giảm nhiều</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Thông báo Freeship */}
                                <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-xl text-xs font-medium">
                                    <Truck size={16} />
                                    Đơn được miễn phí vận chuyển nhé!
                                </div>

                                {/* Nút đặt hàng */}
                                <button className="w-full bg-[#FCAF17] hover:bg-[#f0a515] text-zinc-900 font-bold py-4 rounded-full flex items-center justify-center gap-2 transition-all mt-4 shadow-md shadow-yellow-100">
                                    Đặt hàng
                                    <ArrowRight size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Chính sách cam kết */}
                        <div className="bg-white rounded-2xl p-4 flex items-center justify-center gap-3 shadow-sm border border-zinc-50">
                            <RefreshCcw size={18} className="text-zinc-400" />
                            <span className="text-xs text-zinc-600">
                                <span className="font-bold text-zinc-800">Đổi, trả miễn phí</span> tại nhà nếu không hài lòng
                            </span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CartPage;