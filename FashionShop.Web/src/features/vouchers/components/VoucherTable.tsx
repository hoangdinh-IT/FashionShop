import type React from "react";
import { DiscountType, type Voucher } from "../types/voucher";
import { 
    IoArrowDown, 
    IoArrowUp, 
    IoPencil, 
    IoSwapVertical, 
    IoTrashBinOutline, 
    IoTicketOutline,
    IoTicket,
    IoTimeOutline,
    IoWalletOutline,
    IoInformationCircleOutline
} from "react-icons/io5";
import { format, isAfter, isBefore } from "date-fns";
import Tooltip from "../../../components/common/Tooltip";

interface Props {
    data: Voucher[];
    isLoading: boolean;
    sortBy: string;
    isAscending: boolean;
    onSort: (colKey: string, direction: boolean) => void;
    onEdit: (voucher: Voucher) => void;
    onDelete: (voucherId: string) => void;
}

const VoucherTable: React.FC<Props> = ({
    data,
    isLoading,
    sortBy,
    isAscending,
    onSort,
    onEdit,
    onDelete,
}) => {

    // --- UTILS --- //
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const getStatusLabel = (voucher: Voucher) => {
        if (!voucher.isActive) return { label: 'Tạm ngưng', color: 'bg-slate-50 text-slate-500 border-slate-200', dot: 'hidden' };
        
        const now = new Date();
        const start = new Date(voucher.startDate);
        const end = new Date(voucher.endDate);

        if (isBefore(now, start)) return { label: 'Sắp diễn ra', color: 'bg-blue-50 text-blue-600 border-blue-200', dot: 'hidden' };
        if (isAfter(now, end)) return { label: 'Đã hết hạn', color: 'bg-red-50 text-red-600 border-red-200', dot: 'hidden' };
        if (voucher.usedCount >= voucher.quantity) return { label: 'Hết lượt', color: 'bg-orange-50 text-orange-600 border-orange-200', dot: 'hidden' };
        
        return { label: 'Đang diễn ra', color: 'bg-emerald-50 text-emerald-700 border-emerald-100', dot: 'bg-emerald-500' };
    };

    // --- HANDLERS --- //
    const handleHeaderClick = (colKey: string) => {
        if (sortBy === colKey) onSort(colKey, !isAscending);
        else onSort(colKey, true);
    }

    // --- COMPONENTS --- //
    const SortableHeader = ({ label, colKey, align = 'left' }: { label: string, colKey: string, align?: 'left' | 'center' | 'right' }) => {
        const isActive = sortBy.toLowerCase() === colKey.toLowerCase();
        const alignClass = align === 'center' ? 'justify-center' : align === 'right' ? 'justify-end' : 'justify-start';

        return (
            <div 
                className={`flex items-center gap-1.5 cursor-pointer group select-none ${alignClass}`}
                onClick={() => handleHeaderClick(colKey)}
            >
                <span className={`text-xs font-bold uppercase tracking-wider transition-colors duration-200 ${isActive ? 'text-indigo-600' : 'text-gray-500 group-hover:text-gray-700'}`}>
                    {label}
                </span>
                <span className="flex items-center justify-center w-4 h-4 transition-all duration-200">
                    {isActive ? (
                        isAscending ? <IoArrowUp size={12} className="text-indigo-600" /> : <IoArrowDown size={12} className="text-indigo-600" />
                    ) : (
                        <IoSwapVertical size={12} className="text-gray-300 opacity-0 group-hover:opacity-100 group-hover:text-gray-400 transition-opacity" />
                    )}
                </span>
            </div>
        );
    };

    const TableRowSkeleton = () => (
        <tr className="animate-pulse border-b border-gray-50 last:border-none">
            <td className="px-8 py-5"><div className="flex gap-4 items-center"><div className="h-12 w-12 bg-gray-100 rounded-xl"></div><div className="space-y-2"><div className="h-4 w-32 bg-gray-100 rounded"></div><div className="h-3 w-20 bg-gray-50 rounded"></div></div></div></td>
            <td className="px-6 py-5"><div className="space-y-2"><div className="h-5 w-24 bg-gray-100 rounded-md"></div><div className="h-3 w-32 bg-gray-50 rounded-md"></div></div></td>
            <td className="px-6 py-5"><div className="space-y-2"><div className="h-4 w-full bg-gray-100 rounded-full"></div><div className="h-3 w-16 mx-auto bg-gray-50 rounded-md"></div></div></td>
            <td className="px-6 py-5"><div className="space-y-2"><div className="h-4 w-24 mx-auto bg-gray-100 rounded"></div><div className="h-3 w-20 mx-auto bg-gray-50 rounded"></div></div></td>
            <td className="px-6 py-5"><div className="h-6 w-24 mx-auto bg-gray-100 rounded-full"></div></td>
            <td className="px-8 py-5"><div className="h-8 w-20 ml-auto bg-gray-100 rounded-lg"></div></td>
        </tr>
    );

    return (
        <div className="bg-white rounded-[24px] shadow-[0_0_40px_-10px_rgba(0,0,0,0.05)] border border-gray-100/80 overflow-hidden flex flex-col font-sans">
            <div className="overflow-x-auto overflow-y-auto max-h-[650px] relative scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent hover:scrollbar-thumb-gray-300 transition-colors">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                    {/* --- HEADER --- */}
                    <thead>
                        <tr className="bg-gray-50/80 backdrop-blur-md border-b border-gray-100">
                            <th className="px-8 py-4 sticky top-0 z-20 bg-gray-50/95 backdrop-blur-sm w-[25%]">
                                <SortableHeader label="Voucher" colKey="code" />
                            </th>
                            <th className="px-6 py-4 sticky top-0 z-20 bg-gray-50/95 backdrop-blur-sm w-[20%]">
                                <SortableHeader label="Mức giảm" colKey="discountAmount" />
                            </th>
                            <th className="px-6 py-4 sticky top-0 z-20 bg-gray-50/95 backdrop-blur-sm text-center w-[15%]">
                                <SortableHeader label="Lượt dùng" colKey="usedCount" align="center" />
                            </th>
                            <th className="px-6 py-4 sticky top-0 z-20 bg-gray-50/95 backdrop-blur-sm text-center w-[15%]">
                                <SortableHeader label="Thời hạn" colKey="endDate" align="center" />
                            </th>
                            <th className="px-6 py-4 sticky top-0 z-20 bg-gray-50/95 backdrop-blur-sm text-center w-[15%]">
                                <SortableHeader label="Trạng thái" colKey="status" align="center" />
                            </th>
                            <th className="px-8 py-4 sticky top-0 z-20 bg-gray-50/95 backdrop-blur-sm text-right w-[10%]">
                                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Hành động</span>
                            </th>
                        </tr>
                    </thead>

                    {/* --- BODY --- */}
                    <tbody className="divide-y divide-gray-50/80">
                        {isLoading ? (
                            [...Array(5)].map((_, index) => <TableRowSkeleton key={index} />)
                        ) : data.length > 0 ? (
                            data.map((item) => {
                                const statusInfo = getStatusLabel(item);
                                const usagePercent = item.quantity > 0 ? (item.usedCount / item.quantity) * 100 : 0;
                                const isLowStock = item.quantity - item.usedCount <= 5 && item.quantity - item.usedCount > 0;

                                return (
                                    <tr key={item.id} className="group hover:bg-indigo-50/40 transition-colors duration-200">
                                        
                                        {/* 1. INFO VOUCHER (Mã Code + Tên) */}
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl shrink-0 border border-orange-100 bg-orange-50/50 flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:border-orange-300 group-hover:bg-white transition-all duration-300">
                                                    <IoTicketOutline className="text-2xl text-orange-500 group-hover:scale-110 transition-transform" />
                                                </div>
                                                
                                                <div className="flex flex-col gap-1.5">
                                                    <div className="inline-flex items-center gap-2">
                                                        <span className="font-bold font-mono tracking-wide text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 text-[13px]">
                                                            {item.code}
                                                        </span>
                                                        {item.description && (
                                                            <Tooltip 
                                                                title="Mô tả thương hiệu" 
                                                                headerIcon={<IoInformationCircleOutline className="text-lg" />}
                                                                content={
                                                                    <div className="whitespace-pre-line text-left text-sm text-gray-600 leading-relaxed max-w-xs">
                                                                        {item.description}
                                                                    </div>
                                                                }
                                                            >
                                                                <div className="text-gray-300 hover:text-indigo-500 cursor-help transition-colors">
                                                                    <IoInformationCircleOutline className="text-lg" />
                                                                </div>
                                                            </Tooltip>
                                                        )}
                                                    </div>
                                                    <div className="font-medium text-gray-600 text-[13px] line-clamp-1" title={item.name}>
                                                        {item.name}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* 2. MỨC GIẢM & ĐIỀU KIỆN */}
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col gap-1">
                                                <div className="font-bold text-rose-600 text-[15px]">
                                                    {item.discountType === DiscountType.FixedAmount 
                                                        ? formatCurrency(item.discountAmount) 
                                                        : `Giảm ${item.discountAmount}%`
                                                    }
                                                    {item.maxDiscountAmount && item.discountType !== DiscountType.FixedAmount && (
                                                        <span className="text-xs text-gray-400 font-normal ml-1">
                                                            (Tối đa {formatCurrency(item.maxDiscountAmount)})
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-[12px] text-gray-500 flex items-center gap-1.5">
                                                    <IoWalletOutline className="text-gray-400" />
                                                    Đơn tối thiểu {formatCurrency(item.minOrderValue)}
                                                </div>
                                            </div>
                                        </td>

                                        {/* 3. LƯỢT DÙNG (Kèm Progress Bar) */}
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col items-center gap-1.5 w-full max-w-[120px] mx-auto">
                                                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                                    <div 
                                                        className={`h-1.5 rounded-full transition-all duration-500 ${usagePercent >= 100 ? 'bg-red-500' : isLowStock ? 'bg-orange-500' : 'bg-indigo-500'}`}
                                                        style={{ width: `${Math.min(usagePercent, 100)}%` }}
                                                    ></div>
                                                </div>
                                                <div className="flex justify-between items-center w-full text-[11px]">
                                                    <span className="font-semibold text-gray-700">{item.usedCount}</span>
                                                    <span className="text-gray-400">/ {item.quantity}</span>
                                                </div>
                                            </div>
                                        </td>

                                        {/* 4. THỜI HẠN */}
                                        <td className="px-6 py-5 text-center">
                                            <div className="flex flex-col items-center gap-1">
                                                <div className="text-[13px] font-medium text-gray-700">
                                                    {format(new Date(item.startDate), "dd/MM/yyyy")} - {format(new Date(item.endDate), "dd/MM/yyyy")}
                                                </div>
                                                <div className="text-[11px] text-gray-400 flex items-center gap-1">
                                                    <IoTimeOutline />
                                                    {format(new Date(item.endDate), "HH:mm")}
                                                </div>
                                            </div>
                                        </td>

                                        {/* 5. TRẠNG THÁI */}
                                        <td className="px-6 py-5 text-center">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold border shadow-sm transition-transform hover:scale-105 ${statusInfo.color}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${statusInfo.dot}`}></span>
                                                {statusInfo.label}
                                            </span>
                                        </td>

                                        {/* 6. HÀNH ĐỘNG */}
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); onEdit?.(item); }} 
                                                    className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-white hover:bg-violet-500 rounded-xl transition-all duration-200 shadow-sm hover:shadow-violet-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-95" 
                                                    title="Chỉnh sửa"
                                                >
                                                    <IoPencil className="text-[17px]" />
                                                </button>
                                                
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); onDelete?.(item.id); }} 
                                                    className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-white hover:bg-rose-500 rounded-xl transition-all duration-200 shadow-sm hover:shadow-rose-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-95" 
                                                    title="Xóa"
                                                >
                                                    <IoTrashBinOutline className="text-[17px]" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-24 text-center">
                                    <div className="flex flex-col items-center justify-center gap-4">
                                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center shadow-sm border border-gray-100">
                                            <IoTicket className="text-4xl text-gray-300" />
                                        </div>
                                        <div>
                                            <h3 className="text-gray-800 font-bold text-lg">Chưa có Voucher nào</h3>
                                            <p className="text-gray-400 text-sm mt-1 max-w-xs mx-auto">
                                                Hệ thống chưa ghi nhận mã giảm giá nào. Hãy thử tạo mới ngay bây giờ.
                                            </p>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default VoucherTable;