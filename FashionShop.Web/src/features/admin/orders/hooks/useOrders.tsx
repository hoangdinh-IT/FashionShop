import { useMutation, useQuery } from "@tanstack/react-query"
import type { OrderQueryParams, UpdateOrder } from "../types/requests"
import { useMutationSideEffects } from "../../../../hooks/useMutationSideEffects"
import { orderService } from "../../../../services/admin/order.service"

export const useOrders = (params: OrderQueryParams) => {
    const query = useQuery({
        queryKey: ["orders", params],
        queryFn: () => orderService.getAll(params),
        enabled: !!params,
    })

    return {
        pagedOrders: query.data?.data?.items || [],
        totalRecord: query.data?.data?.totalRecord || 0,
        isFetching: query.isFetching,
    }
}

export const useOrderMutations = () => {
    const createSideEffects = useMutationSideEffects();

    const updateMutation = useMutation({
        mutationFn: ({ orderId, request }: { orderId: string, request: UpdateOrder }) => orderService.update(orderId, request),
        ...createSideEffects({
            successMessage: "Cập nhật đơn hàng thành công!",
            errorMessage: "Cập nhật đơn hàng thất bại!",
            invalidateKeys: [["orders"]]
        })
    })

    return {
        updateOrder: updateMutation.mutate,
        isUpdating: updateMutation.isPending,
    }
}