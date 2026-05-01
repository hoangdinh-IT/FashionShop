import { useMutation } from "@tanstack/react-query";
import type { OrderRequest } from "../types/requests";
import { orderService } from "../../../../services/shop/order.service";
import { useMutationSideEffects } from "../../../../hooks/useMutationSideEffects";

export const useOrderMutations = () => {
    const createSideEffects = useMutationSideEffects();

    const createMutation = useMutation({
        mutationFn: (request: OrderRequest) => orderService.create(request),
        ...createSideEffects({
            successMessage: "Đặt hàng thành công!",
            errorMessage: "Đặt hàng thất bại!",
            invalidateKeys: [["addresses"]]
        })
    })

    return {
        createOrder: createMutation.mutate,
        isLoading: createMutation.isPending,
    }
}