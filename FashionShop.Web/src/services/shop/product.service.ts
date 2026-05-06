import type { FilterOptionsResponse, ProductDetail, ProductGridItem } from "../../features/shop/products/types/product";
import type { FilterOptionsRequest, ProductCollectionsQueryParams, ProductQueryParams } from "../../features/shop/products/types/requests";
import type { ApiResponse } from "../../models/apiResponse";
import type { PagedResult } from "../../models/PagedResult";
import apiClient from "../api.client";

export const productService = {
    getPaged: async(params: ProductQueryParams): Promise<ApiResponse<PagedResult<ProductGridItem>>> => {
        const response = await apiClient.get<ApiResponse<PagedResult<ProductGridItem>>>("/shop/products", {
            params: params
        });
        return response.data;
    },

    getCollection: async(params: ProductCollectionsQueryParams): Promise<ApiResponse<ProductGridItem[]>> => {
        const response = await apiClient.get<ApiResponse<ProductGridItem[]>>("/shop/products/collection", {
            params: params
        });
        return response.data;
    },

    getFilterOptions: async(params: FilterOptionsRequest): Promise<ApiResponse<FilterOptionsResponse>> => {
        const response = await apiClient.get<ApiResponse<FilterOptionsResponse>>("/shop/products/filter-options", {
            params: params
        });
        return response.data;
    },

    getDetail: async(productSlug: string): Promise<ApiResponse<ProductDetail>> => {
        const response = await apiClient.get(`/shop/products/${productSlug}`);
        return response.data;
    }
}