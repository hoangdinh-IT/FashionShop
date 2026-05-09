import type { OrderDetail, OrderSummary } from "../../features/admin/orders/types/order";
import type { OrderQueryParams, UpdateOrder } from "../../features/admin/orders/types/requests";
import type { ApiResponse } from "../../models/apiResponse";
import type { PagedResult } from "../../models/PagedResult";
import apiClient from "../api.client";

export const orderService = {
    getAll: async(params: OrderQueryParams): Promise<ApiResponse<PagedResult<OrderSummary>>> => {
        const response = await apiClient.get<ApiResponse<PagedResult<OrderSummary>>>("/admin/orders", {
            params: params
        });
        return response.data;
    },

    getById: async(orderId: string): Promise<ApiResponse<OrderDetail>> => {
        const response = await apiClient.get<ApiResponse<OrderDetail>>(`/admin/orders/${orderId}`);
        return response.data;
    },

    update: async(orderId: string, request: UpdateOrder): Promise<ApiResponse<OrderSummary>> => {
        const response = await apiClient.put<ApiResponse<OrderSummary>>(`/admin/orders/${orderId}`, request);
        return response.data;
    }
}