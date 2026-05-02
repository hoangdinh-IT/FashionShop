import type { Order } from "../../features/admin/orders/types/order";
import type { OrderQueryParams, UpdateOrder } from "../../features/admin/orders/types/requests";
import type { ApiResponse } from "../../models/apiResponse";
import type { PagedResult } from "../../models/PagedResult";
import apiClient from "../api.client";

export const orderService = {
    getAll: async(params: OrderQueryParams): Promise<ApiResponse<PagedResult<Order>>> => {
        const response = await apiClient.get<ApiResponse<PagedResult<Order>>>("/admin/orders", {
            params: params
        });
        return response.data;
    },

    update: async(orderId: string, request: UpdateOrder): Promise<ApiResponse<Order>> => {
        const response = await apiClient.put<ApiResponse<Order>>(`/admin/orders/${orderId}`, request);
        return response.data;
    }
}