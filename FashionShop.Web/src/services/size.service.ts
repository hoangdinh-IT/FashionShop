import type { SizeFormInputs, SizeListRequest } from "../features/sizes/types/requests";
import type { Size } from "../features/sizes/types/size";
import type { ApiResponse } from "../models/apiResponse";
import type { PagedResult } from "../models/PagedResult";
import apiClient from "./api.client";

export const sizeService = {
    create: async(request: SizeFormInputs): Promise<ApiResponse<PagedResult<Size>>> => {
        const response = await apiClient.post<ApiResponse<PagedResult<Size>>>("/admin/sizes", request);
        return response.data;
    },

    getList: async(params: SizeListRequest): Promise<ApiResponse<PagedResult<Size>>> => {
        const response = await apiClient.get<ApiResponse<PagedResult<Size>>>("/admin/sizes", {
            params: params
        });
        return response.data;
    },

    update: async(sizeId: number, request: SizeFormInputs): Promise<ApiResponse<PagedResult<Size>>> => {
        const response = await apiClient.put<ApiResponse<PagedResult<Size>>>(`/admin/sizes/${sizeId}`, request);
        return response.data;
    },

    delete: async(sizeId: number): Promise<ApiResponse<PagedResult<Size>>> => {
        const response = await apiClient.delete<ApiResponse<PagedResult<Size>>>(`/admin/sizes/${sizeId}`);
        return response.data;
    }
}