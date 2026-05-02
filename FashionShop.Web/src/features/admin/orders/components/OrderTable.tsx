import type React from "react";
import { 
    IoArrowDown, 
    IoArrowUp, 
    IoSwapVertical, 
    IoEyeOutline,
    IoEllipsisHorizontal,
    IoCalendarOutline,
    IoLocationOutline,
    IoCardOutline,
    IoCubeOutline,
    IoChevronDownOutline,
    IoWalletOutline
} from "react-icons/io5";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import type { Order } from "../types/order";
import AddressString from "../../../shop/addresses/components/AddressString";
import type { OrderStatus, PaymentStatus } from "../types/requests";

// 1. Định nghĩa Config cho Trạng thái với Type Safety
const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string; border: string; dot: string }> & { [key: string]: any } = {
    Pending: { label: 'Chờ xử lý', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', dot: 'bg-amber-400' },
    Confirmed: { label: 'Xác nhận', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', dot: 'bg-blue-400' },
    Shipping: { label: 'Đang giao', color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200', dot: 'bg-indigo-400' },
    Success: { label: 'Thành công', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', dot: 'bg-emerald-400' },
    Cancelled: { label: 'Đã hủy', color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200', dot: 'bg-rose-400' },
    Failed: { label: 'Thất bại', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', dot: 'bg-red-400' },
    Returned: { label: 'Trả hàng', color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200', dot: 'bg-gray-400' },
    Refunded: { label: 'Hoàn tiền', color: 'text-fuchsia-600', bg: 'bg-fuchsia-50', border: 'border-fuchsia-200', dot: 'bg-fuchsia-400' },
};

const PAYMENT_CONFIG: Record<PaymentStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> & { [key: string]: any } = {
    Unpaid: { label: 'Chờ thanh toán', color: 'text-slate-500', bg: 'bg-slate-100', icon: <IoWalletOutline className="mr-1" /> },
    Paid: { label: 'Đã thanh toán', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: <IoCardOutline className="mr-1" /> },
};

const ORDER_STATUS_OPTIONS = Object.entries(STATUS_CONFIG).map(([value, config]) => ({
    value,
    label: config.label
}));

const PAYMENT_STATUS_OPTIONS = Object.entries(PAYMENT_CONFIG).map(([value, config]) => ({
    value,
    label: config.label
}));

interface Props {
    data: Order[];
    isLoading: boolean;
    sortBy: string;
    isAscending?: boolean;
    onSort: (colKey: string, direction: boolean) => void;
    onViewDetail: (order: Order) => void;
    onUpdateOrder: (orderId: string, orderStatus?: OrderStatus, paymentStatus?: PaymentStatus) => void;
}

const OrderTable: React.FC<Props> = ({
    data,
    isLoading,
    sortBy,
    isAscending,
    onSort,
    onViewDetail,
    onUpdateOrder
}) => {

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const handleHeaderClick = (colKey: string) => {
        if (sortBy === colKey) onSort(colKey, !isAscending);
        else onSort(colKey, true);
    };

    const SortableHeader = ({ label, colKey, align = 'left' }: { label: string, colKey: string, align?: 'left' | 'center' | 'right' }) => {
        const isActive = sortBy.toLowerCase() === colKey.toLowerCase();
        const alignClass = align === 'center' ? 'justify-center' : align === 'right' ? 'justify-end' : 'justify-start';

        return (
            <div className={`flex items-center gap-1.5 cursor-pointer group select-none ${alignClass}`} onClick={() => handleHeaderClick(colKey)}>
                <span className={`text-[11px] font-black uppercase tracking-widest transition-colors duration-200 ${isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-600'}`}>
                    {label}
                </span>
                <span className="flex items-center justify-center w-4 h-4 transition-all duration-200">
                    {isActive ? (
                        isAscending ? <IoArrowUp size={12} className="text-indigo-600" /> : <IoArrowDown size={12} className="text-indigo-600" />
                    ) : (
                        <IoSwapVertical size={12} className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                </span>
            </div>
        );
    };

    const TableRowSkeleton = () => (
        <tr className="animate-pulse border-b border-gray-50 last:border-none">
            <td className="px-8 py-6"><div className="h-5 w-24 bg-gray-100 rounded-lg"></div></td>
            <td className="px-6 py-6"><div className="h-5 w-48 bg-gray-100 rounded-lg"></div></td>
            <td className="px-6 py-6"><div className="flex -space-x-2"><div className="h-10 w-10 bg-gray-100 rounded-full border-2 border-white"></div></div></td>
            <td className="px-6 py-6"><div className="h-5 w-24 bg-gray-100 rounded-lg"></div></td>
            <td className="px-6 py-6"><div className="h-12 w-32 mx-auto bg-gray-100 rounded-xl"></div></td>
            <td className="px-8 py-6"><div className="h-10 w-10 ml-auto bg-gray-100 rounded-xl"></div></td>
        </tr>
    );

    return (
        <div className="bg-white rounded-[32px] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden flex flex-col font-sans">
            <div className="overflow-x-auto relative scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                <table className="w-full text-left border-collapse min-w-[1200px]">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                            <th className="px-8 py-6 sticky top-0 z-20 bg-gray-50/50 backdrop-blur-xl w-[15%]">
                                <SortableHeader label="Mã Đơn" colKey="id" />
                            </th>
                            <th className="px-6 py-6 sticky top-0 z-20 bg-gray-50/50 backdrop-blur-xl w-[25%]">
                                <SortableHeader label="Thông tin Giao hàng" colKey="shippingCity" />
                            </th>
                            <th className="px-6 py-6 sticky top-0 z-20 bg-gray-50/50 backdrop-blur-xl w-[15%]">
                                <span className="text-[11px] font-black uppercase tracking-widest text-gray-400">Sản phẩm</span>
                            </th>
                            <th className="px-6 py-6 sticky top-0 z-20 bg-gray-50/50 backdrop-blur-xl w-[15%]">
                                <SortableHeader label="Giá trị đơn" colKey="totalAmount" />
                            </th>
                            <th className="px-6 py-6 sticky top-0 z-20 bg-gray-50/50 backdrop-blur-xl text-center w-[18%]">
                                <SortableHeader label="Trạng thái & Thanh toán" colKey="orderStatus" align="center" />
                            </th>
                            <th className="px-8 py-6 sticky top-0 z-20 bg-gray-50/50 backdrop-blur-xl text-right w-[12%]">
                                <span className="text-[11px] font-black uppercase tracking-widest text-gray-400">Hành động</span>
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-50">
                        {isLoading ? (
                            [...Array(5)].map((_, index) => <TableRowSkeleton key={index} />)
                        ) : data.length > 0 ? (
                            data.map((item) => {
                                const status = STATUS_CONFIG[item.orderStatus] || STATUS_CONFIG.Pending;
                                const payment = PAYMENT_CONFIG[item.paymentStatus] || PAYMENT_CONFIG.Unpaid;

                                return (
                                    <tr key={item.id} className="group hover:bg-gray-50/80 transition-all duration-300">
                                        {/* 1. MÃ ĐƠN & NGÀY */}
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col gap-1">
                                                <span className="font-black text-gray-900 text-[14px] tracking-tight uppercase">
                                                    #{item.id.slice(0, 8)}
                                                </span>
                                                <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-medium">
                                                    <IoCalendarOutline size={13} />
                                                    {format(new Date(item.orderDate), "dd MMM, yyyy", { locale: vi })}
                                                </div>
                                            </div>
                                        </td>

                                        {/* 2. THÔNG TIN KHÁCH HÀNG & GIAO HÀNG */}
                                        <td className="px-6 py-6">
                                            <div className="flex flex-col gap-2 max-w-[300px]">
                                                
                                                {/* DÒNG 1: TÊN & SỐ ĐIỆN THOẠI */}
                                                <div className="flex items-center gap-2">
                                                    <span className="font-black text-gray-900 text-[14px] leading-none shrink-0">
                                                        {item.fullName}
                                                    </span>
                                                    <span className="h-3 w-[1px] bg-gray-200"></span> {/* Vạch ngăn cách nhẹ */}
                                                    <span className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-lg text-[11px] font-bold tracking-tighter border border-indigo-100 shadow-sm">
                                                        {item.phoneNumber}
                                                    </span>
                                                </div>

                                                {/* DÒNG 2: ĐỊA CHỈ */}
                                                <div className="flex items-start gap-1.5 text-gray-500 text-[11px] font-medium leading-relaxed group-hover:text-gray-700 transition-colors">
                                                    <IoLocationOutline className="text-indigo-400 shrink-0 mt-0.5" size={14} />
                                                    <div className="line-clamp-2 italic">
                                                        <AddressString 
                                                            addressDetail={item.shippingAddress}
                                                            communeCode={item.shippingCommune}
                                                            districtCode={item.shippingDistrict}
                                                            cityCode={item.shippingCity}
                                                        />
                                                    </div>
                                                </div>

                                            </div>
                                        </td>

                                        {/* 3. SẢN PHẨM */}
                                        <td className="px-6 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="flex -space-x-3 overflow-hidden">
                                                    {item.orderDetails.slice(0, 3).map((detail, i) => (
                                                        <div key={i} className="inline-block h-10 w-10 rounded-2xl ring-4 ring-white bg-white overflow-hidden border border-gray-100 shadow-sm transition-transform group-hover:scale-110" style={{ transitionDelay: `${i * 50}ms` }}>
                                                            <img src={detail.imageUrl || '/placeholder.png'} alt="item" className="h-full w-full object-cover" />
                                                        </div>
                                                    ))}
                                                </div>
                                                {item.orderDetails.length > 3 && (
                                                    <span className="text-[10px] font-black text-gray-400 bg-gray-100 px-2 py-1 rounded-lg">
                                                        +{item.orderDetails.length - 3}
                                                    </span>
                                                )}
                                            </div>
                                        </td>

                                        {/* 4. TỔNG TIỀN */}
                                        <td className="px-6 py-6">
                                            <div className="flex flex-col gap-1">
                                                <div className="font-black text-gray-900 text-[15px]">
                                                    {formatCurrency(item.totalAmount)}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                    <IoCardOutline className="shrink-0" />
                                                    {item.paymentMethod}
                                                </div>
                                            </div>
                                        </td>

                                        {/* 5. TRẠNG THÁI (Đã sửa lỗi index và nâng cấp UI) */}
                                        <td className="px-6 py-6">
                                            <div className="flex flex-col items-center gap-2.5">
                                                {/* Order Status */}
                                                <div className="group/select relative w-full max-w-[160px]">
                                                    <div className={`flex items-center justify-between px-3 py-2 rounded-xl border-2 transition-all duration-300 ${status.bg} ${status.border} group-hover/select:shadow-lg group-hover/select:shadow-indigo-500/10 cursor-pointer`}>
                                                        <div className="flex items-center gap-2">
                                                            <span className={`w-2 h-2 rounded-full animate-pulse ${status.dot}`} />
                                                            <span className={`text-[11px] font-bold uppercase tracking-tight ${status.color}`}>
                                                                {status.label}
                                                            </span>
                                                        </div>
                                                        <IoChevronDownOutline className={`transition-transform duration-300 group-hover/select:rotate-180 opacity-40 ${status.color}`} />
                                                    </div>
                                                    <select
                                                        value={item.orderStatus}
                                                        onChange={(e) => onUpdateOrder(item.id, e.target.value as OrderStatus, undefined)}
                                                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                    >
                                                        {ORDER_STATUS_OPTIONS.map(opt => (
                                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                {/* Payment Status */}
                                                <div className="group/pay relative">
                                                    <div className={`flex items-center px-2.5 py-1 rounded-lg border transition-all duration-200 ${payment.bg} border-transparent group-hover/pay:border-gray-300 cursor-pointer`}>
                                                        <span className={`flex items-center text-[10px] font-extrabold uppercase tracking-tighter ${payment.color}`}>
                                                            {payment.icon}
                                                            {payment.label}
                                                        </span>
                                                    </div>
                                                    <select
                                                        value={item.paymentStatus}
                                                        onChange={(e) => onUpdateOrder(item.id, undefined, e.target.value as PaymentStatus)}
                                                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                    >
                                                        {PAYMENT_STATUS_OPTIONS.map(opt => (
                                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </td>

                                        {/* 6. HÀNH ĐỘNG */}
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                                                <button onClick={() => onViewDetail(item)} className="w-11 h-11 flex items-center justify-center text-gray-400 hover:text-white hover:bg-indigo-600 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-indigo-200 hover:shadow-xl active:scale-95">
                                                    <IoEyeOutline size={20} />
                                                </button>
                                                <button className="w-11 h-11 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-white border border-transparent hover:border-gray-200 rounded-2xl transition-all duration-300 shadow-sm">
                                                    <IoEllipsisHorizontal size={20} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-32 text-center">
                                    <div className="flex flex-col items-center justify-center gap-6">
                                        <div className="w-24 h-24 bg-gray-50 rounded-[40px] flex items-center justify-center shadow-inner border border-gray-100">
                                            <IoCubeOutline className="text-5xl text-gray-200" />
                                        </div>
                                        <h3 className="text-gray-900 font-black text-xl uppercase tracking-tighter">Kho đơn hàng trống</h3>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrderTable;