import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AnimatePresence } from 'framer-motion';
import { FiLoader } from 'react-icons/fi';
import Layout from './components/Layout/Layout';
import ScrollToTop from './components/Layout/ScrollToTop';
import ErrorBoundary from './components/UI/ErrorBoundary';
import { ToastProvider } from './components/UI/Toast';

// Lazy Load Pages
const Home = lazy(() => import('./pages/Home'));
const Browse = lazy(() => import('./pages/Browse'));
const MangaDetail = lazy(() => import('./pages/MangaDetail'));
const Vault = lazy(() => import('./pages/Vault'));

const LoadingFallback = () => (
    <div className="min-h-screen bg-[#0B0C15] overflow-hidden">
        {/* Fake Navbar Shimmer */}
        <div className="h-20 w-full bg-white/5 border-b border-white/5 animate-pulse" />
        {/* Body Shimmer */}
        <div className="animate-pulse bg-slate-800/20 h-full w-full" />
    </div>
);

const App = () => {
    return (
        <HelmetProvider>
            <div className="min-h-screen font-sans bg-[#0B0C15] text-white">
                <ScrollToTop />
                <ToastProvider>
                    <ErrorBoundary>
                        <Suspense fallback={<LoadingFallback />}>
                            <AnimatePresence mode="wait">
                                <Routes>
                                    <Route element={<Layout />}>
                                        <Route path="/" element={<Home />} />
                                        <Route path="/home" element={<Navigate to="/" replace />} />
                                        <Route path="/browse" element={<Browse />} />
                                        <Route path="/manga/:id" element={<MangaDetail />} />
                                        <Route path="/vault" element={<Vault />} />
                                        <Route path="*" element={<Navigate to="/" replace />} />
                                    </Route>
                                </Routes>
                            </AnimatePresence>
                        </Suspense>
                    </ErrorBoundary>
                </ToastProvider>
            </div>
        </HelmetProvider>
    );
};

export default App;
