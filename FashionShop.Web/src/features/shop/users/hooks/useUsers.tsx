import { useMutation, useQuery } from "@tanstack/react-query"
import { userService } from "../../../../services/shop/user.service"
import type { ChangePasswordFormInputs, UserFormInputs } from "../types/requests"
import { useMutationSideEffects } from "../../../../hooks/useMutationSideEffects";

export const useUsers = () => {
    const createSideEffects = useMutationSideEffects();

    const getUser = useQuery({
        queryKey: ["users"],
        queryFn: userService.get
    })

    const updateMutation = useMutation({
        mutationFn: (request: UserFormInputs) => userService.update(request),
        ...createSideEffects({
            successMessage: "Cập nhật thông tin tài khoản thành công!",
            errorMessage: "Cập nhật thông tin tài khoản thất bại!",
            invalidateKeys: [["users"]]
        })
    })

    const changePasswordMutation = useMutation({
        mutationFn: (request: ChangePasswordFormInputs) => userService.changePassword(request),
        ...createSideEffects({
            successMessage: "Thay đổi mật khẩu thành công!",
            errorMessage: "Thay đổi mật khẩu thất bại!",
            invalidateKeys: [["users"]]
        })
    })

    return {
        user: getUser.data?.data,
        isLoading: getUser.isPending,

        updateUser: updateMutation.mutate,
        isUpdating: updateMutation.isPending,

        changePassword: changePasswordMutation.mutate,
        isChanging: changePasswordMutation.isPending,
    }
}