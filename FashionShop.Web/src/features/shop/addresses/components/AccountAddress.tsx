import React from 'react';
import type { Address } from '../types/address';
import AddressString from './AddressString';
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { IoCallOutline, IoLocationOutline, IoCheckmarkCircle, IoLocationSharp } from 'react-icons/io5';

interface Props {
    addresses: Address[];
    isLoading: boolean;
    onEdit: (address: Address) => void;
    onSetDefaultAddress: (addressId: string) => void;
    onDelete: (addressId: string) => void;
}

// Cấu hình Easing cao cấp (Luxury Editorial Feel)
const customEase = [0.16, 1, 0.3, 1] as const;

// Variants cho Item địa chỉ
const itemVariants: Variants = {
    hidden: { 
        opacity: 0, 
        scale: 0.97,
        filter: "blur(4px)",
    },
    visible: (index: number) => ({
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        transition: {
            duration: 0.5,
            delay: index * 0.05,
            ease: customEase,
        },
    }),
    exit: {
        opacity: 0,
        scale: 0.96,
        filter: "blur(4px)",
        transition: {
            duration: 0.25,
            ease: customEase,
        },
    },
};

// Variants cho Empty State & Skeleton Container
const fadeScaleVariants: Variants = {
    hidden: { 
        opacity: 0, 
        scale: 0.97,
        filter: "blur(4px)",
    },
    visible: {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        transition: {
            duration: 0.55,
            ease: customEase,
        },
    },
    exit: {
        opacity: 0,
        scale: 0.97,
        filter: "blur(4px)",
        transition: {
            duration: 0.2,
            ease: customEase,
        },
    },
};

const AccountAddress: React.FC<Props> = ({
    addresses,
    isLoading,
    onEdit,
    onSetDefaultAddress,
    onDelete,
}) => {

    return (
        <div className="grid grid-cols-1 gap-4">
            <AnimatePresence mode="popLayout">

                {/* ===================================================== */}
                {/* LOADING SKELETON */}
                {/* ===================================================== */}
                {isLoading ? (
                    <React.Fragment key="skeleton-list">
                        {[...Array(3)].map((_, index) => (
                            <motion.div
                                key={`skeleton-${index}`}
                                custom={index}
                                variants={itemVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="relative rounded-2xl border border-zinc-100 bg-white p-6 space-y-4"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="h-5 w-36 animate-pulse rounded-full bg-zinc-200" />
                                    <div className="h-7 w-20 animate-pulse rounded-full bg-zinc-100" />
                                </div>
                                <div className="h-4 w-44 animate-pulse rounded-full bg-zinc-100" />
                                <div className="space-y-2">
                                    <div className="h-4 w-full animate-pulse rounded-full bg-zinc-100" />
                                    <div className="h-4 w-3/4 animate-pulse rounded-full bg-zinc-100" />
                                </div>
                            </motion.div>
                        ))}
                    </React.Fragment>

                ) : addresses.length > 0 ? (

                    /* ===================================================== */
                    /* HAS ADDRESSES */
                    /* ===================================================== */
                    <React.Fragment key="address-list">
                        {addresses.map((item, index) => (
                            <motion.div
                                key={item.id}
                                custom={index}
                                variants={itemVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                layout
                                className={`group relative rounded-2xl p-6 border transition-all duration-300 ${
                                    item.isDefault
                                        ? 'border-zinc-900 bg-zinc-900/[0.02] shadow-xs'
                                        : 'border-zinc-200/80 bg-white hover:border-zinc-300'
                                }`}
                            >
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                    
                                    {/* MAIN CONTENT */}
                                    <div className="space-y-3 flex-1">
                                        
                                        {/* NAME & DEFAULT BADGE */}
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <h3 className="text-base font-bold text-zinc-900">
                                                {item.fullName}
                                            </h3>

                                            {item.isDefault && (
                                                <span className="inline-flex items-center gap-1.5 bg-zinc-900 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                                    <IoCheckmarkCircle className="text-emerald-400 text-xs" />
                                                    Mặc định
                                                </span>
                                            )}
                                        </div>

                                        {/* PHONE & ADDRESS */}
                                        <div className="space-y-2 text-xs md:text-sm text-zinc-600">
                                            <div className="flex items-center gap-2 font-medium text-zinc-800">
                                                <IoCallOutline className="text-zinc-400 text-base shrink-0" />
                                                <span>{item.phoneNumber}</span>
                                            </div>

                                            <div className="flex items-start gap-2 leading-relaxed">
                                                <IoLocationOutline className="text-zinc-400 text-base shrink-0 mt-0.5" />
                                                <span className="text-zinc-600">
                                                    <AddressString
                                                        addressDetail={item.addressDetail}
                                                        communeCode={item.commune}
                                                        districtCode={item.district}
                                                        cityCode={item.city}
                                                    />
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ACTIONS */}
                                    <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-100 justify-end">
                                        {!item.isDefault && (
                                            <>
                                                <button
                                                    onClick={() => onSetDefaultAddress(item.id)}
                                                    className="px-3.5 py-1.5 text-xs font-semibold text-zinc-700 bg-zinc-100 hover:bg-zinc-900 hover:text-white rounded-lg transition-colors cursor-pointer"
                                                >
                                                    Thiết lập mặc định
                                                </button>
                                                <button
                                                    onClick={() => onDelete(item.id)}
                                                    className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                                >
                                                    Xóa
                                                </button>
                                            </>
                                        )}

                                        <button
                                            onClick={() => onEdit(item)}
                                            className="px-3 py-1.5 text-xs font-semibold text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors border border-zinc-200 cursor-pointer"
                                        >
                                            Sửa
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </React.Fragment>

                ) : (

                    /* ===================================================== */
                    /* EMPTY STATE */
                    /* ===================================================== */
                    <motion.div
                        key="empty-state"
                        variants={fadeScaleVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="flex flex-col items-center justify-center py-16 px-4 border border-dashed border-zinc-200 rounded-2xl bg-zinc-50/50 text-center"
                    >
                        <div className="w-14 h-14 rounded-2xl bg-white border border-zinc-200/80 shadow-xs flex items-center justify-center mb-4 text-zinc-400">
                            <IoLocationSharp className="text-2xl" />
                        </div>

                        <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider mb-1">
                            Chưa có địa chỉ nào
                        </h3>

                        <p className="text-xs text-zinc-500 max-w-xs">
                            Thêm địa chỉ giao hàng để thuận tiện hơn khi thanh toán đơn hàng.
                        </p>
                    </motion.div>
                )}

            </AnimatePresence>
        </div>
    );
};

export default AccountAddress;