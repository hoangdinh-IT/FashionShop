import React, { useState } from 'react';
import AccountAddress from '../../../features/shop/addresses/components/AccountAddress';
import { useAddresses } from '../../../features/shop/addresses/hooks/useAddresses';
import type { Address } from '../../../features/shop/addresses/types/address';
import { useDialog } from '../../../contexts';
import AddressFormDialog from '../../../features/shop/addresses/components/AddressFormDialog';
import { motion } from "framer-motion";

const AddressPage: React.FC = () => {
    const { showDialog } = useDialog();

    const {
        addresses,
        isLoading,
        updateSetDefaultAddress,
        deleteAddress,
    } = useAddresses();

    const [modalConfig, setModalConfig] = useState<{
        isOpen: boolean;
        address: Address | undefined;
    }>({
        isOpen: false,
        address: undefined,
    });

    const handleOpenCreate = () =>
        setModalConfig({
            isOpen: true,
            address: undefined,
        });

    const handleOpenEdit = (address: Address) =>
        setModalConfig({
            isOpen: true,
            address,
        });

    const handleUpdateSetDefaultAddress = (addressId: string) =>
        updateSetDefaultAddress(addressId);

    const handleClose = () =>
        setModalConfig({
            isOpen: false,
            address: undefined,
        });

    const handleDelete = (addressId: string) => {
        showDialog({
            title: 'XÁC NHẬN XOÁ ĐỊA CHỈ',
            message:
                'Địa chi này sẽ bị xoá vĩnh viễn. Bạn có chắc chắn muốn tiếp tục?',
            confirmText: 'Xoá',
            cancelText: 'Hủy',
            confirmColor: 'error',
            onConfirm: () => deleteAddress(addressId),
        });
    };

    return (
        <>
            <main className="flex-1 bg-white rounded-[2rem] shadow-sm border border-zinc-100 p-8 md:p-12 min-h-[600px]">

            {/* HEADER */}
            <div className="relative mb-14">

                {/* Title */}
                <header className="relative flex flex-col items-center">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block"
                    >
                        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter mb-2 italic text-center">
                            ĐỊA CHỈ GIAO HÀNG
                        </h1>
                    </motion.div>

                    <div className="h-1 w-12 bg-slate-900 rounded-full" />
                </header>

                {/* Add Button */}
                <div className="flex justify-center mt-8">
                    <button
                        onClick={handleOpenCreate}
                        className="
                            group relative overflow-hidden
                            flex items-center gap-3
                            bg-slate-900 text-white
                            px-7 py-3.5
                            rounded-full
                            text-[11px] font-black tracking-[0.25em]
                            uppercase
                            shadow-[0_12px_30px_rgba(15,23,42,0.12)]
                            hover:shadow-[0_18px_40px_rgba(15,23,42,0.18)]
                            hover:-translate-y-0.5
                            transition-all duration-300
                        "
                    >
                        {/* Glow */}
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        <svg
                            className="relative z-10 w-4 h-4 transition-transform duration-500 group-hover:rotate-90"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4v16m8-8H4"
                            />
                        </svg>

                        <span className="relative z-10">
                            THÊM ĐỊA CHỈ
                        </span>
                    </button>
                </div>
            </div>

            <AccountAddress
                data={addresses}
                isLoading={isLoading}
                onEdit={handleOpenEdit}
                onSetDefaultAddress={handleUpdateSetDefaultAddress}
                onDelete={handleDelete}
            />
        </main>

            <AddressFormDialog
                isOpen={modalConfig.isOpen}
                initialData={modalConfig.address}
                onClose={handleClose}
                isLoading={isLoading}
            />
        </>
    );
};

export default AddressPage;