import type { Order } from "../../features/shop/orders/types/order";
import type { OrderRequest } from "../../features/shop/orders/types/requests";
import type { ApiResponse } from "../../models/apiResponse";
import apiClient from "../api.client";

export const orderService = {
    create: async(request: OrderRequest): Promise<ApiResponse<Order>> => {
        const response = await apiClient.post<ApiResponse<Order>>("/shop/orders", request);
        return response.data;
    },

    getAll: async(): Promise<ApiResponse<Order[]>> => {
        const response = await apiClient.get<ApiResponse<Order[]>>("/shop/orders");
        return response.data;
    }
}