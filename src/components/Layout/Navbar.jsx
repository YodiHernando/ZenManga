import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, X, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const listRef = useRef(null);

    // Close search when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (listRef.current && !listRef.current.contains(event.target)) {
                setIsSearchOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            // Navigate to Browse page with query
            navigate(`/browse?q=${encodeURIComponent(searchQuery)}`);
            setIsSearchOpen(false);
            setSearchQuery('');
        }
    };

    return (
        <header className="fixed top-0 z-50 w-full border-b border-white/5 bg-[#0B0C15]/95 backdrop-blur-xl transition-all duration-300">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 group" onClick={(e) => {
                    if (location.pathname === '/') {
                        e.preventDefault();
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                }}>
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg overflow-hidden shrink-0 transition-all border border-white/10">
                        <img src="/ZenManga.jpg" alt="ZenManga Logo" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-xl font-bold font-sans tracking-tight">
                        <span className="text-white">Zen</span>
                        <span className="text-cyan-500">Manga</span>
                    </span>
                </Link>

                <nav className="flex items-center gap-6 text-sm font-medium text-slate-400">
                    <div className="hidden md:flex items-center gap-1">
                        <Link to="/"
                            onClick={(e) => {
                                if (location.pathname === '/') {
                                    e.preventDefault();
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }
                            }}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${location.pathname === '/'
                                    ? 'text-white bg-white/10'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                        >Home</Link>
                        <Link to="/browse"
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${location.pathname === '/browse'
                                    ? 'text-white bg-white/10'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                        >Browse</Link>
                        <Link to="/vault"
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${location.pathname === '/vault'
                                    ? 'text-white bg-white/10'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                        >My Vault</Link>
                    </div>

                    {/* Search Bar Toggle */}
                    <div ref={listRef} className="flex items-center">
                        {/* Desktop & Mobile Search Container */}
                        <div className={`
                            absolute top-16 left-0 w-full bg-[#10111B] border-b border-white/5 p-4
                            md:static md:bg-transparent md:border-none md:p-0 md:backdrop-blur-none
                            transition-all duration-300 origin-top
                            ${isSearchOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 md:scale-y-100 md:opacity-100 md:w-0 md:overflow-hidden'}
                            ${isSearchOpen ? 'md:w-64' : ''} 
                        `}>
                            <form onSubmit={handleSearchSubmit} className="relative w-full">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search manga..."
                                    className="w-full bg-slate-900 border border-slate-700 rounded-full py-2 pl-4 pr-10 text-white focus:outline-none focus:border-cyan-500 text-sm"
                                    autoFocus={isSearchOpen}
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </form>
                        </div>

                        <button
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                            className={`p-2 hover:bg-white/10 rounded-full transition-colors hidden md:block ${isSearchOpen ? 'text-white bg-white/10 ml-2' : 'text-slate-400 hover:text-white'}`}
                        >
                            <Search className="w-5 h-5" />
                        </button>
                        {/* Mobile Search Icon (Always visible) */}
                        <button
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                            className={`p-2 hover:bg-white/10 rounded-full transition-colors md:hidden ${isSearchOpen ? 'text-white' : 'text-slate-400'}`}
                        >
                            <Search className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </nav>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-b border-white/5 bg-[#10111B]/95 backdrop-blur-xl overflow-hidden"
                    >
                        <div className="flex flex-col p-4 space-y-4 text-center">
                            <Link
                                to="/"
                                onClick={(e) => {
                                    setIsMobileMenuOpen(false);
                                    if (location.pathname === '/') {
                                        e.preventDefault();
                                        setTimeout(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, 300);
                                    }
                                }}
                                className={`py-2 px-4 font-medium rounded-lg transition-colors ${location.pathname === '/'
                                        ? 'text-white bg-white/10'
                                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                Home
                            </Link>
                            <Link
                                to="/browse"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`py-2 px-4 font-medium rounded-lg transition-colors ${location.pathname === '/browse'
                                        ? 'text-white bg-white/10'
                                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                Browse
                            </Link>
                            <Link
                                to="/vault"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`py-2 px-4 font-medium rounded-lg transition-colors ${location.pathname === '/vault'
                                        ? 'text-white bg-white/10'
                                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                My Vault
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Navbar;
