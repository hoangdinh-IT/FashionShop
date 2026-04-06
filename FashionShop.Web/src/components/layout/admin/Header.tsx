import React from 'react';
import { IoMenuOutline, IoNotificationsOutline, IoSearchOutline } from "react-icons/io5";

interface HeaderProps {
    toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
    return (
        <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between bg-white/80 px-6 shadow-sm backdrop-blur-md transition-all">
            {/* Left: Toggle Button & Search */}
            <div className="flex items-center gap-4">
                <button
                    onClick={toggleSidebar}
                    className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 focus:outline-none"
                >
                    <IoMenuOutline className="text-2xl" />
                </button>

                <div className="relative hidden md:block">
                    <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm..."
                        className="h-10 w-64 rounded-full bg-gray-100 pl-10 pr-4 text-sm text-gray-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
                    />
                </div>
            </div>

            {/* Right: Actions & Profile */}
            <div className="flex items-center gap-4">
                <button className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100 transition-colors">
                    <IoNotificationsOutline className="text-xl" />
                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                </button>

                <div className="flex items-center gap-3 border-l border-gray-200 pl-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-gray-700">ADMIN</p>
                    </div>
                    <img
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt="Avatar"
                        className="h-10 w-10 rounded-full border-2 border-white shadow-sm object-cover cursor-pointer hover:scale-105 transition-transform"
                    />
                </div>
            </div>
        </header>
    );
};

export default Header;