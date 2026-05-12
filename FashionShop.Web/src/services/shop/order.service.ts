import type { OrderSummary, OrderDetail } from "../../features/shop/orders/types/order";
import type { OrderRequest } from "../../features/shop/orders/types/requests";
import type { ApiResponse } from "../../models/apiResponse";
import apiClient from "../api.client";

export const orderService = {
    getAll: async(): Promise<ApiResponse<OrderSummary[]>> => {
        const response = await apiClient.get<ApiResponse<OrderSummary[]>>("/shop/orders");
        return response.data;
    },

    getById: async(orderId: string): Promise<ApiResponse<OrderDetail>> => {
        const response = await apiClient.get<ApiResponse<OrderDetail>>(`/shop/orders/${orderId}`);
        return response.data;
    },
    
    create: async(request: OrderRequest): Promise<ApiResponse<OrderDetail>> => {
        const response = await apiClient.post<ApiResponse<OrderDetail>>("/shop/orders", request);
        return response.data;
    },

    updateCancelled: async(orderId: string): Promise<ApiResponse<OrderDetail>> => {
        const response = await apiClient.put<ApiResponse<OrderDetail>>(`/shop/orders/${orderId}/order-status-cancelled`);
        return response.data;
    }
}