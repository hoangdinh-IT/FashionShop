import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/layout/shop/Header';

const ShopMainLayout: React.FC = () => {
    return (
        <div className="min-h-screen bg-white flex flex-col font-sans">
            <Header />
            <main className="flex-1 w-full bg-white">
                <Outlet />
            </main>
            <footer className="py-12 bg-zinc-50 border-t border-zinc-100 text-center">
                <p className="text-zinc-400 text-sm italic">© 2026 FashionShop. Limited Edition.</p>
            </footer>
        </div>
    );
};

export default ShopMainLayout;