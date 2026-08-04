import { useState } from "react";
import type { Coupon } from "../../../features/admin/coupons/types/coupon";
import type { CouponFilters, CouponQueryParam } from "../../../features/admin/coupons/types/requests";
import { useCouponMutations, useCoupons } from "../../../features/admin/coupons/hooks/useCoupons";
import { useDialog } from "../../../contexts";
import { useTableMinHeight } from "../../../hooks/useTableMinHeight";
import { IoAdd } from "react-icons/io5";
import CouponTable from "../../../features/admin/coupons/components/CouponTable";
import CouponToolbar from "../../../features/admin/coupons/components/CouponToolbar";
import Pagination from "../../../components/common/Pagination";
import CouponFormModal from "../../../features/admin/coupons/components/CouponFormModal";

const CouponPage = () => {
    const { showDialog } = useDialog();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCoupon, setSelectedCoupon] = useState<Coupon | undefined>(undefined);

    const [queryParams, setQueryParams] = useState<CouponQueryParam>({
        keyword: undefined,
        discountType: undefined,
        isActive: undefined,
        fromDate: undefined,
        toDate: undefined,
        status: undefined,
        isAvailable: undefined,
        fromMinOrderValue: undefined,
        toMinOrderValue: undefined,
        pageSize: 5,
        pageIndex: 1,
        sortBy: "createddate",
        isAscending: false,
    });

    const {
        pagedCoupons,
        totalRecord,
        isFetching
    } = useCoupons(queryParams);

    const { deleteCoupon } = useCouponMutations();

    const handleOpenCreate = () => {
        setIsModalOpen(true);
        setSelectedCoupon(undefined);
    };

    const handleOpenEdit = (coupon: Coupon) => {
        setIsModalOpen(true);
        setSelectedCoupon(coupon);
    };

    const handleDelete = (couponId: string) => {
        showDialog({
            title: "XÁC NHẬN XOÁ MÃ GIẢM GIÁ",
            message: "Mã giảm giá này sẽ bị xoá vĩnh viễn. Bạn có chắc chắn muốn tiếp tục?",
            confirmText: "Xoá",
            cancelText: "Hủy",
            confirmColor: "error",
            onConfirm: () => deleteCoupon(couponId)
        });
    };

    const handleSearch = (text: string) => {
        setQueryParams(prev => ({
            ...prev,
            keyword: text,
            pageIndex: 1
        }));
    };

    const handleFilterChange = (newFilters: CouponFilters) => {
        setQueryParams(prev => ({
            ...prev,
            ...newFilters,
            pageIndex: 1
        }));
    };

    const handleSortChange = (colKey: string, isAscending: boolean) => {
        setQueryParams(prev => ({
            ...prev,
            sortBy: colKey,
            isAscending: isAscending,
            pageIndex: 1,
        }));
    };

    const handlePageChange = (newPage: number) => {
        setQueryParams(prev => ({
            ...prev,
            pageIndex: newPage
        }));

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const tableContainerStyle = useTableMinHeight(queryParams.pageSize);

    return (
        <div className="h-full flex flex-col p-2.5 md:p-3 space-y-2.5 bg-gray-50/50"> 
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-2.5 shrink-0">
                
                <div className="flex items-center justify-center w-full">
                    <h1 className="text-[28px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600">
                        QUẢN LÝ PHIẾU GIẢM GIÁ
                    </h1>
                </div>

                <div className="flex items-center gap-2.5 w-full md:w-auto">
                    <button 
                        onClick={handleOpenCreate}
                        className="flex-none flex items-center gap-1.5 bg-gray-900 hover:bg-gray-800 text-white px-3 py-1.5 rounded-md text-[13px] font-semibold transition-all shadow-sm whitespace-nowrap ml-auto md:ml-0"
                    >
                        <IoAdd className="text-base" />
                        <span>Thêm mới</span>
                    </button>
                </div>
            </div>

            <div className="shrink-0 z-20">
                <CouponToolbar
                    onSearch={handleSearch}
                    onFilterChange={handleFilterChange}
                />
            </div>

            <div className="flex-1 flex flex-col min-h-0 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                
                <div 
                    className="flex-1 overflow-auto custom-scrollbar relative"
                    style={tableContainerStyle}
                >
                    <CouponTable 
                        data={pagedCoupons} 
                        isLoading={isFetching}
                        sortBy={queryParams.sortBy}
                        isAscending={queryParams.isAscending}
                        onSort={handleSortChange}
                        onEdit={handleOpenEdit}
                        onDelete={handleDelete}
                    />
                </div>
                
                {!isFetching && pagedCoupons.length > 0 && (
                    <div className="shrink-0 border-t border-gray-100 bg-white px-3 py-2.5 mt-auto">
                        <Pagination
                            totalRecord={totalRecord} 
                            pageSize={queryParams.pageSize}
                            currentPage={queryParams.pageIndex}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}
            </div>

            <CouponFormModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialData={selectedCoupon}
            />
        </div>
    );
};

export default CouponPage;