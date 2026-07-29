import React from 'react';
import AccountInformation from '../../../features/shop/users/components/AccountInformation';
import { useUser } from '../../../features/shop/users/hooks/useUser';

const InformationPage: React.FC = () => {
    // Gọi hook lấy data tại Page này thay vì gọi ở Layout
    const { user, isLoading } = useUser();

    return (
        <AccountInformation
            user={user}
            isLoading={isLoading}
        />
    );
};

export default InformationPage;