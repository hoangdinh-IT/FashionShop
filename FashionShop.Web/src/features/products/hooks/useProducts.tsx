import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query"
import productService from "../../../services/product.service"
import { useMutationSideEffects } from "../../../hooks/useMutationSideEffects"
import type { ProductQueryParams } from "../types/requests";

export const useProducts = (params?: ProductQueryParams) => {
    const productsListQuery = useQuery({
        queryKey: ["products", "list", params],
        queryFn: () => productService.getList(params!),
        staleTime: 1000 * 60 * 5,
        placeholderData: keepPreviousData,
        enabled: !!params,
    })

    return {
        products: productsListQuery.data?.data?.items || [],
        totalRecord: productsListQuery.data?.data?.totalRecord || 0,
        isLoadingProduct: productsListQuery.isLoading,
        isFetchingProduct: productsListQuery.isFetching,
    }
}

export const useProductDetail = (productId?: string) => {
    const productDetailQuery = useQuery({
        queryKey: ["products", "detail", productId],
        queryFn: () => productService.getDetail(productId!),
        enabled: !!productId,
    })

    return {
        productDetail: productDetailQuery.data?.data,
        isLoadingDetail: productDetailQuery.isLoading,
        isFetchingDetail: productDetailQuery.isFetching,
    }
}

export const useProductMutations = () => {
    const createSideEffects = useMutationSideEffects();

    const createMutation = useMutation({
        mutationFn: (request: FormData) => productService.create(request),
        ...createSideEffects({
            successMessage: "Thêm sản phẩm thành công!",
            errorMessage: "Thêm sản phẩm thất bại!",
            invalidateKeys: [["products"]],
        }),
    })

    const createDetailMutation = useMutation({
        mutationFn: (request: FormData) => productService.createDetail(request),
        ...createSideEffects({
            successMessage: "Thêm chi tiết sản phẩm thành công!",
            errorMessage: "Thêm chi tiết sản phẩm thất bại!",
            invalidateKeys: [["products"]],
        }),
    })

    const updateMutation = useMutation({
        mutationFn: ({ productId, request }: { productId: string, request: FormData }) => productService.update(productId, request),
        ...createSideEffects({
            successMessage: "Cập nhật sản phẩm thành công!",
            errorMessage: "Cập nhật sản phẩm thất bại!",
            invalidateKeys: [["products"]],
        }),
    })

    const updateDetailMutation = useMutation({
        mutationFn: ({ productId, request }: { productId: string, request: FormData }) => productService.updateDetail(productId, request),
        ...createSideEffects({
            successMessage: "Cập nhật chi tiết sản phẩm thành công!",
            errorMessage: "Cập nhật chi tiết sản phẩm thất bại!",
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

    const deleteDetailMutation = useMutation({
        mutationFn: (productId: string) => productService.deleteDetail(productId),
        ...createSideEffects({
            successMessage: "Xoá chi tiết sản phẩm thành công!",
            errorMessage: "Xoá chi tiết sản phẩm thất bại!",
            invalidateKeys: [["products"]],
        }),
    })

    return {
        createProduct: createMutation.mutate,
        isCreatingProduct: createMutation.isPending,

        createDetail: createDetailMutation.mutate,
        isCreatingDetail: createDetailMutation.isPending,

        updateProduct: updateMutation.mutate,
        isUpdatingProduct: updateMutation.isPending,

        updateDetail: updateDetailMutation.mutate,
        isUpdatingDetail: updateDetailMutation.isPending,

        deleteProduct: deleteMutation.mutate,
        isDeletingProduct: deleteMutation.isPending,

        deleteDetail: deleteDetailMutation.mutate,
        isDeletingDetail: deleteDetailMutation.isPending,
    }
}

export const useProductColors = (productId?: string) => {
    const colorsListQuery = useQuery({
        queryKey: ["products", "colors", productId],
        queryFn: () => productService.getColors(productId!),
        enabled: !!productId,
    })

    return {
        colors: colorsListQuery.data?.data || [],
        isLoadingColors: colorsListQuery.isLoading,
    }
}