import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom"
import { useAuth, useSnackbar } from "../../../contexts";
import type { LoginRequest, RegisterRequest } from "../types/user";
import { authService } from "../../../services/auth.service";

export const useRegister = () => {
    const { showSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: (request: RegisterRequest) => authService.register(request),
        onSuccess: (response) => {
            if (response.succeeded) {
                showSnackbar(
                    <div>
                        <strong>Đăng ký thành công!</strong> <br />
                        Vui lòng đăng nhập để tiếp tục.
                    </div>, 
                    "success"
                );
                navigate("/auth/login");
            } else {
                showSnackbar(response.message || "Đăng ký tài khoản thất bại!", "error");
            }
        },
        onError: (error: any) => {
            showSnackbar(error.response?.data?.message || "Lỗi hệ thống", "error");
        }
    });

    return {
        registerMutation: mutation.mutate,
        isLoading: mutation.isPending,
    }
}

export const useLogin = () => {
    const { showSnackbar } = useSnackbar()
    const { login } = useAuth();
    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: (request: LoginRequest) => authService.login(request),
        onSuccess: (response) => {
            if (response.succeeded) {
                showSnackbar("Đăng nhập thành công!", "success");
                const { id, email, role, accessToken, refreshToken } = response.data;
                console.log("DỮ LIỆU TỪ BACKEND:", response.data);
                login(
                    accessToken,
                    refreshToken,
                    {
                        id: id,
                        email: email,
                        role: role,
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                    }
                );
                if (response.data.role === "Admin") {
                    navigate("/admin", { replace: true });
                }
            } else {
                showSnackbar(response.message || "Đăng nhập thất bại!", "error");
            }
        },
        onError: (error: any) => {
            showSnackbar(error.response?.data?.message || "Lỗi hệ thống", "error");
        }
    });

    return {
        login: mutation.mutate,
        isLoading: mutation.isPending,
    };
}