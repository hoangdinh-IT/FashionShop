import type { Review } from "../../features/shop/reviews/types/review";
import type { ApiResponse } from "../../models/apiResponse";
import apiClient from "../api.client";

export const reviewService = {
    create: async(request: FormData): Promise<ApiResponse<Review>> => {
        const response = await apiClient.post<ApiResponse<Review>>("/shop/reviews", request, {
            headers: {
                'Content-Type': undefined
            },
        });
        return response.data;
    },

    getAllByProductSlug: async(productSlug: string): Promise<ApiResponse<Review[]>> => {
        const response = await apiClient.get<ApiResponse<Review[]>>(`/shop/reviews/${productSlug}`);
        return response.data;
    }
}