import type React from "react";
import { 
    IoArrowDown, 
    IoArrowUp, 
    IoSwapVertical, 
    IoEyeOutline,
    IoCalendarOutline,
    IoLocationOutline,
    IoCardOutline,
    IoCubeOutline,
    IoChevronDownOutline,
    IoWalletOutline,
    IoQrCodeOutline
} from "react-icons/io5";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import type { OrderSummary } from "../types/order";
import AddressString from "../../../shop/addresses/components/AddressString";
import type { OrderStatus, PaymentStatus } from "../types/requests";

// 1. Config Trạng thái với màu sắc mềm mại chuẩn Minimalism
const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string; border: string; dot: string }> & { [key: string]: any } = {
    Pending: { label: 'Chờ xử lý', color: 'text-amber-700', bg: 'bg-amber-50/80', border: 'border-amber-200/60', dot: 'bg-amber-500' },
    Confirmed: { label: 'Xác nhận', color: 'text-blue-700', bg: 'bg-blue-50/80', border: 'border-blue-200/60', dot: 'bg-blue-500' },
    Shipping: { label: 'Đang giao', color: 'text-indigo-700', bg: 'bg-indigo-50/80', border: 'border-indigo-200/60', dot: 'bg-indigo-500' },
    Success: { label: 'Thành công', color: 'text-emerald-700', bg: 'bg-emerald-50/80', border: 'border-emerald-200/60', dot: 'bg-emerald-500' },
    Cancelled: { label: 'Huỷ đơn', color: 'text-rose-700', bg: 'bg-rose-50/80', border: 'border-rose-200/60', dot: 'bg-rose-500' },
    Failed: { label: 'Thất bại', color: 'text-red-700', bg: 'bg-red-50/80', border: 'border-red-200/60', dot: 'bg-red-500' },
    Returned: { label: 'Trả hàng', color: 'text-gray-700', bg: 'bg-gray-100/80', border: 'border-gray-200/60', dot: 'bg-gray-500' },
    Refunded: { label: 'Hoàn tiền', color: 'text-fuchsia-700', bg: 'bg-fuchsia-50/80', border: 'border-fuchsia-200/60', dot: 'bg-fuchsia-500' },
};

const PAYMENT_CONFIG: Record<PaymentStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> & { [key: string]: any } = {
    Unpaid: { label: 'Chờ thanh toán', color: 'text-zinc-600', bg: 'bg-zinc-100/80', icon: <IoWalletOutline className="mr-1 shrink-0" /> },
    Paid: { label: 'Đã thanh toán', color: 'text-emerald-700', bg: 'bg-emerald-50/80', icon: <IoCardOutline className="mr-1 shrink-0" /> },
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
    data: OrderSummary[];
    isLoading: boolean;
    sortBy: string;
    isAscending?: boolean;
    onSort: (colKey: string, direction: boolean) => void;
    onViewDetail: (orderId: string) => void;
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
            <div className={`inline-flex items-center gap-1.5 cursor-pointer group/header select-none ${alignClass}`} onClick={() => handleHeaderClick(colKey)}>
                <span className={`text-xs font-bold tracking-wider uppercase transition-colors duration-150 ${isActive ? 'text-zinc-950' : 'text-zinc-800 group-hover/header:text-zinc-950'}`}>
                    {label}
                </span>
                <span className="flex items-center justify-center w-3 h-3 transition-opacity duration-150">
                    {isActive ? (
                        isAscending ? <IoArrowUp size={12} className="text-zinc-950" /> : <IoArrowDown size={12} className="text-zinc-950" />
                    ) : (
                        <IoSwapVertical size={12} className="text-zinc-400 opacity-0 group-hover/header:opacity-100 transition-opacity" />
                    )}
                </span>
            </div>
        );
    };

    const TableRowSkeleton = () => (
        <tr className="animate-pulse border-b border-zinc-100/80">
            <td className="px-6 py-5"><div className="h-4 w-20 bg-zinc-100 rounded-md"></div></td>
            <td className="px-6 py-5"><div className="h-4 w-44 bg-zinc-100 rounded-md"></div></td>
            <td className="px-6 py-5"><div className="flex -space-x-1.5"><div className="h-7 w-7 bg-zinc-100 rounded-full border border-white"></div></div></td>
            <td className="px-6 py-5"><div className="h-4 w-24 bg-zinc-100 rounded-md"></div></td>
            <td className="px-6 py-5"><div className="h-8 w-32 mx-auto bg-zinc-100 rounded-lg"></div></td>
            <td className="px-6 py-5"><div className="h-8 w-8 ml-auto bg-zinc-100 rounded-lg"></div></td>
        </tr>
    );

    return (
        <div className="w-full bg-white rounded-2xl border border-zinc-200/70 overflow-hidden font-sans">
            <div className="overflow-x-auto relative">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                    <thead>
                        {/* Tiêu đề cột được làm nổi bật với chữ đậm và màu rõ nét hơn */}
                        <tr className="border-b border-zinc-200 bg-zinc-100/60">
                            <th className="px-6 py-4 w-[16%]">
                                <SortableHeader label="Mã đơn" colKey="orderId" />
                            </th>
                            <th className="px-6 py-4 w-[26%]">
                                <SortableHeader label="Giao hàng" colKey="shippingCity" />
                            </th>
                            <th className="px-6 py-4 w-[14%]">
                                <span className="text-xs font-bold tracking-wider uppercase text-zinc-800">Sản phẩm</span>
                            </th>
                            <th className="px-6 py-4 w-[16%]">
                                <SortableHeader label="Tổng tiền" colKey="totalAmount" />
                            </th>
                            <th className="px-6 py-4 text-center w-[18%]">
                                <SortableHeader label="Trạng thái" colKey="orderStatus" align="center" />
                            </th>
                            <th className="px-6 py-4 text-right w-[10%]">
                                <span className="text-xs font-bold tracking-wider uppercase text-zinc-800">Thao tác</span>
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-zinc-100">
                        {isLoading ? (
                            [...Array(5)].map((_, index) => <TableRowSkeleton key={index} />)
                        ) : data.length > 0 ? (
                            data.map((item) => {
                                const status = STATUS_CONFIG[item.orderStatus] || STATUS_CONFIG.Pending;
                                const payment = PAYMENT_CONFIG[item.paymentStatus] || PAYMENT_CONFIG.Unpaid;
                                const isEditable = item.orderStatus !== 'Success' && item.orderStatus !== 'Cancelled';

                                return (
                                    <tr key={item.orderId} className="group hover:bg-zinc-50/70 transition-colors duration-150">
                                        
                                        {/* 1. MÃ ĐƠN & NGÀY */}
                                        <td className="px-6 py-4 align-top">
                                            <div className="flex flex-col gap-1">
                                                <span className="font-mono font-bold text-zinc-900 text-xs tracking-tight">
                                                    #{item.orderId.slice(0, 8).toUpperCase()}
                                                </span>

                                                {item.transferCode && (
                                                    <div className="inline-flex items-center gap-1 text-[11px] font-mono text-zinc-500 bg-zinc-100 px-1.5 py-0.5 rounded w-fit">
                                                        <IoQrCodeOutline size={12} className="text-zinc-400" />
                                                        <span>{item.transferCode}</span>
                                                    </div>
                                                )}

                                                <div className="flex items-center gap-1 text-[11px] text-zinc-400 mt-0.5">
                                                    <IoCalendarOutline size={12} />
                                                    <span>{format(new Date(item.orderDate), "dd/MM/yyyy", { locale: vi })}</span>
                                                </div>
                                            </div>
                                        </td>

                                        {/* 2. KHÁCH HÀNG & ĐỊA CHỈ */}
                                        <td className="px-6 py-4 align-top">
                                            <div className="flex flex-col gap-1 max-w-[260px]">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-zinc-900 text-sm">
                                                        {item.fullName}
                                                    </span>
                                                    <span className="text-zinc-300">•</span>
                                                    <span className="text-xs text-zinc-500 font-mono">
                                                        {item.phoneNumber}
                                                    </span>
                                                </div>

                                                {/* Địa chỉ với size chữ nhỏ hơn (text-[10px]) */}
                                                <div className="flex items-start gap-1 text-[10px] text-zinc-400 leading-relaxed">
                                                    <IoLocationOutline className="text-zinc-400 shrink-0 mt-0.5" size={13} />
                                                    <div className="line-clamp-2">
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
                                        <td className="px-6 py-4 align-top">
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                <div className="flex -space-x-2 overflow-hidden">
                                                    {item.orderItems?.slice(0, 3).map((detail, i) => (
                                                        <img 
                                                            key={i} 
                                                            src={detail.imageUrl || '/placeholder.png'} 
                                                            alt="product" 
                                                            className="inline-block h-8 w-8 rounded-lg object-cover ring-2 ring-white border border-zinc-200/80 bg-zinc-50"
                                                        />
                                                    ))}
                                                </div>

                                                {item.orderItems?.length > 3 && (
                                                    <span className="text-[10px] font-bold text-zinc-500 bg-zinc-100 px-1.5 py-1 rounded-md">
                                                        +{item.orderItems.length - 3}
                                                    </span>
                                                )}
                                            </div>
                                        </td>

                                        {/* 4. TỔNG TIỀN */}
                                        <td className="px-6 py-4 align-top">
                                            <div className="flex flex-col gap-0.5">
                                                <span className="font-semibold text-zinc-900 text-sm">
                                                    {formatCurrency(item.totalAmount)}
                                                </span>

                                                <div className="flex items-center gap-1 text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
                                                    <IoCardOutline size={12} className="shrink-0" />
                                                    <span>{item.paymentMethod}</span>
                                                </div>
                                            </div>
                                        </td>

                                        {/* 5. TRẠNG THÁI */}
                                        <td className="px-6 py-4 align-top">
                                            <div className="flex flex-col items-center gap-1.5">

                                                {/* Trạng thái đơn hàng */}
                                                <div className="relative group/select w-full max-w-[130px]">
                                                    <div className={`flex items-center justify-between px-2.5 py-1 rounded-full border transition-all ${status.bg} ${status.border}`}>
                                                        <div className="flex items-center gap-1.5 min-w-0">
                                                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${status.dot}`} />
                                                            <span className={`text-[11px] font-medium truncate ${status.color}`}>
                                                                {status.label}
                                                            </span>
                                                        </div>
                                                        {isEditable && (
                                                            <IoChevronDownOutline size={11} className={`ml-1 shrink-0 opacity-50 ${status.color}`} />
                                                        )}
                                                    </div>

                                                    {isEditable && (
                                                        <select
                                                            value={item.orderStatus}
                                                            onChange={(e) => onUpdateOrder(item.orderId, e.target.value as OrderStatus, undefined)}
                                                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                                                        >
                                                            {ORDER_STATUS_OPTIONS.map(opt => (
                                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                            ))}
                                                        </select>
                                                    )}
                                                </div>

                                                {/* Trạng thái thanh toán */}
                                                <div className="relative group/pay w-full max-w-[130px]">
                                                    <div className={`flex items-center justify-center px-2 py-0.5 rounded-md text-[10px] font-medium ${payment.bg} ${payment.color}`}>
                                                        {payment.icon}
                                                        <span>{payment.label}</span>
                                                    </div>

                                                    {isEditable && (
                                                        <select
                                                            value={item.paymentStatus}
                                                            onChange={(e) => onUpdateOrder(item.orderId, undefined, e.target.value as PaymentStatus)}
                                                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                                                        >
                                                            {PAYMENT_STATUS_OPTIONS.map(opt => (
                                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                            ))}
                                                        </select>
                                                    )}
                                                </div>

                                            </div>
                                        </td>

                                        {/* 6. THAO TÁC (Ẩn nút, chỉ hiển thị Icon Con Mắt khi Hover dòng) */}
                                        <td className="px-6 py-4 align-middle text-right">
                                            <div className="flex items-center justify-end opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-1 group-hover:translate-x-0">
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); onViewDetail(item?.orderId); }} 
                                                    className="w-9 h-9 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-indigo-600 rounded-xl transition-all duration-200 shadow-sm hover:shadow-indigo-200 hover:shadow-lg active:scale-95" 
                                                    title="Xem chi tiết"
                                                >
                                                    <IoEyeOutline size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-20 text-center">
                                    <div className="flex flex-col items-center justify-center gap-3">
                                        <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-400">
                                            <IoCubeOutline size={24} />
                                        </div>
                                        <p className="text-zinc-500 font-medium text-sm">
                                            Không có đơn hàng nào
                                        </p>
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