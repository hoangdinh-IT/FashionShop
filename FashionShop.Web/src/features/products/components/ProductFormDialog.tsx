import type React from "react";
import { useEffect, useRef, useState } from "react";
import { useFieldArray, useForm, type SubmitHandler } from "react-hook-form";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import {
    IoClose,
    IoImageOutline,
    IoInformationCircleOutline,
    IoLayersOutline,
} from "react-icons/io5";

import type { ProductDetail } from "../types/product";
import type { ProductDetailFormInputs } from "../types/requests";
import type { Category } from "../../categories/types/category";
import type { Brand } from "../../brands/types/brand";

import { useProductDetail, useProductMutations } from "../hooks/useProducts";
import { useSnackbar } from "../../../contexts";
import RenderToggle from "../../../components/common/RenderToggle";
import ProductVariantsManager from "./ProductVariansManager";

// ==========================================
// 1. HELPERS & UTILS
// ==========================================
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

const getInputClassName = (hasError?: boolean) => `
    w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-900 transition-all outline-none focus:bg-white
    ${hasError
        ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
        : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
    }
`;

const getDefaultValues = (productDetail?: ProductDetail): Partial<ProductDetailFormInputs> => {
    const defaultVariants = [
        { id: "", sku: "", colorId: 0 as any, sizeId: 0 as any, quantity: 0, price: 0 },
    ];

    if (!productDetail) {
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
            productVariants: defaultVariants,
        };
    }

    return {
        ...productDetail,
        productVariants: productDetail.productVariants?.length
            ? productDetail.productVariants.map((v) => ({
                id: v.id,
                sku: v.sku,
                colorId: v.colorId,
                sizeId: v.sizeId,
                quantity: v.quantity,
                price: v.price,
            }))
            : defaultVariants,
    };
};

const preparePayload = (data: ProductDetailFormInputs, file: File | null, isCreate: boolean) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
        if (value === undefined || value === null || key === "thumbnail" || key === "productVariants") {
            return;
        }
        const formattedKey = isCreate ? key.charAt(0).toUpperCase() + key.slice(1) : key;
        formData.append(`${formattedKey}`, String(value));
    });

    if (file) {
        formData.append(`${isCreate ? "Thumbnail" : "thumbnail"}`, file);
    }

    data.productVariants.forEach((variant, index) => {
        formData.append(`ProductVariants[${index}].ProductId`, "00000000-0000-0000-0000-000000000000");
        formData.append(`ProductVariants[${index}].ColorId`, String(variant.colorId));
        formData.append(`ProductVariants[${index}].SizeId`, String(variant.sizeId));
        formData.append(`ProductVariants[${index}].SKU`, String(variant.sku));
        formData.append(`ProductVariants[${index}].Quantity`, String(variant.quantity));
        formData.append(`ProductVariants[${index}].Price`, String(variant.price || data.price));

        if (!isCreate && variant.id) {
            formData.append(`ProductVariants[${index}].Id`, String(variant.id));
        }
    });

    return formData;
};

// ==========================================
// 2. MAIN COMPONENT
// ==========================================
interface ProductFormDialogProps {
    isOpen: boolean;
    onClose: () => void;
    productId?: string;
    leafCategories: Category[];
    brands: Brand[];
}

const ProductFormDialog: React.FC<ProductFormDialogProps> = ({
    isOpen,
    onClose,
    productId,
    leafCategories,
    brands,
}) => {
    const { showSnackbar } = useSnackbar();
    const { createDetail, isCreatingProduct, updateProduct, isUpdatingProduct, updateDetail, isUpdatingDetail } = useProductMutations();
    const { productDetail } = useProductDetail(productId);

    const {
        register,
        control,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { dirtyFields, errors },
    } = useForm<ProductDetailFormInputs>();

    const { fields, append, remove } = useFieldArray({
        control,
        name: "productVariants",
        rules: { minLength: 1 },
    });

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const isProcessing = isCreatingProduct || isUpdatingProduct;

    // --- EFFECTS ---
    useEffect(() => {
        if (isOpen) {
            reset(getDefaultValues(productDetail));
            setPreviewUrl(productDetail?.thumbnailUrl || null);
            setSelectedFile(null);
        }
    }, [isOpen, productDetail, reset]);

    useEffect(() => {
        return () => {
            if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    // --- HANDLERS ---
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newName = e.target.value;
        if (!productDetail || !dirtyFields.slug) {
            setValue("slug", generateSlug(newName), { shouldValidate: !!newName });
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            return showSnackbar("Vui lòng chỉ chọn file hình ảnh!", "warning");
        }

        if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const onSubmit: SubmitHandler<ProductDetailFormInputs> = (data) => {
        const isCreate = !productDetail;
        const formData = preparePayload(data, selectedFile, isCreate);

        const handleSuccess = (res: any) => {
            if (res.succeeded) {
                showSnackbar(
                    `Sản phẩm đã được ${isCreate ? "thêm mới" : "cập nhật"} thành công!`,
                    "success"
                );
                onClose();
            }
        };

        if (isCreate) {
            createDetail(formData, { onSuccess: handleSuccess });
        } else {
            updateDetail(
                { productId: productDetail!.id, request: formData },
                { onSuccess: handleSuccess }
            );
        }
    };

    // --- ANIMATION VARIANTS ---
    const backdropVariants: Variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
    };

    const modalVariants: Variants = {
        hidden: { opacity: 0, y: 20, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { type: "spring", stiffness: 300, damping: 25 },
        },
        exit: { opacity: 0, y: 20, scale: 0.95, transition: { duration: 0.2 } },
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 font-sans">
                    <motion.div
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        onClick={onClose}
                    />

                    <motion.div
                        className="relative w-full max-w-6xl bg-slate-50 rounded-[24px] shadow-2xl flex flex-col max-h-[95vh] ring-1 ring-slate-900/5 overflow-hidden"
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
                            {/* HEADER */}
                            <FormHeader
                                isEdit={!!productDetail}
                                isProcessing={isProcessing}
                                onClose={onClose}
                            />

                            {/* BODY */}
                            <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar scroll-smooth">
                                <div className="max-w-7xl mx-auto space-y-6">
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        {/* CỘT TRÁI */}
                                        <div className="lg:col-span-2 space-y-6">
                                            <BasicInfoSection
                                                register={register}
                                                errors={errors}
                                                watch={watch}
                                                onNameChange={handleNameChange}
                                            />
                                            <AttributesSection
                                                register={register}
                                                errors={errors}
                                                watch={watch}
                                                categories={leafCategories}
                                                brands={brands}
                                            />
                                        </div>

                                        {/* CỘT PHẢI */}
                                        <div className="lg:col-span-1 space-y-6">
                                            <ThumbnailSection
                                                register={register}
                                                errors={errors}
                                                previewUrl={previewUrl}
                                                fileInputRef={fileInputRef}
                                                onFileChange={handleFileChange}
                                                onRemove={() => {
                                                    setSelectedFile(null);
                                                    setPreviewUrl(null);
                                                }}
                                                isEdit={!!productDetail}
                                            />
                                            {productDetail && <StatusSection register={register} />}
                                        </div>
                                    </div>

                                    {/* PHÂN LOẠI (VARIANTS) */}
                                    <div className="pt-2 pb-10">
                                        <ProductVariantsManager
                                            fields={fields}
                                            append={append}
                                            remove={remove}
                                            register={register}
                                            errors={errors}
                                        />
                                    </div>
                                </div>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ProductFormDialog;

// ==========================================
// 3. SUB-COMPONENTS
// ==========================================

const FormHeader = ({ isEdit, isProcessing, onClose }: any) => (
    <div className="px-6 py-5 md:px-8 border-b border-slate-200 flex flex-wrap gap-4 items-center justify-between bg-white shrink-0 z-20 sticky top-0">
        <div>
            <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold text-slate-800 tracking-tight">
                    {isEdit ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}
                </h3>
                <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-600 rounded-md">
                    {isEdit ? "Chỉnh sửa" : "Tạo mới"}
                </span>
            </div>
            <p className="text-sm text-slate-500 mt-1 font-medium">
                Cấu hình thông tin, hình ảnh và các phân loại của sản phẩm
            </p>
        </div>
        <div className="flex items-center gap-3">
            <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
            >
                Hủy bỏ
            </button>
            <button
                type="submit"
                disabled={isProcessing}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400"
            >
                {isProcessing ? "Đang lưu..." : "Lưu sản phẩm"}
            </button>
            <div className="hidden sm:block w-px h-8 bg-slate-200 mx-2"></div>
            <button
                type="button"
                onClick={onClose}
                className="p-2.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
                <IoClose className="text-xl" />
            </button>
        </div>
    </div>
);

const BasicInfoSection = ({ register, errors, watch, onNameChange }: any) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
        <h4 className="text-base font-bold text-slate-800 mb-5 flex items-center gap-2">
            <IoInformationCircleOutline className="text-xl text-blue-500" /> Thông tin chung
        </h4>

        {/* Name */}
        <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Tên sản phẩm <span className="text-red-500">*</span>
            </label>
            <input
                {...register("name", { required: "Bắt buộc", maxLength: 200 })}
                type="text"
                placeholder="Nhập tên..."
                className={getInputClassName(errors.name)}
                onChange={(e) => {
                    register("name").onChange(e);
                    onNameChange(e);
                }}
            />
            <div className="flex justify-between mt-1.5 text-xs">
                <span className="text-red-500">{errors.name?.message}</span>
                <span className="text-slate-400">{(watch("name") || "").length}/200</span>
            </div>
        </div>

        {/* Slug */}
        <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Đường dẫn (Slug) <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center">
                <span className="px-3 py-2.5 bg-slate-100 border border-r-0 border-slate-200 rounded-l-xl text-sm text-slate-500 font-mono">
                    /url/
                </span>
                <input
                    {...register("slug", { required: "Bắt buộc", maxLength: 200 })}
                    type="text"
                    className={`flex-1 rounded-l-none ${getInputClassName(errors.slug)}`}
                />
            </div>
            <div className="flex justify-between mt-1.5 text-xs">
                <span className="text-red-500">{errors.slug?.message}</span>
                <span className="text-slate-400">{(watch("slug") || "").length}/200</span>
            </div>
        </div>

        {/* Description & Content */}
        <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Mô tả ngắn <span className="text-red-500">*</span>
            </label>
            <textarea
                {...register("description", { required: "Bắt buộc", maxLength: 500 })}
                rows={3}
                className={`resize-none ${getInputClassName(errors.description)}`}
            />
            <div className="flex justify-between mt-1.5 text-xs">
                <span className="text-red-500">{errors.description?.message}</span>
                <span className="text-slate-400">{(watch("description") || "").length}/500</span>
            </div>
        </div>
        <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Nội dung chi tiết <span className="text-red-500">*</span>
            </label>
            <textarea
                {...register("content", { required: "Bắt buộc" })}
                rows={6}
                className={`resize-none ${getInputClassName(errors.content)}`}
            />
            <span className="text-xs text-red-500 mt-1.5 block">{errors.content?.message}</span>
        </div>
    </div>
);

const AttributesSection = ({ register, errors, categories, brands }: any) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h4 className="text-base font-bold text-slate-800 mb-5 flex items-center gap-2">
            <IoLayersOutline className="text-xl text-indigo-500" /> Tổ chức & Thuộc tính
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Danh mục <span className="text-red-500">*</span>
                </label>
                <select
                    {...register("categoryId", { required: "Bắt buộc" })}
                    className={getInputClassName(errors.categoryId)}
                >
                    <option value="" disabled hidden>
                        -- Chọn danh mục --
                    </option>
                    {categories?.map((c: any) => (
                        <option key={c.id} value={c.id}>
                            {c.name}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Thương hiệu <span className="text-red-500">*</span>
                </label>
                <select
                    {...register("brandId", { required: "Bắt buộc" })}
                    className={getInputClassName(errors.brandId)}
                >
                    <option value="" disabled hidden>
                        -- Chọn thương hiệu --
                    </option>
                    {brands?.map((c: any) => (
                        <option key={c.id} value={c.id}>
                            {c.name}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Chất liệu <span className="text-red-500">*</span>
                </label>
                <input
                    {...register("material", { required: "Bắt buộc" })}
                    type="text"
                    className={getInputClassName(errors.material)}
                />
            </div>
            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Giá bán mặc định <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <input
                        {...register("price")}
                        type="number"
                        className="w-full pl-4 pr-12 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-blue-500"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">
                        VNĐ
                    </span>
                </div>
            </div>
        </div>
    </div>
);

const ThumbnailSection = ({
    register,
    errors,
    previewUrl,
    fileInputRef,
    onFileChange,
    onRemove,
    isEdit,
}: any) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h4 className="text-base font-bold text-slate-800 mb-4">
            Ảnh đại diện <span className="text-red-500">*</span>
        </h4>
        <input
            type="file"
            className="hidden"
            accept="image/*"
            {...register("thumbnail", { required: !isEdit ? "Bắt buộc" : false })}
            ref={(e) => {
                register("thumbnail").ref(e);
                fileInputRef.current = e;
            }}
            onChange={(e) => {
                register("thumbnail").onChange(e);
                onFileChange(e);
            }}
        />

        <div
            onClick={() => fileInputRef.current?.click()}
            className={`group relative w-full aspect-[4/5] rounded-xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center overflow-hidden ${errors.thumbnail
                ? "border-red-400 bg-red-50"
                : "border-slate-300 bg-slate-50 hover:border-blue-500"
                }`}
        >
            {previewUrl ? (
                <>
                    <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemove();
                        }}
                        className="absolute top-3 right-3 z-20 p-2 bg-white text-red-500 rounded-full shadow-md opacity-0 group-hover:opacity-100"
                    >
                        <IoClose />
                    </button>
                </>
            ) : (
                <div className="flex flex-col items-center text-center p-6 text-slate-400">
                    <IoImageOutline className="text-4xl mb-2" />
                    <p className="text-sm font-semibold text-slate-600">Nhấn để tải ảnh</p>
                </div>
            )}
        </div>
        {errors.thumbnail && (
            <p className="mt-2 text-xs text-red-500">{errors.thumbnail.message}</p>
        )}
    </div>
);

const StatusSection = ({ register }: any) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h4 className="text-base font-bold text-slate-800 mb-2">Trạng thái</h4>
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <RenderToggle label="Hoạt động" name="isActive" register={register} />
        </div>
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <RenderToggle label="Bán chạy" name="isBestSeller" register={register} />
        </div>
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <RenderToggle label="Hàng mới" name="isNew" register={register} />
        </div>
    </div>
);