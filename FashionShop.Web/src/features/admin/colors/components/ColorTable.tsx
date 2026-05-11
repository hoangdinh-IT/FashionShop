import type React from "react";
import { IoArrowDown, IoArrowUp, IoCalendarOutline, IoColorPaletteOutline, IoPencil, IoSwapVertical, IoTrashBinOutline } from "react-icons/io5";
import type { Color } from "../types/color";
import { format } from "date-fns";
import Tooltip from "../../../../components/common/Tooltip";

interface ColorTableProps {
    data: Color[],
    isLoading: boolean;
    sortBy: string;
    isAscending?: boolean;
    onSort: (colKey: string, direction: boolean) => void;
    onEdit: (color: Color) => void;
    onDelete: (id: number) => void; 
}

const ColorTable: React.FC<ColorTableProps> = ({
    data,
    isLoading,
    sortBy,
    isAscending,
    onSort,
    onEdit,
    onDelete,
}) => {
    
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
                <span className={`text-[11px] font-bold uppercase tracking-wider transition-colors duration-200 ${isActive ? 'text-indigo-600' : 'text-gray-500 group-hover:text-gray-700'}`}>
                    {label}
                </span>
                <span className="flex items-center justify-center w-3.5 h-3.5 transition-all duration-200">
                    {isActive ? (
                        isAscending ? <IoArrowUp size={11} className="text-indigo-600" /> : <IoArrowDown size={11} className="text-indigo-600" />
                    ) : (
                        <IoSwapVertical size={11} className="text-gray-300 opacity-0 group-hover:opacity-100 group-hover:text-gray-400 transition-opacity" />
                    )}
                </span>
            </div>
        );
    };

    const TableRowSkeleton = () => (
        <tr className="animate-pulse border-b border-gray-50 last:border-none">
            <td className="px-6 py-4"><div className="flex gap-3 items-center"><div className="h-10 w-10 bg-gray-100 rounded-lg"></div><div className="space-y-2"><div className="h-3.5 w-28 bg-gray-100 rounded"></div><div className="h-2.5 w-16 bg-gray-50 rounded"></div></div></div></td>
            <td className="px-5 py-4"><div className="h-5 w-20 bg-gray-100 rounded-md"></div></td>
            <td className="px-5 py-4"><div className="h-7 w-7 mx-auto bg-gray-100 rounded-full"></div></td>
            <td className="px-5 py-4"><div className="h-3.5 w-20 mx-auto bg-gray-100 rounded"></div></td>
            <td className="px-5 py-4"><div className="h-5 w-16 mx-auto bg-gray-100 rounded-full"></div></td>
            <td className="px-6 py-4"><div className="h-7 w-14 ml-auto bg-gray-100 rounded-lg"></div></td>
        </tr>
    );

    return (
        <div className="bg-white rounded-[22px] shadow-[0_0_40px_-10px_rgba(0,0,0,0.05)] border border-gray-100/80 overflow-hidden flex flex-col font-sans">
            <div className="overflow-x-auto overflow-y-auto max-h-[650px] relative scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent hover:scrollbar-thumb-gray-300 transition-colors">
                <table className="w-full text-left border-collapse">
                    
                    {/* --- HEADER --- */}
                    <thead>
                        <tr className="bg-gray-50/80 backdrop-blur-md border-b border-gray-100">
                            <th className="px-6 py-3.5 sticky top-0 z-20 bg-gray-50/95 backdrop-blur-sm">
                                <SortableHeader label="Tên màu & Mã" colKey="name" />
                            </th>
                            <th className="px-5 py-3.5 sticky top-0 z-20 bg-gray-50/95 backdrop-blur-sm">
                                <SortableHeader label="Slug" colKey="slug" />
                            </th>
                            <th className="px-5 py-3.5 sticky top-0 z-20 bg-gray-50/95 backdrop-blur-sm text-center">
                                <SortableHeader label="Sản phẩm" colKey="productCount" align="center" />
                            </th>
                            <th className="px-5 py-3.5 sticky top-0 z-20 bg-gray-50/95 backdrop-blur-sm text-center">
                                <SortableHeader label="Ngày tạo" colKey="createdDate" align="center" />
                            </th>
                            <th className="px-5 py-3.5 sticky top-0 z-20 bg-gray-50/95 backdrop-blur-sm text-center">
                                <SortableHeader label="Trạng thái" colKey="isActive" align="center" />
                            </th>
                            <th className="px-6 py-3.5 sticky top-0 z-20 bg-gray-50/95 backdrop-blur-sm text-right">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Hành động</span>
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
                                        
                                        {/* 1. INFO MÀU SẮC */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div 
                                                    className="w-10 h-10 rounded-lg shrink-0 border border-gray-200 shadow-sm group-hover:shadow-md group-hover:border-indigo-100 transition-all duration-300"
                                                    style={{ backgroundColor: item.hexCode }}
                                                    title={`Mã màu: ${item.hexCode}`}
                                                ></div>
                                                
                                                <div className="flex flex-col gap-0.5">
                                                    <div className="font-semibold text-gray-700 text-sm group-hover:text-indigo-600 transition-colors">
                                                        {item.name}
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-gray-100 text-gray-600 border border-gray-200 uppercase tracking-wide">
                                                            {item.hexCode}
                                                        </span>
                                                        <div className="text-[9px] text-gray-400">
                                                            ID: {item.id}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* 2. SLUG */}
                                        <td className="px-5 py-4">
                                            <span className="inline-block max-w-[140px] truncate px-2 py-1 bg-gray-50 rounded-md text-[10px] font-mono font-medium text-gray-500 border border-gray-100 group-hover:border-indigo-100 group-hover:bg-white group-hover:text-indigo-500 transition-all select-all">
                                                /{item.slug}
                                            </span>
                                        </td>

                                        {/* 3. SỐ LƯỢNG SẢN PHẨM */}
                                        <td className="px-5 py-4 text-center">
                                            <span className={`inline-flex items-center justify-center min-w-[28px] h-[28px] rounded-full text-[11px] font-bold transition-all shadow-sm
                                                ${hasProducts 
                                                    ? 'bg-indigo-50 text-indigo-600 border border-indigo-100 ring-2 ring-transparent group-hover:ring-indigo-100' 
                                                    : 'bg-gray-50 text-gray-400 border border-gray-100'
                                                }`}>
                                                {item.productCount}
                                            </span>
                                        </td>

                                        {/* 4. NGÀY TẠO */}
                                        <td className="px-5 py-4 text-center">
                                            <Tooltip 
                                                title="Lịch sử chỉnh sửa" 
                                                headerIcon={<IoCalendarOutline className="text-base" />}
                                                content={
                                                    item.updatedDate ? (
                                                        <div className="flex flex-col gap-1">
                                                            <span className="text-[11px] text-gray-500">Cập nhật lần cuối:</span>
                                                            <div className="font-mono font-medium text-indigo-600 text-xs">
                                                                {format(new Date(item.updatedDate), "dd/MM/yyyy HH:mm")}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="italic text-gray-400 text-[11px]">Chưa có chỉnh sửa nào.</span>
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

                                        {/* 5. TRẠNG THÁI */}
                                        <td className="px-5 py-4 text-center">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border shadow-sm transition-transform hover:scale-105 ${
                                                item.isActive 
                                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                                                    : 'bg-slate-50 text-slate-500 border-slate-200'
                                            }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${item.isActive ? 'bg-emerald-500' : 'hidden'}`}></span>
                                                {item.isActive ? 'Hoạt động' : 'Tạm ngưng'}
                                            </span>
                                        </td>

                                        {/* 6. HÀNH ĐỘNG */}
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                                                
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); onEdit?.(item); }} 
                                                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-violet-500 rounded-lg transition-all duration-200 shadow-sm hover:shadow-violet-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-95" 
                                                    title="Chỉnh sửa"
                                                >
                                                    <IoPencil className="text-[15px]" />
                                                </button>
                                                
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); onDelete?.(item.id); }} 
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
                                    <div className="flex flex-col items-center justify-center gap-4">
                                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center shadow-sm border border-gray-100">
                                            <IoColorPaletteOutline className="text-3xl text-gray-300" />
                                        </div>
                                        <div>
                                            <h3 className="text-gray-800 font-bold text-base">Chưa có màu sắc nào</h3>
                                            <p className="text-gray-400 text-sm mt-1 max-w-xs mx-auto">
                                                Hệ thống chưa ghi nhận dữ liệu màu sắc. Hãy thử tạo mới ngay bây giờ.
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

export default ColorTable;