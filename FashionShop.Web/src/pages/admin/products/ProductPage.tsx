import type React from "react";
import { useState } from "react";
import type { Product } from "../../../features/products/types/product";
import { useProducts } from "../../../features/products/hooks/useProducts";
import { IoAdd } from "react-icons/io5";
import { useCategories } from "../../../features/categories/hooks/useCategories";
import { useBrands } from "../../../features/brands/hooks/useBrands";
import ProductFormDialog from "../../../features/products/components/ProductFormDialog";
import ProductTable from "../../../features/products/components/ProductTable";
import Pagination from "../../../components/common/Pagination";
import { useTableMinHeight } from "../../../hooks/useTableMinHeight";
import { useDialog } from "../../../contexts";
import ProductToolbar from "../../../features/products/components/ProductToolbar";
import type { ProductFilters, ProductQueryParams } from "../../../features/products/types/requests";

const ProductPage: React.FC = () => {
    const { showDialog } = useDialog();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);

    const [queryParams, setQueryParams] = useState<ProductQueryParams>({
        keyword: "",
        categoryId: "",
        brandId: "",
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
        isLoading,
        totalRecord,
        isFetching,
        deleteProduct,
    } = useProducts(queryParams);

    const { leafCategories } = useCategories();

    const { brands } = useBrands();

    const handleOpenCreate = () => {
        setIsDialogOpen(true);
        setSelectedProduct(undefined);
    }

    const handleOpenEdit = (product: Product) => {
        setIsDialogOpen(true);
        setSelectedProduct(product);
    }

    const handleDeleteProduct = (productId: string) => {
        showDialog({
            title: "XÁC NHẬN XOÁ SẢN PHẨM",
            message: "Sản phẩm này sẽ bị xoá vĩnh viễn. Bạn có chắc chắn muốn tiếp tục?",
            confirmText: "Xoá",
            cancelText: "Hủy",
            confirmColor: "error",
            onConfirm: () => deleteProduct(productId)
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
                        isLoading={isLoading || isFetching}
                        sortBy={queryParams.sortBy}
                        isAscending={queryParams.isAscending}
                        onSort={handleSortChange}
                        onEdit={handleOpenEdit}
                        onDelete={handleDeleteProduct}
                    />
                </div>
                
                {!isLoading && brands.length > 0 && (
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
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                initialData={selectedProduct}
                leafCategories={leafCategories}
                brands={brands}
            />
        </div>
    );
}

export default ProductPage;