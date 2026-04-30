import type { Cart, CartItem } from "../../features/shop/carts/types/cart";
import type { CartFormInputs, UpdateCartItem } from "../../features/shop/carts/types/requests";
import type { ApiResponse } from "../../models/apiResponse";
import apiClient from "../api.client";

export const cartService = {
    get: async(): Promise<ApiResponse<CartItem[]>> => {
        const response = await apiClient.get<ApiResponse<CartItem[]>>("/shop/carts");
        return response.data;
    },

    create: async(request: CartFormInputs): Promise<ApiResponse<Cart>> => {
        const response = await apiClient.post<ApiResponse<Cart>>("/shop/carts", request);
        return response.data;
    },

    update: async(cartItemId: number, request: UpdateCartItem): Promise<ApiResponse<CartItem>> => {
        const response = await apiClient.put<ApiResponse<CartItem>>(`/shop/carts/items/${cartItemId}`, request);
        return response.data;
    },

    delete: async(cartItemId: number): Promise<ApiResponse<null>> => {
        const response = await apiClient.delete<ApiResponse<null>>(`/shop/carts/items/${cartItemId}`);
        return response.data;
    }
}