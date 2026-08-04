import type { Coupon } from "../../features/shop/coupons/types/coupon";
import type { ApiResponse } from "../../models/apiResponse";
import apiClient from "../api.client";

export const couponService = {
    getAll: async(): Promise<ApiResponse<Coupon[]>> => {
        const response = await apiClient.get<ApiResponse<Coupon[]>>("/shop/coupons");
        return response.data;
    }
}