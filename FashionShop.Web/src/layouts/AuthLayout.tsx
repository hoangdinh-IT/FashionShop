import { Outlet } from 'react-router-dom';

import backgroundLogin from "../assets/background-login.jpg";

const AuthLayout = () => {
    return (
        <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gray-900">

            {/* Background Image */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-80"
                style={{
                    backgroundImage: `url(${backgroundLogin})`
                }}
            />

            <div className="absolute inset-0 z-0 bg-black/40 backdrop-blur-[2px]" />

            <div className="relative z-10 px-4 w-full flex justify-center">
                <Outlet />
            </div>
        </div>
    );
};

export default AuthLayout;