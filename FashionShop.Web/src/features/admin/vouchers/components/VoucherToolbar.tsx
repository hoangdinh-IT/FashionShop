import type React from "react";
import type { VoucherFilters } from "../types/requests";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoCalendarOutline, IoCashOutline, IoClose, IoFilterOutline, IoRefreshOutline, IoSearchOutline } from "react-icons/io5";
import { DiscountType } from "../types/voucher";

interface Props {
    onSearch: (text: string) => void;
    onFilterChange: (filters: VoucherFilters) => void;
}

const VoucherToolbar: React.FC<Props> = ({
    onSearch,
    onFilterChange
}) => {

    const defaultValues: VoucherFilters = {
        discountType: undefined,
        isActive: undefined,
        fromDate: undefined,
        toDate: undefined,
        status: "",
        isAvailable: undefined,
        fromMinOrderValue: undefined,
        toMinOrderValue: undefined,
    }

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filters, setFilters] = useState<VoucherFilters>(defaultValues);

    const handleFilterChange = (key: keyof VoucherFilters, value: any) => {
        const newValues = { ...filters, [key]: value };
        setFilters(newValues);
        onFilterChange(newValues);
    }

    const handleReset = () => {
        setFilters(defaultValues);
        onFilterChange(defaultValues);
    }

    const handleBooleanSelect = (key: keyof VoucherFilters, value: string) => {
        handleFilterChange(key, value === "all" ? undefined : value === "true");
    }

    return (
        <div className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-200/80 overflow-hidden font-sans">
            {/* TOP BAR: SEARCH & TOGGLE */}
            <div className="p-3 flex gap-3 justify-between items-center bg-white relative z-10">
                <div className="relative w-full md:max-w-md group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                        <IoSearchOutline className="text-[1.1rem]" />
                    </div>
                    <input
                        type="text"
                        onChange={(e) => onSearch?.(e.target.value)}
                        className="block w-full pl-10 pr-4 py-2.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-lg text-slate-700 text-sm transition-all outline-none placeholder-slate-400"
                        placeholder="Tìm kiếm mã, tên voucher..."
                    />
                </div>

                <button 
                    onClick={() => {
                        setIsFilterOpen(!isFilterOpen)
                        if (isFilterOpen) handleReset()
                    }}
                    className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all border ${
                        isFilterOpen 
                            ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm' 
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 shadow-sm hover:shadow'
                    }`}
                >
                    {isFilterOpen ? <IoClose className="text-lg" /> : <IoFilterOutline className="text-lg" />}
                    <span className="hidden sm:inline">{isFilterOpen ? 'Đóng bộ lọc' : 'Lọc nâng cao'}</span>
                </button>
            </div>

            {/* EXPANDABLE FILTER AREA */}
            <AnimatePresence>
                {isFilterOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="bg-slate-50/60 border-t border-slate-100"
                    >
                        <div className="p-4 md:p-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                                
                                {/* 1. LOẠI GIẢM GIÁ */}
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Loại ưu đãi</label>
                                    <select
                                        value={filters.discountType === undefined ? "all" : filters.discountType}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            handleFilterChange("discountType", val === "all" ? undefined : val as DiscountType);
                                        }}
                                        className="block w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none cursor-pointer transition-all shadow-sm"
                                    >
                                        <option value="all">Tất cả</option>
                                        <option value={DiscountType.FixedAmount}>Giảm số tiền cố định</option>
                                        <option value={DiscountType.Percentage}>Giảm theo phần trăm</option>
                                    </select>
                                </div>

                                {/* 2. TRẠNG THÁI KÍCH HOẠT */}
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Kích hoạt</label>
                                    <select
                                        value={filters.isActive === undefined ? "all" : filters.isActive.toString()}
                                        onChange={(e) => handleBooleanSelect("isActive", e.target.value)}
                                        className="block w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none cursor-pointer transition-all shadow-sm"
                                    >
                                        <option value="all">Tất cả</option>
                                        <option value="true">Đang hoạt động</option>
                                        <option value="false">Đã tạm ngưng</option>
                                    </select>
                                </div>

                                {/* 3. TÌNH TRẠNG SỬ DỤNG (Còn lượt hay không) */}
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Kho Voucher</label>
                                    <select
                                        value={filters.isAvailable === undefined ? "all" : filters.isAvailable.toString()}
                                        onChange={(e) => handleBooleanSelect("isAvailable", e.target.value)}
                                        className="block w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none cursor-pointer transition-all shadow-sm"
                                    >
                                        <option value="all">Tất cả</option>
                                        <option value="true">Còn lượt sử dụng</option>
                                        <option value="false">Đã hết lượt</option>
                                    </select>
                                </div>

                                {/* 4. TIẾN ĐỘ THỜI GIAN (Status) */}
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Tiến độ</label>
                                    <select
                                        value={filters.status || "all"}
                                        onChange={(e) => handleFilterChange("status", e.target.value === "all" ? undefined : e.target.value)}
                                        className="block w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none cursor-pointer transition-all shadow-sm"
                                    >
                                        <option value="all">Tất cả</option>
                                        <option value="Upcoming">Sắp diễn ra</option>
                                        <option value="Ongoing">Đang diễn ra</option>
                                        <option value="Expired">Đã kết thúc</option>
                                    </select>
                                </div>

                                {/* 5. ĐIỀU KIỆN ĐƠN HÀNG (Khoảng giá trị) */}
                                <div className="space-y-1.5 lg:col-span-2">
                                    <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                                        <IoCashOutline className="text-sm" /> Điều kiện đơn hàng tối thiểu
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            placeholder="Từ (VNĐ)"
                                            value={filters.fromMinOrderValue || ""}
                                            onChange={(e) => handleFilterChange("fromMinOrderValue", e.target.value ? Number(e.target.value) : undefined)}
                                            className="block w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all shadow-sm placeholder-slate-400"
                                        />
                                        <span className="text-slate-400 font-medium">-</span>
                                        <input
                                            type="number"
                                            placeholder="Đến (VNĐ)"
                                            value={filters.toMinOrderValue || ""}
                                            onChange={(e) => handleFilterChange("toMinOrderValue", e.target.value ? Number(e.target.value) : undefined)}
                                            className="block w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all shadow-sm placeholder-slate-400"
                                        />
                                    </div>
                                </div>

                                {/* 6. THỜI GIAN DIỄN RA (Ngày bắt đầu - kết thúc) */}
                                <div className="space-y-1.5 lg:col-span-2">
                                    <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                                        <IoCalendarOutline className="text-sm" /> Thời gian diễn ra
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="date"
                                            value={filters.fromDate ? new Date(filters.fromDate).toISOString().split('T')[0] : ""}
                                            onChange={(e) => handleFilterChange("fromDate", e.target.value ? new Date(e.target.value) : undefined)}
                                            className="block w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all shadow-sm"
                                        />
                                        <span className="text-slate-400 font-medium">-</span>
                                        <input
                                            type="date"
                                            value={filters.toDate ? new Date(filters.toDate).toISOString().split('T')[0] : ""}
                                            onChange={(e) => handleFilterChange("toDate", e.target.value ? new Date(e.target.value) : undefined)}
                                            className="block w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all shadow-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* DIVIDER & ACTIONS */}
                            <div className="mt-5 pt-4 border-t border-slate-200/60 flex justify-end">
                                <button
                                    onClick={handleReset}
                                    className="flex items-center justify-center gap-2 px-5 py-2 text-sm font-semibold text-rose-600 bg-rose-50/50 border border-rose-200 rounded-lg hover:bg-rose-100 hover:border-rose-300 transition-all shadow-sm"
                                >
                                    <IoRefreshOutline className="text-lg" />
                                    <span>Đặt lại mặc định</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default VoucherToolbar;