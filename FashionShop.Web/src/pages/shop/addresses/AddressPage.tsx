import React, { useEffect, useState } from 'react';
import AccountAddress from '../../../features/shop/addresses/components/AccountAddress';
import { useAddresses } from '../../../features/shop/addresses/hooks/useAddresses';
import type { Address } from '../../../features/shop/addresses/types/address';
import { useDialog } from '../../../contexts';
import AddressFormModal from '../../../features/shop/addresses/components/AddressFormModal';
import { motion } from "framer-motion";
import { IoAdd } from 'react-icons/io5';

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
            message: 'Địa chỉ này sẽ bị xoá vĩnh viễn. Bạn có chắc chắn muốn tiếp tục?',
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
            className="w-full font-sans"
        >
            <main className="flex-1 bg-white rounded-3xl shadow-sm border border-zinc-200/80 min-h-[600px] overflow-hidden">

                {/* STICKY HEADER */}
                <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-zinc-100">
                    <div className="px-6 md:px-10 py-6">

                        {/* TITLE (GIỮ NGUYÊN KIỂU CHỮ VÀ DẤU GẠCH CHÂN) */}
                        <header className="relative flex flex-col items-center">
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-block"
                            >
                                <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mb-2 italic text-center">
                                    ĐỊA CHỈ GIAO HÀNG
                                </h1>
                            </motion.div>

                            <div className="h-[3px] w-10 bg-slate-900 rounded-full" />
                        </header>

                        {/* ADD BUTTON */}
                        <div className="flex justify-center mt-6">
                            <button
                                onClick={handleOpenCreate}
                                className="inline-flex items-center gap-2 bg-zinc-900 text-white px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase hover:bg-zinc-800 active:scale-[0.98] transition-all duration-200 shadow-sm cursor-pointer"
                            >
                                <IoAdd className="text-lg" />
                                <span>Thêm địa chỉ</span>
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

            <AddressFormModal
                isOpen={modalConfig.isOpen}
                initialData={modalConfig.address}
                onClose={handleClose}
                isLoading={isLoading}
            />
        </motion.div>
    );
};

export default AddressPage;