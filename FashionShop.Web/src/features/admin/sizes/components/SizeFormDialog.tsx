import type React from "react";
import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { IoClose } from "react-icons/io5";

import { SizeType, type Size } from "../types/size";
import type { SizeFormInputs } from "../types/requests";
import { useSizes } from "../hooks/useSizes";

// 1. Định nghĩa Animation ra ngoài để tối ưu hiệu năng
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

const generateSlug = (str: string) => {
    if (!str) return "";
    return str
        .toLowerCase() // Chuyển thành chữ thường
        .normalize("NFD") // Chuẩn hóa chuỗi Unicode để tách dấu
        .replace(/[\u0300-\u036f]/g, "") // Xóa các dấu
        .replace(/[đĐ]/g, "d") // Xử lý chữ đ/Đ
        .replace(/([^0-9a-z-\s])/g, "") // Xóa các ký tự đặc biệt
        .replace(/(\s+)/g, "-") // Thay khoảng trắng bằng dấu gạch ngang
        .replace(/-+/g, "-") // Xóa các dấu gạch ngang kép
        .replace(/^-+|-+$/g, ""); // Xóa gạch ngang ở đầu và cuối
};

interface Props {
    isOpen: boolean;
    onClose: () => void;
    initialData?: Size;
}

const SizeFormDialog: React.FC<Props> = ({
    isOpen,
    onClose,
    initialData,
}) => {
    const { createSize, isCreating, updateSize, isUpdating } = useSizes();

    // 2. Setup Form
    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { dirtyFields, errors }
    } = useForm<SizeFormInputs>();

    // Theo dõi độ dài tên để hiển thị counter
    const watchedName = watch("name") || "";
    const watchedSlug = watch("slug") || "";

    // 3. Reset form khi mở Modal hoặc data thay đổi
    useEffect(() => {
        if (isOpen) {
            reset({
                name: initialData?.name || "",
                slug: initialData?.slug || "",
                sortOrder: (initialData?.sortOrder ?? "") as any, 
                type: initialData?.type || "" as SizeType, 
                isActive: initialData?.isActive ?? true 
            });
        }
    }, [isOpen, initialData, reset]);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newName = e.target.value;

        if (!initialData || !dirtyFields.slug) {
            const newSlug = generateSlug(newName);
            setValue("slug", newSlug, { shouldValidate: !!newSlug });
        }
    };

    // 4. Xử lý Submit
    const onSubmit: SubmitHandler<SizeFormInputs> = (data) => {
        const handleSuccess = (response: { succeeded: boolean }) => {
            if (response.succeeded) onClose();
        };

        if (!initialData) {
            createSize(data, { onSuccess: handleSuccess });
        } else {
            updateSize({ sizeId: initialData.id, request: data }, { onSuccess: handleSuccess });
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 font-sans">
                    {/* Backdrop */}
                    <motion.div
                        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        onClick={onClose}
                    />

                    {/* Modal Content */}
                    <motion.div
                        className="relative w-full max-w-lg bg-white rounded-[24px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
                            {/* HEADER */}
                            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">
                                        {initialData ? 'Cập nhật kích thước' : 'Thêm kích thước mới'}
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Điền đầy đủ thông tin chi tiết cho kích thước
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

                            {/* BODY */}
                            <div className="p-6 overflow-y-auto custom-scrollbar grow space-y-5">
                                {/* Tên kích thước */}
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-gray-700">
                                        Tên kích thước <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        {...register("name", { 
                                            required: "Vui lòng nhập Tên kích thước",
                                            maxLength: { value: 50, message: "Tên không quá 50 ký tự!" },
                                            onChange: handleNameChange
                                        })}
                                        type="text"
                                        placeholder="Nhập tên kích thước..."
                                        className={`w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm font-medium ${errors.name ? 'border-red-500 focus:border-red-500' : ''}`}
                                    />
                                    <div className="flex justify-between mt-1">
                                        <span className="text-xs text-red-500 font-medium min-h-[20px]">
                                            {errors.name?.message}
                                        </span>
                                        <span className={`text-xs ${watchedName.length > 50 ? 'text-red-500 font-bold' : 'text-gray-400'}`}>
                                            {watchedName.length}/50
                                        </span>
                                    </div>
                                </div>

                                {/* Slug */}
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-gray-700">
                                        Đường dẫn (Slug) <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            {...register("slug", { 
                                                required: "Vui lòng nhập Slug",
                                                maxLength: {
                                                    value: 50,
                                                    message: "Slug không được vượt quá 50 ký tự!"
                                                }
                                            })}
                                            type="text"
                                            disabled
                                            placeholder="Nhập đường dẫn (Slug)..."
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm text-gray-600"
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                                            /url
                                        </span>
                                    </div>
                                    <div className="flex justify-between mt-1">
                                        <span className="text-xs text-red-500 font-medium min-h-[20px]">
                                            {errors.slug?.message}
                                        </span>

                                        <span className={`text-xs ${watchedSlug.length > 50 ? 'text-red-500 font-bold' : 'text-gray-400'}`}>
                                            {watchedSlug.length}/50
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {/* Phân loại (Dropdown) */}
                                    <div className="space-y-1.5 col-span-2 sm:col-span-1">
                                        <label className="text-sm font-semibold text-gray-700">Phân loại <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <select
                                                {...register("type", { required: "Vui lòng chọn phân loại" })}
                                                className={`w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none transition-all text-sm font-medium appearance-none cursor-pointer ${errors.type ? 'border-red-500' : ''}`}
                                                defaultValue=""
                                            >
                                                <option value="" disabled hidden>-- Chọn phân loại --</option>
                                                <option value={SizeType.Clothing}>Quần áo</option>
                                                <option value={SizeType.Footwear}>Giày dép</option>
                                                <option value={SizeType.Accessory}>Phụ kiện</option>
                                            </select>
                                            <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                                                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                                                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path>
                                                </svg>
                                            </div>
                                        </div>
                                        <span className="text-xs text-red-500 font-medium">{errors.type?.message}</span>
                                    </div>

                                    {/* Thứ tự sắp xếp */}
                                    <div className="space-y-1.5 col-span-2 sm:col-span-1">
                                        <label className="text-sm font-semibold text-gray-700">Thứ tự hiển thị</label>
                                        <input
                                            {...register("sortOrder", { 
                                                required: "Vui lòng nhập Thứ tự", 
                                                valueAsNumber: true, min: { value: 0, message: "Không được âm" } })}
                                            type="number"
                                            min="0"
                                            className={`w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none transition-all text-sm font-medium ${errors.sortOrder ? 'border-red-500' : ''}`}
                                        />
                                        <span className="text-xs text-red-500 font-medium">{errors.sortOrder?.message}</span>
                                    </div>
                                </div>

                                {/* Trạng thái (Chỉ hiện khi Edit) */}
                                {initialData && (
                                    <div className="pt-4 border-t border-dashed border-gray-100 flex items-center justify-between">
                                        <div>
                                            <label className="text-sm font-bold text-gray-800">Trạng thái hoạt động</label>
                                            <p className="text-[11px] text-gray-500">Hiển thị / Ẩn kích thước này</p>
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
                                )}
                            </div>

                            {/* FOOTER */}
                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3 shrink-0">
                                <button
                                    type='button'
                                    onClick={onClose}
                                    className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-800 bg-white hover:bg-gray-100 border border-gray-200 rounded-lg transition-all"
                                >
                                    Hủy bỏ
                                </button>
                                <button
                                    type='submit'
                                    disabled={isCreating || isUpdating}
                                    className="px-6 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-md shadow-indigo-200 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-wait"
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

export default SizeFormDialog;