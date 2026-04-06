import type { Address } from "../../features/shop/addresses/types/address";
import type { AddressFormInputs } from "../../features/shop/addresses/types/requests";
import type { ApiResponse } from "../../models/apiResponse";
import apiClient from "../api.client";

export const addressService = {
    create: async(request: AddressFormInputs): Promise<ApiResponse<Address>> => {
        const response = await apiClient.post<ApiResponse<Address>>("/shop/addresses", request);
        return response.data;
    },

    getAll: async(): Promise<ApiResponse<Address[]>> => {
        const response = await apiClient.get<ApiResponse<Address[]>>("/shop/addresses");
        return response.data;
    },

    update: async(addressId: string, request: AddressFormInputs): Promise<ApiResponse<Address>> => {
        const response = await apiClient.put<ApiResponse<Address>>(`/shop/addresses/${addressId}`, request);
        return response.data;
    },

    delete: async(addressId: string): Promise<ApiResponse<null>> => {
        const response = await apiClient.delete<ApiResponse<null>>(`/shop/addresses/${addressId}`);
        return response.data;
    }
}