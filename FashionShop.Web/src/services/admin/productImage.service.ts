import type { ProductImage } from "../../features/admin/products/types/product";
import type { DeleteProductImagesRequest, UpdateSortOrderRequest } from "../../features/admin/products/types/requests";
import type { ApiResponse } from "../../models/apiResponse";
import apiClient from "../api.client";

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
    },

    updateSortOrder: async(productId: string, request: UpdateSortOrderRequest): Promise<ApiResponse<ProductImage[]>> => {
        const response = await apiClient.put<ApiResponse<ProductImage[]>>(`/admin/products/${productId}/images/sortOrder`, request);
        return response.data;
    },

    delete: async(productId: string, request?: DeleteProductImagesRequest): Promise<ApiResponse<null>> => {
        const response = await apiClient.delete<ApiResponse<null>>(`/admin/products/${productId}/images`, {
            data: request
        });
        return response.data;
    }
}

export default productImageService;