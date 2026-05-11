import React, { useState } from 'react';
import { IoAdd } from "react-icons/io5";
import CategoryToolbar from '../../../features/admin/categories/components/CategoryToolbar';
import CategoryTable from '../../../features/admin/categories/components/CategoryTable';
import CategoryFormDialog from '../../../features/admin/categories/components/CategoryFormDialog';
import { useCategories } from '../../../features/admin/categories/hooks/useCategories';
import { useDialog } from '../../../contexts';
import type { Category } from '../../../features/admin/categories/types/category';
import Pagination from '../../../components/common/Pagination';
import { useTableMinHeight } from '../../../hooks/useTableMinHeight';
import type { CategoryFilters, CategoryQueryParams } from '../../../features/admin/categories/types/requests';

const CategoryPage: React.FC = () => {
    const { showDialog } = useDialog();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | undefined>(undefined);
    
    const [queryParams, setQueryParams] = useState<CategoryQueryParams>({
        keyword: undefined,
        isActive: undefined,
        parentId: undefined,
        pageSize: 5,
        pageIndex: 1,
        sortBy: "createddate",
        isAscending: false,
    });

    const {
        categories,
        isLoading,
        pagedCategories,
        totalRecord,
        isFetching,
        deleteCategory,
    } = useCategories(queryParams);

    const handleOpenCreate = () => {
        setIsDialogOpen(true);
        setSelectedCategory(undefined);
    };

    const handleOpenEdit = (category: Category) => {
        setIsDialogOpen(true);
        setSelectedCategory(category);
    };

    const handleDelete = (categoryId: string) => {
        showDialog({
            title: "XÁC NHẬN XOÁ DANH MỤC",
            message: "Khi bạn xoá danh mục này, tất cả danh mục thuộc danh mục này cũng sẽ bị xoá vĩnh viễn. Bạn có chắc chắn muốn tiếp tục?",
            confirmText: "Xoá",
            cancelText: "Hủy",
            confirmColor: "error",
            onConfirm: () => deleteCategory(categoryId)
        });
    }

    const handleSearch = (text: string) => {
        setQueryParams(prev => ({
            ...prev,
            keyword: text,
            pageIndex: 1,
        }));
    }

    const handleFilterChange = (newFilters: CategoryFilters) => {
        setQueryParams(prev => ({
            ...prev,
            ...newFilters,
            pageIndex: 1,
        }));
    }

    const handlePageChange = (newPage: number) => {
        setQueryParams(prev => ({ 
            ...prev, 
            pageIndex: newPage 
        }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const handleSortChange = (colKey: string, isAscending: boolean) => {
        setQueryParams(prev => ({ 
            ...prev, 
            sortBy: colKey,
            isAscending: isAscending,
            pageIndex: 1,
        }));
    }

    const tableContainerStyle = useTableMinHeight(queryParams.pageSize);

    return (
        <div className="h-full flex flex-col p-2.5 md:p-3 space-y-2.5 bg-gray-50/50"> 
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-2.5 shrink-0">
                <div className="flex items-center justify-center w-full">
                    <h1 className="text-[28px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600">
                        QUẢN LÝ DANH MỤC
                    </h1>
                </div>

                <div className="flex items-center gap-2.5 w-full md:w-auto">
                    <button 
                        onClick={handleOpenCreate}
                        className="flex-none flex items-center gap-1.5 bg-gray-900 hover:bg-gray-800 text-white px-2.5 py-1.5 rounded-lg text-[13px] font-semibold transition-all shadow-sm whitespace-nowrap ml-auto md:ml-0"
                    >
                        <IoAdd className="text-base" />
                        <span>Thêm mới</span>
                    </button>
                </div>
            </div>

            <div className="shrink-0 z-20">
                <CategoryToolbar
                    onSearch={handleSearch}
                    onFilterChange={handleFilterChange}
                    parentCategories={categories}
                />
            </div>

            <div className="flex-1 flex flex-col min-h-0 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                
                <div 
                    className="flex-1 overflow-auto custom-scrollbar relative"
                    style={tableContainerStyle}
                >
                    <CategoryTable 
                        data={pagedCategories} 
                        isLoading={isLoading || isFetching}
                        sortBy={queryParams.sortBy}
                        isAscending={queryParams.isAscending}
                        onSort={handleSortChange}
                        onEdit={handleOpenEdit}
                        onDelete={handleDelete}
                    />
                </div>
                
                {!isLoading && categories.length > 0 && (
                    <div className="shrink-0 border-t border-gray-100 bg-white px-3 py-2.5">
                        <Pagination
                            totalRecord={totalRecord}
                            pageSize={queryParams.pageSize}
                            currentPage={queryParams.pageIndex}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}
            </div>

            <CategoryFormDialog 
                isOpen={isDialogOpen}
                data={categories}
                onClose={() => setIsDialogOpen(false)}
                initialData={selectedCategory}
            />
        </div>
    );
};

export default CategoryPage;