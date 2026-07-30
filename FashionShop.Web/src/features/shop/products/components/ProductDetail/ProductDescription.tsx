import React from "react";
import { Layers, Info } from "lucide-react";
import type { ProductDetail } from "../../types/product";

interface Props {
    productDetail: ProductDetail;
}

const ProductDescription: React.FC<Props> = ({ productDetail }) => {
    return (
        <section className="mt-12 border-t border-zinc-200/80 pt-10">
            {/* HEADER */}
            <div className="flex items-center gap-2 mb-4">
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-900" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-500">
                    Thông tin chi tiết
                </span>
            </div>

            <h2 className="text-2xl font-black tracking-tight text-zinc-900 md:text-3xl mb-6">
                Mô tả sản phẩm
            </h2>

            {/* CONTAINER */}
            <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 md:p-8 shadow-2xs">
                {/* CONTENT */}
                <div className="text-xs leading-relaxed text-zinc-600 whitespace-pre-line md:text-sm">
                    {productDetail?.description ? (
                        productDetail.description
                    ) : (
                        <div className="flex items-center gap-2 text-zinc-400 py-4 italic">
                            <Info size={16} />
                            <span>Chưa có thông tin mô tả chi tiết cho sản phẩm này.</span>
                        </div>
                    )}
                </div>

                {/* MATERIAL & SPECIFICATIONS */}
                {productDetail?.material && (
                    <div className="mt-8 border-t border-zinc-100 pt-6">
                        <div className="flex items-center gap-2 mb-2">
                            <Layers size={14} className="text-zinc-500" />
                            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                                Chất liệu & Thành phần
                            </h3>
                        </div>
                        
                        <div className="inline-block rounded-xl bg-zinc-50 border border-zinc-200/60 px-4 py-2.5 text-xs font-medium text-zinc-700">
                            {productDetail.material}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default ProductDescription;