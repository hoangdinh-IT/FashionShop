import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  type ButtonProps
} from "@mui/material";

// 1. Định nghĩa các kiểu dữ liệu (Types)
type DialogColor = ButtonProps['color']; // "primary" | "secondary" | "error" | "info" | "success" | "warning"

interface DialogOptions {
  title?: string;
  message: React.ReactNode; // Cho phép truyền cả text hoặc JSX (thẻ p, strong...)
  confirmText?: string;
  cancelText?: string;
  confirmColor?: DialogColor;
  onConfirm?: () => void;
  onCancel?: () => void;
}

interface DialogState extends DialogOptions {
  open: boolean;
}

interface DialogContextType {
  showDialog: (options: DialogOptions) => void;
}

// 2. Tạo Context
const DialogContext = createContext<DialogContextType | undefined>(undefined);

// 3. Provider Component
export const DialogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dialog, setDialog] = useState<DialogState>({
    open: false,
    title: "",
    message: "",
    confirmText: "Xác nhận",
    cancelText: "Hủy",
    confirmColor: "primary",
    onConfirm: undefined,
    onCancel: undefined,
  });

  // Hàm hiển thị Dialog (dùng useCallback để tối ưu)
  const showDialog = useCallback((options: DialogOptions) => {
    // Blur giúp tránh lỗi focus dính vào nút cũ khi mở dialog (Fix warning MUI)
    if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
    }

    setDialog({
      open: true,
      title: options.title || "Xác nhận",
      message: options.message || "",
      confirmText: options.confirmText || "Xác nhận",
      cancelText: options.cancelText || "Hủy",
      confirmColor: options.confirmColor || "primary",
      onConfirm: options.onConfirm,
      onCancel: options.onCancel,
    });
  }, []);

  // Hàm xử lý đóng
  const handleClose = (confirmed: boolean) => {
    // 1. Đóng dialog trước (để UI phản hồi nhanh)
    setDialog((prev) => ({ ...prev, open: false }));

    // 2. Thực thi callback sau đó (nếu có)
    if (confirmed && dialog.onConfirm) {
      dialog.onConfirm();
    } else if (!confirmed && dialog.onCancel) {
      dialog.onCancel();
    }
  };

  const contextValue = useMemo(() => ({ showDialog }), [showDialog]);

  return (
    <DialogContext.Provider value={contextValue}>
      {children}

      <Dialog
        open={dialog.open}
        onClose={() => handleClose(false)} // Bấm ra ngoài hoặc bấm ESC coi như là Hủy
        maxWidth="sm"
        fullWidth
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
        PaperProps={{
          sx: {
            borderRadius: "16px",
            padding: "12px",
            minWidth: "300px", // Chỉnh lại chút cho Responsive tốt hơn
          },
        }}
      >
        <DialogTitle
          id="dialog-title"
          sx={{ fontSize: "1.25rem", fontWeight: "bold", pb: 1 }}
        >
          {dialog.title}
        </DialogTitle>

        <DialogContent
          dividers
          id="dialog-description"
          sx={{ py: 3 }}
        >
          {/* Kiểm tra nếu message là string thì bọc Typography, nếu là JSX thì render thẳng */}
          {typeof dialog.message === 'string' ? (
             <Typography sx={{ fontSize: "1rem", lineHeight: 1.6, color: 'text.secondary' }}>
                {dialog.message}
             </Typography>
          ) : (
             dialog.message
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2, pt: 2 }}>
          <Button
            onClick={() => handleClose(false)}
            sx={{ 
                fontSize: "0.9rem", 
                textTransform: "none", 
                px: 2, 
                color: 'text.secondary' 
            }}
          >
            {dialog.cancelText}
          </Button>
          <Button
            onClick={() => handleClose(true)}
            variant="contained"
            color={dialog.confirmColor}
            disableElevation
            sx={{ 
                fontSize: "0.9rem", 
                textTransform: "none", 
                px: 3, 
                fontWeight: 600,
                borderRadius: '8px'
            }}
          >
            {dialog.confirmText}
          </Button>
        </DialogActions>
      </Dialog>
    </DialogContext.Provider>
  );
};

// 4. Custom Hook
export const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("useDialog must be used within a DialogProvider");
  }
  return context;
};