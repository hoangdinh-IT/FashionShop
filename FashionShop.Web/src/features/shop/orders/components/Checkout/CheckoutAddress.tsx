import React from 'react';
import { MapPin, Plus, NotebookPen } from 'lucide-react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import AddressString from '../../../addresses/components/AddressString';
import type { Address } from '../../../addresses/types/address';

interface Props {
    address?: Address;
    onOpenAddressListModal: () => void;
    note: string;
    onChangeNote: (value: string) => void;
}

// Cấu hình Easing cao cấp (Editorial Design System)
const customEase = [0.16, 1, 0.3, 1] as const;

// Variants cho phần chuyển đổi nội dung Địa chỉ
const fadeScaleVariants: Variants = {
    hidden: { 
        opacity: 0, 
        scale: 0.98,
        filter: "blur(4px)",
    },
    visible: {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        transition: {
            duration: 0.45,
            ease: customEase,
        },
    },
    exit: {
        opacity: 0,
        scale: 0.98,
        filter: "blur(4px)",
        transition: {
            duration: 0.2,
            ease: customEase,
        },
    },
};

const CheckoutAddress: React.FC<Props> = ({
    address,
    onOpenAddressListModal,
    note,
    onChangeNote
}) => {
    return (
        <motion.section 
            initial={{ opacity: 0, scale: 0.98, filter: "blur(4px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.5, ease: customEase }}
            className="bg-white rounded-2xl border border-zinc-200/80 p-4 sm:p-5 md:p-6 shadow-xs font-sans space-y-4 sm:space-y-5"
        >
            
            {/* HEADER */}
            <div className="flex items-center justify-between gap-3 pb-3.5 sm:pb-4 border-b border-zinc-100">
                <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-zinc-100 text-zinc-900 flex items-center justify-center shrink-0">
                        <MapPin size={15} className="sm:w-[16px] sm:h-[16px]" strokeWidth={2} />
                    </div>
                    <h2 className="text-sm sm:text-base font-bold tracking-tight text-zinc-900 truncate">
                        Địa chỉ nhận hàng
                    </h2>
                </div>

                <button
                    type="button"
                    onClick={onOpenAddressListModal}
                    className="inline-flex items-center gap-1 sm:gap-1.5 text-xs font-semibold text-zinc-700 hover:text-black underline underline-offset-4 cursor-pointer transition-colors shrink-0 py-1 px-1.5 sm:p-0 rounded-md active:bg-zinc-100 sm:active:bg-transparent"
                >
                    {address ? (
                        'Thay đổi'
                    ) : (
                        <>
                            <Plus size={14} /> 
                            <span>Thêm địa chỉ</span>
                        </>
                    )}
                </button>
            </div>

            {/* ADDRESS CONTENT WITH ANIMATION */}
            <div>
                <AnimatePresence mode="wait">
                    {address ? (
                        <motion.div 
                            key={address.id || 'selected-address'}
                            variants={fadeScaleVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="rounded-xl bg-zinc-50/70 border border-zinc-100 p-3.5 sm:p-4 space-y-1.5 sm:space-y-2"
                        >
                            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                                <span className="font-bold text-zinc-900 break-words">{address.fullName}</span>
                                <span className="text-zinc-300 hidden sm:inline">•</span>
                                <span className="font-mono text-zinc-600 font-medium text-xs sm:text-sm">{address.phoneNumber}</span>
                            </div>

                            <div className="text-xs leading-relaxed text-zinc-600 break-words">
                                <AddressString
                                    addressDetail={address.addressDetail}
                                    communeCode={address.commune}
                                    districtCode={address.district}
                                    cityCode={address.city}
                                />
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="empty-address-info"
                            variants={fadeScaleVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="rounded-xl border border-zinc-200/80 bg-zinc-50/50 p-4 sm:p-4.5 text-center"
                        >
                            <p className="text-xs sm:text-sm font-medium text-zinc-500">
                                Chưa có địa chỉ giao hàng. Vui lòng thêm địa chỉ mới.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* DELIVERY NOTE */}
            <div className="space-y-1.5 sm:space-y-2 pt-1">
                <label className="flex items-center gap-1.5 text-xs font-medium text-zinc-500">
                    <NotebookPen size={13} className="text-zinc-400 shrink-0" />
                    <span>Ghi chú đơn hàng</span>
                </label>

                <textarea
                    rows={2}
                    value={note}
                    onChange={(e) => onChangeNote(e.target.value)}
                    placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi giao..."
                    className="
                        w-full rounded-xl border border-zinc-200 bg-white
                        px-3 sm:px-3.5 py-2 sm:py-2.5 text-xs sm:text-xs text-zinc-800
                        placeholder:text-zinc-400
                        focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900
                        transition-all resize-none
                    "
                />
            </div>

        </motion.section>
    );
};

export default CheckoutAddress;