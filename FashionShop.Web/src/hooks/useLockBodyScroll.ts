import { useEffect } from 'react';

// Biến đếm toàn cục để theo dõi số lượng Dialog đang mở
let lockCount = 0;
let originalOverflow = '';

export const useLockBodyScroll = (isLocked: boolean = true) => {
    useEffect(() => {
        if (!isLocked) return;

        // Lưu lại thuộc tính overflow ban đầu ở lần mở dialog đầu tiên
        if (lockCount === 0) {
            originalOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
        }

        lockCount++;

        // Cleanup: Giảm số lượng khi Dialog đóng hoặc unmount
        return () => {
            lockCount--;
            // Chỉ khi TẤT CẢ dialog đã đóng thì mới trả lại scroll cho body
            if (lockCount === 0) {
                document.body.style.overflow = originalOverflow;
            }
        };
    }, [isLocked]);
};