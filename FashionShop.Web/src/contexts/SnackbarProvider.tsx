import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import { Snackbar, Alert, type AlertColor, type SnackbarCloseReason } from "@mui/material";

// 1. Định nghĩa kiểu dữ liệu
interface SnackbarState {
    open: boolean;
    message: React.ReactNode; // ✅ QUAN TRỌNG: Đổi từ string sang ReactNode để nhận được JSX
    severity: AlertColor;     // 'success' | 'info' | 'warning' | 'error'
}

interface SnackbarContextType {
    showSnackbar: (message: React.ReactNode, severity?: AlertColor) => void;
}

// 2. Tạo Context
const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

// Định nghĩa map màu sắc
const ALERT_STYLES: Record<AlertColor, { bgcolor: string }> = {
    success: { bgcolor: "#2e7d32" }, // Màu xanh chuẩn Material (đậm hơn chút cho dễ đọc)
    info: { bgcolor: "#0288d1" },
    warning: { bgcolor: "#ed6c02" },
    error: { bgcolor: "#d32f2f" },
};

// 3. Provider Component
export const SnackbarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [snackbar, setSnackbar] = useState<SnackbarState>({
        open: false,
        message: "",
        severity: "info",
    });

    // Xử lý đóng Snackbar
    const handleClose = (_event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar((prev) => ({ ...prev, open: false }));
    };

    // Hàm hiển thị
    // ✅ Nhận vào message là ReactNode (string hoặc JSX đều được)
    const showSnackbar = useCallback((message: React.ReactNode, severity: AlertColor = "info") => {
        setSnackbar({ open: true, message, severity });
    }, []);

    // Optimize context value
    const contextValue = useMemo(() => ({ showSnackbar }), [showSnackbar]);

    return (
        <SnackbarContext.Provider value={contextValue}>
            {children}

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000} // Tăng lên 4s để người dùng kịp đọc nếu nội dung dài
                onClose={handleClose}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                sx={{
                    marginTop: '60px', // Tránh header che mất (tùy chỉnh theo height header của bạn)
                }}
            >
                <Alert
                    onClose={handleClose}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{
                        width: '100%',
                        minWidth: "300px",
                        fontSize: "0.95rem",
                        boxShadow: 6,
                        color: '#fff', // Chữ màu trắng
                        alignItems: 'center', // Căn giữa icon và text
                        
                        // Xử lý xuống dòng nếu dùng \n trong string
                        whiteSpace: 'pre-line', 

                        // Map màu background
                        ...ALERT_STYLES[snackbar.severity]
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </SnackbarContext.Provider>
    );
};

// 4. Custom Hook
export const useSnackbar = () => {
    const context = useContext(SnackbarContext);
    if (!context) {
        throw new Error("useSnackbar must be used within a SnackbarProvider");
    }
    return context;
};