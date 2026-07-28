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

interface ProductReviewDialogProps {
    isOpen: boolean;
    onClose: () => void;
    orderItem?: OrderItemSummary;
    isLoading?: boolean;
    onSuccess?: () => void;
}

const ProductReviewDialog: React.FC<ProductReviewDialogProps> = ({
    isOpen,
    onClose,
    orderItem,
    isLoading,
    onSuccess,
}) => {
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
    };

    const handleRemoveImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    const resetDialogState = () => {
        reset();
        setImages([]);
        setRating(5);
        setHoveredStar(null);
    };

    useEffect(() => {
        if (!isOpen) {
            resetDialogState();
        }
    }, [isOpen]);

    const handleClose = () => {
        resetDialogState();
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

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[999] flex items-center justify-center bg-black/45 p-3 backdrop-blur-md"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 12, scale: 0.97 }}
                        transition={{ duration: 0.22 }}
                        className="relative w-full max-w-[760px] overflow-hidden rounded-[28px] border border-zinc-200 bg-white shadow-[0_25px_80px_rgba(0,0,0,0.10)]"
                    >
                        {/* BACKGROUND */}
                        <div className="pointer-events-none absolute inset-0 overflow-hidden">
                            <div className="absolute right-[-40px] top-[-80px] h-[180px] w-[180px] rounded-full bg-indigo-100/40 blur-[80px]" />

                            <div className="absolute bottom-[-80px] left-[-40px] h-[180px] w-[180px] rounded-full bg-zinc-100 blur-[80px]" />
                        </div>

                        {/* HEADER */}
                        <div className="relative border-b border-zinc-100 px-5 py-4">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="mb-1.5 text-[9px] font-black uppercase tracking-[0.32em] text-zinc-400">
                                        Product Review
                                    </p>

                                    <h2 className="text-xl font-black italic tracking-tight text-zinc-900 md:text-2xl">
                                        ĐÁNH GIÁ SẢN PHẨM
                                    </h2>
                                </div>

                                <button
                                    onClick={handleClose}
                                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 transition-all duration-300 hover:bg-zinc-900 hover:text-white"
                                >
                                    <IoClose size={17} />
                                </button>
                            </div>
                        </div>

                        {/* BODY */}
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="relative max-h-[72vh] overflow-y-auto px-5 py-5">
                                {/* PRODUCT */}
                                <div className="flex items-center gap-4 rounded-[24px] border border-zinc-100 bg-zinc-50/70 p-4">
                                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-zinc-100 bg-white">
                                        <img
                                            src={
                                                orderItem?.productThumbnailUrl ||
                                                "/placeholder.png"
                                            }
                                            alt={orderItem?.productName}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <h3 className="line-clamp-2 text-[15px] font-bold tracking-tight text-zinc-900">
                                            {orderItem?.productName}
                                        </h3>

                                        {orderItem?.variantName && (
                                            <p className="mt-2 text-[9px] font-black uppercase tracking-[0.22em] text-zinc-400">
                                                {orderItem.variantName}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* RATING */}
                                <div className="mt-6">
                                    <div className="mb-3 flex items-center justify-between">
                                        <div>
                                            <p className="mb-1 text-[9px] font-black uppercase tracking-[0.28em] text-zinc-400">
                                                Rating
                                            </p>

                                            <h4 className="text-[15px] font-bold tracking-tight text-zinc-900">
                                                Chất lượng sản phẩm
                                            </h4>
                                        </div>

                                        <div className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-bold text-zinc-900">
                                            {rating}.0 / 5
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => {
                                            const active =
                                                (hoveredStar || rating) >= star;

                                            return (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onMouseEnter={() =>
                                                        setHoveredStar(star)
                                                    }
                                                    onMouseLeave={() =>
                                                        setHoveredStar(null)
                                                    }
                                                    onClick={() =>
                                                        setRating(star)
                                                    }
                                                    className={`flex h-11 w-11 items-center justify-center rounded-2xl border transition-all duration-300 ${
                                                        active
                                                            ? "border-amber-200 bg-amber-50 text-amber-500 shadow-[0_8px_24px_rgba(251,191,36,0.12)]"
                                                            : "border-zinc-200 bg-white text-zinc-300 hover:border-zinc-300"
                                                    }`}
                                                >
                                                    <IoStar size={19} />
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* CONTENT */}
                                <div className="mt-6">
                                    <div className="mb-3">
                                        <p className="mb-1 text-[9px] font-black uppercase tracking-[0.28em] text-zinc-400">
                                            Review Content
                                        </p>

                                        <h4 className="text-[15px] font-bold tracking-tight text-zinc-900">
                                            Chia sẻ trải nghiệm
                                        </h4>
                                    </div>

                                    <textarea
                                        {...register("content", {
                                            maxLength: {
                                                value: 2000,
                                                message: "Nội dung không được vượt quá 2000 ký tự!",
                                            },
                                        })}
                                        rows={5}
                                        placeholder="Sản phẩm có tốt không? Đúng mô tả chứ?"
                                        className={`w-full resize-none rounded-[24px] border border-transparent bg-zinc-50 px-5 py-4 text-[14px] leading-relaxed outline-none transition-all placeholder:text-zinc-300 text-zinc-700 ${
                                            errors.content
                                                ? "ring-2 ring-red-500 bg-red-50"
                                                : "focus:bg-white focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900"
                                        }`}
                                    />

                                    <div className="mt-1 flex justify-between">
                                        <span className="min-h-[18px] text-[11px] font-medium text-red-500">
                                            {errors.content?.message}
                                        </span>

                                        <span
                                            className={`text-[11px] ${
                                                watchedContent.length > 2000
                                                    ? "font-bold text-red-500"
                                                    : "text-zinc-400"
                                            }`}
                                        >
                                            {watchedContent.length}/2000
                                        </span>
                                    </div>
                                </div>

                                {/* IMAGES */}
                                <div className="mt-6">
                                    <div className="mb-3 flex items-center justify-between">
                                        <div>
                                            <p className="mb-1 text-[9px] font-black uppercase tracking-[0.28em] text-zinc-400">
                                                Upload Images
                                            </p>

                                            <h4 className="text-[15px] font-bold tracking-tight text-zinc-900">
                                                Hình ảnh sản phẩm
                                            </h4>
                                        </div>

                                        <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-[10px] font-semibold text-zinc-500">
                                            {images.length}/5 ảnh
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
                                        {/* UPLOAD */}
                                        {images.length < 5 && (
                                            <label className="group relative flex aspect-square cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[20px] border border-dashed border-zinc-300 bg-zinc-50 transition-all duration-300 hover:border-zinc-900 hover:bg-white">
                                                <input
                                                    type="file"
                                                    multiple
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={handleUpload}
                                                />

                                                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-500 transition-all duration-300 group-hover:bg-zinc-900 group-hover:text-white">
                                                    <IoCloudUploadOutline
                                                        size={18}
                                                    />
                                                </div>

                                                <span className="mt-2 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500">
                                                    Upload
                                                </span>
                                            </label>
                                        )}

                                        {/* PREVIEW */}
                                        {previewImages.map((image, index) => (
                                            <div
                                                key={index}
                                                className="group relative aspect-square overflow-hidden rounded-[20px] border border-zinc-100 bg-zinc-100"
                                            >
                                                <img
                                                    src={image.preview}
                                                    alt="preview"
                                                    className="h-full w-full object-cover"
                                                />

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleRemoveImage(index)
                                                    }
                                                    className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white opacity-0 backdrop-blur-md transition-all duration-300 group-hover:opacity-100"
                                                >
                                                    <IoTrashOutline size={13} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* FOOTER */}
                            <div className="relative flex flex-col-reverse items-center justify-between gap-3 border-t border-zinc-100 bg-white/90 px-5 py-4 backdrop-blur-xl sm:flex-row">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="h-10 w-full rounded-full border border-zinc-200 bg-white px-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 transition-all duration-300 hover:bg-zinc-100 sm:w-auto"
                                >
                                    Hủy bỏ
                                </button>

                                <button
                                    type="submit"
                                    disabled={isLoading || isCreating}
                                    className="h-10 w-full rounded-full bg-zinc-900 px-7 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-[0_12px_32px_rgba(0,0,0,0.16)] transition-all duration-300 hover:bg-black disabled:opacity-50 sm:w-auto"
                                >
                                    {isLoading || isCreating
                                        ? "Đang xử lý..."
                                        : "Gửi đánh giá"}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ProductReviewDialog;