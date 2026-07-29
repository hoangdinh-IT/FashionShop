import type { Voucher } from "../../features/shop/vouchers/types/voucher";
import type { ApiResponse } from "../../models/apiResponse";
import apiClient from "../api.client";

export const voucherService = {
    getAll: async(): Promise<ApiResponse<Voucher[]>> => {
        const response = await apiClient.get<ApiResponse<Voucher[]>>("/shop/vouchers");
        return response.data;
    }
}