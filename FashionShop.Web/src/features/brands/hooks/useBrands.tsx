import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import brandService from "../../../services/brand.service";
import type { BrandQueryParams } from "../types/requests";
import { useMutationSideEffects } from "../../../hooks/useMutationSideEffects";

export const useBrands = (params?: BrandQueryParams) => {
    const createSideEffects = useMutationSideEffects();

    const createMutation = useMutation({
        mutationFn: (request: FormData) => brandService.create(request),
        ...createSideEffects({
            successMessage: "Thêm thương hiệu thành công!",
            errorMessage: "Thêm thương hiệu thất bại!",
            invalidateKeys: [["brands"]]
        })
    });

    const allBrandsQuery = useQuery({
        queryKey: ["brands"],
        queryFn: brandService.getAll,
    })

    const brandsListQuery = useQuery({
        queryKey: ["brands", params],
        queryFn: () => brandService.getList(params!),
        staleTime: 1000 * 60 * 5,
        placeholderData: keepPreviousData,
        enabled: !!params,
    });

    const updateMutation = useMutation({
        mutationFn: ({ brandId, request }: { brandId: string, request: FormData }) => brandService.update(brandId, request),
        ...createSideEffects({
            successMessage: "Cập nhật thương hiệu thành công!",
            errorMessage: "Cập nhật thương hiệu thất bại!",
            invalidateKeys: [["brands"]]
        })
    });

    const deleteMutation = useMutation({
        mutationFn: (brandId: string) => brandService.delete(brandId),
        ...createSideEffects({
            successMessage: "Xoá thương hiệu thành công!",
            errorMessage: "Xoá thương hiệu thất bại!",
            invalidateKeys: [["brands"]]
        })
    });

    return {
        createBrand: createMutation.mutate,
        isCreating: createMutation.isPending,
        
        brands: allBrandsQuery.data?.data || [],
        isLoading: allBrandsQuery.isLoading,
        
        pagedBrands: brandsListQuery.data?.data?.items || [],
        totalRecord: brandsListQuery.data?.data?.totalRecord || 0,
        isFetching: brandsListQuery.isFetching,

        updateBrand: updateMutation.mutate,
        isUpdating: updateMutation.isPending,
        
        deleteBrand: deleteMutation.mutate,
        isDeleting: deleteMutation.isPending,
    }
}