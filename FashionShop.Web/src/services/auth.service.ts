import type { ApiResponse } from "../models/apiResponse";
import type { AuthResponse } from "../features/auth/types/auth";
import apiClient from "./api.client";
import type { ForgotPasswordFormInputs, GoogleLoginRequest, LoginFormInputs, RegisterFormInputs, ResetPasswordFormInputs } from "../features/auth/types/requests";

export const authService = {
    register: async (request: RegisterFormInputs): Promise<ApiResponse<AuthResponse>> => {
        const response = await apiClient.post<ApiResponse<AuthResponse>>("/auth/register", request);
        return response.data;
    },

    login: async (request: LoginFormInputs): Promise<ApiResponse<AuthResponse>> => {
        const response = await apiClient.post<ApiResponse<AuthResponse>>("/auth/login", request);
        return response.data;
    },

    googleLogin: async(request: GoogleLoginRequest): Promise<ApiResponse<AuthResponse>> => {
        const response = await apiClient.post<ApiResponse<AuthResponse>>("/auth/google-login", request);
        return response.data;
    },

    forgotPassword: async(request: ForgotPasswordFormInputs): Promise<ApiResponse<null>> => {
        const response = await apiClient.post<ApiResponse<null>>("/auth/forgot-password", request);
        return response.data;
    },

    resetPassword: async(request: ResetPasswordFormInputs): Promise<ApiResponse<null>> => {
        const response = await apiClient.post<ApiResponse<null>>("/auth/reset-password", request);
        return response.data;
    }
};