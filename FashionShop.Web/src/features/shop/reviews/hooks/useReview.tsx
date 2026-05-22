import { useMutation, useQuery } from "@tanstack/react-query"
import { reviewService } from "../../../../services/shop/review.service"
import { useMutationSideEffects } from "../../../../hooks/useMutationSideEffects";

export const useReview = (productSlug: string) => {
    const query = useQuery({
        queryKey: ["reviews"],
        queryFn: () => reviewService.getAllByProductSlug(productSlug),
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
            successMessage: "Thêm đánh giá thành công!",
            errorMessage: "Thêm đánh giá thất bại!",
            invalidateKeys: [["reviews"]],
        }),
    })

    return {
        createReview: createMutation.mutate,
        isCreating: createMutation.isPending,
    }
}