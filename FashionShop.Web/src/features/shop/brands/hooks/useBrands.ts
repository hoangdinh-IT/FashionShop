import { useQuery } from "@tanstack/react-query"
import { brandService } from "../../../../services/shop/brand.service"

export const useBrands = (brandId?: string) => {
    const allBrandsQuery = useQuery({
        queryKey: ["brands"],
        queryFn: brandService.getAll,
    })

    const categoriesListQuery = useQuery({
        queryKey: ["brands", "categories", brandId],
        queryFn: () => brandService.getCategories(brandId!),
        enabled: !!brandId
    })

    return {
        brands: allBrandsQuery.data?.data || [],
        isLoadingBrands: allBrandsQuery.isLoading,

        categories: categoriesListQuery.data?.data || [],
        isLoadingCategories: categoriesListQuery.isLoading,
    }
}