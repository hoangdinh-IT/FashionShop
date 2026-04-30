import { useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "../contexts"; // Điều chỉnh đường dẫn import tùy cấu trúc folder của bạn

// Định nghĩa kiểu dữ liệu cho tham số đầu vào (Optional)
interface SideEffectOptions {
    successMessage?: string;
    errorMessage?: string;
    invalidateKeys?: string[][]; // Mảng các queryKey cần làm mới
}

export const useMutationSideEffects = () => {
    const { showSnackbar } = useSnackbar();
    const queryClient = useQueryClient();

    const createSideEffects = (options: SideEffectOptions) => {
        const { 
            successMessage = null, 
            errorMessage = null, 
            invalidateKeys = [] 
        } = options;

        return {
            onSuccess: (response: any) => {
                if (response?.succeeded) {
                    // CHỈ HIỂN THỊ nếụ có successMessage
                    if (successMessage) {
                        showSnackbar(successMessage, "success");
                    }
                    
                    if (invalidateKeys.length > 0) {
                        invalidateKeys.forEach(key => {
                            queryClient.invalidateQueries({ queryKey: key });
                        });
                    }
                } else {
                    // CHỈ HIỂN THỊ nếu có errorMessage
                    if (errorMessage) {
                        showSnackbar(errorMessage, "error");
                    }
                }
            },
            onError: (error: any) => {
                // Đối với lỗi hệ thống, thường chúng ta vẫn nên giữ thông báo
                const data = error.response?.data;
                const specificError = data?.Errors?.[0];
                const generalMessage = data?.Message;
                const warningMessage = specificError || generalMessage;

                if (warningMessage) {
                    showSnackbar(warningMessage, "warning");
                } else {
                    showSnackbar("Lỗi hệ thống!", "error");
                }
            }
        };
    };

    return createSideEffects;
};