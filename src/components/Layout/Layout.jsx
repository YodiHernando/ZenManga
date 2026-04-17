import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';
import BackToTop from '../UI/BackToTop';

const Layout = () => {
    return (
        <>
            <Navbar />
            <main className="pt-20 pb-10 min-h-screen">
                <Outlet />
            </main>
            <Footer />
            <BackToTop />
        </>
    );
};

export default Layout;
