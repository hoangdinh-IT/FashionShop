import { Clock3, Heart, Star, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useMemo, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReview, useReviewLikeMutations } from "../../../reviews/hooks/useReview";
import type { Review, ReviewLike } from "../../../reviews/types/review";
import { useAuth } from "../../../../../contexts";

interface ReviewWithLike extends Review {
    isLiked?: boolean;
    totalLikes?: number;
}

interface Props {
    productSlug?: string;
}

const formatReviewDate = (date?: string | Date) => {
    if (!date) return "";
    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) return "";
    return parsed.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
};

const formatReviewTime = (date?: string | Date) => {
    if (!date) return "";
    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) return "";
    return parsed.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
    });
};

const ProductReviews = ({ productSlug }: Props) => {
    const { reviews, isLoading } = useReview(productSlug);
    const { updateReviewLike, isUpdating } = useReviewLikeMutations();
    const { user: currentUser } = useAuth();

    const [optimisticLikes, setOptimisticLikes] = useState<
        Record<string, { isLiked: boolean; totalLikes: number }>
    >({});

    // State quản lý Lightbox
    const [lightboxImage, setLightboxImage] = useState<{
        reviewId: string;
        index: number;
    } | null>(null);

    const reviewList = useMemo(() => (reviews as ReviewWithLike[]) || [], [reviews]);
    const reviewCount = reviewList.length;

    const averageRating = useMemo(() => {
        if (!reviewCount) return 0;
        return reviewList.reduce((sum, review) => sum + (review.rating || 0), 0) / reviewCount;
    }, [reviewList, reviewCount]);

    const sortedReviews = useMemo(() => {
        return [...reviewList].sort((a, b) => {
            const dateA = a.createdDate ? new Date(a.createdDate).getTime() : 0;
            const dateB = b.createdDate ? new Date(b.createdDate).getTime() : 0;
            return dateB - dateA;
        });
    }, [reviewList]);

    // Lấy thông tin review & ảnh đang active trong lightbox
    const activeReview = useMemo(() => {
        if (!lightboxImage) return null;
        return sortedReviews.find((r) => r.reviewId === lightboxImage.reviewId);
    }, [lightboxImage, sortedReviews]);

    const activeImages = useMemo(() => activeReview?.reviewImages || [], [activeReview]);
    const currentLightboxImage = activeImages[lightboxImage?.index ?? 0];

    const handlePrevImage = useCallback(() => {
        if (!lightboxImage || activeImages.length <= 1) return;
        setLightboxImage((prev) => {
            if (!prev) return null;
            const newIndex = (prev.index - 1 + activeImages.length) % activeImages.length;
            return { ...prev, index: newIndex };
        });
    }, [lightboxImage, activeImages.length]);

    const handleNextImage = useCallback(() => {
        if (!lightboxImage || activeImages.length <= 1) return;
        setLightboxImage((prev) => {
            if (!prev) return null;
            const newIndex = (prev.index + 1) % activeImages.length;
            return { ...prev, index: newIndex };
        });
    }, [lightboxImage, activeImages.length]);

    // Bắt sự kiện phím Escape & phím mũi tên khi Lightbox mở
    useEffect(() => {
        if (!lightboxImage) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setLightboxImage(null);
            } else if (e.key === "ArrowLeft") {
                handlePrevImage();
            } else if (e.key === "ArrowRight") {
                handleNextImage();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [lightboxImage, handlePrevImage, handleNextImage]);

    const handleToggleLike = (review: ReviewWithLike) => {
        const isOwner = Boolean(currentUser?.id && currentUser.id === review.userId);
        if (isOwner || isUpdating) return;

        const currentOpt = optimisticLikes[review.reviewId];
        const currentIsLiked = currentOpt ? currentOpt.isLiked : Boolean(review.isLiked);
        const currentTotalLikes = currentOpt ? currentOpt.totalLikes : (review.totalLikes ?? 0);

        const nextIsLiked = !currentIsLiked;
        const nextTotalLikes = nextIsLiked
            ? currentTotalLikes + 1
            : Math.max(0, currentTotalLikes - 1);

        setOptimisticLikes((prev) => ({
            ...prev,
            [review.reviewId]: {
                isLiked: nextIsLiked,
                totalLikes: nextTotalLikes,
            },
        }));

        updateReviewLike(
            { reviewId: review.reviewId },
            {
                onSuccess: (data: ReviewLike) => {
                    if (data && data.reviewId) {
                        setOptimisticLikes((prev) => ({
                            ...prev,
                            [data.reviewId]: {
                                isLiked: data.isLiked,
                                totalLikes: data.totalLikes,
                            },
                        }));
                    }
                },
                onError: () => {
                    // Rollback nếu API thất bại
                    setOptimisticLikes((prev) => ({
                        ...prev,
                        [review.reviewId]: {
                            isLiked: currentIsLiked,
                            totalLikes: currentTotalLikes,
                        },
                    }));
                },
            }
        );
    };

    return (
        <section className="mt-16 border-t border-zinc-200/80 pt-12">
            {/* HEADER OVERVIEW */}
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-zinc-900" />
                        <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-500">
                            Khách hàng đánh giá
                        </span>
                    </div>
                    <h2 className="mt-2 text-2xl font-black tracking-tight text-zinc-900 md:text-3xl">
                        Đánh giá sản phẩm
                    </h2>
                </div>

                {/* RATING SUMMARY CARD */}
                <div className="flex items-center gap-4 rounded-2xl border border-zinc-200/80 bg-zinc-50/50 p-4 shadow-2xs">
                    <div className="flex flex-col items-center border-r border-zinc-200/80 pr-4">
                        <span className="text-3xl font-black text-zinc-900">
                            {averageRating ? averageRating.toFixed(1) : "0.0"}
                        </span>
                        <div className="mt-1 flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <Star
                                    key={index}
                                    size={12}
                                    className={
                                        index < Math.round(averageRating)
                                            ? "fill-zinc-900 text-zinc-900"
                                            : "text-zinc-300"
                                    }
                                />
                            ))}
                        </div>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-zinc-900">
                            {reviewCount} nhận xét
                        </p>
                        <p className="mt-0.5 text-[11px] text-zinc-500">
                            Từ khách hàng đã mua hàng
                        </p>
                    </div>
                </div>
            </div>

            {/* REVIEWS LIST */}
            <div className="mt-8">
                {isLoading ? (
                    <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/50 py-12 text-center text-xs font-medium text-zinc-500">
                        Đang tải đánh giá...
                    </div>
                ) : reviewCount === 0 ? (
                    <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/50 py-12 text-center">
                        <p className="text-xs font-medium text-zinc-500">
                            Chưa có đánh giá nào cho sản phẩm này.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {sortedReviews.map((review: ReviewWithLike) => {
                            const isOwner = Boolean(
                                currentUser?.id && currentUser.id === review.userId
                            );

                            const opt = optimisticLikes[review.reviewId];
                            const isLiked = opt ? opt.isLiked : Boolean(review.isLiked);
                            const totalLikes = opt ? opt.totalLikes : (review.totalLikes ?? 0);

                            return (
                                <article
                                    key={review.reviewId}
                                    className="group rounded-2xl border border-zinc-200/80 bg-white p-5 transition-all hover:border-zinc-300 hover:shadow-xs"
                                >
                                    {/* CARD HEADER */}
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={
                                                    review.avatar ||
                                                    "https://ui-avatars.com/api/?name=User&background=18181b&color=fff"
                                                }
                                                alt={review.fullname || "User"}
                                                className="h-10 w-10 rounded-full border border-zinc-200/80 object-cover"
                                            />
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="text-xs font-bold text-zinc-900">
                                                        {review.fullname || "Khách hàng"}
                                                    </h3>
                                                    {isOwner && (
                                                        <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium text-zinc-500">
                                                            Bạn
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="mt-1 flex items-center gap-2 text-[11px] text-zinc-400">
                                                    <span>{formatReviewDate(review.createdDate)}</span>
                                                    <span>•</span>
                                                    <div className="flex items-center gap-1">
                                                        <Clock3 size={10} />
                                                        <span>{formatReviewTime(review.createdDate)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* RATING BADGE */}
                                        <div className="flex items-center gap-1 rounded-lg bg-zinc-100 px-2 py-1">
                                            <Star size={12} className="fill-zinc-900 text-zinc-900" />
                                            <span className="text-xs font-bold text-zinc-900">
                                                {(review.rating || 0).toFixed(1)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* REVIEW CONTENT */}
                                    <div className="mt-3">
                                        <p className="text-xs leading-relaxed text-zinc-600">
                                            {review.content || "Người dùng chưa để lại nhận xét."}
                                        </p>
                                    </div>

                                    {/* REVIEW IMAGES */}
                                    {review.reviewImages && review.reviewImages.length > 0 && (
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {review.reviewImages.map((image, imgIdx) => (
                                                <div
                                                    key={image.reviewImageId || imgIdx}
                                                    onClick={() =>
                                                        setLightboxImage({
                                                            reviewId: review.reviewId,
                                                            index: imgIdx,
                                                        })
                                                    }
                                                    className="h-16 w-16 cursor-pointer overflow-hidden rounded-xl border border-zinc-200/80 bg-zinc-50 transition-transform active:scale-95"
                                                >
                                                    <img
                                                        src={image.imageUrl}
                                                        alt="Review attachment"
                                                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* FOOTER ACTIONS */}
                                    <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-3">
                                        <button
                                            type="button"
                                            disabled={isUpdating || isOwner}
                                            onClick={() => handleToggleLike(review)}
                                            className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-medium transition-all ${
                                                isLiked
                                                    ? 'border-red-200 bg-red-50 text-red-600'
                                                    : 'border-zinc-200/80 text-zinc-600 hover:bg-zinc-50'
                                            } ${isOwner ? 'cursor-not-allowed opacity-60' : 'active:scale-95'}`}
                                            title={
                                                isOwner
                                                    ? "Không thể thích bài viết của chính mình"
                                                    : isLiked
                                                    ? "Bỏ thích"
                                                    : "Thích"
                                            }
                                        >
                                            <Heart
                                                size={13}
                                                className={
                                                    isLiked
                                                        ? "fill-red-500 text-red-500"
                                                        : "text-zinc-400"
                                                }
                                            />
                                            <span>{totalLikes} Lượt thích</span>
                                        </button>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* LIGHTBOX MODAL BẰNG FRAMER MOTION */}
            <AnimatePresence>
                {lightboxImage && currentLightboxImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
                        onClick={() => setLightboxImage(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            className="relative flex max-h-[90vh] max-w-5xl flex-col items-center justify-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Nút đóng Lightbox */}
                            <button
                                type="button"
                                onClick={() => setLightboxImage(null)}
                                className="absolute -top-12 right-0 cursor-pointer rounded-full bg-white/10 p-2 text-white transition-all hover:bg-white/25 active:scale-90"
                            >
                                <X size={20} />
                            </button>

                            {/* Ảnh hiển thị */}
                            <div className="overflow-hidden rounded-2xl bg-black/40 shadow-2xl">
                                <AnimatePresence mode="wait">
                                    <motion.img
                                        key={currentLightboxImage.reviewImageId || lightboxImage.index}
                                        src={currentLightboxImage.imageUrl}
                                        alt="Zoomed review attachment"
                                        initial={{ opacity: 0, scale: 0.96 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.96 }}
                                        transition={{ duration: 0.2 }}
                                        className="max-h-[80vh] max-w-full select-none object-contain"
                                    />
                                </AnimatePresence>
                            </div>

                            {/* Nút chuyển ảnh Next/Prev */}
                            {activeImages.length > 1 && (
                                <>
                                    <button
                                        type="button"
                                        onClick={handlePrevImage}
                                        className="absolute left-2 top-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-white/10 p-3 text-white backdrop-blur-md transition-all hover:bg-white/25 active:scale-90 sm:-left-14"
                                    >
                                        <ChevronLeft size={22} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleNextImage}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-white/10 p-3 text-white backdrop-blur-md transition-all hover:bg-white/25 active:scale-90 sm:-right-14"
                                    >
                                        <ChevronRight size={22} />
                                    </button>

                                    {/* Chỉ số ảnh (Ví dụ: 1 / 3) */}
                                    <div className="absolute -bottom-8 text-xs font-medium tracking-wider text-zinc-300">
                                        {lightboxImage.index + 1} / {activeImages.length}
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default ProductReviews;