import type React from "react";
import { DiscountType, type Voucher } from "../types/voucher";
import { useVoucherMutations } from "../hooks/useVouchers";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { VoucherFormInputs } from "../types/requests";
import { useEffect } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { IoClose, IoTicketOutline, IoTimeOutline, IoWalletOutline } from "react-icons/io5";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Controller } from "react-hook-form";

const backdropVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
};

const modalVariants: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
        opacity: 1, y: 0, scale: 1, 
        transition: { type: "spring", stiffness: 300, damping: 25 } 
    },
    exit: { 
        opacity: 0, y: 20, scale: 0.95, 
        transition: { duration: 0.2 } 
    }
};

interface Props {
    isOpen: boolean;
    onClose: () => void;
    initialData?: Voucher;
}

const VoucherFormDialog: React.FC<Props> = ({
    isOpen,
    onClose,
    initialData,
}) => {

    const { createVoucher, isCreating, updateVoucher, isUpdating } = useVoucherMutations();

    const {
        register,
        handleSubmit,
        control,
        reset,
        watch,
        formState: { errors }
    } = useForm<VoucherFormInputs>();

    const watchedCode = watch("code") || "";
    const watchedDescription = watch("description") || "";
    const selectedDiscountType = watch("discountType");

    const formatDateTimeLocal = (date?: Date | string) => {
        if (!date) return "";
        const d = new Date(date);
        const tzOffset = d.getTimezoneOffset() * 60000; // offset in milliseconds
        const localISOTime = (new Date(d.getTime() - tzOffset)).toISOString().slice(0, 16);
        return localISOTime;
    };

    useEffect(() => {
        if (isOpen) {
            reset({
                name: initialData?.name || "",
                code: initialData?.code || "",
                description: initialData?.description || "",
                discountType: initialData?.discountType || "" as DiscountType,
                discountAmount: initialData?.discountAmount || 0,
                maxDiscountAmount: initialData?.maxDiscountAmount || 0,
                minOrderValue: initialData?.minOrderValue || 0,
                quantity: initialData?.quantity || 0,
                maxUsagePerUser: initialData?.maxUsagePerUser || 1,
                startDate: formatDateTimeLocal(initialData?.startDate) as unknown as Date,
                endDate: formatDateTimeLocal(initialData?.endDate) as unknown as Date,
                isActive: initialData?.isActive ?? true,
            })
        }
    }, [isOpen, initialData, reset]);

    const onSubmit: SubmitHandler<VoucherFormInputs> = (data) => {
        const handleSuccess = (response: { succeeded: boolean }) => {
            if (response.succeeded) onClose();
        };

        const requestData = {
            ...data,
            startDate: new Date(data.startDate),
            endDate: new Date(data.endDate),
        }

        if (!initialData) 
            createVoucher(requestData, { onSuccess: handleSuccess });
        else
            updateVoucher({ voucherId: initialData.id, request: requestData }, { onSuccess: handleSuccess });
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 font-sans">
                    {/* BACKDROP */}
                    <motion.div
                        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        onClick={onClose}
                    />

                    {/* MODAL CONTENT */}
                    <motion.div
                        className="relative w-full max-w-2xl bg-white rounded-[24px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full overflow-hidden">
                            
                            {/* --- HEADER --- */}
                            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                        <IoTicketOutline className="text-indigo-600 text-2xl" />
                                        {initialData ? 'Cập nhật Voucher' : 'Tạo Voucher mới'}
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Thiết lập thông tin và điều kiện áp dụng mã giảm giá
                                    </p>
                                </div>
                                <button
                                    type='button'
                                    onClick={onClose}
                                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <IoClose className="text-lg" />
                                </button>
                            </div>

                            {/* --- BODY (SCROLLABLE) --- */}
                            <div className="p-6 overflow-y-auto custom-scrollbar grow space-y-6 bg-slate-50/30">
                                
                                {/* NHÓM 1: THÔNG TIN CƠ BẢN */}
                                <div className="space-y-4">
                                    <h4 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-2">1. Thông tin cơ bản</h4>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5 col-span-2 sm:col-span-1">
                                            <label className="text-sm font-semibold text-gray-700">Tên Voucher <span className="text-red-500">*</span></label>
                                            <input
                                                {...register("name", { required: "Vui lòng nhập tên voucher" })}
                                                type="text"
                                                className={`w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm font-medium ${errors.name ? 'border-red-500' : ''}`}
                                            />
                                            <div className="flex justify-between mt-1 text-xs">
                                                <span className="text-red-500 font-medium">{errors.name?.message}</span>
                                            </div>
                                        </div>

                                        <div className="space-y-1.5 col-span-2 sm:col-span-1">
                                            <label className="text-sm font-semibold text-gray-700">Mã Code <span className="text-red-500">*</span></label>
                                            <input
                                                {...register("code", { required: "Vui lòng nhập mã code", maxLength: { value: 50, message: "Tối đa 50 ký tự" } })}
                                                type="text"
                                                className={`w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm font-bold uppercase ${errors.code ? 'border-red-500' : ''}`}
                                            />
                                            <div className="flex justify-between mt-1 text-xs">
                                                <span className="text-red-500 font-medium">{errors.code?.message}</span>
                                                <span className={`${watchedCode.length > 50 ? 'text-red-500' : 'text-gray-400'}`}>{watchedCode.length}/50</span>
                                            </div>
                                        </div>

                                        <div className="space-y-1.5 col-span-2">
                                            <label className="text-sm font-semibold text-gray-700">Mô tả chi tiết <span className="text-red-500">*</span></label> 
                                            <textarea
                                                {...register("description", { required: "Vui lòng nhập mô tả chi tiết", maxLength: { value: 500, message: "Tối đa 500 ký tự" } })}
                                                rows={2}
                                                placeholder="Nhập mô tả về điều kiện và ưu đãi của voucher..."
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm resize-none custom-scrollbar"
                                            />
                                            <div className="flex justify-between mt-1 text-xs">
                                                <span className="text-red-500 font-medium">{errors.description?.message}</span>
                                                <span className={`${watchedDescription.length > 500 ? 'text-red-500' : 'text-gray-400'}`}>{watchedDescription.length}/500</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* NHÓM 2: THIẾT LẬP GIẢM GIÁ */}
                                <div className="space-y-4">
                                    <h4 className="flex items-center gap-2 text-sm font-bold text-gray-800 border-b border-gray-100 pb-2">
                                        <IoWalletOutline className="text-lg text-emerald-600" />
                                        2. Thiết lập giảm giá
                                    </h4>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5 col-span-2 sm:col-span-1">
                                            <label className="text-sm font-semibold text-gray-700">Loại giảm giá</label>
                                            <select
                                                {...register("discountType", { required: "Vui lòng chọn Loại giảm giá" })}
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none transition-all text-sm font-medium cursor-pointer"
                                            >
                                                <option value="" disabled hidden>-- Chọn loại giảm giá --</option>
                                                <option value={DiscountType.FixedAmount}>Giảm số tiền cố định (VNĐ)</option>
                                                <option value={DiscountType.Percentage}>Giảm theo phần trăm (%)</option>
                                            </select>
                                            <div className="flex justify-between mt-1 text-xs">
                                                <span className="text-red-500 font-medium">{errors.discountType?.message}</span>
                                            </div>
                                        </div>

                                        <div className="space-y-1.5 col-span-2 sm:col-span-1">
                                            <label className="text-sm font-semibold text-gray-700">Mức giảm <span className="text-red-500">*</span></label>
                                            <input
                                                {...register("discountAmount", { required: "Vui lòng nhập mức giảm", valueAsNumber: true, min: 0 })}
                                                type="number"
                                                placeholder={selectedDiscountType === DiscountType.Percentage ? "VD: 20 (%)" : "VD: 50000 (VNĐ)"}
                                                className={`w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none transition-all text-sm font-medium ${errors.discountAmount ? 'border-red-500' : ''}`}
                                            />
                                            <span className="text-xs text-red-500 font-medium">{errors.discountAmount?.message}</span>
                                        </div>

                                        <div className="space-y-1.5 col-span-2 sm:col-span-1">
                                            <label className="text-sm font-semibold text-gray-700">Đơn tối thiểu (VNĐ) <span className="text-red-500">*</span></label>
                                            <input
                                                {...register("minOrderValue", { required: "Bắt buộc", valueAsNumber: true, min: 0 })}
                                                type="number"
                                                placeholder="VD: 200000"
                                                className={`w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none transition-all text-sm font-medium ${errors.minOrderValue ? 'border-red-500' : ''}`}
                                            />
                                            <span className="text-xs text-red-500">{errors.minOrderValue?.message}</span>
                                        </div>

                                        <div className="space-y-1.5 col-span-2 sm:col-span-1">
                                            <label className={`text-sm font-semibold ${selectedDiscountType === DiscountType.FixedAmount ? 'text-gray-400' : 'text-gray-700'}`}>Giảm tối đa (VNĐ)</label>
                                            <input
                                                {...register("maxDiscountAmount", { valueAsNumber: true, min: 0 })}
                                                type="number"
                                                disabled={selectedDiscountType === DiscountType.FixedAmount}
                                                placeholder={selectedDiscountType === DiscountType.FixedAmount ? "Không áp dụng" : "VD: 100000"}
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none transition-all text-sm font-medium disabled:bg-gray-100 disabled:cursor-not-allowed"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* NHÓM 3: THỜI GIAN & GIỚI HẠN */}
                                <div className="space-y-4">
                                    <h4 className="flex items-center gap-2 text-sm font-bold text-gray-800 border-b border-gray-100 pb-2">
                                        <IoTimeOutline className="text-lg text-blue-600" />
                                        3. Thời gian & Lượt dùng
                                    </h4>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5 col-span-2 sm:col-span-1">
                                            <label className="text-sm font-semibold text-gray-700">Ngày bắt đầu <span className="text-red-500">*</span></label>
                                            
                                            <Controller
                                                control={control}
                                                name="startDate"
                                                rules={{ required: "Vui lòng chọn ngày bắt đầu" }}
                                                render={({ field }) => (
                                                    <DatePicker
                                                        selected={field.value}
                                                        onChange={(date: Date | null) => field.onChange(date)}
                                                        showTimeSelect
                                                        timeFormat="HH:mm"
                                                        timeIntervals={30}
                                                        dateFormat="dd/MM/yyyy HH:mm"
                                                        placeholderText="Chọn ngày và giờ..."
                                                        minDate={new Date()} // Chặn chọn ngày trong quá khứ
                                                        className={`w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none transition-all text-sm font-medium ${errors.startDate ? 'border-red-500' : ''}`}
                                                    />
                                                )}
                                            />
                                            <span className="text-xs text-red-500">{errors.startDate?.message}</span>
                                        </div>

                                        <div className="space-y-1.5 col-span-2 sm:col-span-1">
                                            <label className="text-sm font-semibold text-gray-700">Ngày kết thúc <span className="text-red-500">*</span></label>
                                            <Controller
                                                control={control}
                                                name="endDate"
                                                rules={{ required: "Vui lòng chọn ngày kết thúc" }}
                                                render={({ field }) => (
                                                    <DatePicker
                                                        selected={field.value}
                                                        onChange={(date: Date | null) => field.onChange(date)}
                                                        showTimeSelect
                                                        timeFormat="HH:mm"
                                                        timeIntervals={30}
                                                        dateFormat="dd/MM/yyyy HH:mm"
                                                        placeholderText="Chọn ngày và giờ..."
                                                        minDate={new Date()} // Chặn chọn ngày trong quá khứ
                                                        className={`w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none transition-all text-sm font-medium ${errors.startDate ? 'border-red-500' : ''}`}
                                                    />
                                                )}
                                            />
                                            <span className="text-xs text-red-500">{errors.endDate?.message}</span>
                                        </div>

                                        <div className="space-y-1.5 col-span-2 sm:col-span-1">
                                            <label className="text-sm font-semibold text-gray-700">Tổng số lượng phát hành <span className="text-red-500">*</span></label>
                                            <input
                                                {...register("quantity", { required: true, valueAsNumber: true, min: 1 })}
                                                type="number"
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none transition-all text-sm font-medium"
                                            />
                                        </div>

                                        <div className="space-y-1.5 col-span-2 sm:col-span-1">
                                            <label className="text-sm font-semibold text-gray-700">Lượt dùng tối đa / Khách <span className="text-red-500">*</span></label>
                                            <input
                                                {...register("maxUsagePerUser", { required: true, valueAsNumber: true, min: 1 })}
                                                type="number"
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none transition-all text-sm font-medium"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* TRẠNG THÁI HOẠT ĐỘNG */}
                                <div className="pt-2 flex items-center justify-between bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                    <div>
                                        <label className="text-sm font-bold text-gray-800">Trạng thái kích hoạt</label>
                                        <p className="text-[11px] text-gray-500">Khách hàng có thể sử dụng Voucher này ngay</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            {...register("isActive")} 
                                            className="sr-only peer" 
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                    </label>
                                </div>
                            </div>

                            {/* --- FOOTER (ACTIONS) --- */}
                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3 shrink-0">
                                <button
                                    type='button'
                                    onClick={onClose}
                                    className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-800 bg-white hover:bg-gray-100 border border-gray-200 rounded-xl transition-all"
                                >
                                    Hủy bỏ
                                </button>
                                <button
                                    type='submit'
                                    disabled={isCreating || isUpdating}
                                    className="px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-200 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-wait"
                                >
                                    {(isCreating || isUpdating) ? 'Đang xử lý...' : (initialData ? 'Lưu thay đổi' : 'Tạo mới')}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

export default VoucherFormDialog;