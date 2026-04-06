import type { ChangePasswordFormInputs, UserFormInputs } from "../../features/shop/users/types/requests";
import type { User } from "../../features/shop/users/types/user";
import type { ApiResponse } from "../../models/apiResponse";
import apiClient from "../api.client";

export const userService = {
    get: async(): Promise<ApiResponse<User>> => {
        const response = await apiClient.get<ApiResponse<User>>("/shop/users/me");
        return response.data;
    },

    update: async(request: UserFormInputs): Promise<ApiResponse<User>> => {
        const response = await apiClient.put<ApiResponse<User>>("/shop/users", request);
        return response.data;
    },

    changePassword: async(request: ChangePasswordFormInputs): Promise<ApiResponse<null>> => {
        const response = await apiClient.post<ApiResponse<null>>("/shop/users/change-password", request);
        return response.data;
    }
}