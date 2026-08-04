import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import type { CouponFormInputs, CouponQueryParam } from "../types/requests";
import { useMutationSideEffects } from "../../../../hooks/useMutationSideEffects";
import { couponService } from "../../../../services/admin/coupon.service";

export const useCoupons = (params: CouponQueryParam) => {
    const CouponListQuery = useQuery({
        queryKey: ["coupons", params],
        queryFn: () => couponService.getList(params),
        staleTime: 1000 * 60 * 5,
        placeholderData: keepPreviousData,
        enabled: !!params
    })

    return {
        pagedCoupons: CouponListQuery.data?.data?.items || [],
        totalRecord: CouponListQuery.data?.data?.totalRecord || 0,
        isFetching: CouponListQuery.isFetching,
    }
}

export const useCouponMutations = () => {
    const createSideEffects = useMutationSideEffects();

    const createMutation = useMutation({
        mutationFn: (request: CouponFormInputs) => couponService.create(request),
        ...createSideEffects({
            successMessage: "Thêm mã giảm giá thành công!",
            errorMessage: "Thêm mã giảm giá thất bại!",
            invalidateKeys: [["coupons"]]
        })
    })

    const updateMutation = useMutation({
        mutationFn: ({ couponId, request }: { couponId: string, request: CouponFormInputs }) => couponService.update(couponId, request),
        ...createSideEffects({
            successMessage: "Cập nhật mã giảm giá thành công!",
            errorMessage: "Cập nhật mã giảm giá thất bại!",
            invalidateKeys: [["coupons"]]
        })
    })

    const deleteMutation = useMutation({
        mutationFn: (couponId: string) => couponService.delete(couponId),
        ...createSideEffects({
            successMessage: "Xoá mã giảm giá thành công!",
            errorMessage: "Xoá mã giảm giá thất bại!",
            invalidateKeys: [["coupons"]]
        })
    })

    return {
        createCoupon: createMutation.mutate,
        isCreating: createMutation.isPending,

        updateCoupon: updateMutation.mutate,
        isUpdating: updateMutation.isPending,

        deleteCoupon: deleteMutation.mutate,
        isDeleting: deleteMutation.isPending,
    }
}