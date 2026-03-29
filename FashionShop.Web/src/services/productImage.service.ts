import type { ProductImage } from "../features/products/types/product";
import type { ApiResponse } from "../models/apiResponse";
import apiClient from "./api.client";

const productImageService = {
    create: async(productId: string, request: FormData): Promise<ApiResponse<ProductImage>> => {
        const response = await apiClient.post<ApiResponse<ProductImage>>(`/admin/products/${productId}/images`, request, {
            headers: { 'Content-Type': undefined },
        });
        return response.data;
    },

    getList: async(productId: string): Promise<ApiResponse<ProductImage[]>> => {
        const response = await apiClient.get<ApiResponse<ProductImage[]>>(`/admin/products/${productId}/images`);
        return response.data;
    }
}

export default productImageService;