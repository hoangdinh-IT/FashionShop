import type { Order, RepurchaseOrderItem } from "../../features/shop/orders/types/order";
import type { OrderRequest } from "../../features/shop/orders/types/requests";
import type { ApiResponse } from "../../models/apiResponse";
import apiClient from "../api.client";

export const orderService = {
    getAll: async(): Promise<ApiResponse<Order[]>> => {
        const response = await apiClient.get<ApiResponse<Order[]>>("/shop/orders");
        return response.data;
    },

    getOrderItemsByOrderId: async(orderId: string): Promise<ApiResponse<RepurchaseOrderItem[]>> => {
        const response = await apiClient.get<ApiResponse<RepurchaseOrderItem[]>>(`/shop/orders/${orderId}/orderItems`);
        return response.data;
    },
    
    create: async(request: OrderRequest): Promise<ApiResponse<Order>> => {
        const response = await apiClient.post<ApiResponse<Order>>("/shop/orders", request);
        return response.data;
    },

    updateCancelled: async(orderId: string): Promise<ApiResponse<Order>> => {
        const response = await apiClient.put<ApiResponse<Order>>(`/shop/orders/${orderId}/order-status-cancelled`);
        return response.data;
    }
}