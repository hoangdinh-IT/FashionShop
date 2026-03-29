import { useMutation, useQuery } from "@tanstack/react-query";
import { useMutationSideEffects } from "../../../hooks/useMutationSideEffects";
import productImageService from "../../../services/productImage.service";
import type { DeleteProductImagesRequest, UpdateSortOrderRequest } from "../types/requests";

export const productImageKeys = {
    all: ["products"] as const,
    images: (productId: string) => [...productImageKeys.all, "images", productId] as const,
}

export const useProductImageMutations = (productId?: string) => {
    const createSideEffects = useMutationSideEffects();

    const createMutation = useMutation({
        mutationFn: ({ productId, formData }: { productId: string, formData: FormData }) => productImageService.create(productId, formData),
        ...createSideEffects({
            successMessage: "Thêm hình ảnh sản phẩm thành công!",
            errorMessage: "Thêm hình ảnh sản phẩm thất bại!",
            invalidateKeys: [[...productImageKeys.images(productId!)]],
        }),
    })

    const getList = useQuery({
        queryKey: productImageKeys.images(productId!),
        queryFn: () => productImageService.getList(productId!),
        enabled: !!productId,
    })

    const updateSortOrderMutation = useMutation({
        mutationFn: ({ productId, request }: { productId: string, request: UpdateSortOrderRequest }) => productImageService.updateSortOrder(productId, request),
        ...createSideEffects({
            successMessage: "Cập nhật thứ tự hình ảnh thành công!",
            errorMessage: "Cập nhật thứ tự hình ảnh thất bại!",
            invalidateKeys: [[...productImageKeys.images(productId!)]],
        }),
    })

    const deleteMutation = useMutation({
        mutationFn: ({ productId, request }: { productId: string, request: DeleteProductImagesRequest }) => productImageService.delete(productId, request),
        ...createSideEffects({
            successMessage: "Xoá hình ảnh sản phẩm thành công!",
            errorMessage: "Xoá hình ảnh sản phẩm thất bại!",
            invalidateKeys: [[...productImageKeys.images(productId!)]],
        }),
    })

    return {
        createProductImage: createMutation.mutate,
        isCreatingProductImage: createMutation.isPending,

        productImages: getList.data?.data || [],
        isLoadingProductImages: getList.isLoading,

        updateSortOrder: updateSortOrderMutation.mutate,
        isUpdatingSortOrder: updateSortOrderMutation.isPending,

        deleteProductImages: deleteMutation.mutate,
        isDeletingProductImages: deleteMutation.isPending,
    }
}