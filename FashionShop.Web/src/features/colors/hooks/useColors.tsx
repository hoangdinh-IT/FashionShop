import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query"
import { useMutationSideEffects } from "../../../hooks/useMutationSideEffects"
import colorService from "../../../services/color.service";
import type { ColorFormInputs, ColorQueryParams } from "../types/requests";

export const useColors = (params?: ColorQueryParams) => {
    const createSideEffects = useMutationSideEffects();

    const createMutation = useMutation({
        mutationFn: (request: ColorFormInputs) => colorService.create(request),
        ...createSideEffects({
            successMessage: "Thêm màu sắc thành công!",
            errorMessage: "Thêm màu sắc thất bại!",
            invalidateKeys: [["colors"]]
        })
    })

    const colorsListQuery = useQuery({
        queryKey: ["colors", params],
        queryFn: () => colorService.getList(params!),
        staleTime: 1000 * 60 * 5,
        placeholderData: keepPreviousData,
        enabled: !!params,
    })

    const updateMutation = useMutation({
        mutationFn: ({ colorId, request }: { colorId: number, request: ColorFormInputs }) => colorService.update(colorId, request),
        ...createSideEffects({
            successMessage: "Cập nhật màu sắc thành công!",
            errorMessage: "Cập nhật màu sắc thất bại!",
            invalidateKeys: [["colors"]]
        })
    })

    const deleteMutation = useMutation({
        mutationFn: (colorId: number) => colorService.delete(colorId),
        ...createSideEffects({
            successMessage: "Xoá màu sắc thành công!",
            errorMessage: "Xoá màu sắc thất bại!",
            invalidateKeys: [["colors"]]
        })
    })

    return {
        createColor: createMutation.mutate,
        isCreating: createMutation.isPending,

        colors: colorsListQuery.data?.data?.items || [],
        isLoading: colorsListQuery.isLoading,

        totalRecord: colorsListQuery.data?.data?.totalRecord || 0,
        isFetching: colorsListQuery.isFetching,

        updateColor: updateMutation.mutate,
        isUpdating: updateMutation.isPending,

        deleteColor: deleteMutation.mutate,
        isDeleting: deleteMutation.isPending
    }
}