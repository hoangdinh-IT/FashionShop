import React from 'react';
import AccountInformation from '../../../features/shop/users/components/AccountInformation';
import { useUsers } from '../../../features/shop/users/hooks/useUsers';

const InformationPage: React.FC = () => {
    // Gọi hook lấy data tại Page này thay vì gọi ở Layout
    const { user, isLoading } = useUsers();

    return (
        <AccountInformation
            user={user}
            isLoading={isLoading}
        />
    );
};

export default InformationPage;