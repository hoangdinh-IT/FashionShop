import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { useMutationSideEffects } from "../../../hooks/useMutationSideEffects"
import type { SizeFormInputs, SizeQueryParams } from "../types/requests";
import { sizeService } from "../../../services/size.service";

export const useSizes = (params?: SizeQueryParams) => {
    const createSideEffects = useMutationSideEffects();

    const createMutation = useMutation({
        mutationFn: (request: SizeFormInputs) => sizeService.create(request),
        ...createSideEffects({
            successMessage: "Thêm kích thước thành công!",
            errorMessage: "Thêm kích thước thất bại!",
            invalidateKeys: [["sizes"]]
        })
    })

    const sizesListQuery = useQuery({
        queryKey: ["sizes", params],
        queryFn: () => sizeService.getList(params!),
        staleTime: 1000 * 60 * 5,
        placeholderData: keepPreviousData,
        enabled: !!params,
    })

    const updateMutation = useMutation({
        mutationFn: ({ sizeId, request }: { sizeId: number, request: SizeFormInputs }) => sizeService.update(sizeId, request),
        ...createSideEffects({
            successMessage: "Cập nhật kích thước thành công!",
            errorMessage: "Cập nhật kích thước thất bại!",
            invalidateKeys: [["sizes"]]
        })
    })

    const deleteMutation = useMutation({
        mutationFn: (sizeId: number) => sizeService.delete(sizeId),
        ...createSideEffects({
            successMessage: "Xoá kích thước thành công!",
            errorMessage: "Xoá kích thước thất bại!",
            invalidateKeys: [["sizes"]]
        })
    })

    return {
        createSize: createMutation.mutate,
        isCreating: createMutation.isPending,

        sizes: sizesListQuery.data?.data?.items || [],
        isLoading: sizesListQuery.isLoading,

        totalRecord: sizesListQuery.data?.data?.totalRecord || 0,
        isFetching: sizesListQuery.isFetching,

        updateSize: updateMutation.mutate,
        isUpdating: updateMutation.isPending,

        deleteSize: deleteMutation.mutate,
        isDeleting: deleteMutation.isPending,
    }
}