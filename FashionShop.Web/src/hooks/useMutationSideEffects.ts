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
            successMessage = "Thao tác thành công!", 
            errorMessage = "Thao tác thất bại!", 
            invalidateKeys = [] 
        } = options;

        return {
            onSuccess: (response: any) => {
                // Giả sử API trả về { succeeded: true/false }
                if (response?.succeeded) {
                    showSnackbar(successMessage, "success");
                    
                    // Invalidate các query key được truyền vào
                    if (invalidateKeys.length > 0) {
                        invalidateKeys.forEach(key => {
                            queryClient.invalidateQueries({ queryKey: key });
                        });
                    }
                } else {
                    showSnackbar(errorMessage, "error");
                }
            },
            onError: (error: any) => {
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