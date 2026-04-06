import type { Brand } from "../../features/admin/brands/types/brand";
import type { BrandQueryParams } from "../../features/admin/brands/types/requests";
import type { ApiResponse } from "../../models/apiResponse";
import type { PagedResult } from "../../models/PagedResult";
import apiClient from "../api.client";

const brandService = {
    create: async (request: FormData): Promise<ApiResponse<Brand>> => {
        const response = await apiClient.post<ApiResponse<Brand>>("/admin/brands", request, {
            headers: {
                'Content-Type': undefined
            },
        });
        return response.data;
    },

    getAll: async (): Promise<ApiResponse<Brand[]>> => {
        const response = await apiClient.get<ApiResponse<Brand[]>>("/admin/brands/all");
        return response.data;
    },

    getList: async (params: BrandQueryParams): Promise<ApiResponse<PagedResult<Brand>>> => {
        const response = await apiClient.get<ApiResponse<PagedResult<Brand>>>("/admin/brands", {
            params: params
        });
        return response.data;
    },

    update: async (brandId: string, request: FormData): Promise<ApiResponse<Brand>> => {
        const response = await apiClient.put<ApiResponse<Brand>>(`/admin/brands/${brandId}`, request, {
            headers: {
                'Content-Type': undefined
            },
        });
        return response.data;
    },

    delete: async (brandId: string): Promise<ApiResponse<object>> => {
        const response = await apiClient.delete<ApiResponse<object>>(`/admin/brands/${brandId}`);
        return response.data;
    }
}

export default brandService;