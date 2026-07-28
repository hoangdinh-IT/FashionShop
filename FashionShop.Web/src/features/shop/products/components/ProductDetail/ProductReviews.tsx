import { Clock3, Heart, Star } from "lucide-react";
import { useState } from "react";
import { useReview, useReviewLikeMutations } from "../../../reviews/hooks/useReview";
import type { Review, ReviewLike } from "../../../reviews/types/review";
import { useAuth } from "../../../../../contexts";


// Mở rộng Type Review tại chỗ để khớp 100% với ShopReviewResponse từ BE trả về
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
    return parsed.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const formatReviewTime = (date?: string | Date) => {
    if (!date) return "";
    const parsed = new Date(date);
    return parsed.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
    });
};

const ProductReviews = ({ productSlug }: Props) => {
    const { reviews, isLoading } = useReview(productSlug);
    const { updateReviewLike, isUpdating } = useReviewLikeMutations();

    // Lấy thông tin user đang đăng nhập
    const { user: currentUser } = useAuth();

    // Local State cho Optimistic Update UI
    const [optimisticLikes, setOptimisticLikes] = useState<
        Record<string, { isLiked: boolean; totalLikes: number }>
    >({});

    const reviewList = (reviews as ReviewWithLike[]) || [];
    const reviewCount = reviewList.length;

    const averageRating = reviewCount
        ? reviewList.reduce((sum, review) => sum + review.rating, 0) / reviewCount
        : 0;

    const sortedReviews = [...reviewList].sort(
        (a, b) =>
            new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
    );

    const handleToggleLike = (review: ReviewWithLike) => {
        // 1. Chặn nếu là tác giả hoặc đang trong quá trình gọi API
        const isOwner = currentUser?.id && currentUser.id === review.userId;
        if (isOwner || isUpdating) return;

        // 2. Lấy thông tin like hiện tại (Ưu tiên từ Local State -> rồi mới đến Response từ BE)
        const currentOpt = optimisticLikes[review.reviewId];
        const currentIsLiked = currentOpt ? currentOpt.isLiked : Boolean(review.isLiked);
        const currentTotalLikes = currentOpt ? currentOpt.totalLikes : (review.totalLikes ?? 0);

        // 3. Tính toán trạng thái mới
        const nextIsLiked = !currentIsLiked;
        const nextTotalLikes = nextIsLiked
            ? currentTotalLikes + 1
            : Math.max(0, currentTotalLikes - 1);

        // 4. Optimistic Update: Cập nhật UI lập tức
        setOptimisticLikes((prev) => ({
            ...prev,
            [review.reviewId]: {
                isLiked: nextIsLiked,
                totalLikes: nextTotalLikes,
            },
        }));

        // 5. Gửi Request lên Backend
        updateReviewLike(
            { reviewId: review.reviewId },
            {
                onSuccess: (data: ReviewLike) => {
                    if (data && data.reviewId) {
                        // Đồng bộ dữ liệu chính xác trả về từ BE
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
                    // Revert lại trạng thái cũ nếu API báo lỗi
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
        <section className="mt-16">
            {/* Header Overview */}
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.32em] text-zinc-400">
                        Customer Feedback
                    </span>
                    <h2 className="mt-4 text-[34px] font-black leading-none tracking-[-0.06em] text-zinc-950">
                        ĐÁNH GIÁ SẢN PHẨM
                    </h2>
                    <p className="mt-4 max-w-xl text-sm leading-7 text-zinc-500">
                        Những chia sẻ thực tế từ khách hàng đã trải nghiệm sản phẩm.
                    </p>
                </div>

                {/* Rating Card */}
                <div className="flex items-center gap-5 rounded-[32px] border border-zinc-200 bg-white px-6 py-5 shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-zinc-400">
                            Average Rating
                        </p>
                        <div className="mt-3 flex items-end gap-3">
                            <span className="text-[44px] font-black leading-none tracking-[-0.08em] text-zinc-950">
                                {averageRating ? averageRating.toFixed(1) : "0.0"}
                            </span>
                            <div className="pb-1">
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: 5 }).map((_, index) => (
                                        <Star
                                            key={index}
                                            size={14}
                                            className={
                                                index < Math.round(averageRating)
                                                    ? "fill-zinc-900 text-zinc-900"
                                                    : "text-zinc-300"
                                            }
                                        />
                                    ))}
                                </div>
                                <p className="mt-1 text-[11px] uppercase tracking-[0.25em] text-zinc-400">
                                    {reviewCount} reviews
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reviews List */}
            <div className="mt-10">
                {isLoading ? (
                    <div className="rounded-[32px] border border-zinc-200 bg-zinc-50 px-6 py-12 text-center text-sm text-zinc-500">
                        Đang tải đánh giá...
                    </div>
                ) : reviewCount === 0 ? (
                    <div className="rounded-[32px] border border-dashed border-zinc-200 bg-zinc-50 px-6 py-14 text-center">
                        <p className="text-sm font-medium text-zinc-500">
                            Chưa có đánh giá cho sản phẩm này.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {sortedReviews.map((review: ReviewWithLike) => {
                            // Check người dùng hiện tại có phải tác giả review không
                            const isOwner = Boolean(
                                currentUser?.id && currentUser.id === review.userId
                            );

                            // Tách thông tin Like từ Optimistic state hoặc từ Response Backend
                            const opt = optimisticLikes[review.reviewId];
                            const isLiked = opt ? opt.isLiked : Boolean(review.isLiked);
                            const totalLikes = opt ? opt.totalLikes : (review.totalLikes ?? 0);

                            return (
                                <article
                                    key={review.reviewId}
                                    className="group rounded-[32px] border border-zinc-200 bg-white p-6 transition-all duration-300 hover:border-zinc-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.05)]"
                                >
                                    {/* Top Header Card */}
                                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100">
                                                <img
                                                    src={
                                                        review.avatar ||
                                                        "https://ui-avatars.com/api/?name=User&background=18181b&color=fff"
                                                    }
                                                    alt={review.fullname}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-bold text-zinc-950">
                                                    {review.fullname}
                                                </h3>
                                                <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-zinc-400">
                                                    <span>{formatReviewDate(review.createdDate)}</span>
                                                    <div className="flex items-center gap-1">
                                                        <Clock3 size={11} />
                                                        <span>{formatReviewTime(review.createdDate)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Badge Rating */}
                                        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2">
                                            <Star size={14} className="fill-zinc-900 text-zinc-900" />
                                            <span className="text-xs font-bold tracking-[0.15em] text-zinc-900">
                                                {review.rating.toFixed(1)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Body Content */}
                                    <div className="mt-5">
                                        <p className="text-[15px] leading-8 text-zinc-600">
                                            {review.content || "Người dùng chưa để lại nhận xét."}
                                        </p>
                                    </div>

                                    {/* Images Attachment */}
                                    {review.reviewImages && review.reviewImages.length > 0 && (
                                        <div className="mt-6 grid grid-cols-3 gap-2 sm:grid-cols-5">
                                            {review.reviewImages.map((image) => (
                                                <div
                                                    key={image.reviewImageId}
                                                    className="aspect-square overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100"
                                                >
                                                    <img
                                                        src={image.imageUrl}
                                                        alt="Review detail"
                                                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Footer - Nút Thích / Bỏ thích */}
                                    <div className="mt-6 flex items-center gap-3">
                                        <button
                                            type="button"
                                            disabled={isUpdating || isOwner}
                                            onClick={() => handleToggleLike(review)}
                                            className={`group/btn flex items-center gap-2 rounded-full px-3 py-1.5 transition-all focus:outline-none ${isOwner
                                                    ? "cursor-not-allowed opacity-75 bg-zinc-50"
                                                    : "hover:bg-zinc-100 active:scale-95 disabled:opacity-50"
                                                }`}
                                            title={
                                                isOwner
                                                    ? "Bạn không thể tự thích đánh giá của chính mình"
                                                    : isLiked
                                                        ? "Bỏ thích"
                                                        : "Thích"
                                            }
                                        >
                                            <Heart
                                                size={18}
                                                className={`transition-all duration-300 ${isLiked
                                                        ? "fill-red-500 text-red-500 scale-110"
                                                        : "fill-none text-zinc-400 group-hover/btn:text-red-500"
                                                    }`}
                                            />

                                            <span
                                                className={`text-xs font-semibold tracking-wide ${isLiked ? "text-red-500" : "text-zinc-600"
                                                    }`}
                                            >
                                                {totalLikes} lượt thích
                                            </span>
                                        </button>

                                        {/* Tag hiển thị khi là bài review của chính người dùng này */}
                                        {isOwner && (
                                            <span className="text-[10px] font-medium text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-md">
                                                Đánh giá của bạn
                                            </span>
                                        )}
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
};

export default ProductReviews;