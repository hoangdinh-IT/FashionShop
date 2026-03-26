import type { Product, ProductDetail } from "../features/products/types/product";
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

    createDetail: async(request: FormData): Promise<ApiResponse<ProductDetail>> => {
        const response = await apiClient.post<ApiResponse<ProductDetail>>("admin/products/detail", request, {
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

    getDetail: async(productId: string): Promise<ApiResponse<ProductDetail>> => {
        const response = await apiClient.get<ApiResponse<ProductDetail>>(`/admin/products/detail/${productId}`);
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

    updateDetail: async(productId: string, request: FormData): Promise<ApiResponse<ProductDetail>> => {
        const response = await apiClient.put<ApiResponse<ProductDetail>>(`/admin/products/detail/${productId}`, request, {
            headers: {
                'Content-Type': undefined
            },
        });
        return response.data;
    },

    delete: async(productId: string): Promise<ApiResponse<Product>> => {
        const response = await apiClient.delete<ApiResponse<Product>>(`/admin/products/${productId}`);
        return response.data;
    },

    deleteDetail: async(productId: string): Promise<ApiResponse<null>> => {
        const response = await apiClient.delete<ApiResponse<null>>(`/admin/products/detail/${productId}`);
        return response.data;
    }
}

export default productService;
