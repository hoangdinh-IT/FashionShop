import { IoAddOutline, IoLayersOutline, IoTrashOutline, IoPricetagOutline, IoCubeOutline } from "react-icons/io5";
import { useColors } from "../../colors/hooks/useColors";
import { useSizes } from "../../sizes/hooks/useSizes";
import type { UseFormRegister, FieldErrors, UseFieldArrayAppend, UseFieldArrayRemove } from "react-hook-form";
import type { ProductDetailFormInputs } from "../types/requests";

interface ProductVariantsManagerProps {
    fields: Record<"id", string>[];
    append: UseFieldArrayAppend<ProductDetailFormInputs, "productVariants">;
    remove: UseFieldArrayRemove;
    register: UseFormRegister<ProductDetailFormInputs>;
    errors: FieldErrors<ProductDetailFormInputs>;
}

export default function ProductVariantsManager({ 
    fields, 
    append,
    remove,
    register,
    errors
}: ProductVariantsManagerProps) {
    
    const { colors } = useColors();
    const { sizes } = useSizes();

    return (
        <div className="bg-white p-5 md:p-6 rounded-xl border border-slate-200 shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-sm">
                        <IoLayersOutline className="text-lg" />
                    </div>
                    <div>
                        <h4 className="text-base font-bold text-slate-800 tracking-tight">
                            Phân loại sản phẩm
                        </h4>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                            Quản lý các phiên bản màu sắc, kích cỡ và tồn kho
                        </p>
                    </div>
                </div>
            </div>

            {/* Cảnh báo lỗi root nếu mảng variants trống hoặc lỗi tổng thể */}
            {errors.productVariants?.root && (
                <p className="text-red-500 text-xs mb-3 font-medium">
                    {errors.productVariants.root.message}
                </p>
            )}

            {/* Danh sách các Card Biến thể */}
            <div className="space-y-3">
                {fields.map((field, index) => {
                    const variantErrors = errors?.productVariants?.[index];

                    return (
                        <div 
                            key={field.id}
                            className="group relative bg-white border border-slate-200 rounded-xl p-4 hover:border-blue-400 hover:shadow-md transition-all duration-300"
                        >
                            {/* Card Header: Số thứ tự & Nút xóa */}
                            <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-100">
                                <div className="flex items-center gap-2">
                                    <span className="flex items-center justify-center min-w-[22px] h-5.5 px-1.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-bold font-mono">
                                        #{index + 1}
                                    </span>
                                    <span className="text-xs font-semibold text-slate-700">
                                        Biến thể sản phẩm
                                    </span>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => remove(index)}
                                    disabled={fields.length === 1}
                                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors
                                        ${fields.length === 1 
                                            ? 'text-slate-300 cursor-not-allowed' 
                                            : 'text-slate-500 hover:text-red-600 hover:bg-red-50'
                                        }`}
                                    title={fields.length === 1 ? "Cần giữ lại ít nhất 1 biến thể" : "Xóa biến thể"}
                                >
                                    <IoTrashOutline className="text-sm" />
                                    <span className="hidden sm:inline">Xóa</span>
                                </button>
                            </div>

                            {/* Grid Input 4 Cột */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                
                                {/* 1. Mã SKU */}
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                                        Mã SKU <span className="text-red-500">*</span>
                                    </label>

                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                                            <IoPricetagOutline className="text-slate-400 text-sm" />
                                        </div>

                                        <input
                                            type="text"
                                            placeholder={`SKU-${String(index + 1).padStart(3, '0')}`}
                                            {...register(`productVariants.${index}.sku` as const, { 
                                                required: "Vui lòng nhập SKU" 
                                            })}
                                            className={`w-full pl-8 pr-3 py-2 bg-slate-50 border rounded-lg text-xs text-slate-900 placeholder:text-slate-400 transition-colors outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/10
                                                ${variantErrors?.sku 
                                                    ? "border-red-400 focus:border-red-500" 
                                                    : "border-slate-200 focus:border-blue-500"
                                                }`}
                                        />
                                    </div>

                                    {variantErrors?.sku && (
                                        <span className="text-red-500 text-[10px] font-semibold block">
                                            {variantErrors.sku.message}
                                        </span>
                                    )}
                                </div>

                                {/* 2. Màu sắc */}
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                                        Màu sắc <span className="text-red-500">*</span>
                                    </label>

                                    <select 
                                        {...register(`productVariants.${index}.colorId` as const, { 
                                            validate: (value) => Number(value) !== 0 || "Vui lòng chọn Màu sắc" 
                                        })}
                                        className={`w-full px-3 py-2 bg-slate-50 border rounded-lg text-xs text-slate-900 transition-colors outline-none cursor-pointer focus:bg-white focus:ring-4 focus:ring-blue-500/10
                                            ${variantErrors?.colorId 
                                                ? "border-red-400 focus:border-red-500" 
                                                : "border-slate-200 focus:border-blue-500"
                                            }`}
                                    >
                                        <option value="0" disabled hidden>
                                            -- Chọn màu --
                                        </option>

                                        {colors?.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.name}
                                            </option>
                                        ))}
                                    </select>

                                    {variantErrors?.colorId && (
                                        <span className="text-red-500 text-[10px] font-semibold block">
                                            {variantErrors.colorId.message}
                                        </span>
                                    )}
                                </div>

                                {/* 3. Kích cỡ */}
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                                        Kích cỡ <span className="text-red-500">*</span>
                                    </label>

                                    <select 
                                        {...register(`productVariants.${index}.sizeId` as const, { 
                                            validate: (value) => Number(value) !== 0 || "Vui lòng chọn Size" 
                                        })}
                                        className={`w-full px-3 py-2 bg-slate-50 border rounded-lg text-xs text-slate-900 transition-colors outline-none cursor-pointer focus:bg-white focus:ring-4 focus:ring-blue-500/10
                                            ${variantErrors?.sizeId 
                                                ? "border-red-400 focus:border-red-500" 
                                                : "border-slate-200 focus:border-blue-500"
                                            }`}
                                    >
                                        <option value="0" disabled hidden>
                                            -- Chọn size --
                                        </option>

                                        {sizes?.map((s) => (
                                            <option key={s.id} value={s.id}>
                                                {s.name}
                                            </option>
                                        ))}
                                    </select>

                                    {variantErrors?.sizeId && (
                                        <span className="text-red-500 text-[10px] font-semibold block">
                                            {variantErrors.sizeId.message}
                                        </span>
                                    )}
                                </div>

                                {/* 4. Tồn kho */}
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                                        Tồn kho <span className="text-red-500">*</span>
                                    </label>

                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                                            <IoCubeOutline className="text-slate-400 text-sm" />
                                        </div>

                                        <input
                                            type="number"
                                            min="0"
                                            placeholder="0"
                                            {...register(`productVariants.${index}.stockQuantity` as const, { 
                                                required: "Nhập số lượng",
                                                valueAsNumber: true,
                                                min: { value: 0, message: "Số lượng >= 0" }
                                            })}
                                            className={`w-full pl-8 pr-3 py-2 bg-slate-50 border rounded-lg text-xs text-slate-900 placeholder:text-slate-400 transition-colors outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/10 font-semibold
                                                ${variantErrors?.stockQuantity 
                                                    ? "border-red-400 focus:border-red-500" 
                                                    : "border-slate-200 focus:border-blue-500"
                                                }`}
                                        />
                                    </div>

                                    {variantErrors?.stockQuantity && (
                                        <span className="text-red-500 text-[10px] font-semibold block">
                                            {variantErrors.stockQuantity.message}
                                        </span>
                                    )}
                                </div>

                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Nút thêm biến thể mới */}
            <button
                type="button"
                onClick={() => append({
                    id: "",
                    sku: "",
                    colorId: 0,
                    sizeId: 0,
                    stockQuantity: 0,
                })}
                className="mt-4 w-full py-3 flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 text-xs font-semibold text-slate-600 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
            >
                <IoAddOutline className="text-lg" />
                Thêm phiên bản mới
            </button>
        </div>
    );
}