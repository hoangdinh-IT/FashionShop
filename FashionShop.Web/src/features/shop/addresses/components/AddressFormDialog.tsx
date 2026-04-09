import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
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

// --- HOẠT ẢNH (ANIMATIONS) TỪ PROFILE ---
const backdropVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
};

const modalVariants: Variants = {
    hidden: { opacity: 0, y: 40, scale: 0.96 },
    visible: { 
        opacity: 1, 
        y: 0, 
        scale: 1, 
        transition: { type: "spring", stiffness: 400, damping: 30 } 
    },
    exit: { 
        opacity: 0, 
        y: 20, 
        scale: 0.96, 
        transition: { duration: 0.2, ease: "easeOut" } 
    }
};

// 1. Khai báo kiểu dữ liệu cho API
interface Location {
    code: number;
    name: string;
}

interface AddressFormDialogProps {
    isOpen: boolean;
    initialData?: Address;
    onClose: () => void;
    isLoading?: boolean;
}

const AddressFormDialog: React.FC<AddressFormDialogProps> = ({ 
    isOpen,
    initialData,
    onClose,
    isLoading = false
}) => {

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
            // Dọn dẹp form khi đóng
            setProvinces([]);
            setDistricts([]);
            setWards([]);
            setIsDefault(false);
            reset({ city: "", district: "", commune: "", addressDetail: "" });
        }
    }, [isOpen, reset]);

    // 2. Mở form Edit: Chỉ gán Chi tiết (Khoan gán Tỉnh/Huyện/Xã)
    useEffect(() => {
        if (isOpen && initialData) {
            reset({
                fullName: initialData.fullName,
                phoneNumber: initialData.phoneNumber,
                addressDetail: initialData.addressDetail || "",
                city: "",     // BẮT BUỘC ĐỂ TRỐNG: chờ mảng provinces tải xong mới gán
                district: "", // BẮT BUỘC ĐỂ TRỐNG: chờ mảng districts tải xong mới gán
                commune: "",  // BẮT BUỘC ĐỂ TRỐNG: chờ mảng wards tải xong mới gán
            });
            setIsDefault(initialData.isDefault || false);
        } else if (isOpen && !initialData) {
            reset({ city: "", district: "", commune: "", addressDetail: "" });
            setIsDefault(false);
        }
    }, [isOpen, initialData, reset]);

    // 3. [CHÌA KHÓA] Gán Tỉnh Cũ ngay khi mảng provinces vừa có data
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

    // 5. [CHÌA KHÓA] Gán Huyện Cũ ngay khi mảng districts vừa có data
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

    // 7. [CHÌA KHÓA] Gán Xã Cũ ngay khi mảng wards vừa có data
    useEffect(() => {
        if (initialData && wards.length > 0 && String(selectedDistrict) === String(initialData.district)) {
            setValue("commune", String(initialData.commune));
        }
    }, [wards, initialData, selectedDistrict, setValue]);

    // 8. Gom dữ liệu và Submit
    const onSubmit: SubmitHandler<AddressFormInputs> = (formData) => {
        const userStr = localStorage.getItem("user");
        const userId = userStr ? JSON.parse(userStr).id : null;

        if (!userId) {
            alert("Vui lòng đăng nhập lại để tiếp tục!");
            return;
        }

        const finalPayload: AddressFormInputs = {
            ...formData,
            userId: userId,
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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 font-sans antialiased">
                    
                    {/* BACKDROP */}
                    <motion.div
                        className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm"
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        onClick={onClose}
                    />

                    {/* MODAL CONTENT */}
                    <motion.div
                        className="relative w-full max-w-lg bg-white rounded-[1.5rem] shadow-2xl border border-zinc-100 overflow-hidden flex flex-col"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full max-h-[85vh]">
                            
                            {/* --- HEADER SÁNG TẠO & TỐI GIẢN --- */}
                            <div className="px-8 py-6 flex items-center justify-between bg-white shrink-0 border-b border-zinc-50">
                                <h3 className="text-2xl sm:text-[26px] font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 to-zinc-500">
                                    {initialData ? 'Cập nhật địa chỉ' : 'Thêm địa chỉ'}
                                </h3>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="w-9 h-9 flex items-center justify-center rounded-full bg-zinc-50 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 transition-all duration-200"
                                >
                                    <IoClose className="text-xl" />
                                </button>
                            </div>

                            {/* --- BODY --- */}
                            <div className="px-8 pb-4 pt-4 overflow-y-auto custom-scrollbar flex-1 space-y-6">
                                
                                {/* Họ và tên (Floating Label) */}
                                <div className="relative pt-2">
                                    <div className="relative">
                                        {/* Nhớ import IoPersonOutline từ react-icons/io5 */}
                                        <IoPersonOutline className={`absolute left-4 top-1/2 -translate-y-1/2 text-[20px] pointer-events-none transition-colors duration-300 z-10 ${errors.fullName ? 'text-red-400' : 'text-zinc-400 peer-focus:text-zinc-900'}`} />
                                        
                                        <input
                                            id="fullName"
                                            {...register("fullName", { required: "Vui lòng nhập họ và tên" })}
                                            type="text"
                                            placeholder=" "
                                            className={`peer w-full h-[56px] pl-12 pr-4 bg-zinc-50/80 border ${errors.fullName ? 'border-red-400 ring-1 ring-red-400' : 'border-zinc-200/80'} rounded-2xl focus:bg-white focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 outline-none transition-all duration-300 text-[15px] font-medium text-zinc-900`}
                                        />
                                        
                                        <label
                                            htmlFor="fullName"
                                            className="absolute cursor-text left-12 top-1/2 -translate-y-1/2 text-[15px] text-zinc-500 transition-all duration-300 pointer-events-none
                                            peer-focus:top-0 peer-focus:left-4 peer-focus:text-[13px] peer-focus:font-semibold peer-focus:text-zinc-900 peer-focus:bg-white peer-focus:px-2 peer-focus:-mt-[2px]
                                            peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:left-4 peer-[:not(:placeholder-shown)]:text-[13px] peer-[:not(:placeholder-shown)]:font-semibold peer-[:not(:placeholder-shown)]:text-zinc-900 peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-2 peer-[:not(:placeholder-shown)]:-mt-[2px]"
                                        >
                                            Họ và tên
                                        </label>
                                    </div>
                                    {errors.fullName && <p className="text-[13px] text-red-500 mt-1.5 font-medium pl-1">{errors.fullName.message}</p>}
                                </div>

                                {/* Số điện thoại (Floating Label) */}
                                <div className="relative pt-2">
                                    <div className="relative">
                                        {/* Nhớ import IoCallOutline từ react-icons/io5 */}
                                        <IoCallOutline className={`absolute left-4 top-1/2 -translate-y-1/2 text-[20px] pointer-events-none transition-colors duration-300 z-10 ${errors.phoneNumber ? 'text-red-400' : 'text-zinc-400 peer-focus:text-zinc-900'}`} />
                                        
                                        <input
                                            id="phoneNumber"
                                            {...register("phoneNumber", { 
                                                required: "Vui lòng nhập số điện thoại",
                                                pattern: { value: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g, message: "Số điện thoại không hợp lệ" }
                                            })}
                                            type="tel"
                                            placeholder=" "
                                            className={`peer w-full h-[56px] pl-12 pr-4 bg-zinc-50/80 border ${errors.phoneNumber ? 'border-red-400 ring-1 ring-red-400' : 'border-zinc-200/80'} rounded-2xl focus:bg-white focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 outline-none transition-all duration-300 text-[15px] font-medium text-zinc-900`}
                                        />
                                        
                                        <label
                                            htmlFor="phoneNumber"
                                            className="absolute cursor-text left-12 top-1/2 -translate-y-1/2 text-[15px] text-zinc-500 transition-all duration-300 pointer-events-none
                                            peer-focus:top-0 peer-focus:left-4 peer-focus:text-[13px] peer-focus:font-semibold peer-focus:text-zinc-900 peer-focus:bg-white peer-focus:px-2 peer-focus:-mt-[2px]
                                            peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:left-4 peer-[:not(:placeholder-shown)]:text-[13px] peer-[:not(:placeholder-shown)]:font-semibold peer-[:not(:placeholder-shown)]:text-zinc-900 peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-2 peer-[:not(:placeholder-shown)]:-mt-[2px]"
                                        >
                                            Số điện thoại
                                        </label>
                                    </div>
                                    {errors.phoneNumber && <p className="text-[13px] text-red-500 mt-1.5 font-medium pl-1">{errors.phoneNumber.message}</p>}
                                </div>

                                {/* Tỉnh / Thành phố */}
                                <div className="space-y-1.5">
                                    <label className="text-[13px] font-semibold text-zinc-900 flex items-center gap-2 pl-1">
                                        <IoBusinessOutline className={`text-[16px] ${errors.city ? 'text-red-400' : 'text-zinc-500'}`} />
                                        Tỉnh / Thành phố
                                    </label>
                                    <div className="relative">
                                        <select 
                                            {...register("city", { 
                                                required: "Vui lòng chọn Tỉnh/Thành",
                                                onChange: () => {
                                                    setValue("district", "");
                                                    setValue("commune", "");
                                                    // Nếu đang lưu Huyện Xã bằng state thì dùng setWards([]), setDistricts([]) ở file cha nhé
                                                }
                                            })}
                                            className={`w-full h-[52px] pl-4 pr-10 bg-zinc-50/80 border ${errors.city ? 'border-red-400 ring-1 ring-red-400' : 'border-zinc-200/80'} rounded-2xl focus:bg-white focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 outline-none transition-all duration-300 text-[15px] font-medium text-zinc-900 appearance-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed`}
                                        >
                                            <option value="" disabled hidden>Chọn Tỉnh/Thành</option>
                                            {provinces.map((prov) => (
                                                <option key={prov.code} value={prov.code}>{prov.name}</option>
                                            ))}
                                        </select>
                                        <IoChevronDown className={`absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none ${errors.city ? 'text-red-400' : 'text-zinc-400'}`} />
                                    </div>
                                    {errors.city && <p className="text-[13px] text-red-500 font-medium pl-1">{errors.city.message}</p>}
                                </div>

                                {/* Quận / Huyện */}
                                <div className="space-y-1.5">
                                    <label className="text-[13px] font-semibold text-zinc-900 flex items-center gap-2 pl-1">
                                        <IoLocationOutline className={`text-[16px] ${errors.district ? 'text-red-400' : 'text-zinc-500'}`} />
                                        Quận / Huyện
                                    </label>
                                    <div className="relative">
                                        <select 
                                            {...register("district", { 
                                                required: "Vui lòng chọn Quận/Huyện",
                                                onChange: () => {
                                                    setValue("commune", "");
                                                }
                                            })}
                                            disabled={!selectedProvince}
                                            className={`w-full h-[52px] pl-4 pr-10 bg-zinc-50/80 border ${errors.district ? 'border-red-400 ring-1 ring-red-400' : 'border-zinc-200/80'} rounded-2xl focus:bg-white focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 outline-none transition-all duration-300 text-[15px] font-medium text-zinc-900 appearance-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed`}
                                        >
                                            <option value="" disabled hidden>Chọn Quận/Huyện</option>
                                            {districts.map((dist) => (
                                                <option key={dist.code} value={dist.code}>{dist.name}</option>
                                            ))}
                                        </select>
                                        <IoChevronDown className={`absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none ${errors.district ? 'text-red-400' : 'text-zinc-400'}`} />
                                    </div>
                                    {errors.district && <p className="text-[13px] text-red-500 font-medium pl-1">{errors.district.message}</p>}
                                </div>

                                {/* Phường / Xã */}
                                <div className="space-y-1.5">
                                    <label className="text-[13px] font-semibold text-zinc-900 flex items-center gap-2 pl-1">
                                        <IoHomeOutline className={`text-[16px] ${errors.commune ? 'text-red-400' : 'text-zinc-500'}`} />
                                        Phường / Xã
                                    </label>
                                    <div className="relative">
                                        <select 
                                            {...register("commune", { required: "Vui lòng chọn Phường/Xã" })}
                                            disabled={!selectedDistrict}
                                            className={`w-full h-[52px] pl-4 pr-10 bg-zinc-50/80 border ${errors.commune ? 'border-red-400 ring-1 ring-red-400' : 'border-zinc-200/80'} rounded-2xl focus:bg-white focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 outline-none transition-all duration-300 text-[15px] font-medium text-zinc-900 appearance-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed`}
                                        >
                                            <option value="" disabled hidden>Chọn Phường/Xã</option>
                                            {wards.map((ward) => (
                                                <option key={ward.code} value={ward.code}>{ward.name}</option>
                                            ))}
                                        </select>
                                        <IoChevronDown className={`absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none ${errors.commune ? 'text-red-400' : 'text-zinc-400'}`} />
                                    </div>
                                    {errors.commune && <p className="text-[13px] text-red-500 font-medium pl-1">{errors.commune.message}</p>}
                                </div>

                                {/* Địa chỉ chi tiết (Floating Label) */}
                                <div className="relative pt-2">
                                    <div className="relative">
                                        <IoLocationOutline className={`absolute left-4 top-1/2 -translate-y-1/2 text-[20px] pointer-events-none transition-colors duration-300 z-10 ${errors.addressDetail ? 'text-red-400' : 'text-zinc-400 peer-focus:text-zinc-900'}`} />
                                        
                                        <input
                                            id="addressDetail"
                                            {...register("addressDetail", { required: "Vui lòng nhập địa chỉ cụ thể" })}
                                            type="text"
                                            placeholder=" "
                                            className={`peer w-full h-[56px] pl-12 pr-4 bg-zinc-50/80 border ${errors.addressDetail ? 'border-red-400 ring-1 ring-red-400' : 'border-zinc-200/80'} rounded-2xl focus:bg-white focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 outline-none transition-all duration-300 text-[15px] font-medium text-zinc-900`}
                                        />
                                        
                                        <label
                                            htmlFor="addressDetail"
                                            className="absolute cursor-text left-12 top-1/2 -translate-y-1/2 text-[15px] text-zinc-500 transition-all duration-300 pointer-events-none
                                            peer-focus:top-0 peer-focus:left-4 peer-focus:text-[13px] peer-focus:font-semibold peer-focus:text-zinc-900 peer-focus:bg-white peer-focus:px-2 peer-focus:-mt-[2px]
                                            peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:left-4 peer-[:not(:placeholder-shown)]:text-[13px] peer-[:not(:placeholder-shown)]:font-semibold peer-[:not(:placeholder-shown)]:text-zinc-900 peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-2 peer-[:not(:placeholder-shown)]:-mt-[2px]"
                                        >
                                            Số nhà, tên đường, tòa nhà...
                                        </label>
                                    </div>
                                    {errors.addressDetail && <p className="text-[13px] text-red-500 mt-1.5 font-medium pl-1">{errors.addressDetail.message}</p>}
                                </div>

                                {/* Custom Toggle: Đặt làm mặc định */}
                                <div className="pt-2 pb-2">
                                    <label className="flex items-center justify-between cursor-pointer group">
                                        <span className="text-[14px] font-semibold text-zinc-900 pl-1">
                                            Đặt làm địa chỉ mặc định
                                        </span>
                                        <div className="relative">
                                            <input 
                                                type="checkbox" 
                                                className="sr-only" 
                                                checked={isDefault}
                                                onChange={() => setIsDefault(!isDefault)}
                                            />
                                            <div className={`block w-[46px] h-6 rounded-full transition-colors duration-300 ease-in-out ${isDefault ? 'bg-zinc-900' : 'bg-zinc-200'}`}></div>
                                            <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ease-in-out shadow-sm ${isDefault ? 'translate-x-[22px]' : 'translate-x-0'}`}></div>
                                        </div>
                                    </label>
                                </div>

                            </div>

                            {/* --- FOOTER --- */}
                            <div className="px-8 py-6 mt-2 bg-white rounded-b-[1.5rem] shrink-0 border-t border-zinc-50">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="relative w-full h-[56px] text-[14px] font-bold tracking-widest text-white bg-zinc-900 hover:bg-zinc-800 rounded-2xl transition-all duration-300 disabled:opacity-70 disabled:cursor-wait flex items-center justify-center overflow-hidden shadow-[0_4px_14px_0_rgb(24,24,27,0.3)] hover:shadow-[0_6px_20px_rgba(24,24,27,0.23)] hover:-translate-y-[1px] active:translate-y-[0px] active:scale-[0.98]"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center gap-3">
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            <span>ĐANG LƯU...</span>
                                        </div>
                                    ) : (
                                        initialData ? 'CẬP NHẬT' : 'THÊM ĐỊA CHỈ'
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

export default AddressFormDialog;