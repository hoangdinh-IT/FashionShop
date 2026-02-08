import { useMemo } from 'react';

// Định nghĩa giá trị mặc định (nếu không truyền vào thì sẽ lấy số này)
const DEFAULT_ROW_HEIGHT = 100;
const DEFAULT_HEADER_HEIGHT = 50;

export const useTableMinHeight = (
    pageSize: number, 
    rowHeight: number = DEFAULT_ROW_HEIGHT, 
    headerHeight: number = DEFAULT_HEADER_HEIGHT
) => {
    const tableStyle = useMemo(() => {
        // Công thức: Header + (Số dòng * Chiều cao 1 dòng)
        const minHeight = headerHeight + (pageSize * rowHeight);
        
        return { 
            minHeight: `${minHeight}px` 
        };
    }, [pageSize, rowHeight, headerHeight]);

    return tableStyle;
};