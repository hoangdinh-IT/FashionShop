import type { ProductVariant } from "../../features/admin/products/types/product";
import type { ProductVariantFormInputs, ProductVariantQueryParams } from "../../features/admin/products/types/requests";
import type { ApiResponse } from "../../models/apiResponse";
import type { PagedResult } from "../../models/PagedResult";
import apiClient from "../api.client";

const productVariantService = {
    create: async(productId: string, request: ProductVariantFormInputs): Promise<ApiResponse<ProductVariant>> => {
        const response = await apiClient.post<ApiResponse<ProductVariant>>(`/admin/products/${productId}/variants`, request);
        return response.data;
    },

    getList: async(productId: string, params: ProductVariantQueryParams): Promise<ApiResponse<PagedResult<ProductVariant>>> => {
        const response = await apiClient.get<ApiResponse<PagedResult<ProductVariant>>>(`/admin/products/${productId}/variants`, {
            params: params
        })
        return response.data;
    },

    update: async(productId: string, productVariantId: string, request: ProductVariantFormInputs): Promise<ApiResponse<ProductVariant>> => {
        const response = await apiClient.put<ApiResponse<ProductVariant>>(`/admin/products/${productId}/variants/${productVariantId}`, request);
        return response.data;
    },

    delete: async(productId: string, productVariantId: string): Promise<ApiResponse<ProductVariant>> => {
        const response = await apiClient.delete<ApiResponse<ProductVariant>>(`/admin/products/${productId}/variants/${productVariantId}`);
        return response.data;
    }
}

export default productVariantService;