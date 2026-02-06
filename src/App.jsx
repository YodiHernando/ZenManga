import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Layout from './components/Layout/Layout';
import { FiLoader } from 'react-icons/fi';

// Lazy Load Pages
const Home = lazy(() => import('./pages/Home'));
const Browse = lazy(() => import('./pages/Browse'));
const MangaDetail = lazy(() => import('./pages/MangaDetail'));
const Vault = lazy(() => import('./pages/Vault'));

const LoadingFallback = () => (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-cyan-400">
        <FiLoader className="text-4xl animate-spin" />
    </div>
);

import { AnimatePresence } from 'framer-motion';
import ScrollToTop from './components/Layout/ScrollToTop';

const App = () => {
    return (
        <HelmetProvider>
            <div className="min-h-screen font-sans bg-[#0B0C15] text-white">
                <ScrollToTop />
                <Suspense fallback={<LoadingFallback />}>
                    <AnimatePresence mode="wait">
                        <Routes>
                            <Route element={<Layout />}>
                                <Route path="/" element={<Home />} />
                                <Route path="/browse" element={<Browse />} />
                                <Route path="/manga/:id" element={<MangaDetail />} />
                                <Route path="/vault" element={<Vault />} />
                            </Route>
                        </Routes>
                    </AnimatePresence>
                </Suspense>
            </div>
        </HelmetProvider>
    );
};

export default App;
