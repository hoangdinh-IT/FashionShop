import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query"
import productService from "../../../services/product.service"
import { useMutationSideEffects } from "../../../hooks/useMutationSideEffects"
import type { ProductQueryParams } from "../types/requests";

export const useProducts = (params?: ProductQueryParams) => {
    const createSideEffects = useMutationSideEffects();

    const createMutation = useMutation({
        mutationFn: (request: FormData) => productService.create(request),
        ...createSideEffects({
            successMessage: "Thêm sản phẩm thành công!",
            errorMessage: "Thêm sản phẩm thất bại!",
            invalidateKeys: [["products"]],
        }),
    })

    const productsListQuery = useQuery({
        queryKey: ["products", params],
        queryFn: () => productService.getList(params!),
        staleTime: 1000 * 60 * 5,
        placeholderData: keepPreviousData,
        enabled: !!params,
    })

    const updateMutation = useMutation({
        mutationFn: ({ productId, request }: { productId: string, request: FormData }) => productService.update(productId, request),
        ...createSideEffects({
            successMessage: "Cập nhật sản phẩm thành công!",
            errorMessage: "Cập nhật sản phẩm thất bại!",
            invalidateKeys: [["products"]],
        }),
    })

    const deleteMutation = useMutation({
        mutationFn: (productId: string) => productService.delete(productId),
        ...createSideEffects({
            successMessage: "Xoá sản phẩm thành công!",
            errorMessage: "Xoá sản phẩm thất bại!",
            invalidateKeys: [["products"]],
        }),
    })

    return {
        createProduct: createMutation.mutate,
        isCreating: createMutation.isPending,

        products: productsListQuery.data?.data?.items || [],
        isLoading: productsListQuery.isLoading,

        totalRecord: productsListQuery.data?.data?.totalRecord || 0,
        isFetching: productsListQuery.isFetching,

        updateProduct: updateMutation.mutate,
        isUpdating: updateMutation.isPending,

        deleteProduct: deleteMutation.mutate,
        isDeleting: deleteMutation.isPending,
    }
}