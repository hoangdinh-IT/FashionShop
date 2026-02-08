import type { Product } from "../features/products/types/product";
import type { ProductQueryParams } from "../features/products/types/requests";
import type { ApiResponse } from "../models/apiResponse";
import type { PagedResult } from "../models/PagedResult";
import apiClient from "./api.client";

const productService = {
    create: async(request: FormData): Promise<ApiResponse<Product>> => {
        const response = await apiClient.post<ApiResponse<Product>>("/admin/products", request, {
            headers: {
                'Content-Type': undefined
            },
        });
        return response.data;
    },

    getList: async(params: ProductQueryParams): Promise<ApiResponse<PagedResult<Product>>> => {
        const response = await apiClient.get<ApiResponse<PagedResult<Product>>>("/admin/products", {
            params: params
        });
        return response.data;
    },

    update: async(productId: string, request: FormData): Promise<ApiResponse<Product>> => {
        const response = await apiClient.put<ApiResponse<Product>>(`/admin/products/${productId}`, request, {
            headers: {
                'Content-Type': undefined
            },
        });
        return response.data;
    },

    delete: async(productId: string): Promise<ApiResponse<Product>> => {
        const response = await apiClient.delete<ApiResponse<Product>>(`/admin/products/${productId}`);
        return response.data;
    }
}

export default productService;
