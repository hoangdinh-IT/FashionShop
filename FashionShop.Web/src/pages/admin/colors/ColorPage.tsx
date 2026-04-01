import type React from "react";
import { IoAdd } from "react-icons/io5";
import { useColors } from "../../../features/colors/hooks/useColors";
import { useState } from "react";
import ColorTable from "../../../features/colors/components/ColorTable";
import type { Color } from "../../../features/colors/types/color";
import { useDialog } from "../../../contexts";
import ColorToolbar from "../../../features/colors/components/ColorToolbar";
import Pagination from "../../../components/common/Pagination";
import ColorFormDialog from "../../../features/colors/components/ColorFormDialog";
import { useTableMinHeight } from "../../../hooks/useTableMinHeight";
import type { ColorFilters, ColorQueryParams } from "../../../features/colors/types/requests";

const ColorPage: React.FC = () => {
    const { showDialog } = useDialog();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedColor, setSelectedColor] = useState<Color | undefined>(undefined);

    const [queryParams, setQueryParams] = useState<ColorQueryParams>({
        keyword: undefined,
        isActive: undefined,
        pageSize: 5,
        pageIndex: 1,
        sortBy: "createddate",
        isAscending: false,
    });

    const {
        pagedColors,
        isLoading,
        totalRecord,
        isFetching,
        deleteColor,
    } = useColors(queryParams);

    const handleOpenCreate = () => {
        setIsDialogOpen(true);
        setSelectedColor(undefined);
    }

    const handleOpenEdit = (color: Color) => {
        setIsDialogOpen(true);
        setSelectedColor(color);
    }

    const handleDelete = (colorId: number) => {
        showDialog({
            title: "XÁC NHẬN XOÁ MÀU SẮC",
            message: "Màu sắc này sẽ bị xoá vĩnh viễn. Bạn có chắc chắn muốn tiếp tục?",
            confirmText: "Xoá",
            cancelText: "Hủy",
            confirmColor: "error",
            onConfirm: () => deleteColor(colorId)
        });
    };

    const handleSearch = (text: string) => {
        setQueryParams(prev => ({
            ...prev,
            keyword: text,
            pageIndex: 1,
        }));
    }

    const handleFilterChange = (newFilters: ColorFilters) => {
        setQueryParams(prev => ({
            ...prev,
            ...newFilters,
            pageIndex: 1,
        }));
    }

    const handleSortChange = (colKey: string, isAscending: boolean) => {
        setQueryParams(prev => ({
            ...prev,
            sortBy: colKey,
            isAscending: isAscending,
            pageIndex: 1,
        }));
    }

    const handlePageChange = (newPage: number) => {
        setQueryParams(prev => ({
            ...prev,
            pageIndex: newPage,
        }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const tableContainerStyle = useTableMinHeight(queryParams.pageSize);

    return (
        <div className="h-full flex flex-col p-3 md:p-4 space-y-3 bg-gray-50/50"> 
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 shrink-0">
                <div className="flex items-center justify-center w-full">
                    <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600">
                        QUẢN LÝ MÀU SẮC
                    </h1>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button 
                        onClick={handleOpenCreate}
                        className="flex-none flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm whitespace-nowrap ml-auto md:ml-0"
                    >
                        <IoAdd className="text-lg" />
                        <span>Thêm mới</span>
                    </button>
                </div>
            </div>

            <div className="shrink-0 z-20">
                <ColorToolbar
                    onSearch={handleSearch}
                    onFilterChange={handleFilterChange}
                />
            </div>

            <div className="flex-1 flex flex-col min-h-0 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                
                <div 
                    className="flex-1 overflow-auto custom-scrollbar relative"
                    style={tableContainerStyle}
                >
                    <ColorTable 
                        data={pagedColors} 
                        isLoading={isLoading || isFetching}
                        sortBy={queryParams.sortBy}
                        isAscending={queryParams.isAscending}
                        onSort={handleSortChange}
                        onEdit={handleOpenEdit}
                        onDelete={handleDelete}
                    />
                </div>
                
                {!isLoading && pagedColors.length > 0 && (
                    <div className="shrink-0 border-t border-gray-100 bg-white px-4 py-3">
                        <Pagination
                            totalRecord={totalRecord}
                            pageSize={queryParams.pageSize}
                            currentPage={queryParams.pageIndex}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}
            </div>

            <ColorFormDialog 
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                initialData={selectedColor}
            />
        </div>
    );
}

export default ColorPage;