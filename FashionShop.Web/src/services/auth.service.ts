import type { ApiResponse } from "../models/apiResponse";
import type { RegisterRequest, LoginRequest, UserInfo } from "../features/auth/types/user";
import apiClient from "./api.client";

export const authService = {
    register: async (request: RegisterRequest): Promise<ApiResponse<UserInfo>> => {
        const response = await apiClient.post<ApiResponse<UserInfo>>("/auth/register", request);
        return response.data;
    },

    login: async (request: LoginRequest): Promise<ApiResponse<UserInfo>> => {
        const response = await apiClient.post<ApiResponse<UserInfo>>("/auth/login", request);
        return response.data;
    }
};