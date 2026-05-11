import type React from "react";
import type { Color } from "../types/color";
import { useColors } from "../hooks/useColors";
import { useForm, type SubmitHandler } from "react-hook-form";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import type { ColorFormInputs } from "../types/requests";
import { IoClose, IoColorPaletteOutline } from "react-icons/io5";
import { useEffect } from "react";

const generateSlug = (str: string) => {
    if (!str) return "";
    return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[đĐ]/g, "d")
        .replace(/([^0-9a-z-\s])/g, "")
        .replace(/(\s+)/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "");
};

const getDefaultValues = (initialData?: Color): Partial<ColorFormInputs> => {
    if (!initialData)
        return {
            name: "",
            hexCode: "",
            slug: "",
            isActive: true
        }
    
    return {
        name: initialData.name,
        hexCode: initialData.hexCode,
        slug: initialData.slug,
        isActive: initialData.isActive
    }
}

interface ColorFormDialogProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: Color;
}

const ColorFormDialog: React.FC<ColorFormDialogProps> = ({
    isOpen,
    onClose,
    initialData
}) => {
    
    const {
        createColor,
        isCreating,
        updateColor,
        isUpdating
    } = useColors();

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { dirtyFields, errors }
    } = useForm<ColorFormInputs>();
    
    useEffect(() => {
        if (isOpen) {
            const defaultValues = getDefaultValues(initialData);
            reset(defaultValues);
        }
    }, [isOpen, initialData, reset]);

    const watchedName = watch("name") || "";
    const watchedSlug = watch("slug") || "";
    const watchedHexCode = watch("hexCode") || "";

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newName = e.target.value;

        if (!initialData || !dirtyFields.slug) {
            const newSlug = generateSlug(newName);
            setValue("slug", newSlug, { shouldValidate: !!newSlug });
        }
    };

    const onSubmit: SubmitHandler<ColorFormInputs> = (data) => {
        const handleSuccess = (response: any) => {
            if (response.succeeded) onClose();
        }

        if (!initialData) 
            createColor(data, { onSuccess: handleSuccess });
        else 
            updateColor({ colorId: initialData.id, request: data }, { onSuccess: handleSuccess });
    }

    const backdropVariants: Variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
    };

    const modalVariants: Variants = {
        hidden: {
            opacity: 0,
            y: 16,
            scale: 0.96
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { type: "spring", stiffness: 300, damping: 25 }
        },
        exit: {
            opacity: 0,
            y: 16,
            scale: 0.96,
            transition: { duration: 0.2 }
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 font-sans">
                    <motion.div
                        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        onClick={onClose}
                    />

                    <motion.div
                        className="relative w-full max-w-md bg-white rounded-[20px] shadow-2xl overflow-hidden flex flex-col max-h-[88vh]"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
                            
                            {/* HEADER */}
                            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800">
                                        {initialData ? 'Cập nhật màu sắc' : 'Thêm màu mới'}
                                    </h3>
                                    <p className="text-[11px] text-gray-500 mt-1">
                                        Điền thông tin màu sắc
                                    </p>
                                </div>

                                <button
                                    type='button'
                                    onClick={onClose}
                                    className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <IoClose className="text-base" />
                                </button>
                            </div>

                            {/* BODY */}
                            <div className="p-5 overflow-y-auto custom-scrollbar grow space-y-4">
                                
                                {/* Tên màu */}
                                <div className="space-y-1">
                                    <label className="text-[13px] font-semibold text-gray-700">
                                        Tên màu <span className="text-red-500">*</span>
                                    </label>

                                    <input
                                        {...register("name", { 
                                            required: "Tên màu là bắt buộc",
                                            maxLength: {
                                                value: 50,
                                                message: "Tên màu không được vượt quá 50 ký tự!"
                                            },
                                            onChange: handleNameChange
                                        })}
                                        type="text"
                                        placeholder="Nhập tên màu..."
                                        className={`w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-[13px] font-medium ${
                                            errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : ''
                                        }`}
                                    />

                                    <div className="flex justify-between mt-1">
                                        <span className="text-[11px] text-red-500 font-medium min-h-[18px]">
                                            {errors.name?.message}
                                        </span>

                                        <span className={`text-[11px] ${watchedName.length > 50 ? 'text-red-500 font-bold' : 'text-gray-400'}`}>
                                            {watchedName.length}/50
                                        </span>
                                    </div>
                                </div>

                                {/* Slug */}
                                <div className="space-y-1">
                                    <label className="text-[13px] font-semibold text-gray-700">
                                        Đường dẫn (Slug) <span className="text-red-500">*</span>
                                    </label>

                                    <div className="relative">
                                        <input
                                            {...register("slug", { 
                                                required: "Slug là bắt buộc",
                                                maxLength: {
                                                    value: 50,
                                                    message: "Slug không được vượt quá 50 ký tự!"
                                                }
                                            })}
                                            type="text"
                                            disabled
                                            placeholder="Nhập đường dẫn..."
                                            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-[13px] text-gray-600"
                                        />

                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-[10px] font-mono bg-gray-100 px-1.5 py-0.5 rounded">
                                            /url
                                        </span>
                                    </div>

                                    <div className="flex justify-between mt-1">
                                        <span className="text-[11px] text-red-500 font-medium min-h-[18px]">
                                            {errors.slug?.message}
                                        </span>

                                        <span className={`text-[11px] ${watchedSlug.length > 50 ? 'text-red-500 font-bold' : 'text-gray-400'}`}>
                                            {watchedSlug.length}/50
                                        </span>
                                    </div>
                                </div>

                                {/* Hex Code & Preview */}
                                <div className="grid grid-cols-2 gap-3">
                                    
                                    {/* HEX */}
                                    <div className="space-y-1 col-span-2 sm:col-span-1">
                                        <label className="text-[13px] font-semibold text-gray-700">
                                            Mã màu <span className="text-red-500">*</span>
                                        </label>

                                        <div className="relative flex items-center">
                                            <div className="absolute left-3 text-gray-400 pointer-events-none">
                                                <IoColorPaletteOutline className="text-sm" />
                                            </div>

                                            <input
                                                {...register("hexCode", { 
                                                    required: "Mã màu là bắt buộc",
                                                    pattern: {
                                                        value: /^#([0-9A-F]{3}){1,2}$/i,
                                                        message: "Mã màu không hợp lệ"
                                                    },
                                                    maxLength: {
                                                        value: 7,
                                                        message: "HexCode không được vượt quá 7 ký tự!"
                                                    }
                                                })}
                                                type="text"
                                                placeholder="#000080"
                                                className="w-full pl-8 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-[13px] font-mono uppercase"
                                                onBlur={(e) => {
                                                    let val = e.target.value;
                                                    if(val && !val.startsWith('#')) setValue('hexCode', `#${val}`);
                                                }}
                                            />
                                        </div>

                                        <div className="flex justify-between mt-1">
                                            <span className="text-[11px] text-red-500 font-medium min-h-[18px]">
                                                {errors.hexCode?.message}
                                            </span>

                                            <span className={`text-[11px] ${watchedHexCode.length > 7 ? 'text-red-500 font-bold' : 'text-gray-400'}`}>
                                                {watchedHexCode.length}/7
                                            </span>
                                        </div>
                                    </div>

                                    {/* PREVIEW */}
                                    <div className="space-y-1 col-span-2 sm:col-span-1">
                                        <label className="text-[13px] font-semibold text-gray-700">
                                            Hiển thị
                                        </label>

                                        <div className="flex items-center gap-2.5 h-[42px] px-3 bg-white border border-gray-200 rounded-lg">
                                            <div 
                                                className="w-7 h-7 rounded-full border border-gray-200 shadow-sm shrink-0"
                                                style={{ backgroundColor: watchedHexCode }} 
                                            />

                                            <span className="text-[11px] text-gray-500 font-medium truncate">
                                                {watchedHexCode || 'Chưa chọn màu'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Trạng thái */}
                                {initialData && (
                                    <div className="pt-3 border-t border-dashed border-gray-100">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <label className="text-[13px] font-bold text-gray-800">
                                                    Trạng thái hoạt động
                                                </label>

                                                <p className="text-[10px] text-gray-500">
                                                    Hiển thị / Ẩn màu khỏi bộ lọc
                                                </p>
                                            </div>

                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input 
                                                    type="checkbox" 
                                                    {...register("isActive")} 
                                                    className="sr-only peer" 
                                                />

                                                <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                                            </label>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* FOOTER */}
                            <div className="px-5 py-3.5 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-2.5 shrink-0">
                                
                                <button
                                    type='button'
                                    onClick={onClose}
                                    className="px-4 py-2 text-[13px] font-semibold text-gray-600 hover:text-gray-800 bg-white hover:bg-gray-100 border border-gray-200 rounded-lg transition-all"
                                >
                                    Hủy bỏ
                                </button>

                                <button
                                    type='submit'
                                    disabled={isCreating || isUpdating}
                                    className="px-5 py-2 text-[13px] font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-md shadow-indigo-200 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-wait"
                                >
                                    {(isCreating || isUpdating)
                                        ? 'Đang xử lý...'
                                        : (initialData ? 'Lưu thay đổi' : 'Tạo mới')
                                    }
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

export default ColorFormDialog;