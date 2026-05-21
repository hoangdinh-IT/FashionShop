import React, { useEffect, useState } from 'react';
import AccountAddress from '../../../features/shop/addresses/components/AccountAddress';
import { useAddresses } from '../../../features/shop/addresses/hooks/useAddresses';
import type { Address } from '../../../features/shop/addresses/types/address';
import { useDialog } from '../../../contexts';
import AddressFormDialog from '../../../features/shop/addresses/components/AddressFormDialog';
import { motion } from "framer-motion";

const AddressPage: React.FC = () => {
    const { showDialog } = useDialog();

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "instant"
        });
    }, []);

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
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="w-full"
        >
            <main className="flex-1 bg-white rounded-[2rem] shadow-sm border border-zinc-100 min-h-[600px] overflow-visible">

                {/* STICKY HEADER */}
                <div className="sticky top-20 z-40 bg-white/88 backdrop-blur-2xl border-b border-zinc-100 rounded-t-[2rem]">
                    <div className="px-6 md:px-10 pt-6 pb-6">

                        {/* TITLE */}
                        <header className="relative flex flex-col items-center">

                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-block"
                            >
                                <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight mb-2 italic text-center">
                                    ĐỊA CHỈ GIAO HÀNG
                                </h1>
                            </motion.div>

                            <div className="h-[3px] w-10 bg-slate-900 rounded-full" />
                        </header>

                        {/* ADD BUTTON */}
                        <div className="flex justify-center mt-6">

                            <button
                                onClick={handleOpenCreate}
                                className="group relative overflow-hidden flex items-center gap-2.5 bg-slate-900 text-white px-5 py-3 rounded-full text-[10px] font-black tracking-[0.22em] uppercase shadow-[0_10px_24px_rgba(15,23,42,0.10)] hover:shadow-[0_16px_36px_rgba(15,23,42,0.16)] hover:-translate-y-0.5 transition-all duration-300"
                            >

                                {/* Glow */}
                                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                <svg
                                    className="relative z-10 w-3.5 h-3.5 transition-transform duration-500 group-hover:rotate-90"
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
                </div>

                {/* CONTENT */}
                <div className="px-6 md:px-10 py-8">

                    <AccountAddress
                        addresses={addresses}
                        isLoading={isLoading}
                        onEdit={handleOpenEdit}
                        onSetDefaultAddress={handleUpdateSetDefaultAddress}
                        onDelete={handleDelete}
                    />
                </div>
            </main>

            <AddressFormDialog
                isOpen={modalConfig.isOpen}
                initialData={modalConfig.address}
                onClose={handleClose}
                isLoading={isLoading}
            />
        </motion.div>
    );
};

export default AddressPage;