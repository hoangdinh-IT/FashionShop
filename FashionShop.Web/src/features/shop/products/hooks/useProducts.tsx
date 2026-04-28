import { useQuery } from "@tanstack/react-query";
import type { FilterOptionsRequest, ProductQueryParams } from "../types/requests";
import { productService } from "../../../../services/shop/product.service";

export const useProducts = (params: ProductQueryParams) => {
    const query = useQuery({
        queryKey: ["products", params],
        queryFn: () => productService.getPaged(params),
        enabled: !!params,
    })

    return {
        pagedProducts: query.data?.data?.items || [],
        totalProducts: query.data?.data?.totalRecord || 0,
        isLoading: query.isLoading,
    }
}

export const useFilterOptions = (params: FilterOptionsRequest) => {
    const query = useQuery({
        queryKey: ["filterOptions", params],
        queryFn: () => productService.getFilterOptions(params),
        enabled: !!params,
    })

    return {
        filterOptions: query.data?.data,
        isLoading: query.isLoading,
    }
}

export const useProductDetail = (productSlug?: string) => {
    const query = useQuery({
        queryKey: ["productDetail", productSlug],
        queryFn: () => productService.getDetail(productSlug!),
        enabled: !!productSlug,
    })

    return {
        productDetail: query.data?.data,
        isLoading: query.isLoading,
    }
}