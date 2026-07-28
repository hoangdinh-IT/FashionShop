import { useMutation, useQuery } from "@tanstack/react-query"
import { reviewService } from "../../../../services/shop/review.service"
import { useMutationSideEffects } from "../../../../hooks/useMutationSideEffects";
import type { UpdateReviewLike } from "../types/requests";
import { reviewLikeService } from "../../../../services/shop/reviewLike.service";

export const useReview = (productSlug?: string) => {
    const query = useQuery({
        queryKey: ["reviews", productSlug],
        queryFn: () => reviewService.getAllByProductSlug(productSlug!),
        enabled: !!productSlug,
    })

    return {
        reviews: query?.data?.data,
        isLoading: query.isLoading
    }
}

export const useReviewMutations = () => {
    const createSideEffects = useMutationSideEffects();

    const createMutation = useMutation({
        mutationFn: (request: FormData) => reviewService.create(request),
        ...createSideEffects({
            successMessage: "Đánh giá sản phẩm thành công!",
            errorMessage: "Đánh giá sản phẩm thất bại!",
            invalidateKeys: [["reviews"]],
        }),
    })

    return {
        createReview: createMutation.mutate,
        isCreating: createMutation.isPending,
    }
}

export const useReviewLikeMutations = () => {
    const createSideEffects = useMutationSideEffects();

    const updateReviewLike = useMutation({
        mutationFn: (request: UpdateReviewLike) => reviewLikeService.update(request),
        ...createSideEffects({
            successMessage: "",
            errorMessage: "",
            invalidateKeys: [["reviews"]],
        }),
    })

    return {
        updateReviewLike: updateReviewLike.mutate,
        isUpdating: updateReviewLike.isPending,
    }
}