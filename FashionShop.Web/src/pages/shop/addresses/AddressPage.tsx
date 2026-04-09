import React, { useState } from 'react';
import AccountAddress from '../../../features/shop/addresses/components/AccountAddress';
import { useAddresses } from '../../../features/shop/addresses/hooks/useAddresses';
import type { Address } from '../../../features/shop/addresses/types/address';
import { useDialog } from '../../../contexts';
import AddressFormDialog from '../../../features/shop/addresses/components/AddressFormDialog';

const AddressPage: React.FC = () => {
    const { showDialog } = useDialog();

    const { 
        addresses, 
        isLoading,
        updateSetDefaultAddress,
        deleteAddress,
    } = useAddresses();

    const [modalConfig, setModalConfig] = useState<{
        isOpen: boolean,
        address: Address | undefined
    }>({
        isOpen: false,
        address: undefined,
    })

    const handleOpenCreate = () => setModalConfig({ isOpen: true, address: undefined })

    const handleOpenEdit = (address: Address) => setModalConfig({ isOpen: true, address: address })

    const handleUpdateSetDefaultAddress = (addressId: string) => updateSetDefaultAddress(addressId);

    const handleClose = () => setModalConfig({ isOpen: false, address: undefined })

    const handleDelete = (addressId: string) => {
        showDialog({
            title: "XÁC NHẬN XOÁ ĐỊA CHỈ",
            message: "Địa chi này sẽ bị xoá vĩnh viễn. Bạn có chắc chắn muốn tiếp tục?",
            confirmText: "Xoá",
            cancelText: "Hủy",
            confirmColor: "error",
            onConfirm: () => deleteAddress(addressId)
        });
    }

    return (
        <>
            <AccountAddress 
                data={addresses}
                isLoading={isLoading}
                onCreate={handleOpenCreate}
                onEdit={handleOpenEdit}
                onSetDefaultAddress={handleUpdateSetDefaultAddress}
                onDelete={handleDelete}
            />

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