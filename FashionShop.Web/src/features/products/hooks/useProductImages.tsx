import { useMutation, useQuery } from "@tanstack/react-query";
import { useMutationSideEffects } from "../../../hooks/useMutationSideEffects";
import productImageService from "../../../services/productImage.service";
import type { DeleteProductImagesRequest, UpdateSortOrderRequest } from "../types/requests";

export const useProductImages = (productId?: string) => {
    const getList = useQuery({
        queryKey: ["products", "images", productId],
        queryFn: () => productImageService.getList(productId!),
        enabled: !!productId,
    })

    return {
        productImages: getList.data?.data || [],
        isLoadingProductImages: getList.isLoading,
    }
}

export const useProductImageMutations = () => {
    const createSideEffects = useMutationSideEffects();

    const createMutation = useMutation({
        mutationFn: ({ productId, formData }: { productId: string, formData: FormData }) => productImageService.create(productId, formData),
        ...createSideEffects({
            successMessage: "Thêm hình ảnh sản phẩm thành công!",
            errorMessage: "Thêm hình ảnh sản phẩm thất bại!",
            invalidateKeys: [["products", "images"]],
        }),
    })

    const updateSortOrderMutation = useMutation({
        mutationFn: ({ productId, request }: { productId: string, request: UpdateSortOrderRequest }) => productImageService.updateSortOrder(productId, request),
        ...createSideEffects({
            successMessage: "Cập nhật thứ tự hình ảnh thành công!",
            errorMessage: "Cập nhật thứ tự hình ảnh thất bại!",
            invalidateKeys: [["products", "images"]],
        }),
    })

    const deleteMutation = useMutation({
        mutationFn: ({ productId, request }: { productId: string, request?: DeleteProductImagesRequest }) => productImageService.delete(productId, request),
        ...createSideEffects({
            successMessage: "Xoá hình ảnh sản phẩm thành công!",
            errorMessage: "Xoá hình ảnh sản phẩm thất bại!",
            invalidateKeys: [["products", "images"]],
        }),
    })

    return {
        createProductImage: createMutation.mutate,
        isCreatingProductImage: createMutation.isPending,

        updateSortOrder: updateSortOrderMutation.mutate,
        isUpdatingSortOrder: updateSortOrderMutation.isPending,

        deleteProductImages: deleteMutation.mutate,
        isDeletingProductImages: deleteMutation.isPending,
    }
}