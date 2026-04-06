import type React from "react";
import { useState } from "react";
import { IoAdd } from "react-icons/io5";

import { useProductMutations, useProducts } from "../../../features/admin/products/hooks/useProducts";
import { useCategories } from "../../../features/admin/categories/hooks/useCategories";
import { useBrands } from "../../../features/admin/brands/hooks/useBrands";
import ProductFormDialog from "../../../features/admin/products/components/ProductFormDialog";
import ProductTable from "../../../features/admin/products/components/ProductTable";
import Pagination from "../../../components/common/Pagination";
import { useTableMinHeight } from "../../../hooks/useTableMinHeight";
import { useDialog } from "../../../contexts";
import ProductToolbar from "../../../features/admin/products/components/ProductToolbar";
import type { ProductFilters, ProductQueryParams } from "../../../features/admin/products/types/requests";
import ProductImageManagerDialog from "../../../features/admin/products/components/ProductImagesManagerDialog";
import { useProductImageMutations } from "../../../features/admin/products/hooks/useProductImages";

const ProductPage: React.FC = () => {
    const { showDialog } = useDialog();

    const [modalConfig, setModalConfig] = useState<{
        isOpen: "FORM" | "IMAGE" | null;
        productId: string | undefined;
    }>({
        isOpen: null,
        productId: undefined,
    })

    const [queryParams, setQueryParams] = useState<ProductQueryParams>({
        keyword: undefined,
        categoryId: undefined,
        brandId: undefined,
        isActive: undefined,
        isBestSeller: undefined,
        isNew: undefined,
        minPrice: undefined,
        maxPrice: undefined,
        pageSize: 5,
        pageIndex: 1,
        sortBy: "createddate",
        isAscending: false,
    });

    const {
        products,
        totalRecord,
        isLoadingProduct,
        isFetchingProduct,
    } = useProducts(queryParams);

    const { deleteProductImages } = useProductImageMutations();

    const { deleteDetail } = useProductMutations();

    const { leafCategories } = useCategories();

    const { brands } = useBrands();

    const handleOpenCreate = () => setModalConfig({ isOpen: "FORM", productId: undefined })

    const handleOpenEdit = (productId: string) => setModalConfig({ isOpen: "FORM", productId: productId })

    const handleOpenImage = (productId: string) => setModalConfig({ isOpen: "IMAGE", productId: productId })

    const handleClose = () => setModalConfig({ isOpen: null, productId: undefined })

    const handleDelete = (productId: string) => {
        showDialog({
            title: "XÁC NHẬN XOÁ SẢN PHẨM",
            message: "Sản phẩm này sẽ bị xoá vĩnh viễn. Bạn có chắc chắn muốn tiếp tục?",
            confirmText: "Xoá",
            cancelText: "Hủy",
            confirmColor: "error",
            onConfirm: () => {
                deleteDetail(productId)
                deleteProductImages({ productId })
            }
        });
    }

    const handleSearch = (text: string) => {
        setQueryParams(prev => ({
            ...prev,
            keyword: text,
            pageIndex: 1,
        }));
    }

    const handleFilterChange = (newFilters: ProductFilters) => {
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
        }))
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const tableContainerStyle = useTableMinHeight(queryParams.pageSize);

    return (
        <div className="h-full flex flex-col p-3 md:p-4 space-y-3 bg-gray-50/50"> 
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 shrink-0">
                <div className="flex items-center justify-center w-full">
                    <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600">
                        QUẢN LÝ SẢN PHẨM
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
                <ProductToolbar
                    onSearch={handleSearch}
                    onFilterChange={handleFilterChange}
                    leafCategories={leafCategories}
                    brands={brands}
                />
            </div>

            <div className="flex-1 flex flex-col min-h-0 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                
                <div 
                    className="flex-1 overflow-auto custom-scrollbar relative"
                    style={tableContainerStyle}
                >
                    <ProductTable 
                        data={products} 
                        isLoading={isLoadingProduct || isFetchingProduct}
                        sortBy={queryParams.sortBy}
                        isAscending={queryParams.isAscending}
                        onSort={handleSortChange}
                        openImageManagerModal={handleOpenImage}
                        onEdit={handleOpenEdit}
                        onDelete={handleDelete}
                    />
                </div>
                
                {!isLoadingProduct && brands.length > 0 && (
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

            <ProductFormDialog 
                isOpen={modalConfig.isOpen === "FORM"}
                onClose={handleClose}
                productId={modalConfig.productId}
                leafCategories={leafCategories}
                brands={brands}
            />

            <ProductImageManagerDialog
                isOpen={modalConfig.isOpen === "IMAGE"}
                onClose={handleClose}
                productId={modalConfig.productId}
            />
        </div>
    );
}

export default ProductPage;