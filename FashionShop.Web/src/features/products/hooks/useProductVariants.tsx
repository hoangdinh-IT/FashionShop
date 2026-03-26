import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { useMutationSideEffects } from "../../../hooks/useMutationSideEffects";
import type { ProductVariantFormInputs, ProductVariantQueryParams } from "../types/requests";
import productVariantService from "../../../services/productVariant.service";

export const useProductVariants = (params?: ProductVariantQueryParams) => {
    const createSideEffects = useMutationSideEffects();

    const createMutation = useMutation({
        mutationFn: (request: ProductVariantFormInputs) => productVariantService.create(request),
        ...createSideEffects({
            successMessage: "Thêm biến thể sản phẩm thành công!",
            errorMessage: "Thêm biến thể sản phẩm thất bại!",
            invalidateKeys: [["productVariants"]],
        })
    })

    const productVariantsListQuery = useQuery({
        queryKey: ["productVariants", params],
        queryFn: () => productVariantService.getList(params!),
        staleTime: 1000 * 60 * 5,
        placeholderData: keepPreviousData,
        enabled: !!params,
    })

    const updateMutation = useMutation({
        mutationFn: ({ productVariantId, request }: { productVariantId: string, request: ProductVariantFormInputs }) => productVariantService.update(productVariantId, request),
        ...createSideEffects({
            successMessage: "Cập nhật biến thể sản phẩm thành công!",
            errorMessage: "Cập nhật biến thể sản phẩm thất bại!",
            invalidateKeys: [["productVariants"]],
        })
    })

    const deleteMutation = useMutation({
        mutationFn: (productVariantId: string) => productVariantService.delete(productVariantId),
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