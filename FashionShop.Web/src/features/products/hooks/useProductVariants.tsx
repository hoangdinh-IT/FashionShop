import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { useMutationSideEffects } from "../../../hooks/useMutationSideEffects";
import type { ProductVariantFormInputs, ProductVariantQueryParams } from "../types/requests";
import productVariantService from "../../../services/productVariant.service";

export const useProductVariants = (productId?: string, params?: ProductVariantQueryParams) => {
    const createSideEffects = useMutationSideEffects();

    const createMutation = useMutation({
        mutationFn: ({ productId, request }: { productId: string, request: ProductVariantFormInputs }) => productVariantService.create(productId, request),
        ...createSideEffects({
            successMessage: "Thêm biến thể sản phẩm thành công!",
            errorMessage: "Thêm biến thể sản phẩm thất bại!",
            invalidateKeys: [["productVariants"]],
        })
    })

    const productVariantsListQuery = useQuery({
        queryKey: ["productVariants", params],
        queryFn: () => productVariantService.getList(productId!, params!),
        staleTime: 1000 * 60 * 5,
        placeholderData: keepPreviousData,
        enabled: !!params,
    })

    const updateMutation = useMutation({
        mutationFn: ({ productId, productVariantId, request }: { productId: string, productVariantId: string, request: ProductVariantFormInputs }) => productVariantService.update(productId, productVariantId, request),
        ...createSideEffects({
            successMessage: "Cập nhật biến thể sản phẩm thành công!",
            errorMessage: "Cập nhật biến thể sản phẩm thất bại!",
            invalidateKeys: [["productVariants"]],
        })
    })

    const deleteMutation = useMutation({
        mutationFn: ({ productId, productVariantId }: { productId: string, productVariantId: string }) => productVariantService.delete(productId, productVariantId),
        ...createSideEffects({
            successMessage: "Xoá biến thể sản phẩm thành công!",
            errorMessage: "Xoá biến thể sản phẩm thất bại!",
            invalidateKeys: [["productVariants"]],
        })
        
    })
    
    return {
        createProductVariant: createMutation.mutate,
        isCreatingProductVariant: createMutation.isPending,

        productVariants: productVariantsListQuery.data?.data?.items || [],
        isLoadingProductVariant: productVariantsListQuery.isLoading,

        totalRecord: productVariantsListQuery.data?.data?.totalRecord || 0,
        isFetchingProductVariant: productVariantsListQuery.isFetching,

        updateProductVariant: updateMutation.mutate,
        isUpdatingProductVariant: updateMutation.isPending,

        deleteProductVariant: deleteMutation.mutate,
        isDeletingProductVariant: deleteMutation.isPending,
    }
}