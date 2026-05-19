import type { CartItem } from "../../../carts/types/cart";

interface Props {
    items: CartItem[];
}

const CheckoutItems = ({ items }: Props) => {
    // CheckoutItems.tsx

return (
    <div className="rounded-[30px] border border-zinc-200/70 bg-white/90 backdrop-blur-xl p-6 shadow-[0_10px_35px_rgba(0,0,0,0.03)]">
        
        {/* HEADER */}
        <div className="flex items-center justify-between pb-5 border-b border-zinc-100">
            
            <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-400 font-bold">
                    Selected Products
                </p>

                <h2 className="mt-1 text-[20px] font-bold tracking-tight text-zinc-900">
                    Sản phẩm đã chọn
                </h2>
            </div>

            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-zinc-900" />

                <span className="text-sm font-medium text-zinc-500">
                    {items.length} sản phẩm
                </span>
            </div>
        </div>

        {/* ITEMS */}
        <div className="mt-6 space-y-5">
            {items.map((item) => (
                <div 
                    key={item.id}
                    className="
                        group rounded-[26px]
                        border border-zinc-100
                        bg-[#fafafa]/80
                        hover:bg-white
                        transition-all duration-300
                        p-5
                    "
                >
                    <div className="flex gap-5">
                        
                        {/* IMAGE */}
                        <div className="w-24 h-32 rounded-[20px] overflow-hidden bg-white border border-zinc-100 shrink-0">
                            <img
                                src={item.imageUrl}
                                alt={item.productName}
                                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                            />
                        </div>

                        {/* CONTENT */}
                        <div className="flex-1 flex flex-col justify-between min-w-0">
                            
                            <div>
                                <h3 className="text-[16px] font-semibold leading-6 tracking-tight text-zinc-900 line-clamp-2">
                                    {item.productName}
                                </h3>

                                <div className="mt-3 inline-flex items-center rounded-full border border-zinc-200 bg-white px-3 py-1 text-[12px] font-medium text-zinc-500">
                                    {item.colorName} · {item.sizeName}
                                </div>
                            </div>

                            {/* FOOTER */}
                            <div className="mt-6 flex items-end justify-between">
                                
                                <div>
                                    <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-400 font-semibold">
                                        Quantity
                                    </p>

                                    <div className="mt-1 text-[15px] font-semibold text-zinc-700">
                                        x{item.quantity}
                                    </div>
                                </div>

                                <div className="text-right">
                                    <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-400 font-semibold">
                                        Total
                                    </p>

                                    <div className="mt-1 text-[22px] font-bold tracking-tight text-zinc-900">
                                        {(item.unitPrice * item.quantity).toLocaleString('vi-VN')}đ
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);
};

export default CheckoutItems;