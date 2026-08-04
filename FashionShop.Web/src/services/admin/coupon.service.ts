import type { Coupon } from "../../features/admin/coupons/types/coupon";
import type { CouponFormInputs, CouponQueryParam } from "../../features/admin/coupons/types/requests";
import type { ApiResponse } from "../../models/apiResponse";
import type { PagedResult } from "../../models/PagedResult";
import apiClient from "../api.client";

export const couponService = {
    create: async(request: CouponFormInputs): Promise<ApiResponse<Coupon>> => {
        const response = await apiClient.post<ApiResponse<Coupon>>("/admin/coupons", request);
        return response.data;
    },

    getList: async(params: CouponQueryParam): Promise<ApiResponse<PagedResult<Coupon>>> => {
        const response = await apiClient.get<ApiResponse<PagedResult<Coupon>>>("/admin/coupons", {
            params: params
        });
        return response.data;
    },

    update: async(couponId: string, request: CouponFormInputs): Promise<ApiResponse<Coupon>> => {
        const response = await apiClient.put<ApiResponse<Coupon>>(`/admin/coupons/${couponId}`, request);
        return response.data;
    },

    delete: async(couponId: string): Promise<ApiResponse<null>> => {
        const response = await apiClient.delete<ApiResponse<null>>(`/admin/coupons/${couponId}`);
        return response.data;
    }
}