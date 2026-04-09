import type { Brand } from "../../features/shop/brands/types/brand";
import type { Category } from "../../features/shop/categories/types/category";
import type { ApiResponse } from "../../models/apiResponse";
import apiClient from "../api.client";

export const brandService = {
    getAll: async(): Promise<ApiResponse<Brand[]>> => {
        const response = await apiClient.get<ApiResponse<Brand[]>>("/shop/brands");
        return response.data;
    },

    getCategories: async(brandId: string): Promise<ApiResponse<Category[]>> => {
        const response = await apiClient.get<ApiResponse<Category[]>>(`/shop/brands/${brandId}/categories`);
        return response.data;
    }
}