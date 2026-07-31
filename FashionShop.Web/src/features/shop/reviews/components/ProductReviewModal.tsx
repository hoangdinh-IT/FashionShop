import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    IoClose,
    IoCloudUploadOutline,
    IoStar,
    IoTrashOutline,
} from "react-icons/io5";
import { useForm, type SubmitHandler } from "react-hook-form";

import type { OrderItemSummary } from "../../orders/types/order";
import type { ReviewFormInputs } from "../types/requests";

import { useReviewMutations } from "../hooks/useReview";
import { useLockBodyScroll } from "../../../../hooks/useLockBodyScroll";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    orderItem?: OrderItemSummary;
    isLoading?: boolean;
    onSuccess?: () => void;
}

const ProductReviewModal: React.FC<Props> = ({
    isOpen,
    onClose,
    orderItem,
    isLoading,
    onSuccess,
}) => {
    useLockBodyScroll(isOpen);

    const [rating, setRating] = useState(5);
    const [hoveredStar, setHoveredStar] = useState<number | null>(null);
    const [images, setImages] = useState<File[]>([]);

    const { createReview, isCreating } = useReviewMutations();

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm<ReviewFormInputs>({
        mode: "onChange",
        reValidateMode: "onChange",
        defaultValues: {
            content: "",
        },
    });

    const watchedContent = watch("content") || "";

    const previewImages = useMemo(() => {
        return images.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }));
    }, [images]);

    useEffect(() => {
        return () => {
            previewImages.forEach((p) => URL.revokeObjectURL(p.preview));
        };
    }, [previewImages]);

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;
        setImages((prev) => [...prev, ...files].slice(0, 5));
        // Reset input value to allow selecting the same file again if removed
        e.target.value = "";
    };

    const handleRemoveImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    const resetModalState = () => {
        reset();
        setImages([]);
        setRating(5);
        setHoveredStar(null);
    };

    useEffect(() => {
        if (!isOpen) {
            resetModalState();
        }
    }, [isOpen]);

    const handleClose = () => {
        resetModalState();
        onClose();
    };

    const onSubmit: SubmitHandler<ReviewFormInputs> = (data) => {
        const formData = new FormData();

        formData.append("ProductId", orderItem?.productId ?? "");
        formData.append("OrderItemId", String(orderItem?.orderItemId));
        formData.append("Rating", String(rating));
        formData.append("Content", data.content ?? "");

        images.forEach((file) => {
            formData.append("ReviewImages", file);
        });

        createReview(formData, {
            onSuccess: () => {
                handleClose();
                onSuccess?.();
            },
        });
    };

    const ratingLabels: Record<number, string> = {
        1: "Rất không hài lòng",
        2: "Không hài lòng",
        3: "Bình thường",
        4: "Hài lòng",
        5: "Tuyệt vời",
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm"
                    />

                    {/* Modal Window */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96, y: 12 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: 12 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="relative z-10 my-auto flex flex-col max-h-[90vh] w-full max-w-[560px] overflow-hidden rounded-2xl sm:rounded-3xl bg-white shadow-2xl ring-1 ring-zinc-900/5"
                    >
                        {/* Header - Fixed Top */}
                        <div className="flex shrink-0 items-center justify-between border-b border-zinc-100 px-4 py-3.5 sm:px-6 sm:py-5">
                            <div>
                                <h2 className="text-base sm:text-lg font-semibold tracking-tight text-zinc-900">
                                    Đánh giá sản phẩm
                                </h2>
                                <p className="text-[11px] sm:text-xs text-zinc-400">
                                    Chia sẻ cảm nhận thực tế của bạn
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={handleClose}
                                className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 active:scale-95"
                            >
                                <IoClose size={20} />
                            </button>
                        </div>

                        {/* Form Body - Scrollable Area */}
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="flex flex-col overflow-hidden min-h-0 flex-1"
                        >
                            <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6 space-y-5 sm:space-y-6">
                                
                                {/* Product Summary Card */}
                                <div className="flex items-center gap-3 sm:gap-4 rounded-xl sm:rounded-2xl bg-zinc-50/80 p-3 sm:p-3.5 ring-1 ring-inset ring-zinc-100">
                                    <img
                                        src={
                                            orderItem?.productThumbnailUrl ||
                                            "/placeholder.png"
                                        }
                                        alt={orderItem?.productName}
                                        className="h-14 w-14 sm:h-16 sm:w-16 shrink-0 rounded-lg sm:rounded-xl object-cover bg-white ring-1 ring-zinc-200/60"
                                    />
                                    <div className="min-w-0 flex-1">
                                        <h3 className="line-clamp-2 text-xs sm:text-sm font-medium text-zinc-900">
                                            {orderItem?.productName}
                                        </h3>
                                        {orderItem?.variantName && (
                                            <p className="mt-0.5 text-[11px] sm:text-xs text-zinc-400 line-clamp-1">
                                                Phân loại: {orderItem.variantName}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Star Rating Section */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="font-medium text-zinc-700">
                                            Mức độ hài lòng
                                        </span>
                                        <span className="font-medium text-amber-600 text-[11px] sm:text-xs">
                                            {ratingLabels[hoveredStar || rating]}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between gap-1 rounded-xl sm:rounded-2xl bg-zinc-50 p-1.5 sm:p-2 ring-1 ring-inset ring-zinc-100">
                                        {[1, 2, 3, 4, 5].map((star) => {
                                            const isActive = (hoveredStar || rating) >= star;
                                            return (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onMouseEnter={() => setHoveredStar(star)}
                                                    onMouseLeave={() => setHoveredStar(null)}
                                                    onClick={() => setRating(star)}
                                                    className={`group relative flex h-10 sm:h-11 flex-1 items-center justify-center rounded-lg sm:rounded-xl transition-all ${
                                                        isActive
                                                            ? "text-amber-400"
                                                            : "text-zinc-300 hover:text-zinc-400"
                                                    }`}
                                                >
                                                    <IoStar className="h-5 w-5 sm:h-6 sm:w-6 transition-transform duration-150 active:scale-125" />
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Review Content Section */}
                                <div className="space-y-1.5 sm:space-y-2">
                                    <label className="block text-xs font-medium text-zinc-700">
                                        Nội dung đánh giá
                                    </label>
                                    <div className="relative">
                                        <textarea
                                            {...register("content", {
                                                maxLength: {
                                                    value: 2000,
                                                    message: "Nội dung không quá 2000 ký tự",
                                                },
                                            })}
                                            rows={4}
                                            placeholder="Chất lượng sản phẩm thế nào? Bạn có hài lòng với dịch vụ không?"
                                            className={`w-full rounded-xl sm:rounded-2xl border bg-transparent px-3.5 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm placeholder:text-zinc-400 focus:outline-none transition-all ${
                                                errors.content
                                                    ? "border-red-300 ring-2 ring-red-100"
                                                    : "border-zinc-200 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
                                            }`}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between text-[11px] text-zinc-400">
                                        <span className="text-red-500 font-medium">
                                            {errors.content?.message}
                                        </span>
                                        <span className={watchedContent.length > 2000 ? "text-red-500 font-medium" : ""}>
                                            {watchedContent.length}/2000
                                        </span>
                                    </div>
                                </div>

                                {/* Images Upload Section */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="font-medium text-zinc-700">
                                            Hình ảnh đính kèm
                                        </span>
                                        <span className="text-zinc-400">
                                            {images.length}/5 ảnh
                                        </span>
                                    </div>

                                    {/* Responsive Grid: 3 cột trên mobile, 5 cột trên tablet/desktop */}
                                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-2.5">
                                        {/* Upload Button */}
                                        {images.length < 5 && (
                                            <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl sm:rounded-2xl border border-dashed border-zinc-300 bg-zinc-50/50 text-zinc-400 transition-all hover:border-zinc-900 hover:bg-zinc-50 hover:text-zinc-700 active:scale-95">
                                                <input
                                                    type="file"
                                                    multiple
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={handleUpload}
                                                />
                                                <IoCloudUploadOutline className="text-lg sm:text-xl" />
                                                <span className="mt-1 text-[10px] font-medium">Tải lên</span>
                                            </label>
                                        )}

                                        {/* Image Previews */}
                                        {previewImages.map((image, index) => (
                                            <div
                                                key={index}
                                                className="group relative aspect-square overflow-hidden rounded-xl sm:rounded-2xl bg-zinc-100 ring-1 ring-black/5"
                                            >
                                                <img
                                                    src={image.preview}
                                                    alt="Preview"
                                                    className="h-full w-full object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveImage(index)}
                                                    className="absolute inset-0 flex items-center justify-center bg-zinc-950/40 text-white opacity-100 sm:opacity-0 transition-opacity sm:group-hover:opacity-100"
                                                >
                                                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-red-600/80 sm:bg-transparent">
                                                        <IoTrashOutline size={16} />
                                                    </div>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Footer Actions - Fixed Bottom */}
                            <div className="flex shrink-0 items-center justify-end gap-2 sm:gap-2.5 border-t border-zinc-100 bg-zinc-50/50 px-4 py-3 sm:px-6 sm:py-4">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="rounded-full px-4 py-2 sm:px-5 sm:py-2.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-200/60 active:scale-95"
                                >
                                    Hủy bỏ
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading || isCreating}
                                    className="rounded-full bg-zinc-900 px-5 py-2 sm:px-6 sm:py-2.5 text-xs font-medium text-white shadow-sm transition-all hover:bg-zinc-800 active:scale-95 disabled:opacity-50"
                                >
                                    {isLoading || isCreating ? "Đang gửi..." : "Gửi đánh giá"}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ProductReviewModal;