import { useMutation, useQuery } from "@tanstack/react-query"
import { cartService } from "../../../../services/shop/cart.service"
import type { CartFormInputs, UpdateCartItem } from "../types/requests"
import { useMutationSideEffects } from "../../../../hooks/useMutationSideEffects"

export const useCarts = () => {
    const query = useQuery({
        queryKey: ["cart"],
        queryFn: cartService.get,
    })

    return {
        cartItems: query.data?.data || [],
        isLoading: query.isLoading,
    }
}

export const useCartMutations = () => {
    const createSideEffects = useMutationSideEffects();

    const createMutation = useMutation({
        mutationFn: (request: CartFormInputs) => cartService.create(request),
        ...createSideEffects({
            successMessage: "Thêm sản phẩm vào giỏ hàng thành công!",
            errorMessage: "Thêm sản phẩm vào giỏ hàng thất bại!",
            invalidateKeys: [["cart"]],
        }),
    })

    const updateMutation = useMutation({
        mutationFn: ({ cartItemId, request }: { cartItemId: number, request: UpdateCartItem }) => cartService.update(cartItemId, request),
        ...createSideEffects({
            invalidateKeys: [["cart"]],
        }),
    })

    const deleteMutation = useMutation({
        mutationFn: (cartItemId: number) => cartService.delete(cartItemId),
        ...createSideEffects({
            successMessage: "Xoá sản phẩm trong giỏ hàng thành công!",
            errorMessage: "Xoá sản phẩm trong giỏ hàng thất bại!",
            invalidateKeys: [["cart"]],
        }),
    })

    return {
        createCartItem: createMutation.mutate,
        isCreating: createMutation.isPending,

        updateCartItem: updateMutation.mutate,
        isUpdating: updateMutation.isPending,

        deleteCartItem: deleteMutation.mutate,
        isDeleting: deleteMutation.isPending,
    }
}