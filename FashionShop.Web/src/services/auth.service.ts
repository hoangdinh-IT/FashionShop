import type { ApiResponse } from "../models/apiResponse";
import type { UserInfo } from "../features/auth/types/user";
import apiClient from "./api.client";
import type { ForgotPasswordRequest, LoginFormInputs, RegisterFormInputs, ResetPasswordRequest } from "../features/auth/types/requests";

export const authService = {
    register: async (request: RegisterFormInputs): Promise<ApiResponse<UserInfo>> => {
        const response = await apiClient.post<ApiResponse<UserInfo>>("/auth/register", request);
        return response.data;
    },

    login: async (request: LoginFormInputs): Promise<ApiResponse<UserInfo>> => {
        const response = await apiClient.post<ApiResponse<UserInfo>>("/auth/login", request);
        return response.data;
    },

    forgotPassword: async(request: ForgotPasswordRequest): Promise<ApiResponse<null>> => {
        const response = await apiClient.post<ApiResponse<null>>("/auth/forgot-password", request);
        return response.data;
    },

    resetPassword: async(request: ResetPasswordRequest): Promise<ApiResponse<null>> => {
        const response = await apiClient.post<ApiResponse<null>>("/auth/reset-password", request);
        return response.data;
    }
};