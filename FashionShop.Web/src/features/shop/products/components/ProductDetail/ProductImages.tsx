import { AnimatePresence, motion } from "framer-motion";
import {
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

interface Props {
    productDetail: any;
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
            <div className="flex flex-col gap-2 w-[58px] shrink-0">
                {currentImages.map((imgUrl, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            setDirection(index > selectedImageIndex ? 1 : -1);
                            setSelectedImageIndex(index);
                        }}
                        className={`relative overflow-hidden rounded-2xl aspect-[3/4] border transition-all duration-300 ${
                            selectedImageIndex === index
                                ? "border-zinc-900 shadow-sm"
                                : "border-zinc-200 hover:border-zinc-400"
                        }`}
                    >
                        <img
                            src={imgUrl}
                            alt={`Thumbnail ${index}`}
                            className="w-full h-full object-cover"
                        />
                    </button>
                ))}
            </div>

            <div className="relative flex-1 overflow-hidden rounded-[32px] border border-zinc-200 bg-[#f5f5f5]">
                <div className="absolute top-5 left-5 z-20 flex flex-col gap-2">
                    {productDetail.isNew && (
                        <span className="px-3 py-1 rounded-full bg-white text-[10px] font-bold uppercase tracking-[0.2em] border border-zinc-200">
                            New
                        </span>
                    )}

                    {productDetail.isBestSeller && (
                        <span className="px-3 py-1 rounded-full bg-zinc-900 text-white text-[10px] font-bold uppercase tracking-[0.2em]">
                            Best Seller
                        </span>
                    )}
                </div>

                <div className="relative h-[520px] overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.img
                            key={selectedImageIndex}
                            src={
                                currentImages[selectedImageIndex] ||
                                "https://placehold.co/600x800/e2e8f0/64748b?text=No+Image"
                            }
                            alt={productDetail.name}
                            className="absolute inset-0 w-full h-full object-contain p-8"
                            initial={{
                                opacity: 0,
                                x: direction > 0 ? 80 : -80,
                            }}
                            animate={{
                                opacity: 1,
                                x: 0,
                            }}
                            exit={{
                                opacity: 0,
                                x: direction > 0 ? -80 : 80,
                            }}
                            transition={{
                                duration: 0.25,
                                ease: "easeInOut",
                            }}
                        />
                    </AnimatePresence>
                </div>

                {currentImages.length > 1 && (
                    <div className="absolute bottom-5 right-5 flex items-center gap-2 rounded-full border border-white/20 bg-black/40 backdrop-blur-md p-1.5">
                        <button
                            onClick={() => {
                                setDirection(-1);

                                setSelectedImageIndex((prev) =>
                                    prev > 0
                                        ? prev - 1
                                        : currentImages.length - 1
                                );
                            }}
                            className="w-9 h-9 rounded-full bg-white text-zinc-700 flex items-center justify-center hover:bg-zinc-900 hover:text-white transition-all cursor-pointer"
                        >
                            <ChevronLeft size={15} />
                        </button>

                        <button
                            onClick={() => {
                                setDirection(1);

                                setSelectedImageIndex((prev) =>
                                    prev < currentImages.length - 1
                                        ? prev + 1
                                        : 0
                                );
                            }}
                            className="w-9 h-9 rounded-full bg-white text-zinc-700 flex items-center justify-center hover:bg-zinc-900 hover:text-white transition-all cursor-pointer"
                        >
                            <ChevronRight size={15} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductImages;