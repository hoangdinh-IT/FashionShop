import type React from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

interface PaginationProps {
    totalRecord: number;
    pageSize: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
    totalRecord,
    pageSize,
    currentPage,
    onPageChange
}) => {
    const totalPages = Math.ceil(totalRecord / pageSize);

    if (totalPages <= 1) return null;

    const renderPageNumbers = () => {
        const pages = []

        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, currentPage + 2);

        if (endPage - startPage < 4) {
            startPage = Math.max(1, endPage - 4);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => onPageChange(i)}
                    className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200
                        ${currentPage === i 
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' 
                            : 'bg-white text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 border border-gray-100'
                        }`}
                >
                    {i}
                </button>
            )
        }

        return pages;
    }

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 px-2">
            
            {/* --- Thông tin hiển thị (Showing 1-10 of 50) --- */}
            <div className="text-sm text-gray-500 font-medium">
                Hiển thị <span className="text-gray-800 font-bold">{(currentPage - 1) * pageSize + 1}</span> 
                -<span className="text-gray-800 font-bold">{Math.min(currentPage * pageSize, totalRecord)}</span> 
                {' '} trong tổng số <span className="text-indigo-600 font-bold">{totalRecord}</span> kết quả
            </div>

            {/* --- Các nút điều hướng --- */}
            <div className="flex items-center gap-2">
                {/* Nút Previous */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-100 bg-white text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    <IoChevronBack />
                </button>

                {/* Danh sách số trang */}
                <div className="flex items-center gap-1">
                    {renderPageNumbers()}
                </div>

                {/* Nút Next */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-100 bg-white text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    <IoChevronForward />
                </button>
            </div>
        </div>
    );
}

export default Pagination;