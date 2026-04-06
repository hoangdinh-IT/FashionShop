import type { VoucherFormInputs, VoucherQueryParam } from "../../features/admin/vouchers/types/requests";
import type { Voucher } from "../../features/admin/vouchers/types/voucher";
import type { ApiResponse } from "../../models/apiResponse";
import type { PagedResult } from "../../models/PagedResult";
import apiClient from "../api.client";

export const voucherService = {
    create: async(request: VoucherFormInputs): Promise<ApiResponse<Voucher>> => {
        const response = await apiClient.post<ApiResponse<Voucher>>("/admin/vouchers", request);
        return response.data;
    },

    getList: async(params: VoucherQueryParam): Promise<ApiResponse<PagedResult<Voucher>>> => {
        const response = await apiClient.get<ApiResponse<PagedResult<Voucher>>>("/admin/vouchers", {
            params: params
        });
        return response.data;
    },

    update: async(voucherId: string, request: VoucherFormInputs): Promise<ApiResponse<Voucher>> => {
        const response = await apiClient.put<ApiResponse<Voucher>>(`/admin/vouchers/${voucherId}`, request);
        return response.data;
    },

    delete: async(voucherId: string): Promise<ApiResponse<null>> => {
        const response = await apiClient.delete<ApiResponse<null>>(`/admin/vouchers/${voucherId}`);
        return response.data;
    }
}