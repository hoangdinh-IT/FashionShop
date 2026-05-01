import type { CartItem } from "../../carts/types/cart";

interface Props {
    items: CartItem[];
}

const CheckoutItems = ({ items }: Props) => {
    return (
        <div className="bg-white rounded-3xl p-8 border border-zinc-100 shadow-sm">
            <h2 className="text-xl font-bold mb-8 tracking-tight text-zinc-900">
                Sản phẩm đã chọn ({items.length})
            </h2>
            <div className="divide-y divide-zinc-100">
                {items.map((item) => (
                    <div key={item.id} className="py-6 first:pt-0 last:pb-0 flex gap-6">
                        <div className="w-24 h-32 bg-zinc-50 rounded-2xl overflow-hidden border border-zinc-100 shrink-0">
                            <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 flex flex-col justify-between py-1">
                            <div>
                                <h3 className="font-bold text-zinc-900 leading-tight">{item.productName}</h3>
                                <p className="text-sm text-zinc-500 mt-1.5">{item.colorName} / {item.sizeName}</p>
                            </div>
                            <div className="flex justify-between items-end">
                                <span className="text-sm text-zinc-400 font-medium">Số lượng: {item.quantity}</span>
                                <span className="font-bold text-lg text-zinc-900">
                                    {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CheckoutItems;