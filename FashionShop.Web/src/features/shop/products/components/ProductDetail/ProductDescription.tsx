interface Props {
    productDetail: any;
}

const ProductDescription = ({ productDetail }: Props) => {
    return (
        <div className="mt-14 overflow-hidden rounded-[28px] border border-zinc-200 bg-white">
            <div className="px-6 py-5 border-b border-zinc-100 flex items-center justify-between">
                <div>
                    <span className="text-[10px] uppercase tracking-[0.28em] font-bold text-zinc-400">
                        Product Details
                    </span>

                    <h2 className="mt-2 text-xl font-black tracking-tight text-zinc-900">
                        Chi tiết sản phẩm
                    </h2>
                </div>
            </div>

            <div className="px-6 py-6 text-sm leading-8 text-zinc-600 whitespace-pre-line">
                {productDetail.description ||
                    "Chưa có thông tin chi tiết cho sản phẩm này."}

                {productDetail.material && (
                    <div className="mt-8 pt-8 border-t border-zinc-100">
                        <h3 className="mb-2 text-sm font-bold uppercase tracking-[0.15em] text-zinc-900">
                            Chất liệu
                        </h3>

                        <p>{productDetail.material}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDescription;