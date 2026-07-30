import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { AnimatePresence, motion } from 'framer-motion';
import { 
    IoClose, 
    IoChevronDown,
    IoLocationOutline,
    IoHomeOutline,
    IoBusinessOutline,
    IoPersonOutline,
    IoCallOutline
} from 'react-icons/io5';
import type { AddressFormInputs } from '../types/requests';
import { useAddresses } from '../hooks/useAddresses';
import type { Address } from '../types/address';
import { useLockBodyScroll } from '../../../../hooks/useLockBodyScroll';
import { BACKDROP_STYLES, backdropVariants, modalVariants } from '../../../../utils/animation';

interface Location {
    code: number;
    name: string;
}

interface Props {
    isOpen: boolean;
    initialData?: Address;
    onClose: () => void;
    isLoading?: boolean;
}

const AddressFormModal: React.FC<Props> = ({ 
    isOpen,
    initialData,
    onClose,
    isLoading = false
}) => {
    useLockBodyScroll(isOpen);

    const { createAddress, updateAddress } = useAddresses();
    
    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors }
    } = useForm<AddressFormInputs>();

    // Theo dõi giá trị Tỉnh và Huyện bằng watch của react-hook-form
    const selectedProvince = watch("city");
    const selectedDistrict = watch("district");

    // States lưu trữ Danh sách để đổ vào Select
    const [provinces, setProvinces] = useState<Location[]>([]);
    const [districts, setDistricts] = useState<Location[]>([]);
    const [wards, setWards] = useState<Location[]>([]);
    
    // State riêng cho Toggle (công tắc)
    const [isDefault, setIsDefault] = useState(false);

    // 1. Tải danh sách Tỉnh/Thành ngay khi mở
    useEffect(() => {
        if (isOpen) {
            axios.get('https://provinces.open-api.vn/api/?depth=1')
                .then(response => setProvinces(response.data))
                .catch(err => console.error("Lỗi tải Tỉnh:", err));
        } else {
            setProvinces([]);
            setDistricts([]);
            setWards([]);
            setIsDefault(false);
            reset({ city: "", district: "", commune: "", addressDetail: "" });
        }
    }, [isOpen, reset]);

    // 2. Mở form Edit
    useEffect(() => {
        if (isOpen && initialData) {
            reset({
                fullName: initialData.fullName,
                phoneNumber: initialData.phoneNumber,
                addressDetail: initialData.addressDetail || "",
                city: "", 
                district: "", 
                commune: "",
            });
            setIsDefault(initialData.isDefault || false);
        } else if (isOpen && !initialData) {
            reset({ city: "", district: "", commune: "", addressDetail: "" });
            setIsDefault(false);
        }
    }, [isOpen, initialData, reset]);

    // 3. Gán Tỉnh Cũ khi provinces vừa có data
    useEffect(() => {
        if (initialData && provinces.length > 0) {
            setValue("city", String(initialData.city));
        }
    }, [provinces, initialData, setValue]);

    // 4. Tải Huyện khi Tỉnh thay đổi
    useEffect(() => {
        if (selectedProvince) {
            axios.get(`https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`)
                .then(response => setDistricts(response.data.districts || []))
                .catch(err => console.error("Lỗi tải Huyện:", err));
        } else {
            setDistricts([]);
        }
    }, [selectedProvince]);

    // 5. Gán Huyện Cũ khi districts vừa có data
    useEffect(() => {
        if (initialData && districts.length > 0 && String(selectedProvince) === String(initialData.city)) {
            setValue("district", String(initialData.district));
        }
    }, [districts, initialData, selectedProvince, setValue]);

    // 6. Tải Xã khi Huyện thay đổi
    useEffect(() => {
        if (selectedDistrict) {
            axios.get(`https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`)
                .then(response => setWards(response.data.wards || []))
                .catch(err => console.error("Lỗi tải Xã:", err));
        } else {
            setWards([]);
        }
    }, [selectedDistrict]);

    // 7. Gán Xã Cũ khi wards vừa có data
    useEffect(() => {
        if (initialData && wards.length > 0 && String(selectedDistrict) === String(initialData.district)) {
            setValue("commune", String(initialData.commune));
        }
    }, [wards, initialData, selectedDistrict, setValue]);

    // 8. Gom dữ liệu và Submit
    const onSubmit: SubmitHandler<AddressFormInputs> = (formData) => {
        const finalPayload: AddressFormInputs = {
            ...formData,
            isDefault: isDefault
        };

        const handleSuccess = (response: { succeeded: boolean }) => {
            if (response.succeeded) onClose();
        };

        if (!initialData) {
            createAddress(finalPayload, { onSuccess: handleSuccess });
        } else {
            updateAddress({ addressId: initialData.id, request: finalPayload }, { onSuccess: handleSuccess });
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 font-sans">
                    
                    {/* BACKDROP */}
                    <motion.div
                        className={BACKDROP_STYLES}
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        onClick={onClose}
                    />

                    {/* MODAL CONTAINER */}
                    <motion.div
                        className="relative w-full max-w-lg bg-white rounded-3xl border border-zinc-200/80 shadow-xl overflow-hidden flex flex-col z-10"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col max-h-[85vh]">
                            
                            {/* --- HEADER --- */}
                            <div className="px-6 py-5 flex items-center justify-between border-b border-zinc-100 bg-white shrink-0">
                                <h3 className="text-lg font-semibold text-zinc-900 tracking-tight">
                                    {initialData ? 'Cập nhật địa chỉ' : 'Thêm địa chỉ mới'}
                                </h3>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="w-8 h-8 flex items-center justify-center rounded-full text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors duration-200 cursor-pointer"
                                >
                                    <IoClose className="text-xl" />
                                </button>
                            </div>

                            {/* --- BODY --- */}
                            <div className="p-6 overflow-y-auto space-y-4 custom-scrollbar flex-1">
                                
                                {/* Họ tên & SĐT (2 Cột trên màn hình ngang) */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Họ và tên */}
                                    <div className="space-y-1.5">
                                        <label htmlFor="fullName" className="text-xs font-semibold text-zinc-700 flex items-center gap-1.5">
                                            <IoPersonOutline className="text-zinc-400" />
                                            Họ và tên
                                        </label>
                                        <input
                                            id="fullName"
                                            {...register("fullName", { required: "Vui lòng nhập họ và tên" })}
                                            type="text"
                                            placeholder="Nguyễn Văn A"
                                            className={`w-full h-11 px-3.5 text-sm bg-zinc-50 border ${errors.fullName ? 'border-red-400 focus:border-red-500' : 'border-zinc-200 focus:border-zinc-900'} rounded-xl focus:bg-white outline-none transition-all font-medium text-zinc-900 placeholder:text-zinc-400`}
                                        />
                                        {errors.fullName && <p className="text-xs text-red-500 font-medium">{errors.fullName.message}</p>}
                                    </div>

                                    {/* Số điện thoại */}
                                    <div className="space-y-1.5">
                                        <label htmlFor="phoneNumber" className="text-xs font-semibold text-zinc-700 flex items-center gap-1.5">
                                            <IoCallOutline className="text-zinc-400" />
                                            Số điện thoại
                                        </label>
                                        <input
                                            id="phoneNumber"
                                            {...register("phoneNumber", { 
                                                required: "Vui lòng nhập số điện thoại",
                                                pattern: { value: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g, message: "Số điện thoại không hợp lệ" }
                                            })}
                                            type="tel"
                                            placeholder="0912345678"
                                            className={`w-full h-11 px-3.5 text-sm bg-zinc-50 border ${errors.phoneNumber ? 'border-red-400 focus:border-red-500' : 'border-zinc-200 focus:border-zinc-900'} rounded-xl focus:bg-white outline-none transition-all font-medium text-zinc-900 placeholder:text-zinc-400`}
                                        />
                                        {errors.phoneNumber && <p className="text-xs text-red-500 font-medium">{errors.phoneNumber.message}</p>}
                                    </div>
                                </div>

                                {/* Tỉnh / Thành phố */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-zinc-700 flex items-center gap-1.5">
                                        <IoBusinessOutline className="text-zinc-400" />
                                        Tỉnh / Thành phố
                                    </label>
                                    <div className="relative">
                                        <select 
                                            {...register("city", { 
                                                required: "Vui lòng chọn Tỉnh/Thành",
                                                onChange: () => {
                                                    setValue("district", "");
                                                    setValue("commune", "");
                                                }
                                            })}
                                            className={`w-full h-11 pl-3.5 pr-10 text-sm bg-zinc-50 border ${errors.city ? 'border-red-400' : 'border-zinc-200 focus:border-zinc-900'} rounded-xl focus:bg-white outline-none transition-all font-medium text-zinc-900 appearance-none cursor-pointer disabled:opacity-50`}
                                        >
                                            <option value="" disabled hidden>Chọn Tỉnh / Thành phố</option>
                                            {provinces.map((prov) => (
                                                <option key={prov.code} value={prov.code}>{prov.name}</option>
                                            ))}
                                        </select>
                                        <IoChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                                    </div>
                                    {errors.city && <p className="text-xs text-red-500 font-medium">{errors.city.message}</p>}
                                </div>

                                {/* Quận Huyện & Phường Xã (2 Cột) */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Quận / Huyện */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-zinc-700 flex items-center gap-1.5">
                                            <IoLocationOutline className="text-zinc-400" />
                                            Quận / Huyện
                                        </label>
                                        <div className="relative">
                                            <select 
                                                {...register("district", { 
                                                    required: "Vui lòng chọn Quận/Huyện",
                                                    onChange: () => setValue("commune", "")
                                                })}
                                                disabled={!selectedProvince}
                                                className={`w-full h-11 pl-3.5 pr-10 text-sm bg-zinc-50 border ${errors.district ? 'border-red-400' : 'border-zinc-200 focus:border-zinc-900'} rounded-xl focus:bg-white outline-none transition-all font-medium text-zinc-900 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
                                            >
                                                <option value="" disabled hidden>Chọn Quận/Huyện</option>
                                                {districts.map((dist) => (
                                                    <option key={dist.code} value={dist.code}>{dist.name}</option>
                                                ))}
                                            </select>
                                            <IoChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                                        </div>
                                        {errors.district && <p className="text-xs text-red-500 font-medium">{errors.district.message}</p>}
                                    </div>

                                    {/* Phường / Xã */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-zinc-700 flex items-center gap-1.5">
                                            <IoHomeOutline className="text-zinc-400" />
                                            Phường / Xã
                                        </label>
                                        <div className="relative">
                                            <select 
                                                {...register("commune", { required: "Vui lòng chọn Phường/Xã" })}
                                                disabled={!selectedDistrict}
                                                className={`w-full h-11 pl-3.5 pr-10 text-sm bg-zinc-50 border ${errors.commune ? 'border-red-400' : 'border-zinc-200 focus:border-zinc-900'} rounded-xl focus:bg-white outline-none transition-all font-medium text-zinc-900 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
                                            >
                                                <option value="" disabled hidden>Chọn Phường/Xã</option>
                                                {wards.map((ward) => (
                                                    <option key={ward.code} value={ward.code}>{ward.name}</option>
                                                ))}
                                            </select>
                                            <IoChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                                        </div>
                                        {errors.commune && <p className="text-xs text-red-500 font-medium">{errors.commune.message}</p>}
                                    </div>
                                </div>

                                {/* Địa chỉ chi tiết */}
                                <div className="space-y-1.5">
                                    <label htmlFor="addressDetail" className="text-xs font-semibold text-zinc-700 flex items-center gap-1.5">
                                        <IoLocationOutline className="text-zinc-400" />
                                        Địa chỉ cụ thể
                                    </label>
                                    <input
                                        id="addressDetail"
                                        {...register("addressDetail", { required: "Vui lòng nhập địa chỉ cụ thể" })}
                                        type="text"
                                        placeholder="Số nhà, tên đường, tòa nhà..."
                                        className={`w-full h-11 px-3.5 text-sm bg-zinc-50 border ${errors.addressDetail ? 'border-red-400 focus:border-red-500' : 'border-zinc-200 focus:border-zinc-900'} rounded-xl focus:bg-white outline-none transition-all font-medium text-zinc-900 placeholder:text-zinc-400`}
                                    />
                                    {errors.addressDetail && <p className="text-xs text-red-500 font-medium">{errors.addressDetail.message}</p>}
                                </div>

                                {/* Toggle Mặc Định */}
                                <div className="pt-2">
                                    <label className="flex items-center justify-between cursor-pointer py-1">
                                        <span className="text-sm font-semibold text-zinc-800">
                                            Đặt làm địa chỉ mặc định
                                        </span>
                                        <div className="relative inline-flex items-center">
                                            <input 
                                                type="checkbox" 
                                                className="sr-only" 
                                                checked={isDefault}
                                                onChange={() => setIsDefault(!isDefault)}
                                            />
                                            <div className={`w-11 h-6 rounded-full transition-colors duration-200 ease-in-out ${isDefault ? 'bg-zinc-900' : 'bg-zinc-200'}`} />
                                            <div className={`absolute left-0.5 bg-white w-5 h-5 rounded-full transition-transform duration-200 ease-in-out shadow-sm ${isDefault ? 'translate-x-5' : 'translate-x-0'}`} />
                                        </div>
                                    </label>
                                </div>

                            </div>

                            {/* --- FOOTER --- */}
                            <div className="p-6 bg-zinc-50/50 border-t border-zinc-100 shrink-0">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full h-11 text-xs font-bold uppercase tracking-wider text-white bg-zinc-900 hover:bg-zinc-800 rounded-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-wait flex items-center justify-center cursor-pointer shadow-sm"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            <span>ĐANG LƯU...</span>
                                        </div>
                                    ) : (
                                        initialData ? 'Cập nhật địa chỉ' : 'Lưu địa chỉ'
                                    )}
                                </button>
                            </div>

                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AddressFormModal;