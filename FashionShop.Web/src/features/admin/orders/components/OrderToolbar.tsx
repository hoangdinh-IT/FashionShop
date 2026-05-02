import type React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    IoCalendarOutline, 
    IoClose, 
    IoFilterOutline, 
    IoRefreshOutline, 
    IoSearchOutline 
} from "react-icons/io5";

// Giả định các types được import theo project của bạn
import type { OrderFilters } from "../types/requests";
import { OrderStatus, PaymentStatus, PaymentMethod } from "../types/requests"; // Cần đảm bảo có export các enums này

interface Props {
    onSearch: (text: string) => void;
    onFilterChange: (filters: OrderFilters) => void;
}

const OrderToolbar: React.FC<Props> = ({
    onSearch,
    onFilterChange
}) => {

    const defaultValues: OrderFilters = {
        keyword: undefined,
        orderStatus: undefined,
        paymentMethod: undefined,
        paymentStatus: undefined,
        fromOrderDate: undefined,
        toOrderDate: undefined,
    }

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filters, setFilters] = useState<OrderFilters>(defaultValues);

    const handleFilterChange = (key: keyof OrderFilters, value: any) => {
        const newValues = { ...filters, [key]: value };
        setFilters(newValues);
        onFilterChange(newValues);
    }

    const handleReset = () => {
        setFilters(defaultValues);
        onFilterChange(defaultValues);
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
                        placeholder="Tìm theo mã đơn, khách hàng..."
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
                            {/* Bố cục Grid: 4 Cột */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-end">
                                
                                {/* DÒNG 1 - CỘT 1: TRẠNG THÁI VẬN CHUYỂN */}
                                <div className="space-y-1.5 col-span-1">
                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Trạng thái vận chuyển</label>
                                    <select
                                        value={filters.orderStatus === undefined ? "all" : filters.orderStatus}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            handleFilterChange("orderStatus", val === "all" ? undefined : val as OrderStatus);
                                        }}
                                        className="block w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none cursor-pointer transition-all shadow-sm"
                                    >
                                        <option value="all">Tất cả</option>
                                        <option value="Pending">Chờ xử lý</option>
                                        <option value="Confirmed">Đã xác nhận</option>
                                        <option value="Shipping">Đang giao hàng</option>
                                        <option value="Success">Giao thành công</option>
                                        <option value="Cancelled">Đã hủy</option>
                                    </select>
                                </div>

                                {/* DÒNG 1 - CỘT 2: TRẠNG THÁI THANH TOÁN */}
                                <div className="space-y-1.5 col-span-1">
                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Thanh toán</label>
                                    <select
                                        value={filters.paymentStatus === undefined ? "all" : filters.paymentStatus}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            handleFilterChange("paymentStatus", val === "all" ? undefined : val as PaymentStatus);
                                        }}
                                        className="block w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none cursor-pointer transition-all shadow-sm"
                                    >
                                        <option value="all">Tất cả</option>
                                        <option value="Unpaid">Chưa thanh toán</option>
                                        <option value="Paid">Đã thanh toán</option>
                                    </select>
                                </div>

                                {/* DÒNG 1 - CỘT 3: PHƯƠNG THỨC THANH TOÁN */}
                                <div className="space-y-1.5 col-span-1">
                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Phương thức</label>
                                    <select
                                        value={filters.paymentMethod === undefined ? "all" : filters.paymentMethod}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            handleFilterChange("paymentMethod", val === "all" ? undefined : val as PaymentMethod);
                                        }}
                                        className="block w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none cursor-pointer transition-all shadow-sm"
                                    >
                                        <option value="all">Tất cả</option>
                                        <option value="COD">Thanh toán khi nhận hàng (COD)</option>
                                        <option value="Banking">Chuyển khoản ngân hàng</option>
                                    </select>
                                </div>

                                {/* DÒNG 1 - CỘT 4: Ô TRỐNG ĐỂ ÉP XUỐNG DÒNG (Hiển thị trên màn hình lớn) */}
                                <div className="hidden lg:block col-span-1"></div>

                                {/* DÒNG 2 - CỘT 1&2: THỜI GIAN ĐẶT HÀNG */}
                                <div className="space-y-1.5 md:col-span-2 lg:col-span-2">
                                    <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                                        <IoCalendarOutline className="text-sm" /> Khoảng ngày đặt
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="date"
                                            value={filters.fromOrderDate ? new Date(filters.fromOrderDate).toISOString().split('T')[0] : ""}
                                            onChange={(e) => handleFilterChange("fromOrderDate", e.target.value ? new Date(e.target.value) : undefined)}
                                            className="block w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all shadow-sm"
                                        />
                                        <span className="text-slate-400 font-medium">-</span>
                                        <input
                                            type="date"
                                            value={filters.toOrderDate ? new Date(filters.toOrderDate).toISOString().split('T')[0] : ""}
                                            onChange={(e) => handleFilterChange("toOrderDate", e.target.value ? new Date(e.target.value) : undefined)}
                                            className="block w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all shadow-sm"
                                        />
                                    </div>
                                </div>

                                {/* DÒNG 2 - CỘT 3: NÚT RESET (NẰM NGAY DƯỚI PHƯƠNG THỨC) */}
                                <div className="col-span-1">
                                    <button
                                        onClick={handleReset}
                                        className="flex items-center justify-center gap-2 w-full px-3 py-2 text-sm font-semibold text-rose-600 bg-rose-50/50 border border-rose-200 rounded-lg hover:bg-rose-100 hover:border-rose-300 transition-all shadow-sm"
                                        title="Đặt lại mặc định"
                                    >
                                        <IoRefreshOutline className="text-lg" />
                                        <span>Đặt lại mặc định</span>
                                    </button>
                                </div>

                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default OrderToolbar;