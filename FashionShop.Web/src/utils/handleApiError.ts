import type { AxiosError } from "axios";

type ApiError = {
    Errors?: string[];
    Message?: string[];
}

export const handleApiError = (
    error: AxiosError<ApiError>,
    showSnackbar: (message: React.ReactNode, type: "error") => void,
    fallbackMessage = "Lỗi hệ thống"
) => {
    const errorData = error?.response?.data;

    const errorMessage = 
        errorData?.Errors?.[0] || 
        errorData?.Message || 
        fallbackMessage

    showSnackbar(errorMessage, "error");
}