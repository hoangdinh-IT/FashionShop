import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query"
import categoryService from "../../../services/category.service";
import type { CategoryQueryParams } from "../types/requests";
import { useMutationSideEffects } from "../../../hooks/useMutationSideEffects";

export const useCategories = (params?: CategoryQueryParams) => {
    const createSideEffects = useMutationSideEffects();

    const createMutation = useMutation({
        mutationFn: (request: FormData) => categoryService.create(request),
        ...createSideEffects({
            successMessage: "Thêm danh mục thành công!",
            errorMessage: "Thêm danh mục thất bại!",
            invalidateKeys: [["categories"]]
        })
    });

    const allCategoriesQuery = useQuery({
        queryKey: ["categories"],
        queryFn: categoryService.getAll,
    });

    const categoriesListQuery = useQuery({
        queryKey: ["categories", params],
        queryFn: () => categoryService.getList(params!),
        staleTime: 1000 * 60 * 5,
        placeholderData: keepPreviousData,
        enabled: !!params,
    });

    const leafCategoriesQuery = useQuery({
        queryKey: ["leafCategories"],
        queryFn: categoryService.getLeaf,
    });

    const updateMutation = useMutation({
        mutationFn: ({categoryId, request}: {categoryId: string, request: FormData}) => categoryService.update(categoryId, request),
        ...createSideEffects({
            successMessage: "Cập nhật danh mục thành công!",
            errorMessage: "Cập nhật danh mục thất bại!",
            invalidateKeys: [["categories"]]
        })
    })

    const deleteMutation = useMutation({
        mutationFn: (categoryId: string) => categoryService.delete(categoryId),
        ...createSideEffects({
            successMessage: "Xoá danh mục thành công!",
            errorMessage: "Xoá danh mục thất bại!",
            invalidateKeys: [["categories"]]
        })
    })

    return {
        createCategory: createMutation.mutate,
        isCreating: createMutation.isPending,

        categories: allCategoriesQuery.data?.data || [],
        isLoading: allCategoriesQuery.isLoading,

        pagedCategories: categoriesListQuery.data?.data?.items || [],
        totalRecord: categoriesListQuery.data?.data?.totalRecord || 0,
        isFetching: categoriesListQuery.isFetching,

        leafCategories: leafCategoriesQuery.data?.data || [],

        updateCategory: updateMutation.mutate,
        isUpdating: updateMutation.isPending,

        deleteCategory: deleteMutation.mutate,
        isDeleting: deleteMutation.isPending,

        error: categoriesListQuery.error
    }
}