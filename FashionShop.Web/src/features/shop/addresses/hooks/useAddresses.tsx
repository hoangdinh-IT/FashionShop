import { useMutation, useQuery } from "@tanstack/react-query"
import { addressService } from "../../../../services/shop/address.service"
import type { AddressFormInputs } from "../types/requests"
import { useMutationSideEffects } from "../../../../hooks/useMutationSideEffects";

export const useAddresses = () => {
    const createSideEffects = useMutationSideEffects();

    const allAddressesQuery = useQuery({
        queryKey: ["addresses"],
        queryFn: addressService.getAll
    })

    const createMutation = useMutation({
        mutationFn: (request: AddressFormInputs) => addressService.create(request),
        ...createSideEffects({
            successMessage: "Thêm địa chỉ thành công!",
            errorMessage: "Thêm địa chỉ thất bại!",
            invalidateKeys: [["addresses"]]
        })
    })

    const updateMutation = useMutation({
        mutationFn: ({ addressId, request }: { addressId: string, request: AddressFormInputs }) => addressService.update(addressId, request),
        ...createSideEffects({
            successMessage: "Cập nhật địa chỉ thành công!",
            errorMessage: "Cập nhật địa chỉ thất bại!",
            invalidateKeys: [["addresses"]]
        })
    })

    const updateSetDefaultMutation = useMutation({
        mutationFn: (addressId: string) => addressService.updateSetDefault(addressId),
        ...createSideEffects({
            successMessage: "Cập nhật địa chỉ mặc định thành công!",
            errorMessage: "Cập nhật địa chỉ mặc định thất bại!",
            invalidateKeys: [["addresses"]]
        })
    })

    const deleteMutation = useMutation({
        mutationFn: (addressId: string) => addressService.delete(addressId),
        ...createSideEffects({
            successMessage: "Xoá địa chỉ thành công!",
            errorMessage: "Xoá địa chỉ thất bại!",
            invalidateKeys: [["addresses"]]
        })
    })

    return {
        addresses: allAddressesQuery.data?.data || [],
        isLoading: allAddressesQuery.isPending,

        createAddress: createMutation.mutate,
        isCreating: createMutation.isPending,

        updateAddress: updateMutation.mutate,
        isUpdating: updateMutation.isPending,

        updateSetDefaultAddress: updateSetDefaultMutation.mutate,
        isUpdatingSetDefault: updateSetDefaultMutation.isPending,

        deleteAddress: deleteMutation.mutate,
        isDeleting: deleteMutation.isPending,
    }
}