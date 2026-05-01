import { useQuery } from "@tanstack/react-query"
import { orderService } from "../../../../services/shop/order.service"

export const useOrders = () => {
    const query = useQuery({
        queryKey: ["orders"],
        queryFn: orderService.getAll,
    })

    return {
        orders: query.data?.data || [],
        isLoading: query.isLoading,
    }
}