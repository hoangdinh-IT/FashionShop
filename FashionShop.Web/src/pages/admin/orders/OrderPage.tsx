import { useState } from "react";
import type { Order } from "../../../features/admin/orders/types/order";
import type { OrderFilters, OrderQueryParams, OrderStatus, PaymentStatus } from "../../../features/admin/orders/types/requests";
import { useOrderMutations, useOrders } from "../../../features/admin/orders/hooks/useOrders";
import { useTableMinHeight } from "../../../hooks/useTableMinHeight";
import Pagination from "../../../components/common/Pagination";
import OrderTable from "../../../features/admin/orders/components/OrderTable";
import OrderDetailDialog from "../../../features/admin/orders/components/OrderDetailDialog";
import OrderToolbar from "../../../features/admin/orders/components/OrderToolbar";

const OrderPage = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | undefined>(undefined);

    const [queryParams, setQueryParams] = useState<OrderQueryParams>({
        keyword: undefined,
        orderStatus: undefined,
        paymentMethod: undefined,
        paymentStatus: undefined,
        fromOrderDate: undefined,
        toOrderDate: undefined,
        pageSize: 5,
        pageIndex: 1,
        sortBy: "createddate",
        isAscending: false,
    })

    const {
        pagedOrders,
        totalRecord,
        isFetching
    } = useOrders(queryParams);

    const { updateOrder } = useOrderMutations();

    const handleSearch = (text: string) => {
        setQueryParams(prev => ({
            ...prev,
            keyword: text,
            pageIndex: 1
        }));
    }

    const handleFilterChange = (newFilters: OrderFilters) => {
        setQueryParams(prev => ({
            ...prev,
            ...newFilters,
            pageIndex: 1
        }));
    }

    const handleSortChange = (colKey: string, isAscending: boolean) => {
        setQueryParams(prev => ({
            ...prev,
            sortBy: colKey,
            isAscending: isAscending,
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

    const handleUpdateOrder = (orderId: string, orderStatus?: OrderStatus, paymentStatus?: PaymentStatus) => {
        updateOrder({
            orderId,
            request: {
                orderStatus: orderStatus,
                paymentStatus: paymentStatus
            }
        })
    }

    const handleViewDetail = (order: Order) => {
        setSelectedOrder(order);
        setIsDialogOpen(true);
    }

    const handleCloseDetail = () => {
        setSelectedOrder(undefined);
        setIsDialogOpen(false);
    }

    const tableContainerStyle = useTableMinHeight(queryParams.pageSize);

    return (
        <div className="h-full flex flex-col p-3 md:p-4 space-y-3 bg-gray-50/50"> 
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 shrink-0">
                <div className="flex items-center justify-center w-full">
                    <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600">
                        QUẢN LÝ ĐƠN HÀNG
                    </h1>
                </div>
            </div>

            <div className="shrink-0 z-20">
                <OrderToolbar
                    onSearch={handleSearch}
                    onFilterChange={handleFilterChange}
                />
            </div>

            <div className="flex-1 flex flex-col min-h-0 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                
                <div 
                    className="flex-1 overflow-auto custom-scrollbar relative"
                    style={tableContainerStyle}
                >
                    <OrderTable 
                        data={pagedOrders} 
                        isLoading={isFetching}
                        sortBy={queryParams.sortBy}
                        isAscending={queryParams.isAscending}
                        onSort={handleSortChange}
                        onViewDetail={handleViewDetail}
                        onUpdateOrder={handleUpdateOrder}
                    />
                </div>
                
                {!isFetching && pagedOrders.length > 0 && (
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

            <OrderDetailDialog 
                isOpen={isDialogOpen}
                onClose={handleCloseDetail}
                order={selectedOrder}
            />
        </div>
    );
}

export default OrderPage;