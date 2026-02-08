import type React from "react";
import type { Product } from "../types/product";
import { useProducts } from "../hooks/useProducts";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { ProductFormInputs } from "../types/requests";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { IoClose, IoCloudUploadOutline, IoImageOutline, IoSaveOutline } from "react-icons/io5";
import { useSnackbar } from "../../../contexts";
import type { Category } from "../../categories/types/category";
import type { Brand } from "../../brands/types/brand";
import RenderToggle from "../../../components/common/RenderToggle";

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

const buildProductFormData = (data: ProductFormInputs, file: File | null) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
        if (value === undefined || value === null || key === "thumbnail") return;
        formData.append(key, String(value));
    });

    if (file) formData.append("thumbnail", file);

    return formData;
}

const getDefaultValues = (initialData?: Product): Partial<ProductFormInputs> => {
    if (!initialData) 
        return {
            categoryId: "",
            brandId: "",
            name: "",
            slug: "",
            description: "",
            content: "",
            material: "",
            price: 0,
            isActive: true,
            isBestSeller: false,
            isNew: true,
        }
    return {
        categoryId: initialData.categoryId,
        brandId: initialData.brandId,
        name: initialData.name,
        slug: initialData.slug,
        description: initialData.description,
        content: initialData.content,
        material: initialData.material,
        price: initialData.price,
        isActive: initialData.isActive,
        isBestSeller: initialData.isBestSeller,
        isNew: initialData.isNew,
    }
}

interface ProductFormDialogProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: Product;
    leafCategories: Category[];
    brands: Brand[];
}

const ProductFormDialog: React.FC<ProductFormDialogProps> = ({
    isOpen,
    onClose,
    initialData,
    leafCategories,
    brands
}) => {

    const { showSnackbar } = useSnackbar();

    const {
        createProduct,
        isCreating,
        updateProduct,
        isUpdating
    } = useProducts();

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { dirtyFields, errors }
    } = useForm<ProductFormInputs>();

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const triggerFileInput = () => fileInputRef.current?.click();

    useEffect(() => {
        if (isOpen) {
            const defaultValues = getDefaultValues(initialData);
            reset(defaultValues);

            setPreviewUrl(initialData?.thumbnailUrl || null);
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

    const watchedName = watch("name") || "";
    const watchedDescription = watch("description") || "";
    const watchedMaterial = watch("material") || "";

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

    const handleRemoveImage = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
    }

    const onSubmit: SubmitHandler<ProductFormInputs> = (data) => {
        const formData = buildProductFormData(data, selectedFile);

        const handleSuccess = (response: any) => {
            if (response.succeeded) onClose();
        }

        if (!initialData) {
            createProduct(formData, { onSuccess: handleSuccess })
        } else {
            updateProduct({ productId: initialData.id, request: formData }, { onSuccess: handleSuccess })
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

                    {/* --- BACKDROP --- */}
                    <motion.div
                        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        onClick={onClose}
                    />

                    {/* --- MODAL CONTAINER --- */}
                    <motion.div
                        className="relative w-full max-w-5xl bg-white rounded-[32px] shadow-2xl flex flex-col max-h-[90vh] ring-1 ring-black/5 overflow-hidden"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="flex flex-col h-full overflow-hidden"
                        >

                            {/* --- HEADER (FIXED) --- */}
                            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-white shrink-0 z-10">
                                <div>
                                    <h3 className="text-2xl font-extrabold text-gray-800 tracking-tight">
                                        {initialData ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}
                                    </h3>
                                    <p className="text-sm text-gray-500 font-medium mt-1">
                                        Điền đầy đủ thông tin chi tiết cho sản phẩm
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all duration-200"
                                >
                                    <IoClose className="text-xl" />
                                </button>
                            </div>

                            {/* --- BODY (SCROLLABLE) --- */}
                            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-white scroll-smooth">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                                    {/* === CỘT TRÁI: THÔNG TIN (2/3) === */}
                                    <div className="lg:col-span-2 space-y-6">

                                        {/* ROW 1: Tên & Slug */}
                                        <div className="grid grid-cols-1 gap-6">
                                            {/* Name Input */}
                                            <div className="group">
                                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                                    Tên sản phẩm <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="Nhập tên sản phẩm..."
                                                    className={`w-full px-5 py-3 border border-transparent bg-gray-50 rounded-xl outline-none transition-all placeholder:text-gray-400 font-semibold text-gray-800 ${errors.name
                                                            ? "ring-2 ring-red-500 bg-red-50"
                                                            : "focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                                        }`}
                                                    {...register("name", {
                                                        required: "Tên sản phẩm là bắt buộc",
                                                        maxLength: { value: 200, message: "Tối đa 200 ký tự" },
                                                        onChange: handleNameChange,
                                                    })}
                                                />
                                                <div className="flex justify-between mt-1">
                                                    <span className="text-xs text-red-500 font-medium min-h-[20px]">
                                                        {errors.name?.message}
                                                    </span>
                                                    <span className="text-xs text-gray-400">
                                                        {watchedName.length}/200
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Slug Input */}
                                            <div className="group">
                                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                                    Đường dẫn (Slug) <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        placeholder="Nhập đường dẫn (slug)..."
                                                        className={`w-full pl-5 pr-16 py-3 border border-transparent bg-gray-50 rounded-xl outline-none transition-all placeholder:text-gray-400 font-semibold text-gray-800 ${errors.slug
                                                                ? "ring-2 ring-red-500 bg-red-50"
                                                                : "focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                                            }`}
                                                        {...register("slug", {
                                                            required: "Slug là bắt buộc"
                                                        })}
                                                    />
                                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                                                        /product
                                                    </span>
                                                </div>
                                                <div className="flex justify-between mt-1">
                                                    <span className="text-xs text-red-500 font-medium min-h-[20px]">
                                                        {errors.slug?.message}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* ROW 2: Category & Brand */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            {/* Category Select */}
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                                    Danh mục <span className="text-red-500">*</span>
                                                </label>
                                                <select
                                                    className={`w-full px-5 py-3 border border-transparent bg-gray-50 rounded-xl outline-none transition-all font-semibold text-gray-800 cursor-pointer appearance-none ${errors.categoryId
                                                            ? "ring-2 ring-red-500 bg-red-50"
                                                            : "focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                                        }`}
                                                    {...register("categoryId", { required: "Vui lòng chọn danh mục" })}
                                                >
                                                    <option value="" disabled hidden>-- Chọn danh mục --</option>
                                                    {leafCategories?.map(c => (
                                                        <option key={c.id} value={c.id}>{c.name}</option>
                                                    ))}
                                                </select>
                                                <p className="text-xs text-red-500 font-medium mt-1 min-h-[20px]">
                                                    {errors.categoryId?.message}
                                                </p>
                                            </div>

                                            {/* Brand Select */}
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                                    Thương hiệu <span className="text-red-500">*</span>
                                                </label>
                                                <select
                                                    className={`w-full px-5 py-3 border border-transparent bg-gray-50 rounded-xl outline-none transition-all font-semibold text-gray-800 cursor-pointer appearance-none ${errors.brandId
                                                            ? "ring-2 ring-red-500 bg-red-50"
                                                            : "focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                                        }`}
                                                    {...register("brandId", { required: "Vui lòng chọn thương hiệu" })}
                                                >
                                                    <option value="" disabled hidden>-- Chọn thương hiệu --</option>
                                                    {brands?.map(c => (
                                                        <option key={c.id} value={c.id}>{c.name}</option>
                                                    ))}
                                                </select>
                                                <p className="text-xs text-red-500 font-medium mt-1 min-h-[20px]">
                                                    {errors.brandId?.message}
                                                </p>
                                            </div>
                                        </div>

                                        {/* ROW 3: Material & Price */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            {/* Material Input */}
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                                    Chất liệu <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="Nhập chất liệu..."
                                                    className={`w-full px-5 py-3 border border-transparent bg-gray-50 rounded-xl outline-none transition-all placeholder:text-gray-400 font-semibold text-gray-800 ${errors.material
                                                            ? "ring-2 ring-red-500 bg-red-50"
                                                            : "focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                                        }`}
                                                    {...register("material", {
                                                        required: "Chất liệu là bắt buộc",
                                                        maxLength: { value: 100, message: "Tối đa 100 ký tự" }
                                                    })}
                                                />
                                                <div className="flex justify-between mt-1">
                                                    <span className="text-xs text-red-500 font-medium min-h-[20px]">
                                                        {errors.material?.message}
                                                    </span>
                                                    <span className={`text-xs ${watchedMaterial?.length > 100 ? 'text-red-500 font-bold' : 'text-gray-400'}`}>
                                                        {watchedMaterial?.length || 0}/100
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Price Input */}
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                                    Giá bán (VNĐ) <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    placeholder="0"
                                                    className={`w-full px-5 py-3 border border-transparent bg-gray-50 rounded-xl outline-none transition-all placeholder:text-gray-400 font-semibold text-gray-800 ${errors.price
                                                            ? "ring-2 ring-red-500 bg-red-50"
                                                            : "focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                                        }`}
                                                    {...register("price", {
                                                        required: "Giá bán là bắt buộc",
                                                        min: { value: 0, message: "Giá không được âm" }
                                                    })}
                                                />
                                                <p className="text-xs text-red-500 font-medium mt-1 min-h-[20px]">
                                                    {errors.price?.message}
                                                </p>
                                            </div>
                                        </div>

                                        {/* ROW 4: Short Description */}
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                                Mô tả ngắn <span className="text-red-500">*</span>
                                            </label>
                                            <textarea
                                                rows={3}
                                                placeholder="Tóm tắt về sản phẩm..."
                                                className={`w-full px-5 py-3 border border-transparent bg-gray-50 rounded-xl outline-none transition-all resize-none text-sm leading-relaxed placeholder:text-gray-400 text-gray-700 ${errors.description
                                                        ? "ring-2 ring-red-500 bg-red-50"
                                                        : "focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                                    }`}
                                                {...register("description", {
                                                    required: "Mô tả là bắt buộc",
                                                    maxLength: { value: 500, message: "Tối đa 500 ký tự" }
                                                })}
                                            />
                                            <div className="flex justify-between mt-1">
                                                <span className="text-xs text-red-500 font-medium min-h-[20px]">
                                                    {errors.description?.message}
                                                </span>
                                                <span className={`text-xs ${watchedDescription?.length > 500 ? 'text-red-500 font-bold' : 'text-gray-400'}`}>
                                                    {watchedDescription?.length || 0}/500
                                                </span>
                                            </div>
                                        </div>

                                        {/* ROW 5: Detailed Content */}
                                        <div className="pb-4">
                                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                                Nội dung chi tiết <span className="text-red-500">*</span>
                                            </label>
                                            <textarea
                                                rows={6}
                                                placeholder="Nhập thông tin chi tiết, bài viết quảng cáo..."
                                                className={`w-full px-5 py-3 border border-transparent bg-gray-50 rounded-xl outline-none transition-all resize-y text-sm leading-relaxed placeholder:text-gray-400 text-gray-700 ${errors.content
                                                        ? "ring-2 ring-red-500 bg-red-50"
                                                        : "focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                                    }`}
                                                {...register("content", { required: "Nội dung là bắt buộc" })}
                                            />
                                            <p className="text-xs text-red-500 font-medium mt-1 min-h-[20px]">
                                                {errors.content?.message}
                                            </p>
                                        </div>
                                    </div>

                                    {/* === CỘT PHẢI: HÌNH ẢNH (1/3) === */}
                                    <div className="lg:col-span-1">
                                        <div className="sticky top-0 space-y-6">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                                    Ảnh đại diện (Thumbnail) <span className="text-red-500">*</span>
                                                </label>

                                                {/* Hidden Input File */}
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/png, image/jpeg, image/jpg, image/webp"
                                                    {...register("thumbnail", { required: !initialData ? "Ảnh là bắt buộc" : false })}
                                                    ref={(e) => {
                                                        register("thumbnail").ref(e);
                                                        fileInputRef.current = e;
                                                    }}
                                                    onChange={(e) => {
                                                        register("thumbnail").onChange(e);
                                                        handleFileChange(e);
                                                    }}
                                                />

                                                {/* Image Preview Box */}
                                                <div
                                                    onClick={triggerFileInput}
                                                    className={`group relative w-full aspect-[3/4] border-2 border-dashed rounded-2xl transition-all cursor-pointer flex flex-col items-center justify-center overflow-hidden bg-gray-50 ${errors.thumbnail
                                                            ? "border-red-400 bg-red-50 hover:bg-red-100/50"
                                                            : "border-gray-300 hover:border-indigo-500 hover:bg-indigo-50/30"
                                                        }`}
                                                >
                                                    {previewUrl ? (
                                                        <>
                                                            <img
                                                                src={previewUrl}
                                                                alt="Preview"
                                                                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                                                            />
                                                            {/* Hover Overlay */}
                                                            <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-[1px] flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                                <div className="p-3 bg-white rounded-full shadow-lg mb-2">
                                                                    <IoCloudUploadOutline className="text-xl text-indigo-600" />
                                                                </div>
                                                                <span className="text-white font-semibold text-sm tracking-wide shadow-sm">
                                                                    Thay đổi ảnh
                                                                </span>
                                                            </div>
                                                            {/* Remove Button */}
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    if (handleRemoveImage) handleRemoveImage();
                                                                }}
                                                                className="absolute top-3 right-3 z-20 p-2 bg-white text-red-500 rounded-full shadow-md hover:bg-red-50 transition-all transform hover:scale-110 opacity-0 group-hover:opacity-100"
                                                                title="Xóa ảnh"
                                                            >
                                                                <IoClose className="text-xl" />
                                                            </button>
                                                        </>
                                                    ) : (
                                                        // Placeholder
                                                        <div className="flex flex-col items-center text-center p-6">
                                                            <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 text-indigo-500 group-hover:scale-110 transition-transform duration-300">
                                                                <IoImageOutline className="text-3xl" />
                                                            </div>
                                                            <p className="text-sm text-gray-700 font-bold">Tải ảnh lên</p>
                                                            <p className="text-xs text-gray-400 mt-2">.JPG, .PNG, .WEBP<br />(Tỷ lệ 3:4)</p>
                                                        </div>
                                                    )}
                                                </div>

                                                {errors.thumbnail && (
                                                    <p className="mt-2 text-xs font-semibold text-red-500 text-center">
                                                        {errors.thumbnail.message}
                                                    </p>
                                                )}
                                            </div>

                                            {initialData && (
                                                <div className="grid grid-cols-1 gap-4 mt-4">
                                                    
                                                    {/* Toggle 1: Trạng thái */}
                                                    <RenderToggle
                                                        label="Trạng thái hoạt động"
                                                        subLabel="Ẩn/Hiện sản phẩm trên cửa hàng"
                                                        name="isActive" 
                                                        register={register}
                                                    />

                                                    {/* Toggle 2: Best Seller */}
                                                    <RenderToggle
                                                        label="Sản phẩm bán chạy"
                                                        subLabel="Gắn nhãn 'Hot' cho sản phẩm"
                                                        name="isBestSeller"
                                                        register={register}
                                                    />

                                                    {/* Toggle 3: New */}
                                                    <RenderToggle
                                                        label="Sản phẩm mới"
                                                        subLabel="Đánh dấu là hàng mới về"
                                                        name="isNew"
                                                        register={register}
                                                    />
                                                    
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/* --- FOOTER (FIXED) --- */}
                            <div className="px-8 py-5 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3 shrink-0 z-10">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    disabled={isCreating || isUpdating}
                                    className="px-6 py-2.5 text-sm font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 rounded-xl transition-all shadow-sm disabled:opacity-50"
                                >
                                    Hủy bỏ
                                </button>

                                <button
                                    type="submit"
                                    disabled={isCreating || isUpdating}
                                    className={`relative overflow-hidden flex items-center gap-2 px-8 py-2.5 text-sm font-bold text-white rounded-xl shadow-lg shadow-indigo-200 transition-all duration-300 ${isCreating || isUpdating
                                            ? 'bg-indigo-400 cursor-wait'
                                            : 'bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-0.5'
                                        }`}
                                >
                                    {isCreating || isUpdating ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4 text-white/90" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span>Đang xử lý...</span>
                                        </>
                                    ) : (
                                        <>
                                            <IoSaveOutline className="text-lg" />
                                            <span>{initialData ? 'Lưu thay đổi' : 'Tạo sản phẩm'}</span>
                                        </>
                                    )}
                                </button>
                            </div>

                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

export default ProductFormDialog;