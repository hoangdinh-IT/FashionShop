import { useMutation, useQuery } from "@tanstack/react-query";
import { useMutationSideEffects } from "../../../hooks/useMutationSideEffects";
import productImageService from "../../../services/productImage.service";

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

    return {
        createProductImage: createMutation.mutate,
        isCreatingProductImage: createMutation.isPending,

        productImages: getList.data?.data || [],
        isLoadingProductImages: getList.isLoading,
    }
}