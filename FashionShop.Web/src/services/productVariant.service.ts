import type { ProductVariant } from "../features/products/types/product";
import type { ProductVariantFormInputs, ProductVariantQueryParams } from "../features/products/types/requests";
import type { ApiResponse } from "../models/apiResponse";
import type { PagedResult } from "../models/PagedResult";
import apiClient from "./api.client";

const productVariantService = {
    create: async(request: ProductVariantFormInputs): Promise<ApiResponse<ProductVariant>> => {
        const response = await apiClient.post<ApiResponse<ProductVariant>>("/admin/product-variants", request);
        return response.data;
    },

    getList: async(params: ProductVariantQueryParams): Promise<ApiResponse<PagedResult<ProductVariant>>> => {
        const response = await apiClient.get<ApiResponse<PagedResult<ProductVariant>>>("/admin/product-variants", {
            params: params
        })
        return response.data;
    },

    update: async(productVariantId: string, request: ProductVariantFormInputs): Promise<ApiResponse<ProductVariant>> => {
        const response = await apiClient.put<ApiResponse<ProductVariant>>(`/admin/product-variants/${productVariantId}`, request);
        return response.data;
    },

    delete: async(productVariantId: string): Promise<ApiResponse<ProductVariant>> => {
        const response = await apiClient.delete<ApiResponse<ProductVariant>>(`/admin/product-variants/${productVariantId}`);
        return response.data;
    }
}

export default productVariantService;