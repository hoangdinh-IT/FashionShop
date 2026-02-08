import React, { useState } from 'react';
import { IoAdd } from "react-icons/io5";
import CategoryToolbar from '../../../features/categories/components/CategoryToolbar';
import CategoryTable from '../../../features/categories/components/CategoryTable';
import CategoryFormDialog from '../../../features/categories/components/CategoryFormDialog';
import { useCategories } from '../../../features/categories/hooks/useCategories';
import { useDialog } from '../../../contexts';
import type { Category } from '../../../features/categories/types/category';
import Pagination from '../../../components/common/Pagination';
import { useTableMinHeight } from '../../../hooks/useTableMinHeight';
import type { CategoryFilters, CategoryQueryParams } from '../../../features/categories/types/requests';

const CategoryPage: React.FC = () => {
    const { showDialog } = useDialog();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | undefined>(undefined);
    
    const [queryParams, setQueryParams] = useState<CategoryQueryParams>({
        keyword: "",
        isActive: undefined,
        parentId: "",
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

    const handleDeleteCategory = (categoryId: string) => {
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

    const handleSortChange = (colKey: string, direction: boolean) => {
        setQueryParams(prev => ({ 
            ...prev, 
            sortBy: colKey,
            isAscending: direction,
            pageIndex: 1,
        }));
    }

    const tableContainerStyle = useTableMinHeight(queryParams.pageSize);

    return (
        <div className="h-full flex flex-col p-3 md:p-4 space-y-3 bg-gray-50/50"> 
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 shrink-0">
                <div className="flex items-center justify-center w-full">
                    <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600">
                        QUẢN LÝ DANH MỤC
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
                <CategoryToolbar
                    onSearch={handleSearch}
                    onFilterChange={handleFilterChange}
                    parentCategories={categories}
                />
            </div>

            <div className="flex-1 flex flex-col min-h-0 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                
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
                        onDelete={handleDeleteCategory}
                    />
                </div>
                
                {!isLoading && categories.length > 0 && (
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