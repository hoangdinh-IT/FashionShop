import type React from "react";
import type { Product } from "../types/product";
import { IoArrowDown, IoArrowUp, IoCalendarOutline, IoEyeOutline, IoImageOutline, IoImagesOutline, IoInformationCircleOutline, IoPencil, IoSwapVertical, IoTrashBinOutline } from "react-icons/io5";
import Tooltip from "../../../../components/common/Tooltip";
import CopyableId from "../../../../components/common/CopyableId";
import { format } from "date-fns";

interface ProductTableProps {
    data: Product[];
    isLoading: boolean;
    sortBy: string;
    isAscending?: boolean;
    onSort: (colKey: string, direction: boolean) => void;
    openImageManagerModal?: (productId: string) => void;
    onEdit?: (productId: string) => void;
    onDelete?: (productId: string) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({
    data,
    isLoading,
    sortBy,
    isAscending,
    onSort,
    openImageManagerModal,
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
            <td className="px-6 py-4"><div className="flex gap-3 items-center"><div className="h-10 w-10 bg-gray-100 rounded-xl"></div><div className="space-y-2"><div className="h-3.5 w-28 bg-gray-100 rounded"></div><div className="h-2.5 w-16 bg-gray-50 rounded"></div></div></div></td>
            <td className="px-5 py-4"><div className="h-5 w-20 bg-gray-100 rounded-md"></div></td>
            <td className="px-5 py-4"><div className="h-7 w-7 mx-auto bg-gray-100 rounded-full"></div></td>
            <td className="px-5 py-4"><div className="h-3.5 w-20 mx-auto bg-gray-100 rounded"></div></td>
            <td className="px-5 py-4"><div className="h-5 w-16 mx-auto bg-gray-100 rounded-full"></div></td>
            <td className="px-6 py-4"><div className="h-7 w-14 ml-auto bg-gray-100 rounded-lg"></div></td>
        </tr>
    );

    return (
        <div className="bg-white rounded-[22px] shadow-[0_0_35px_-10px_rgba(0,0,0,0.05)] border border-gray-100/80 overflow-hidden flex flex-col font-sans">
            <div className="overflow-x-auto overflow-y-auto max-h-[650px] relative scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent hover:scrollbar-thumb-gray-300 transition-colors">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/80 backdrop-blur-md border-b border-gray-100">
                            <th className="px-5 py-3.5 sticky top-0 z-20 bg-gray-50/95 backdrop-blur-sm min-w-[280px]">
                                <SortableHeader label="Sản phẩm" colKey="name" />
                            </th>
                            
                            <th className="px-5 py-3.5 sticky top-0 z-20 bg-gray-50/95 backdrop-blur-sm">
                                <SortableHeader label="Giá bán" colKey="price" />
                            </th>

                            <th className="px-5 py-3.5 sticky top-0 z-20 bg-gray-50/95 backdrop-blur-sm text-center">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Thuộc tính</span>
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

                    <tbody className="divide-y divide-gray-50/80">
                        {isLoading ? (
                            [...Array(5)].map((_, index) => <TableRowSkeleton key={index} />)
                        ) : data.length > 0 ? (
                            data.map((item) => {
                                const formattedPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price);
                                
                                return (
                                    <tr key={item.id} className="group hover:bg-indigo-50/40 transition-colors duration-200">
                                        
                                        <td className="px-5 py-4">
                                            <div className="flex items-start gap-3">
                                                <div className="w-11 h-14 rounded-xl overflow-hidden bg-white shrink-0 border border-gray-100 flex items-center justify-center p-1 shadow-sm group-hover:shadow-md group-hover:border-indigo-100 transition-all duration-300 relative">
                                                    {item.thumbnailUrl ? (
                                                        <img
                                                            src={item.thumbnailUrl}
                                                            alt={item.name}
                                                            className="w-full h-full object-contain rounded-lg"
                                                            onError={(e) => {
                                                                (e.currentTarget as HTMLImageElement).style.display = 'none';
                                                                e.currentTarget.parentElement?.classList.add('bg-gray-50');
                                                            }}
                                                        />
                                                    ) : (
                                                        <IoImageOutline className="text-xl text-gray-300" />
                                                    )}
                                                </div>

                                                <div className="flex flex-col min-w-0">
                                                    <div className="flex items-center gap-1.5 mb-1">
                                                        <span className="font-semibold text-gray-700 text-[14px] group-hover:text-indigo-600 transition-colors line-clamp-1" title={item.name}>
                                                            {item.name}
                                                        </span>

                                                        {item.description && (
                                                            <Tooltip 
                                                                title="Mô tả sản phẩm" 
                                                                headerIcon={<IoInformationCircleOutline className="text-base" />}
                                                                content={<div className="text-[11px] text-gray-600 max-w-xs line-clamp-4">{item.description}</div>}
                                                            >
                                                                <IoInformationCircleOutline className="text-gray-300 hover:text-indigo-500 cursor-help transition-colors text-base shrink-0" />
                                                            </Tooltip>
                                                        )}
                                                    </div>

                                                    <div className="flex flex-wrap gap-1.5 text-[11px]">
                                                        <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 border border-gray-200 font-medium">
                                                            {item.categoryName || 'No Category'}
                                                        </span>

                                                        <span className="px-2 py-0.5 rounded bg-gray-50 text-gray-500 border border-gray-100">
                                                            {item.brandName || 'No Brand'}
                                                        </span>
                                                    </div>
                                                    
                                                    <div className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                        <CopyableId id={item.id} />
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="font-bold text-[14px] text-gray-700 group-hover:text-indigo-600 transition-colors whitespace-nowrap">
                                                {formattedPrice}
                                            </div>

                                            <div className="text-[9px] text-gray-400 font-mono mt-1">
                                                /{item.slug}
                                            </div>
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="flex flex-col items-center gap-1.5">
                                                <div className="flex gap-1">
                                                    {item.isNew && (
                                                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-50 text-blue-600 border border-blue-100 whitespace-nowrap">
                                                            NEW
                                                        </span>
                                                    )}

                                                    {item.isBestSeller && (
                                                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-amber-600 border border-amber-100 whitespace-nowrap">
                                                            HOT
                                                        </span>
                                                    )}

                                                    {!item.isNew && !item.isBestSeller && (
                                                        <span className="text-gray-300 text-[9px] italic">---</span>
                                                    )}
                                                </div>
                                                
                                                <div className="flex items-center gap-1 text-[11px] text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
                                                    <IoEyeOutline className="text-gray-400 text-xs" />
                                                    <span className="font-medium">{item.viewCount.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </td>

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

                                        <td className="px-5 py-4 text-center">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border shadow-sm transition-transform hover:scale-105 ${
                                                item.isActive 
                                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                                                    : 'bg-slate-50 text-slate-500 border-slate-200'
                                            }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${item.isActive ? 'bg-emerald-500' : 'hidden'}`}></span>
                                                {item.isActive ? 'Kinh doanh' : 'Ngừng bán'}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                                                <button 
                                                    title="Quản lý hình ảnh"
                                                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                    onClick={() => openImageManagerModal?.(item.id)}
                                                >
                                                    <IoImagesOutline className="text-base" />
                                                </button>

                                                <button 
                                                    title="Chỉnh sửa sản phẩm"
                                                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-violet-500 rounded-xl transition-all duration-200 shadow-sm hover:shadow-violet-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-95" 
                                                    onClick={(e) => { e.stopPropagation(); onEdit?.(item.id); }} 
                                                >
                                                    <IoPencil className="text-[15px]" />
                                                </button>
                                                
                                                <button 
                                                    title="Xóa sản phẩm"
                                                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-rose-500 rounded-xl transition-all duration-200 shadow-sm hover:shadow-rose-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-95" 
                                                    onClick={(e) => { e.stopPropagation(); onDelete?.(item.id); }} 
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
                                            <span className="text-3xl opacity-20 grayscale">📦</span>
                                        </div>

                                        <div>
                                            <h3 className="text-gray-800 font-bold text-base">Chưa có sản phẩm nào</h3>

                                            <p className="text-gray-400 text-sm mt-1 max-w-xs mx-auto">
                                                Hệ thống chưa tìm thấy sản phẩm nào phù hợp với bộ lọc hiện tại.
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

export default ProductTable;