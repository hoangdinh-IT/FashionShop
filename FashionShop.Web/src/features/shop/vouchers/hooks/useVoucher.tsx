import { useQuery } from "@tanstack/react-query";
import { voucherService } from "../../../../services/shop/voucher.service";

export const useVoucher = () => {
    const query = useQuery({
        queryKey: ["vouchers"],
        queryFn: () => voucherService.getAll(),
    })

    return {
        vouchers: query.data?.data || [],
        isLoading: query.isLoading,
    }
}