import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ProductDetail } from "../../types/product";

interface Props {
    productDetail: ProductDetail;
    currentImages: string[];
    selectedImageIndex: number;
    setSelectedImageIndex: React.Dispatch<React.SetStateAction<number>>;
    direction: number;
    setDirection: React.Dispatch<React.SetStateAction<number>>;
}

const ProductImages = ({
    productDetail,
    currentImages,
    selectedImageIndex,
    setSelectedImageIndex,
    direction,
    setDirection,
}: Props) => {
    return (
        /* Khung chứa tổng thể nhỏ gọn (tối đa 400px chiều rộng) */
        <div className="flex flex-col-reverse gap-3 sm:flex-row max-w-[400px] mx-auto sm:max-w-none">
            {/* THUMBNAILS LIST */}
            <div className="flex w-full shrink-0 flex-row sm:w-12 sm:flex-col gap-2 overflow-x-auto sm:overflow-y-auto max-h-[380px] scrollbar-none">
                {currentImages.map((imgUrl, index) => {
                    const isSelected = selectedImageIndex === index;
                    return (
                        <button
                            key={index}
                            type="button"
                            onClick={() => {
                                setDirection(index > selectedImageIndex ? 1 : -1);
                                setSelectedImageIndex(index);
                            }}
                            className={`group relative aspect-square sm:aspect-[3/4] w-10 sm:w-full shrink-0 overflow-hidden rounded-lg border transition-all ${
                                isSelected
                                    ? "border-transparent ring-2 ring-zinc-900"
                                    : "border-zinc-200/80 hover:border-zinc-400"
                            }`}
                        >
                            <img
                                src={imgUrl}
                                alt={`Thumbnail ${index + 1}`}
                                className="h-full w-full object-cover"
                            />
                        </button>
                    );
                })}
            </div>

            {/* MAIN IMAGE DISPLAY - Khung hiển thị chính */}
            <div className="relative flex-1 overflow-hidden rounded-xl border border-zinc-200/80 bg-zinc-50/50">
                {/* BADGES */}
                <div className="absolute top-2.5 left-2.5 z-20 flex flex-col gap-1">
                    {productDetail?.isNew && (
                        <span className="inline-flex items-center rounded bg-white/90 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-zinc-900 backdrop-blur-xs border border-zinc-200/80 shadow-2xs">
                            New
                        </span>
                    )}

                    {productDetail?.isBestSeller && (
                        <span className="inline-flex items-center rounded bg-zinc-900 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-2xs">
                            Best Seller
                        </span>
                    )}
                </div>

                {/* ANIMATED IMAGE CAROUSEL */}
                {/* Chiều cao khung nhỏ gọn (380px), ảnh dùng object-contain để HIỆN ĐẦY ĐỦ KHÔNG BỊ CẮT */}
                <div className="relative h-[360px] sm:h-[380px] w-full">
                    <AnimatePresence mode="wait">
                        <motion.img
                            key={selectedImageIndex}
                            src={
                                currentImages[selectedImageIndex] ||
                                "https://placehold.co/600x800/e2e8f0/64748b?text=No+Image"
                            }
                            alt={productDetail?.name || "Product"}
                            /* ✅ ĐÃ ĐỔI: object-contain giúp ảnh không bao giờ bị xén mất phần nào */
                            className="absolute inset-0 h-full w-full object-contain p-2"
                            initial={{
                                opacity: 0,
                                x: direction > 0 ? 30 : -30,
                            }}
                            animate={{
                                opacity: 1,
                                x: 0,
                            }}
                            exit={{
                                opacity: 0,
                                x: direction > 0 ? -30 : 30,
                            }}
                            transition={{
                                duration: 0.2,
                                ease: "easeInOut",
                            }}
                        />
                    </AnimatePresence>
                </div>

                {/* CONTROLS & INDICATOR */}
                {currentImages.length > 1 && (
                    <div className="absolute bottom-2.5 inset-x-2.5 z-20 flex items-center justify-between pointer-events-none">
                        {/* COUNTER INDICATOR */}
                        <span className="pointer-events-auto rounded-full bg-white/80 border border-zinc-200/60 px-2 py-0.5 text-[10px] font-semibold text-zinc-700 backdrop-blur-md shadow-2xs">
                            {selectedImageIndex + 1} / {currentImages.length}
                        </span>

                        {/* NAV BUTTONS */}
                        <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-zinc-200/60 bg-white/80 p-0.5 backdrop-blur-md shadow-2xs">
                            <button
                                type="button"
                                onClick={() => {
                                    setDirection(-1);
                                    setSelectedImageIndex((prev) =>
                                        prev > 0 ? prev - 1 : currentImages.length - 1
                                    );
                                }}
                                className="flex h-5 w-5 items-center justify-center rounded-full text-zinc-700 hover:bg-zinc-900 hover:text-white transition-colors"
                                aria-label="Previous image"
                            >
                                <ChevronLeft size={12} />
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setDirection(1);
                                    setSelectedImageIndex((prev) =>
                                        prev < currentImages.length - 1 ? prev + 1 : 0
                                    );
                                }}
                                className="flex h-5 w-5 items-center justify-center rounded-full text-zinc-700 hover:bg-zinc-900 hover:text-white transition-colors"
                                aria-label="Next image"
                            >
                                <ChevronRight size={12} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductImages;