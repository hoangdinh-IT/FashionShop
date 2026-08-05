import React from "react";
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

const ProductImages: React.FC<Props> = ({
    productDetail,
    currentImages,
    selectedImageIndex,
    setSelectedImageIndex,
    setDirection,
}) => {
    return (
        /* Container chính linh hoạt: Mobile xếp dọc, Desktop khớp chiều cao với ProductInfo */
        <div className="flex flex-col-reverse sm:flex-row gap-3 w-full h-full min-w-0">
            
            {/* THUMBNAILS LIST */}
            <div className="flex w-full shrink-0 flex-row sm:w-16 md:w-20 sm:flex-col gap-2 overflow-x-auto sm:overflow-y-auto lg:max-h-full scrollbar-none p-1 -m-1">
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
                            className={`group relative aspect-square w-12 sm:w-full shrink-0 overflow-hidden rounded-lg transition-all duration-200 cursor-pointer ${
                                isSelected
                                    ? "ring-2 ring-zinc-900 ring-offset-1 ring-offset-white scale-[0.98]"
                                    : "border border-zinc-200/80 hover:border-zinc-400 opacity-60 hover:opacity-100"
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

            {/* MAIN IMAGE DISPLAY - Kéo giãn 100% chiều cao trên Desktop */}
            <div className="relative flex-1 min-w-0 min-h-[380px] sm:min-h-[450px] lg:min-h-0 h-full overflow-hidden rounded-xl sm:rounded-2xl border border-zinc-200/80 bg-zinc-50/50">
                
                {/* BADGES */}
                <div className="absolute top-2.5 left-2.5 z-20 flex flex-col gap-1">
                    {productDetail?.isNew && (
                        <span className="inline-flex items-center rounded bg-white/90 px-2 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-zinc-900 backdrop-blur-xs border border-zinc-200/80 shadow-2xs">
                            New
                        </span>
                    )}

                    {productDetail?.isBestSeller && (
                        <span className="inline-flex items-center rounded bg-zinc-900 px-2 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white shadow-2xs">
                            Best Seller
                        </span>
                    )}
                </div>

                {/* ANIMATED IMAGE CAROUSEL */}
                <div className="absolute inset-0 w-full h-full">
                    <AnimatePresence mode="wait">
                        <motion.img
                            key={selectedImageIndex}
                            src={
                                currentImages[selectedImageIndex] ||
                                "https://placehold.co/600x800/e2e8f0/64748b?text=No+Image"
                            }
                            alt={productDetail?.name || "Product"}
                            className="h-full w-full object-contain p-2 sm:p-4 select-none"
                            
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.96 }}
                            transition={{ duration: 0.2 }}
                        />
                    </AnimatePresence>
                </div>

                {/* CONTROLS & INDICATOR */}
                {currentImages.length > 1 && (
                    <div className="absolute bottom-2.5 inset-x-2.5 z-20 flex items-center justify-between pointer-events-none">
                        
                        {/* COUNTER INDICATOR */}
                        <span className="pointer-events-auto rounded-full bg-white/80 border border-zinc-200/60 px-2.5 py-1 text-[10px] sm:text-xs font-semibold text-zinc-700 backdrop-blur-md shadow-2xs">
                            {selectedImageIndex + 1} / {currentImages.length}
                        </span>

                        {/* NAV BUTTONS */}
                        <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-zinc-200/60 bg-white/80 p-1 backdrop-blur-md shadow-2xs">
                            <button
                                type="button"
                                onClick={() => {
                                    setDirection(-1);
                                    setSelectedImageIndex((prev) =>
                                        prev > 0 ? prev - 1 : currentImages.length - 1
                                    );
                                }}
                                className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full text-zinc-700 hover:bg-zinc-900 hover:text-white transition-colors cursor-pointer"
                                aria-label="Previous image"
                            >
                                <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setDirection(1);
                                    setSelectedImageIndex((prev) =>
                                        prev < currentImages.length - 1 ? prev + 1 : 0
                                    );
                                }}
                                className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full text-zinc-700 hover:bg-zinc-900 hover:text-white transition-colors cursor-pointer"
                                aria-label="Next image"
                            >
                                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductImages;