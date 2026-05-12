import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom"
import { useAuth, useSnackbar } from "../../../contexts";
import { authService } from "../../../services/auth.service";
import type { ForgotPasswordFormInputs, GoogleLoginRequest, LoginFormInputs, RegisterFormInputs, ResetPasswordFormInputs } from "../types/requests";

export const useRegister = () => {
    const { showSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: (request: RegisterFormInputs) => authService.register(request),
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
        mutationFn: (request: LoginFormInputs) => authService.login(request),
        onSuccess: (response) => {
            if (response.succeeded) {
                showSnackbar("Đăng nhập thành công!", "success");
                const { user, accessToken, refreshToken } = response.data;
                login(
                    user,
                    accessToken,
                    refreshToken,
                );
                if (user.role === "Admin")
                    navigate("/admin", { replace: true });
                else if (user.role === "Customer")
                    navigate("/shop/collection", { replace: true })
            } else {
                showSnackbar(response.message || "Đăng nhập thất bại!", "error");
            }
        },
        onError: (error: any) => {
            showSnackbar(error.response?.data?.Message || "Lỗi hệ thống", "error");
        }
    });

    return {
        login: mutation.mutate,
        isLoading: mutation.isPending,
    };
}

export const useGoogleLogin = () => {
    const { showSnackbar } = useSnackbar();
    const { login } = useAuth(); // Lấy hàm login từ AppContext để lưu user/token
    const navigate = useNavigate();

    const mutation = useMutation({
        // Sử dụng service googleLogin bạn đã định nghĩa
        mutationFn: (request: GoogleLoginRequest) => authService.googleLogin(request),
        onSuccess: (response) => {
            if (response.succeeded) {
                showSnackbar("Đăng nhập bằng Google thành công!", "success");
                
                const { user, accessToken, refreshToken } = response.data;
                
                // Lưu thông tin đăng nhập vào hệ thống (giống login thường)
                login(user, accessToken, refreshToken);

                // Điều hướng dựa trên Role của User trả về từ Backend
                if (user.role === "Admin") {
                    navigate("/admin", { replace: true });
                } else {
                    navigate("/shop/collection", { replace: true });
                }
            } else {
                showSnackbar(response.message || "Đăng nhập Google thất bại!", "error");
            }
        },
        onError: (error: any) => {
            // Hiển thị lỗi từ Backend hoặc lỗi hệ thống
            showSnackbar(error.response?.data?.Message || "Không thể kết nối với máy chủ Google", "error");
        }
    });

    return {
        googleLogin: mutation.mutate, // Hàm này sẽ được gọi khi bấm nút Google
        isLoading: mutation.isPending,
    };
};

export const useForgotPassword = () => {
    const { showSnackbar } = useSnackbar()

    const mutation = useMutation({
        mutationFn: (request: ForgotPasswordFormInputs) => authService.forgotPassword(request),
        onSuccess: (response) => {
            if (response.succeeded) {
                showSnackbar("Mã OTP đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư.", "success");
            }
        },
        onError: (error: any) => {
            showSnackbar(error.response?.data?.message || "Lỗi hệ thống", "error");
        }
    });

    return {
        forgotPassword: mutation.mutate,
        isLoading: mutation.isPending,
    }
}

export const useResetPassword = () => {
    const { showSnackbar } = useSnackbar()

    const mutation = useMutation({
        mutationFn: (request: ResetPasswordFormInputs) => authService.resetPassword(request),
        onSuccess: (response) => {
            if (response.succeeded) {
                showSnackbar("Mật khẩu được cập nhật thành công. Vui lòng đăng nhập lại!", "success");
            }
        },
        onError: (error: any) => {
            const errorData = error.response?.data;

            if (errorData?.Errors && errorData.Errors.length > 0) {
                showSnackbar(errorData.Errors[0], "error"); 
            } else if (errorData?.Message) {
                showSnackbar(errorData.Message, "error");
            } else {
                showSnackbar("Lỗi hệ thống hoặc không thể kết nối đến máy chủ", "error");
            }
        }
    });

    return {
        resetPassword: mutation.mutate,
        isLoading: mutation.isPending,
    }
}