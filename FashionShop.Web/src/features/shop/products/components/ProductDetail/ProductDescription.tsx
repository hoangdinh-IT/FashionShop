import React from "react";
import { Layers, Info } from "lucide-react";
import type { ProductDetail } from "../../types/product";

interface Props {
    productDetail: ProductDetail;
}

const ProductDescription: React.FC<Props> = ({ productDetail }) => {
    return (
        <section className="mt-8 sm:mt-10 md:mt-12 border-t border-zinc-200/80 pt-6 sm:pt-8 md:pt-10 w-full">
            {/* HEADER */}
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-900" />
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-zinc-500">
                    Thông tin chi tiết
                </span>
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-zinc-900 mb-4 sm:mb-6">
                Mô tả sản phẩm
            </h2>

            {/* CONTAINER */}
            <div className="rounded-xl sm:rounded-2xl border border-zinc-200/80 bg-white p-4 sm:p-6 md:p-8 shadow-2xs">
                {/* CONTENT */}
                <div className="text-xs sm:text-sm leading-relaxed sm:leading-loose text-zinc-600 whitespace-pre-line break-words">
                    {productDetail?.description ? (
                        productDetail.description
                    ) : (
                        <div className="flex items-center gap-2 text-zinc-400 py-3 sm:py-4 italic">
                            <Info size={16} className="shrink-0" />
                            <span>Chưa có thông tin mô tả chi tiết cho sản phẩm này.</span>
                        </div>
                    )}
                </div>

                {/* MATERIAL & SPECIFICATIONS */}
                {productDetail?.material && (
                    <div className="mt-6 sm:mt-8 border-t border-zinc-100 pt-4 sm:pt-6">
                        <div className="flex items-center gap-2 mb-2.5">
                            <Layers size={14} className="text-zinc-500 shrink-0" />
                            <h3 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-zinc-900">
                                Chất liệu & Thành phần
                            </h3>
                        </div>
                        
                        <div className="inline-block w-full sm:w-auto rounded-lg sm:rounded-xl bg-zinc-50 border border-zinc-200/60 px-3.5 py-2 sm:px-4 sm:py-2.5 text-xs font-medium text-zinc-700">
                            {productDetail.material}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default ProductDescription;