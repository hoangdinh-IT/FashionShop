import React from 'react';
import { IoPencil, IoTrashBinOutline, IoImageOutline, IoCalendarOutline, IoInformationCircleOutline, IoArrowUp, IoArrowDown, IoSwapVertical } from "react-icons/io5";
import type { Brand } from '../types/brand';
import Tooltip from '../../../../components/common/Tooltip';
import CopyableId from '../../../../components/common/CopyableId';
import { format } from 'date-fns';

interface BrandTableProps {
    data: Brand[];
    isLoading: boolean;
    sortBy: string;
    isAscending?: boolean;
    onSort: (col: string, direction: boolean) => void;
    onEdit?: (brand: Brand) => void;
    onDelete?: (id: string) => void;
}

const BrandTable: React.FC<BrandTableProps> = ({ data, isLoading, sortBy, isAscending, onSort, onEdit, onDelete }) => {

    const handleHeaderClick = (colKey: string) => {
        if (sortBy === colKey) onSort(colKey, !isAscending);
        else onSort(colKey, true);
    }

    const SortableHeader = ({
        label,
        colKey,
        align = 'left'
    }: {
        label: string,
        colKey: string,
        align?: 'left' | 'center' | 'right'
    }) => {

        const isActive = sortBy.toLowerCase() === colKey.toLowerCase();

        const alignClass =
            align === 'center'
                ? 'justify-center'
                : align === 'right'
                    ? 'justify-end'
                    : 'justify-start';

        return (
            <div
                className={`flex items-center gap-1 cursor-pointer group select-none ${alignClass}`}
                onClick={() => handleHeaderClick(colKey)}
            >
                <span
                    className={`text-[11px] font-bold uppercase tracking-wider transition-colors duration-200 ${
                        isActive
                            ? 'text-indigo-600'
                            : 'text-gray-500 group-hover:text-gray-700'
                    }`}
                >
                    {label}
                </span>

                <span className="flex items-center justify-center w-3.5 h-3.5 transition-all duration-200">
                    {isActive ? (
                        isAscending
                            ? <IoArrowUp size={11} className="text-indigo-600" />
                            : <IoArrowDown size={11} className="text-indigo-600" />
                    ) : (
                        <IoSwapVertical
                            size={11}
                            className="text-gray-300 opacity-0 group-hover:opacity-100 group-hover:text-gray-400 transition-opacity"
                        />
                    )}
                </span>
            </div>
        );
    };

    const TableRowSkeleton = () => (
        <tr className="animate-pulse border-b border-gray-50 last:border-none">
            <td className="px-6 py-4">
                <div className="flex gap-3 items-center">
                    <div className="h-10 w-10 bg-gray-100 rounded-lg"></div>

                    <div className="space-y-1.5">
                        <div className="h-3.5 w-28 bg-gray-100 rounded"></div>
                        <div className="h-2.5 w-16 bg-gray-50 rounded"></div>
                    </div>
                </div>
            </td>

            <td className="px-5 py-4">
                <div className="h-5 w-20 bg-gray-100 rounded-md"></div>
            </td>

            <td className="px-5 py-4">
                <div className="h-7 w-7 mx-auto bg-gray-100 rounded-full"></div>
            </td>

            <td className="px-5 py-4">
                <div className="h-3.5 w-20 mx-auto bg-gray-100 rounded"></div>
            </td>

            <td className="px-5 py-4">
                <div className="h-5 w-16 mx-auto bg-gray-100 rounded-full"></div>
            </td>

            <td className="px-6 py-4">
                <div className="h-7 w-14 ml-auto bg-gray-100 rounded-lg"></div>
            </td>
        </tr>
    );

    return (
        <div className="bg-white rounded-[20px] shadow-[0_0_40px_-10px_rgba(0,0,0,0.05)] border border-gray-100/80 overflow-hidden flex flex-col font-sans">

            {/* WRAPPER */}
            <div className="overflow-x-auto overflow-y-auto max-h-[650px] relative scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent hover:scrollbar-thumb-gray-300 transition-colors">

                <table className="w-full text-left border-collapse">

                    {/* HEADER */}
                    <thead>
                        <tr className="bg-gray-50/80 backdrop-blur-md border-b border-gray-100">

                            <th className="px-6 py-3 sticky top-0 z-20 bg-gray-50/95 backdrop-blur-sm">
                                <SortableHeader label="Thương hiệu" colKey="name" />
                            </th>

                            <th className="px-5 py-3 sticky top-0 z-20 bg-gray-50/95 backdrop-blur-sm">
                                <SortableHeader label="Slug" colKey="slug" />
                            </th>

                            <th className="px-5 py-3 sticky top-0 z-20 bg-gray-50/95 backdrop-blur-sm text-center">
                                <SortableHeader label="Sản phẩm" colKey="productcount" align="center" />
                            </th>

                            <th className="px-5 py-3 sticky top-0 z-20 bg-gray-50/95 backdrop-blur-sm text-center">
                                <SortableHeader label="Ngày tạo" colKey="createddate" align="center" />
                            </th>

                            <th className="px-5 py-3 sticky top-0 z-20 bg-gray-50/95 backdrop-blur-sm text-center">
                                <SortableHeader label="Trạng thái" colKey="isActive" align="center" />
                            </th>

                            <th className="px-6 py-3 sticky top-0 z-20 bg-gray-50/95 backdrop-blur-sm text-right">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                                    Hành động
                                </span>
                            </th>
                        </tr>
                    </thead>

                    {/* BODY */}
                    <tbody className="divide-y divide-gray-50/80">
                        {isLoading ? (
                            [...Array(5)].map((_, index) => (
                                <TableRowSkeleton key={index} />
                            ))
                        ) : data.length > 0 ? (
                            data.map((item) => {

                                const hasProducts = item.productCount > 0;

                                return (
                                    <tr
                                        key={item.id}
                                        className="group hover:bg-indigo-50/40 transition-colors duration-200"
                                    >

                                        {/* THÔNG TIN */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">

                                                <div className="w-10 h-10 rounded-lg overflow-hidden bg-white shrink-0 border border-gray-100 flex items-center justify-center p-1 shadow-sm group-hover:shadow-md group-hover:border-indigo-100 transition-all duration-300">
                                                    {item.logoUrl ? (
                                                        <img
                                                            src={item.logoUrl}
                                                            alt={item.name}
                                                            className="w-full h-full object-contain"
                                                            onError={(e) => {
                                                                (e.currentTarget as HTMLImageElement).style.display = 'none';
                                                                e.currentTarget.parentElement?.classList.add('bg-gray-50');
                                                            }}
                                                        />
                                                    ) : (
                                                        <IoImageOutline className="text-lg text-gray-300" />
                                                    )}
                                                </div>

                                                <div className="flex flex-col">
                                                    <div className="flex items-center gap-1.5">

                                                        <span className="font-semibold text-gray-700 text-[14px] group-hover:text-indigo-600 transition-colors">
                                                            {item.name}
                                                        </span>

                                                        {item.description && (
                                                            <Tooltip
                                                                title="Mô tả thương hiệu"
                                                                headerIcon={<IoInformationCircleOutline className="text-base" />}
                                                                content={
                                                                    <div className="whitespace-pre-line text-left text-[13px] text-gray-600 leading-relaxed max-w-xs">
                                                                        {item.description}
                                                                    </div>
                                                                }
                                                            >
                                                                <div className="text-gray-300 hover:text-indigo-500 cursor-help transition-colors">
                                                                    <IoInformationCircleOutline className="text-base" />
                                                                </div>
                                                            </Tooltip>
                                                        )}
                                                    </div>

                                                    <div className="mt-0.5 scale-95 origin-left">
                                                        <CopyableId id={item.id} />
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* SLUG */}
                                        <td className="px-5 py-4">
                                            <span className="inline-block max-w-[130px] truncate px-2 py-0.5 bg-gray-50 rounded-md text-[10px] font-mono font-medium text-gray-500 border border-gray-100 group-hover:border-indigo-100 group-hover:bg-white group-hover:text-indigo-500 transition-all select-all">
                                                /{item.slug}
                                            </span>
                                        </td>

                                        {/* PRODUCT COUNT */}
                                        <td className="px-5 py-4 text-center">
                                            <span
                                                className={`inline-flex items-center justify-center min-w-[28px] h-[28px] rounded-full text-[11px] font-bold transition-all shadow-sm
                                                ${
                                                    hasProducts
                                                        ? 'bg-indigo-50 text-indigo-600 border border-indigo-100 ring-2 ring-transparent group-hover:ring-indigo-100'
                                                        : 'bg-gray-50 text-gray-400 border border-gray-100'
                                                }`}
                                            >
                                                {item.productCount}
                                            </span>
                                        </td>

                                        {/* CREATED DATE */}
                                        <td className="px-5 py-4 text-center">
                                            <Tooltip
                                                title="Lịch sử chỉnh sửa"
                                                headerIcon={<IoCalendarOutline className="text-base" />}
                                                content={
                                                    item.updatedDate ? (
                                                        <div className="flex flex-col gap-1">
                                                            <span className="text-[11px] text-gray-500">
                                                                Cập nhật lần cuối:
                                                            </span>

                                                            <div className="font-mono font-medium text-indigo-600 text-[13px]">
                                                                {format(new Date(item.updatedDate), "dd/MM/yyyy HH:mm")}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="italic text-gray-400 text-[11px]">
                                                            Chưa có chỉnh sửa nào.
                                                        </span>
                                                    )
                                                }
                                            >
                                                <div className="flex items-center justify-center gap-1 text-[11px] text-gray-500 cursor-help group/date">
                                                    <IoCalendarOutline className="text-gray-400 group-hover/date:text-indigo-500 transition-colors text-sm" />

                                                    <span className="group-hover/date:text-gray-700 transition-colors border-b border-dotted border-gray-300 group-hover/date:border-indigo-300 font-medium">
                                                        {format(new Date(item.createdDate), "dd/MM/yyyy")}
                                                    </span>
                                                </div>
                                            </Tooltip>
                                        </td>

                                        {/* STATUS */}
                                        <td className="px-5 py-4 text-center">
                                            <span
                                                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border shadow-sm transition-transform hover:scale-105 ${
                                                    item.isActive
                                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                                        : 'bg-slate-50 text-slate-500 border-slate-200'
                                                }`}
                                            >
                                                <span
                                                    className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                                                        item.isActive ? 'bg-emerald-500' : 'hidden'
                                                    }`}
                                                ></span>

                                                {item.isActive ? 'Hoạt động' : 'Tạm ngưng'}
                                            </span>
                                        </td>

                                        {/* ACTIONS */}
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">

                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onEdit?.(item);
                                                    }}
                                                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-violet-500 rounded-lg transition-all duration-200 shadow-sm hover:shadow-violet-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
                                                    title="Chỉnh sửa"
                                                >
                                                    <IoPencil className="text-[15px]" />
                                                </button>

                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onDelete?.(item.id);
                                                    }}
                                                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-rose-500 rounded-lg transition-all duration-200 shadow-sm hover:shadow-rose-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
                                                    title="Xóa"
                                                >
                                                    <IoTrashBinOutline className="text-[15px]" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-20 text-center">

                                    <div className="flex flex-col items-center justify-center gap-3">

                                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center shadow-sm border border-gray-100">
                                            <span className="text-3xl opacity-20 grayscale">🏷️</span>
                                        </div>

                                        <div>
                                            <h3 className="text-gray-800 font-bold text-base">
                                                Chưa có thương hiệu nào
                                            </h3>

                                            <p className="text-gray-400 text-[13px] mt-1 max-w-xs mx-auto">
                                                Hệ thống chưa ghi nhận dữ liệu. Hãy thử thay đổi bộ lọc hoặc thêm mới.
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
};

export default BrandTable;