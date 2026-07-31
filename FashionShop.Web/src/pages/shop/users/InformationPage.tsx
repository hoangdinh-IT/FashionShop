import React from 'react';
import AccountInformation from '../../../features/shop/users/components/AccountInformation';
import { useUser } from '../../../features/shop/users/hooks/useUser';

const InformationPage: React.FC = () => {
    const { user, isLoading } = useUser();

    return (
        <AccountInformation
            user={user}
            isLoading={isLoading}
        />
    );
};

export default InformationPage;