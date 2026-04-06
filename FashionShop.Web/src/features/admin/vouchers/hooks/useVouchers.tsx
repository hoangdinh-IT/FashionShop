import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import type { VoucherFormInputs, VoucherQueryParam } from "../types/requests";
import { voucherService } from "../../../../services/admin/voucher.service";
import { useMutationSideEffects } from "../../../../hooks/useMutationSideEffects";

export const useVouchers = (params: VoucherQueryParam) => {
    const voucherListQuery = useQuery({
        queryKey: ["vouchers", params],
        queryFn: () => voucherService.getList(params),
        staleTime: 1000 * 60 * 5,
        placeholderData: keepPreviousData,
        enabled: !!params
    })

    return {
        pagedVouchers: voucherListQuery.data?.data?.items || [],
        totalRecord: voucherListQuery.data?.data?.totalRecord || 0,
        isFetching: voucherListQuery.isFetching,
    }
}

export const useVoucherMutations = () => {
    const createSideEffects = useMutationSideEffects();

    const createMutation = useMutation({
        mutationFn: (request: VoucherFormInputs) => voucherService.create(request),
        ...createSideEffects({
            successMessage: "Thêm mã giảm giá thành công!",
            errorMessage: "Thêm mã giảm giá thất bại!",
            invalidateKeys: [["vouchers"]]
        })
    })

    const updateMutation = useMutation({
        mutationFn: ({ voucherId, request }: { voucherId: string, request: VoucherFormInputs }) => voucherService.update(voucherId, request),
        ...createSideEffects({
            successMessage: "Cập nhật mã giảm giá thành công!",
            errorMessage: "Cập nhật mã giảm giá thất bại!",
            invalidateKeys: [["vouchers"]]
        })
    })

    const deleteMutation = useMutation({
        mutationFn: (voucherId: string) => voucherService.delete(voucherId),
        ...createSideEffects({
            successMessage: "Xoá mã giảm giá thành công!",
            errorMessage: "Xoá mã giảm giá thất bại!",
            invalidateKeys: [["vouchers"]]
        })
    })

    return {
        createVoucher: createMutation.mutate,
        isCreating: createMutation.isPending,

        updateVoucher: updateMutation.mutate,
        isUpdating: updateMutation.isPending,

        deleteVoucher: deleteMutation.mutate,
        isDeleting: deleteMutation.isPending,
    }
}