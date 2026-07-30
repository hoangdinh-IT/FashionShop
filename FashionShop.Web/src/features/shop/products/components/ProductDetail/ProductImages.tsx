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
        <div className="flex gap-3">
            {/* THUMBNAILS LIST */}
            <div className="flex w-14 shrink-0 flex-col gap-2">
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
                            className={`group relative aspect-[3/4] w-full overflow-hidden rounded-xl border transition-all ${
                                isSelected
                                    ? "border-transparent ring-2 ring-zinc-900"
                                    : "border-zinc-200/80 hover:border-zinc-400"
                            }`}
                        >
                            <img
                                src={imgUrl}
                                alt={`Thumbnail ${index + 1}`}
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                        </button>
                    );
                })}
            </div>

            {/* MAIN IMAGE DISPLAY */}
            <div className="relative flex-1 overflow-hidden rounded-2xl border border-zinc-200/80 bg-zinc-50/60">
                {/* BADGES */}
                <div className="absolute top-4 left-4 z-20 flex flex-col gap-1.5">
                    {productDetail?.isNew && (
                        <span className="inline-flex items-center rounded-md border border-zinc-200/80 bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-900 backdrop-blur-xs shadow-2xs">
                            New
                        </span>
                    )}

                    {productDetail?.isBestSeller && (
                        <span className="inline-flex items-center rounded-md bg-zinc-900 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-2xs">
                            Best Seller
                        </span>
                    )}
                </div>

                {/* ANIMATED IMAGE CAROUSEL */}
                <div className="relative h-[480px] w-full md:h-[540px]">
                    <AnimatePresence mode="wait">
                        <motion.img
                            key={selectedImageIndex}
                            src={
                                currentImages[selectedImageIndex] ||
                                "https://placehold.co/600x800/e2e8f0/64748b?text=No+Image"
                            }
                            alt={productDetail?.name || "Product"}
                            className="absolute inset-0 h-full w-full object-contain p-6"
                            initial={{
                                opacity: 0,
                                x: direction > 0 ? 40 : -40,
                            }}
                            animate={{
                                opacity: 1,
                                x: 0,
                            }}
                            exit={{
                                opacity: 0,
                                x: direction > 0 ? -40 : 40,
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
                    <div className="absolute bottom-4 inset-x-4 z-20 flex items-center justify-between">
                        {/* COUNTER INDICATOR */}
                        <span className="rounded-full bg-white/80 border border-zinc-200/60 px-3 py-1 text-[11px] font-semibold text-zinc-700 backdrop-blur-md shadow-2xs">
                            {selectedImageIndex + 1} / {currentImages.length}
                        </span>

                        {/* NAV BUTTONS */}
                        <div className="flex items-center gap-1.5 rounded-full border border-zinc-200/60 bg-white/80 p-1 backdrop-blur-md shadow-2xs">
                            <button
                                type="button"
                                onClick={() => {
                                    setDirection(-1);
                                    setSelectedImageIndex((prev) =>
                                        prev > 0 ? prev - 1 : currentImages.length - 1
                                    );
                                }}
                                className="flex h-7 w-7 items-center justify-center rounded-full text-zinc-700 hover:bg-zinc-900 hover:text-white transition-colors"
                                aria-label="Previous image"
                            >
                                <ChevronLeft size={14} />
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setDirection(1);
                                    setSelectedImageIndex((prev) =>
                                        prev < currentImages.length - 1 ? prev + 1 : 0
                                    );
                                }}
                                className="flex h-7 w-7 items-center justify-center rounded-full text-zinc-700 hover:bg-zinc-900 hover:text-white transition-colors"
                                aria-label="Next image"
                            >
                                <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductImages;