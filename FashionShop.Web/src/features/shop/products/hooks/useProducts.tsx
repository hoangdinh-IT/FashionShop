import { useQuery } from "@tanstack/react-query";
import type { FilterOptionsRequest, ProductQueryParams } from "../types/requests";
import { productService } from "../../../../services/shop/product.service";

export const useProducts = (params: ProductQueryParams) => {
    const useProducts = useQuery({
        queryKey: ["products", params],
        queryFn: () => productService.getPaged(params),
        enabled: !!params,
    })

    return {
        pagedProducts: useProducts.data?.data?.items || [],
        totalProducts: useProducts.data?.data?.totalRecord || 0,
        isLoading: useProducts.isLoading,
    }
}

export const useFilterOptions = (params: FilterOptionsRequest) => {
    const useFilterOptions = useQuery({
        queryKey: ["filterOptions", params],
        queryFn: () => productService.getFilterOptions(params),
        enabled: !!params,
    })

    return {
        filterOptions: useFilterOptions.data?.data,
        isLoading: useFilterOptions.isLoading,
    }
}