import { useState } from "react";
import { useSizes } from "../../../features/sizes/hooks/useSizes";
import type { Size } from "../../../features/sizes/types/size";
import { IoAdd } from "react-icons/io5";
import { useDialog } from "../../../contexts";
import SizeTable from "../../../features/sizes/components/SizeTable";
import Pagination from "../../../components/common/Pagination";
import SizeToolbar from "../../../features/sizes/components/SizeToolbar";
import SizeFormDialog from "../../../features/sizes/components/SizeFormDialog";
import { useTableMinHeight } from "../../../hooks/useTableMinHeight";
import type { SizeFilters, SizeQueryParams } from "../../../features/sizes/types/requests";

const SizePage = () => {
    const { showDialog } = useDialog();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedSize, setSelectedSize] = useState<Size | undefined>(undefined);

    const [queryParams, setQueryParams] = useState<SizeQueryParams>({
        keyword: "",
        type: undefined,
        isActive: undefined,
        pageSize: 5,
        pageIndex: 1,
        sortBy: "createddate",
        isAscending: false,
    });

    const {
        pagedSizes,
        isLoading,
        totalRecord,
        isFetching,
        deleteSize,
    } = useSizes(queryParams);


    const handleOpenCreate = () => {
        setIsDialogOpen(true);
        setSelectedSize(undefined);
    }

    const handleOpenEdit = (size: Size) => {
        setIsDialogOpen(true);
        setSelectedSize(size);
    }

    const handleDeleteSize = (sizeId: number) => {
        showDialog({
            title: "XÁC NHẬN XOÁ KÍCH THƯỚC",
            message: "Kích thước này sẽ bị xoá vĩnh viễn. Bạn có chắc chắn muốn tiếp tục?",
            confirmText: "Xoá",
            cancelText: "Hủy",
            confirmColor: "error",
            onConfirm: () => deleteSize(sizeId)
        });
    }

    const handleSearch = (text: string) => {
        setQueryParams(prev => ({
            ...prev,
            keyword: text,
            pageIndex: 1,
        }));
    }

    const handleFilterChange = (newFilters: SizeFilters) => {
        setQueryParams(prev => ({
            ...prev,
            ...newFilters,
            pageIndex: 1,
        }));
    }

    const handleSortChange = (colKey: string, direction: boolean) => {
        setQueryParams(prev => ({
            ...prev,
            sortBy: colKey,
            isAscending: direction,
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
                        QUẢN LÝ KÍCH THƯỚC
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
                <SizeToolbar
                    onSearch={handleSearch}
                    onFilterChange={handleFilterChange}
                />
            </div>

            <div className="flex-1 flex flex-col min-h-0 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                
                <div 
                    className="flex-1 overflow-auto custom-scrollbar relative"
                    style={tableContainerStyle}
                >
                    <SizeTable 
                        data={pagedSizes} 
                        isLoading={isLoading || isFetching}
                        sortBy={queryParams.sortBy}
                        isAscending={queryParams.isAscending}
                        onSort={handleSortChange}
                        onEdit={handleOpenEdit}
                        onDelete={handleDeleteSize}
                    />
                </div>
                
                {!isLoading && pagedSizes.length > 0 && (
                    <div className="shrink-0 border-t border-gray-100 bg-white px-4 py-3 mt-auto">
                        <Pagination
                            totalRecord={totalRecord} 
                            pageSize={queryParams.pageSize}
                            currentPage={queryParams.pageIndex}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}
            </div>

            <SizeFormDialog 
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                initialData={selectedSize}
            />
        </div>
    );
}

export default SizePage;