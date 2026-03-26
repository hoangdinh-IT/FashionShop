import type { ApiResponse } from "../models/apiResponse";
import apiClient from "./api.client";
import type { CategoryQueryParams } from "../features/categories/types/requests";
import type { PagedResult } from "../models/PagedResult";
import type { Category } from "../features/categories/types/category";

const categoryService = {
    create: async (request: FormData): Promise<ApiResponse<Category>> => {
        const response = await apiClient.post<ApiResponse<Category>>("/admin/categories", request, {
            headers: {
                'Content-Type': undefined 
            },
        });
        return response.data;
    },

    getAll: async (): Promise<ApiResponse<Category[]>> => {
        const response = await apiClient.get<ApiResponse<Category[]>>("/admin/categories/all");
        return response.data;
    },

    getList: async(params: CategoryQueryParams): Promise<ApiResponse<PagedResult<Category>>> => {
        const response = await apiClient.get<ApiResponse<PagedResult<Category>>>("/admin/categories", {
            params: params
        });
        return response.data;
    },

    getLeaf: async(): Promise<ApiResponse<Category[]>> => {
        const response = await apiClient.get<ApiResponse<Category[]>>("/admin/categories/leaf");
        return response.data;
    },

    update: async (categoryId: string, request: FormData): Promise<ApiResponse<Category>> => {
        const response = await apiClient.put<ApiResponse<Category>>(`/admin/categories/${categoryId}`, request, {
            headers: {
                'Content-Type': undefined 
            },
        });
        return response.data;
    },

    delete: async (categoryId: string): Promise<ApiResponse<object>> => {
        const response = await apiClient.delete<ApiResponse<object>>(`/admin/categories/${categoryId}`);
        return response.data;
    } 
}

export default categoryService