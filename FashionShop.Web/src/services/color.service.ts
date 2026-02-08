import type { ColorFormInputs, ColorListRequest } from "../features/colors/types/requests";
import type { ApiResponse } from "../models/apiResponse";
import apiClient from "./api.client";
import type { PagedResult } from "../models/PagedResult";
import type { Color } from "../features/colors/types/color";

const colorService = {
    create: async (request: ColorFormInputs): Promise<ApiResponse<Color>> => {
        const response = await apiClient.post<ApiResponse<Color>>("/admin/colors", request);
        return response.data;
    },

    getList: async(params: ColorListRequest): Promise<ApiResponse<PagedResult<Color>>> => {
        const response = await apiClient.get<ApiResponse<PagedResult<Color>>>("/admin/colors", {
            params: params
        });
        return response.data;
    },

    update: async(colorId: number, request: ColorFormInputs): Promise<ApiResponse<Color>> => {
        const response = await apiClient.put<ApiResponse<Color>>(`/admin/colors/${colorId}`, request);
        return response.data;
    },

    delete: async(colorId: number): Promise<ApiResponse<Color>> => {
        const response = await apiClient.delete(`/admin/colors/${colorId}`);
        return response.data;
    }
}

export default colorService;