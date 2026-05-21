import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/layout/shop/Header';
import Footer from '../components/layout/shop/Footer';

const ShopMainLayout: React.FC = () => {
    return (
        <div className="min-h-screen bg-white flex flex-col font-sans">
            <Header />
            <main className="flex-1 w-full bg-white">
                <Outlet />
            </main>
            <Footer />            
        </div>
    );
};

export default ShopMainLayout;