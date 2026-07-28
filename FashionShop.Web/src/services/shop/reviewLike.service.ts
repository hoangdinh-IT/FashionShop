import type { UpdateReviewLike } from "../../features/shop/reviews/types/requests";
import type { ReviewLike } from "../../features/shop/reviews/types/review";
import apiClient from "../api.client";

export const reviewLikeService = {
    update: async(request: UpdateReviewLike): Promise<ReviewLike> => {
        const response = await apiClient.put<ReviewLike>("/shop/review-likes", request);
        return response.data;
    }
}