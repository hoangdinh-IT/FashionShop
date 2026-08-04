import { useQuery } from "@tanstack/react-query";
import { couponService } from "../../../../services/shop/coupon.service";

export const useCoupon = () => {
    const query = useQuery({
        queryKey: ["coupons"],
        queryFn: () => couponService.getAll(),
    })

    return {
        Coupons: query.data?.data || [],
        isLoading: query.isLoading,
    }
}