import type React from "react";
import type { Brand } from "../types/brand";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { IoClose, IoCloudUploadOutline, IoImageOutline } from "react-icons/io5";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useBrands } from "../hooks/useBrands";
import { useEffect, useRef, useState } from "react";
import { useSnackbar } from "../../../../contexts";
import type { BrandFormInputs } from "../types/requests";

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

const buildBrandFormData = (data: BrandFormInputs, file: File | null) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
        if (value === undefined || value === null || key === "logo") return;
        formData.append(key, String(value));
    });

    if (file) formData.append("logo", file);

    return formData;
}

const getDefaultValues = (initialData?: Brand): Partial<BrandFormInputs> => {
    if (!initialData)
        return {
            name: "",
            description: "",
            slug: "",
            isActive: true,
        }

    return {
        name: initialData.name,
        description: initialData.description || "",
        slug: initialData.slug,
        isActive: initialData.isActive
    }
}

interface BrandFormDialogProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: Brand
}

const BrandFormDialog: React.FC<BrandFormDialogProps> = ({ 
    isOpen, 
    onClose, 
    initialData 
}) => {

    const { showSnackbar } = useSnackbar();

    const {
        createBrand,
        isCreating,
        updateBrand,
        isUpdating,
    } = useBrands();

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { dirtyFields, errors }
    } = useForm<BrandFormInputs>();

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const triggerFileInput = () => fileInputRef.current?.click();

    const watchedName = watch("name") || "";
    const watchedDescription = watch("description") || "";
    const watchedSlug = watch("slug") || "";

    useEffect(() => {
        if (isOpen) {
            const defaultValues = getDefaultValues(initialData);
            reset(defaultValues);

            setPreviewUrl(initialData?.logoUrl || null);
            setSelectedFile(null);
        }
    }, [isOpen, initialData, reset]);

    useEffect(() => {
        return () => {
            if (previewUrl && previewUrl.startsWith("blob:")) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newName = e.target.value;

        if (!initialData || !dirtyFields.slug) {
            const newSlug = generateSlug(newName);
            setValue("slug", newSlug, { shouldValidate: !!newSlug });
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith('image/')) {
            showSnackbar('Vui lòng chỉ chọn file hình ảnh!', "warning");
            return;
        }

        if (previewUrl && previewUrl.startsWith("blob:")) {
            URL.revokeObjectURL(previewUrl);
        }

        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const onSubmit: SubmitHandler<BrandFormInputs> = (data) => {
        const formData = buildBrandFormData(data, selectedFile);

        const handleSuccess = (response: any) => {
            if (response.succeeded) onClose();
        }

        if (!initialData) {
            createBrand(formData, { onSuccess: handleSuccess })
        } else {
            updateBrand({ brandId: initialData.id, request: formData }, { onSuccess: handleSuccess })
        }
    }

    const backdropVariants: Variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
    };

    const modalVariants: Variants = {
        hidden: {
            opacity: 0,
            y: 20,
            scale: 0.95
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { type: "spring", stiffness: 300, damping: 25 }
        },
        exit: {
            opacity: 0,
            y: 20,
            scale: 0.95,
            transition: { duration: 0.2 }
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 font-sans">
                    <motion.div
                        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        onClick={onClose}
                    />

                    <motion.div
                        className="relative w-full max-w-4xl bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ring-1 ring-black/5"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <motion.form 
                            onSubmit={handleSubmit(onSubmit)} 
                            className="flex flex-col h-full w-full overflow-hidden"
                            variants={modalVariants} initial="hidden" animate="visible" exit="exit"
                        >
                            {/* HEADER */}
                            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-white shrink-0 z-10">
                                <div>
                                    <h3 className="text-2xl font-extrabold text-gray-800 tracking-tight">
                                        {initialData ? 'Cập nhật thương hiệu' : 'Thêm thương hiệu mới'}
                                    </h3>
                                    <p className="text-sm text-gray-500 font-medium mt-1">
                                        Điền đầy đủ thông tin chi tiết cho thương hiệu
                                    </p>
                                </div>
                                <button
                                    type='button'
                                    onClick={onClose}
                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all duration-200"
                                >
                                    <IoClose className="text-xl" />
                                </button>
                            </div>

                            {/* BODY */}
                            <div className="p-8 overflow-y-auto custom-scrollbar grow bg-white min-h-0">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    <div className="lg:col-span-2 space-y-6">
                                        
                                        {/* 1. Tên thương hiệu */}
                                        <div className="group">
                                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                                Tên thương hiệu <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                {...register("name", { 
                                                    required: "Tên thương hiệu là bắt buộc",
                                                    maxLength: {
                                                        value: 100,
                                                        message: "Tên thương hiệu không được vượt quá 100 ký tự!"
                                                    },
                                                    onChange: handleNameChange,
                                                })}
                                                type="text"
                                                placeholder="Nhập tên thương hiệu..."
                                                className={`w-full px-5 py-3 border border-transparent bg-gray-50 rounded-xl outline-none transition-all placeholder:text-gray-400 font-semibold text-gray-800
                                                    ${errors.name 
                                                        ? "ring-2 ring-red-500 bg-red-50" 
                                                        : "focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                                    }`}
                                            />
                                            <div className="flex justify-between mt-1">
                                                <span className="text-xs text-red-500 font-medium min-h-[20px]">
                                                    {errors.name?.message}
                                                </span>

                                                <span className={`text-xs ${watchedName.length > 100 ? 'text-red-500 font-bold' : 'text-gray-400'}`}>
                                                    {watchedName.length}/100
                                                </span>
                                            </div>
                                        </div>

                                        {/* 2. Slug */}
                                        <div className="group">
                                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                                Đường dẫn (Slug) <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <input
                                                    {...register("slug", { 
                                                        required: "Slug là bắt buộc",
                                                        maxLength: {
                                                            value: 100,
                                                            message: "Slug không được vượt quá 100 ký tự!"
                                                        }
                                                    })}
                                                    type="text"
                                                    placeholder="Nhập đường dẫn (Slug)..."
                                                    className={`w-full pl-5 pr-16 py-3 border border-transparent bg-gray-50 rounded-xl outline-none transition-all placeholder:text-gray-400 font-semibold text-gray-800
                                                        ${errors.slug 
                                                            ? "ring-2 ring-red-500 bg-red-50" 
                                                            : "focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                                        }`}
                                                />
                                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                                                    /url
                                                </span>
                                            </div>
                                            <div className="flex justify-between mt-1">
                                                <span className="text-xs text-red-500 font-medium min-h-[20px]">
                                                    {errors.slug?.message}
                                                </span>

                                                <span className={`text-xs ${watchedSlug.length > 100 ? 'text-red-500 font-bold' : 'text-gray-400'}`}>
                                                    {watchedSlug.length}/100
                                                </span>
                                            </div>
                                        </div>

                                        {/* 3. Mô tả */}
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                                Mô tả chi tiết
                                            </label>
                                            <textarea
                                                {...register("description", {
                                                    maxLength: {
                                                        value: 500,
                                                        message: "Mô tả không được vượt quá 500 ký tự!"
                                                    }
                                                })} 
                                                rows={5}
                                                className="w-full px-5 py-3 border border-transparent bg-gray-50 rounded-xl outline-none transition-all resize-none text-sm leading-relaxed placeholder:text-gray-400 text-gray-700
                                                    focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                                placeholder="Nhập thông tin giới thiệu về thương hiệu..."
                                            ></textarea>

                                            <div className="flex justify-between mt-1">
                                                <span className="text-xs text-red-500 font-medium min-h-[20px]">
                                                    {errors.description?.message}
                                                </span>

                                                <span className={`text-xs ${watchedDescription.length > 500 ? 'text-red-500 font-bold' : 'text-gray-400'}`}>
                                                    {watchedDescription.length}/500
                                                </span>
                                            </div>
                                        </div>

                                        {/* 4. Trạng thái */}
                                        {initialData && (
                                            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                                                <div>
                                                    <h4 className="text-sm font-bold text-gray-800">Trạng thái hoạt động</h4>
                                                    <p className="text-xs text-gray-500 mt-1">Ẩn/Hiện thương hiệu này trên cửa hàng</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input 
                                                        type="checkbox" 
                                                        {...register("isActive")} 
                                                        className="sr-only peer" 
                                                    />
                                                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                                </label>
                                            </div>
                                        )}
                                    </div>

                                    {/* --- CỘT PHẢI: HÌNH ẢNH (Chiếm 1/3) --- */}
                                    <div className="lg:col-span-1">
                                        <div className="sticky top-0">
                                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                                Logo thương hiệu <span className="text-red-500">*</span>
                                            </label>
                                            
                                            <input
                                                {...register("logo", { required: !initialData ? "Logo là bắt buộc" : false })}
                                                type="file"
                                                ref={(e) => {
                                                    register("logo").ref(e);
                                                    fileInputRef.current = e;
                                                }}
                                                onChange={(e) => {
                                                    register("logo").onChange(e); 
                                                    handleFileChange(e);
                                                }}
                                                className="hidden"
                                                accept="image/png, image/jpeg, image/jpg, image/webp"
                                            />

                                            <div
                                                onClick={triggerFileInput}
                                                className={`group relative w-full aspect-square border-2 border-dashed rounded-2xl transition-all cursor-pointer flex flex-col items-center justify-center overflow-hidden bg-gray-50
                                                    ${errors.logo 
                                                        ? "border-red-400 bg-red-50 hover:bg-red-100/50" 
                                                        : "border-gray-300 hover:border-indigo-500 hover:bg-indigo-50/30" 
                                                    }
                                                `}
                                            >
                                                {previewUrl ? (
                                                    <>
                                                        <img 
                                                            src={previewUrl} 
                                                            alt="Preview" 
                                                            className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105" 
                                                        />
                                                        <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-[1px] flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                            <div className="p-3 bg-white rounded-full shadow-lg mb-2">
                                                                <IoCloudUploadOutline className="text-xl text-indigo-600" />
                                                            </div>
                                                            <span className="text-white font-semibold text-sm tracking-wide shadow-sm">Thay đổi ảnh</span>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="flex flex-col items-center text-center p-6">
                                                        <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 text-indigo-500 group-hover:scale-110 transition-transform duration-300">
                                                            <IoImageOutline className="text-3xl" />
                                                        </div>
                                                        <p className="text-sm text-gray-700 font-bold">Tải ảnh lên</p>
                                                        <p className="text-xs text-gray-400 mt-2">SVG, PNG, JPG<br/>(Max 5MB)</p>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {errors.logo && (
                                                <p className="mt-2 text-xs font-semibold text-red-500 flex items-center gap-1 justify-center">
                                                    {errors.logo.message as string}
                                                </p>
                                            )}
                                            
                                            {/* Helper text dưới ảnh */}
                                            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                                <p className="text-xs text-blue-600 leading-relaxed">
                                                    <span className="font-bold">Lưu ý:</span> Nên sử dụng ảnh có tỉ lệ 1:1.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* FOOTER */}
                            <div className="px-8 py-5 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3 shrink-0">
                                <button
                                    type='button'
                                    onClick={onClose}
                                    disabled={isCreating || isUpdating}
                                    className="px-6 py-2.5 text-sm font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 rounded-xl transition-all shadow-sm disabled:opacity-50"
                                >
                                    Hủy bỏ
                                </button>

                                <button
                                    type='submit'
                                    disabled={isCreating || isUpdating}
                                    className={`
                                        relative overflow-hidden flex items-center gap-2 px-8 py-2.5 text-sm font-bold text-white rounded-xl shadow-lg shadow-indigo-200 transition-all duration-300
                                        ${isCreating || isUpdating 
                                            ? 'bg-indigo-400 cursor-wait' 
                                            : 'bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-0.5' 
                                        }
                                    `}
                                >
                                    {isCreating || isUpdating ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4 text-white/90" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span>Đang lưu...</span>
                                        </>
                                    ) : (
                                        <span>{initialData ? 'Lưu thay đổi' : 'Tạo mới'}</span>
                                    )}
                                </button>
                            </div>
                        </motion.form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

export default BrandFormDialog;