import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <>
            <Navbar />
            <main className="pt-20 pb-10 min-h-screen">
                <Outlet />
            </main>
            <Footer />
        </>
    );
};

export default Layout;
