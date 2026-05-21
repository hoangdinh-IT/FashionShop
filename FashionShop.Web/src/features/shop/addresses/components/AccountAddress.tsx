import React from 'react';
import type { Address } from '../types/address';
import AddressString from './AddressString';
import { motion, AnimatePresence } from "framer-motion";

interface Props {
    addresses: Address[];
    isLoading: boolean;
    onEdit: (address: Address) => void;
    onSetDefaultAddress: (addressId: string) => void;
    onDelete: (addressId: string) => void;
}

const AccountAddress: React.FC<Props> = ({
    addresses,
    isLoading,
    onEdit,
    onSetDefaultAddress,
    onDelete,
}) => {

    return (
        <div className="grid grid-cols-1 gap-6">

            <AnimatePresence mode="popLayout">

                {/* ===================================================== */}
                {/* LOADING */}
                {/* ===================================================== */}
                {isLoading ? (

                    <>
                        {[...Array(4)].map((_, index) => (

                            <motion.div
                                key={index}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: index * 0.05 }}
                                className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6"
                            >

                                {/* ACTIONS */}
                                <div className="absolute top-5 right-5 flex gap-2">
                                    <div className="h-10 w-28 animate-pulse rounded-full bg-zinc-200" />
                                    <div className="h-10 w-24 animate-pulse rounded-full bg-zinc-100" />
                                </div>

                                {/* NAME */}
                                <div className="mb-6 flex items-center gap-3 pr-[260px]">
                                    <div className="h-6 w-44 animate-pulse rounded-full bg-zinc-200" />
                                    <div className="h-7 w-24 animate-pulse rounded-full bg-zinc-100" />
                                </div>

                                {/* PHONE */}
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="h-8 w-8 shrink-0 animate-pulse rounded-full bg-zinc-100" />
                                    <div className="h-4 w-52 animate-pulse rounded-full bg-zinc-200" />
                                </div>

                                {/* ADDRESS */}
                                <div className="flex items-start gap-3">
                                    <div className="h-8 w-8 shrink-0 animate-pulse rounded-full bg-zinc-100" />

                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 w-full animate-pulse rounded-full bg-zinc-200" />
                                        <div className="h-4 w-4/5 animate-pulse rounded-full bg-zinc-100" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </>

                ) : addresses.length > 0 ? (

                    /* ===================================================== */
                    /* HAS addresses */
                    /* ===================================================== */

                    <>
                        {addresses.map((item, index) => (

                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                transition={{ delay: index * 0.04 }}
                                className={`group relative border rounded-2xl p-6 transition-all duration-300 hover:shadow-lg ${
                                    item.isDefault
                                        ? 'border-zinc-400 bg-zinc-50/30'
                                        : 'border-zinc-200 hover:border-zinc-300'
                                }`}
                            >

                                {/* ACTIONS */}
                                <div className="absolute top-5 right-5 flex items-center gap-2.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">

                                    {item.isDefault ? (
                                        <button
                                            onClick={() => onEdit(item)}
                                            className="flex items-center gap-2 px-4 py-2 bg-zinc-100 border border-transparent text-sm font-medium text-zinc-700 rounded-full hover:bg-zinc-200 hover:text-black transition-all shadow-sm"
                                        >
                                            Cập nhật
                                        </button>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => onSetDefaultAddress(item.id)}
                                                className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 text-sm font-medium text-zinc-700 rounded-full hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-all duration-300 shadow-sm"
                                            >
                                                Đặt mặc định
                                            </button>

                                            <button
                                                onClick={() => onEdit(item)}
                                                className="flex items-center gap-2 px-4 py-2 bg-zinc-50 border border-zinc-200 text-sm font-medium text-zinc-600 rounded-full hover:bg-zinc-200 hover:text-zinc-900 transition-all duration-300 shadow-sm"
                                            >
                                                Cập nhật
                                            </button>

                                            <button
                                                onClick={() => onDelete(item.id)}
                                                className="flex items-center gap-2 px-4 py-2 bg-white border border-red-100 text-sm font-medium text-red-500 rounded-full hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-all duration-300 shadow-sm"
                                            >
                                                Xóa
                                            </button>
                                        </>
                                    )}
                                </div>

                                {/* INFO */}
                                <div className="flex items-center gap-3 mb-4 pr-[320px]">

                                    <h3 className="text-lg font-bold text-zinc-900">
                                        {item.fullName}
                                    </h3>

                                    {item.isDefault && (
                                        <span className="flex items-center gap-1.5 bg-black text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                                            Mặc định
                                        </span>
                                    )}
                                </div>

                                <div className="space-y-3 text-[15px] text-zinc-600">

                                    <p className="flex items-center gap-3">
                                        <span className="font-medium text-zinc-700">
                                            {item.phoneNumber}
                                        </span>
                                    </p>

                                    <p className="leading-relaxed whitespace-pre-line">
                                        <AddressString
                                            addressDetail={item.addressDetail}
                                            communeCode={item.commune}
                                            districtCode={item.district}
                                            cityCode={item.city}
                                        />
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </>

                ) : (

                    /* ===================================================== */
                    /* EMPTY */
                    /* ===================================================== */

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-zinc-200 rounded-2xl bg-zinc-50/50"
                    >

                        <div className="relative mb-6">

                            <div className="absolute inset-0 bg-zinc-200/40 blur-[30px] rounded-full scale-150" />

                            <div className="relative flex items-center justify-center w-20 h-20 rounded-[28px] bg-white border border-zinc-100 shadow-sm">
                                <svg
                                    className="w-10 h-10 text-zinc-300"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                    />

                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                </svg>
                            </div>
                        </div>

                        <div className="text-center space-y-2">

                            <h3 className="text-[15px] font-black uppercase tracking-[0.24em] text-zinc-800">
                                Danh sách trống
                            </h3>

                            <p className="text-sm text-zinc-400">
                                Bạn chưa có địa chỉ nào
                            </p>
                        </div>
                    </motion.div>
                )}

            </AnimatePresence>
        </div>
    );
};

export default AccountAddress;