import React from 'react';
import { format } from "date-fns";
import {
    IoArrowDown,
    IoArrowUp,
    IoCalendarOutline,
    IoImageOutline,
    IoInformationCircleOutline,
    IoPencil,
    IoSwapVertical,
    IoTrashBinOutline
} from 'react-icons/io5';
import type { Category } from '../types/category';
import CopyableId from '../../../components/common/CopyableId';
import Tooltip from '../../../components/common/Tooltip';

interface CategoryTableProps {
    data: Category[];
    isLoading: boolean;
    sortBy: string;
    isAscending: boolean;
    onSort: (colKey: string, direction: boolean) => void;
    onEdit?: (item: Category) => void; 
    onDelete?: (id: string) => void;   
}

const CategoryTable: React.FC<CategoryTableProps> = ({ data, isLoading, sortBy, isAscending, onSort, onEdit, onDelete }) => {
    const handleHeaderClick = (colKey: string) => {
        if (sortBy === colKey) onSort(colKey, !isAscending);
        else onSort(colKey, true);
    }

    const SortableHeader = ({ label, colKey, align = 'left' }: { label: string, colKey: string, align?: 'left' | 'center' | 'right' }) => {
        const isActive = sortBy.toLowerCase() === colKey.toLowerCase();
        const alignClass = align === 'center' ? 'justify-center' : align === 'right' ? 'justify-end' : 'justify-start';

        return (
            <div 
                className={`flex items-center gap-1 cursor-pointer group select-none ${alignClass}`}
                onClick={() => handleHeaderClick(colKey)}
            >
                <span>{label}</span>
                <span className="text-gray-400 group-hover:text-indigo-600 transition-colors">
                    {isActive ? (
                        isAscending ? <IoArrowUp size={14} className="text-indigo-600" /> : <IoArrowDown size={14} className="text-indigo-600" />
                    ) : (
                        <IoSwapVertical size={14} className="opacity-0 group-hover:opacity-50" />
                    )}
                </span>
            </div>
        );
    };

    const TableRowSkeleton = () => (
        <tr className="animate-pulse border-b border-gray-50">
            {/* ... giữ nguyên code skeleton ... */}
            <td className="px-8 py-5"><div className="h-4 bg-gray-200 rounded w-3/4"></div></td>
            <td className="px-6 py-5"><div className="h-4 bg-gray-200 rounded w-1/2"></div></td>
            <td className="px-6 py-5"><div className="h-4 bg-gray-200 rounded w-8 mx-auto"></div></td>
            <td className="px-6 py-5"><div className="h-6 bg-gray-200 rounded-full w-20 mx-auto"></div></td>
            <td className="px-8 py-5"><div className="h-8 bg-gray-200 rounded w-16 ml-auto"></div></td>
        </tr>
    );

    return (
    <div className="bg-white rounded-[24px] shadow-[0_0_40px_-10px_rgba(0,0,0,0.05)] border border-gray-100/80 overflow-hidden flex flex-col font-sans">
        <div className="overflow-x-auto overflow-y-auto max-h-[650px] relative scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent hover:scrollbar-thumb-gray-300 transition-colors">
            <table className="w-full text-left border-collapse">
                {/* --- HEADER --- */}
                <thead>
                    <tr className="bg-gray-50/80 backdrop-blur-md border-b border-gray-100">
                        <th className="px-8 py-4 sticky top-0 z-20 bg-gray-50/95 backdrop-blur-sm">
                            <SortableHeader label="Danh mục" colKey="name" />
                        </th>
                        <th className="px-6 py-4 sticky top-0 z-20 bg-gray-50/95 backdrop-blur-sm">
                            <SortableHeader label="Slug" colKey="slug" />
                        </th>
                        <th className="px-6 py-4 sticky top-0 z-20 bg-gray-50/95 backdrop-blur-sm text-center">
                            <SortableHeader label="Sản phẩm" colKey="productCount" align="center" />
                        </th>
                        <th className="px-6 py-4 sticky top-0 z-20 bg-gray-50/95 backdrop-blur-sm text-center">
                            <SortableHeader label="Ngày tạo" colKey="createdDate" align="center" />
                        </th>
                        <th className="px-6 py-4 sticky top-0 z-20 bg-gray-50/95 backdrop-blur-sm text-center">
                            <SortableHeader label="Trạng thái" colKey="isActive" align="center" />
                        </th>
                        <th className="px-8 py-4 sticky top-0 z-20 bg-gray-50/95 backdrop-blur-sm text-right">
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
                            const hasProducts = item.productCount > 0;

                            return (
                                <tr key={item.id} className="group hover:bg-indigo-50/40 transition-colors duration-200">
                                    
                                    {/* 1. THÔNG TIN DANH MỤC (Ảnh + Tên) */}
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl shrink-0 border border-gray-200 shadow-sm group-hover:shadow-md group-hover:border-indigo-100 transition-all duration-300 overflow-hidden bg-white flex items-center justify-center p-0.5">
                                                {item.imageUrl ? (
                                                    <img
                                                        src={item.imageUrl}
                                                        alt={item.name}
                                                        className="w-full h-full object-cover rounded-[10px]"
                                                        onError={(e) => {
                                                            (e.currentTarget as HTMLImageElement).style.display = 'none';
                                                            e.currentTarget.parentElement?.classList.add('bg-gray-50');
                                                        }}
                                                    />
                                                ) : (
                                                    <IoImageOutline className="text-xl text-gray-300" />
                                                )}
                                            </div>

                                            <div className="flex flex-col gap-0.5">
                                                <div className="flex items-center gap-2">
                                                    <div className="font-semibold text-gray-700 text-[15px] group-hover:text-indigo-600 transition-colors">
                                                        {item.name}
                                                    </div>
                                                    {item.description && (
                                                        <Tooltip 
                                                            title="Mô tả danh mục" 
                                                            headerIcon={<IoInformationCircleOutline className="text-lg" />}
                                                            content={
                                                                <div className="whitespace-pre-line text-left max-w-xs">
                                                                    {item.description}
                                                                </div>
                                                            }
                                                        >
                                                            <div className="cursor-help opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <IoInformationCircleOutline className="text-gray-400 hover:text-indigo-500" />
                                                            </div>
                                                        </Tooltip>
                                                    )}
                                                </div>
                                                
                                                <div className="mt-0.5">
                                                    <CopyableId id={item.id} />
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    {/* 2. SLUG */}
                                    <td className="px-6 py-5">
                                        <span className="inline-block max-w-[150px] truncate px-2.5 py-1 bg-gray-50 rounded-lg text-[11px] font-mono font-medium text-gray-500 border border-gray-100 group-hover:border-indigo-100 group-hover:bg-white group-hover:text-indigo-500 transition-all select-all">
                                            /{item.slug}
                                        </span>
                                    </td>

                                    {/* 3. SỐ LƯỢNG SẢN PHẨM */}
                                    <td className="px-6 py-5 text-center">
                                        <span className={`inline-flex items-center justify-center min-w-[32px] h-[32px] rounded-full text-xs font-bold transition-all shadow-sm
                                            ${hasProducts 
                                                ? 'bg-indigo-50 text-indigo-600 border border-indigo-100 ring-2 ring-transparent group-hover:ring-indigo-100' 
                                                : 'bg-gray-50 text-gray-400 border border-gray-100'
                                            }`}>
                                            {item.productCount}
                                        </span>
                                    </td>

                                    {/* 4. NGÀY TẠO & SỬA */}
                                    <td className="px-6 py-5 text-center">
                                        <Tooltip 
                                            title="Lịch sử chỉnh sửa" 
                                            headerIcon={<IoCalendarOutline className="text-lg" />}
                                            content={
                                                item.updatedDate ? (
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-xs text-gray-500">Cập nhật lần cuối:</span>
                                                        <div className="font-mono font-medium text-indigo-600 text-sm">
                                                            {format(new Date(item.updatedDate), "dd/MM/yyyy HH:mm")}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="italic text-gray-400 text-xs">Chưa có chỉnh sửa nào.</span>
                                                )
                                            }
                                        >
                                            <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500 cursor-help group/date">
                                                <IoCalendarOutline className="text-gray-400 group-hover/date:text-indigo-500 transition-colors text-base" />
                                                <span className="group-hover/date:text-gray-700 transition-colors border-b border-dotted border-gray-300 group-hover/date:border-indigo-300 font-medium">
                                                    {format(new Date(item.createdDate), "dd/MM/yyyy")}
                                                </span>
                                            </div>
                                        </Tooltip>
                                    </td>

                                    {/* 5. TRẠNG THÁI */}
                                    <td className="px-6 py-5 text-center">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border shadow-sm transition-transform hover:scale-105 ${
                                            item.isActive 
                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                                                : 'bg-slate-50 text-slate-500 border-slate-200'
                                        }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${item.isActive ? 'bg-emerald-500' : 'hidden'}`}></span>
                                            {item.isActive ? 'Hoạt động' : 'Tạm ngưng'}
                                        </span>
                                    </td>

                                    {/* 6. HÀNH ĐỘNG */}
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                                            {/* Nút Sửa */}
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); onEdit?.(item); }} 
                                                className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-white hover:bg-violet-500 rounded-xl transition-all duration-200 shadow-sm hover:shadow-violet-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-95" 
                                                title="Chỉnh sửa"
                                            >
                                                <IoPencil className="text-[17px]" />
                                            </button>
                                            
                                            {/* Nút Xóa */}
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
                        // --- EMPTY STATE ---
                        <tr>
                            <td colSpan={6} className="px-6 py-24 text-center">
                                <div className="flex flex-col items-center justify-center gap-4">
                                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center shadow-sm border border-gray-100">
                                        <IoImageOutline className="text-4xl text-gray-300" />
                                    </div>
                                    <div>
                                        <h3 className="text-gray-800 font-bold text-lg">Chưa có danh mục nào</h3>
                                        <p className="text-gray-400 text-sm mt-1 max-w-xs mx-auto">
                                            Hệ thống chưa ghi nhận danh mục nào. Hãy thử tạo mới hoặc thay đổi bộ lọc.
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

export default CategoryTable;