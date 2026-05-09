import { useMutation, useQuery } from "@tanstack/react-query";
import type { OrderRequest } from "../types/requests";
import { orderService } from "../../../../services/shop/order.service";
import { useMutationSideEffects } from "../../../../hooks/useMutationSideEffects";

export const useOrders = () => {
    const query = useQuery({
        queryKey: ["orders"],
        queryFn: orderService.getAll,
    })

    return {
        orders: query.data?.data || [],
        isLoading: query.isLoading,
    }
}

export const useOrderItems = (orderId?: string) => {
    const query = useQuery({
        queryKey: ["orders"],
        queryFn: () => orderService.getOrderItemsByOrderId(orderId!),
    })

    return {
        orderItems: query.data?.data || [],
        isLoading: query.isLoading
    }
} 

export const useOrderMutations = () => {
    const createSideEffects = useMutationSideEffects();

    const createMutation = useMutation({
        mutationFn: (request: OrderRequest) => orderService.create(request),
        ...createSideEffects({
            successMessage: "Đặt hàng thành công!",
            errorMessage: "Đặt hàng thất bại!",
            invalidateKeys: [["orders"]]
        })
    })

    const updateCancelledMutation = useMutation({
        mutationFn: (orderId: string) => orderService.updateCancelled(orderId),
        ...createSideEffects({
            successMessage: "Đơn hàng huỷ thành công!",
            errorMessage: "Đơn hàng huỷ thất bại!",
            invalidateKeys: [["orders"]]
        })
    })

    return {
        createOrder: createMutation.mutate,
        isCreating: createMutation.isPending,

        updateCancelledOrder: updateCancelledMutation.mutate,
        isUpdatingCancelled: updateCancelledMutation.isPending,
    }
}