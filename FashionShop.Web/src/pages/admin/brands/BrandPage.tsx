import type React from "react";
import { useState } from "react";
import { IoAdd } from "react-icons/io5";
import BrandToolbar from "../../../features/brands/components/BrandToolbar";
import BrandTable from "../../../features/brands/components/BrandTable";
import BrandFormDialog from "../../../features/brands/components/BrandFormDialog";
import type { Brand } from "../../../features/brands/types/brand";
import { useBrands } from "../../../features/brands/hooks/useBrands";
import { useDialog } from "../../../contexts";
import Pagination from "../../../components/common/Pagination";
import { useTableMinHeight } from "../../../hooks/useTableMinHeight";
import type { BrandFilters, BrandQueryParams } from "../../../features/brands/types/requests";

const BrandPage: React.FC = () => {
    const { showDialog } = useDialog();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState<Brand | undefined>(undefined);

    const [queryParams, setQueryParams] = useState<BrandQueryParams>({
        keyword: "",
        isActive: undefined,
        pageSize: 5,
        pageIndex: 1,
        sortBy: "createddate",
        isAscending: false
    });

    // const getActiveParam = (value?: GeneralStatus): (boolean | undefined) => {
    //     if (value == GeneralStatus.Active) return true;
    //     else if (value == GeneralStatus.Inactive) return false;
    //     return undefined;
    // }

    const {
        pagedBrands,
        isLoading,
        totalRecord,
        isFetching,
        deleteBrand,
    } = useBrands(queryParams);

    const handleOpenCreate = () => {
        setIsDialogOpen(true);
        setSelectedBrand(undefined);
    };

    const handleOpenEdit = (brand: Brand) => {
        setIsDialogOpen(true);
        setSelectedBrand(brand);
    };

    const handleDeleteBrand = (brandId: string) => {
        showDialog({
            title: "XÁC NHẬN XOÁ THƯƠNG HIỆU",
            message: "Thương hiệu này sẽ bị xoá vĩnh viễn. Bạn có chắc chắn muốn tiếp tục?",
            confirmText: "Xoá",
            cancelText: "Hủy",
            confirmColor: "error",
            onConfirm: () => deleteBrand(brandId)
        });
    };

    const handleSearch = (text: string) => {
        setQueryParams(prev => ({
            ...prev,
            keyword: text,
            pageIndex: 1,
        }));
    }

    const handleFilterChange = (newFilters: BrandFilters) => {
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
        }))
    }

    const handlePageChange = (newPage: number) => {
        setQueryParams(prev => ({ 
            ...prev, 
            pageIndex: newPage 
        }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    const tableContainerStyle = useTableMinHeight(queryParams.pageSize);

    return (
        <div className="h-full flex flex-col p-3 md:p-4 space-y-3 bg-gray-50/50"> 
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 shrink-0">
                <div className="flex items-center justify-center w-full">
                    <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600">
                        QUẢN LÝ THƯƠNG HIỆU
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
                <BrandToolbar
                    onSearch={handleSearch}
                    onFilterChange={handleFilterChange}
                />
            </div>

            <div className="flex-1 flex flex-col min-h-0 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                
                <div 
                    className="flex-1 overflow-auto custom-scrollbar relative"
                    style={tableContainerStyle}
                >
                    <BrandTable 
                        data={pagedBrands} 
                        isLoading={isLoading || isFetching}
                        sortBy={queryParams.sortBy}
                        isAscending={queryParams.isAscending}
                        onSort={handleSortChange}
                        onEdit={handleOpenEdit}
                        onDelete={handleDeleteBrand}
                    />
                </div>
                
                {!isLoading && pagedBrands.length > 0 && (
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

            <BrandFormDialog 
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                initialData={selectedBrand}
            />
        </div>
    );
}

export default BrandPage;