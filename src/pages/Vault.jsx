import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiTrash2, FiBookOpen, FiPlus, FiMinus, FiCheck, FiEdit2 } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/Layout/SEO';
import PageTransition from '../components/Layout/PageTransition';
import { useVault } from '../hooks/useVault';

const TABS = ['All', 'Reading', 'Completed', 'Plan to Read', 'On Hold', 'Dropped'];

const STATUS_COLORS = {
    'Reading':      { bg: 'bg-cyan-500/10',     text: 'text-cyan-400',     border: 'border-cyan-500/30',     bar: 'from-cyan-400 to-blue-500' },
    'Completed':    { bg: 'bg-emerald-500/10',  text: 'text-emerald-400',  border: 'border-emerald-500/30',  bar: 'from-emerald-400 to-green-500' },
    'Plan to Read': { bg: 'bg-slate-500/10',    text: 'text-slate-400',    border: 'border-slate-500/30',    bar: 'from-slate-400 to-slate-500' },
    'On Hold':      { bg: 'bg-amber-500/10',    text: 'text-amber-400',    border: 'border-amber-500/30',    bar: 'from-amber-400 to-yellow-500' },
    'Dropped':      { bg: 'bg-rose-500/10',     text: 'text-rose-400',     border: 'border-rose-500/30',     bar: 'from-rose-400 to-red-500' },
};

const LibraryCard = ({ manga, updateStatus, updateProgress, removeFromVault }) => {
    const statusStyle = STATUS_COLORS[manga.status] || STATUS_COLORS['Plan to Read'];
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState(manga.read_chapters || 0);

    const currentRead = manga.read_chapters || 0;
    const isOngoing = !manga.total_chapters || manga.total_chapters === 0;

    const handleIncrement = () => {
        if (!isOngoing && currentRead >= manga.total_chapters) return;
        updateProgress(manga.mal_id, 1);
    };

    const handleDecrement = () => {
        if (currentRead <= 0) return;
        updateProgress(manga.mal_id, -1);
    };

    const handleSubmitProgress = () => {
        let target = Math.max(0, parseInt(inputValue) || 0);
        if (!isOngoing) {
            target = Math.min(target, manga.total_chapters);
        }
        updateProgress(manga.mal_id, target - currentRead);
        setIsEditing(false);
    };

    const percentage = isOngoing ? 100 : Math.round((currentRead / manga.total_chapters) * 100) || 0;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`glass p-4 rounded-2xl border flex gap-4 group relative overflow-hidden transition-all duration-300 hover:border-white/20 bg-[#12131C] ${statusStyle.border}`}
        >
            {/* Image */}
            <Link to={`/manga/${manga.mal_id}`} className="w-[100px] h-[145px] flex-shrink-0 rounded-xl overflow-hidden shadow-2xl relative">
                <img src={manga.image} alt={manga.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </Link>

            {/* Content Flex */}
            <div className="flex-1 flex flex-col justify-between z-10 min-w-0 py-1">
                <div>
                    <Link to={`/manga/${manga.mal_id}`}>
                        <h3 className="font-bold text-[15px] leading-tight mb-2 group-hover:text-white transition-colors line-clamp-2 text-slate-200">
                            {manga.title}
                        </h3>
                    </Link>

                    {/* Status Dropdown */}
                    <div className="relative inline-block mb-3">
                        <select
                            value={manga.status}
                            onChange={(e) => updateStatus(manga.mal_id, e.target.value)}
                            className={`appearance-none text-xs border rounded-full px-4 pr-8 py-1.5 focus:outline-none focus:ring-1 focus:ring-white/20 font-bold transition-colors cursor-pointer ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                        >
                            {Object.keys(STATUS_COLORS).map(s => <option key={s} value={s} className="bg-[#0B0C15]">{s}</option>)}
                        </select>
                        <div className="absolute top-1/2 right-3 -translate-y-1/2 pointer-events-none opacity-70">
                            <FiEdit2 size={10} />
                        </div>
                    </div>

                    {/* Progress Track */}
                    <div className="space-y-2">
                        {/* Control Row */}
                        <div className="flex items-center justify-between text-xs font-medium">
                            <div className="text-slate-400 capitalize">Progress</div>
                            
                            <div className="flex items-center gap-2 bg-black/40 rounded-lg p-1 border border-white/5">
                                <button onClick={handleDecrement} className="p-1 hover:bg-white/10 rounded-md text-slate-400 hover:text-white transition-colors">
                                    <FiMinus size={12} />
                                </button>

                                {/* Edit Input or Display */}
                                {isEditing ? (
                                    <div className="flex items-center justify-center">
                                        <input 
                                            type="number" 
                                            autoFocus
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            onBlur={handleSubmitProgress}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSubmitProgress()}
                                            className="w-10 text-center bg-transparent border-none focus:outline-none text-white p-0 m-0 h-4 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        />
                                    </div>
                                ) : (
                                    <div 
                                        onClick={() => { setInputValue(currentRead); setIsEditing(true); }}
                                        className="min-w-[40px] text-center text-white cursor-pointer hover:text-cyan-300 transition-colors"
                                        title="Click to edit"
                                    >
                                        {currentRead} <span className="text-slate-500">/ {isOngoing ? '∞' : manga.total_chapters}</span>
                                    </div>
                                )}

                                <button onClick={handleIncrement} className="p-1 hover:bg-white/10 rounded-md text-slate-400 hover:text-white transition-colors">
                                    <FiPlus size={12} />
                                </button>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden relative">
                            <div
                                className={`absolute top-0 left-0 h-full bg-gradient-to-r ${statusStyle.bar} ${isOngoing && 'animate-pulse'}`}
                                style={{ width: `${percentage}%`, transition: 'width 0.5s ease-in-out' }}
                            />
                        </div>
                    </div>
                </div>

                {/* Remove Button */}
                <div className="flex items-center justify-end mt-1">
                    <button
                        onClick={() => removeFromVault(manga.mal_id, manga.title)}
                        className="text-[11px] text-slate-500 hover:text-rose-400 flex items-center gap-1.5 uppercase font-bold tracking-wider transition-colors"
                    >
                        <FiTrash2 size={12} /> Delete
                    </button>
                </div>
            </div>

            {/* Back Glow Effect based on status */}
            <div className={`absolute -right-16 -bottom-16 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-5 transition-colors ${statusStyle.bg.replace('/10', '')}`} />
        </motion.div>
    );
};

const VaultSkeleton = () => (
    <div className="glass p-4 rounded-2xl border flex gap-4 bg-[#12131C] border-white/5 animate-pulse min-h-[177px]">
        <div className="w-[100px] h-[145px] bg-white/5 rounded-xl flex-shrink-0" />
        <div className="flex-1 flex flex-col justify-between py-1">
            <div>
                <div className="h-4 bg-white/10 rounded w-3/4 mb-3" />
                <div className="h-6 bg-white/10 rounded-full w-24 mb-4" />
                <div className="h-3 bg-white/10 rounded w-16 mb-2" />
                <div className="h-1.5 bg-white/5 rounded-full w-full" />
            </div>
            <div className="h-4 bg-white/10 rounded w-16 self-end mt-2" />
        </div>
    </div>
);

const Vault = () => {
    const { vault, updateProgress, updateStatus, removeFromVault } = useVault();
    const [activeTab, setActiveTab] = useState('All');
    const [isFiltering, setIsFiltering] = useState(false);

    const handleTabChange = (tab) => {
        if (activeTab === tab) return;
        setIsFiltering(true);
        setActiveTab(tab);
        setTimeout(() => setIsFiltering(false), 300);
    };

    // Filter the vault based on selected tab
    const filteredVault = vault.filter(m => activeTab === 'All' || m.status === activeTab);

    return (
        <PageTransition>
            <div className="min-h-screen pb-20">
                {/* Header Phase (Non-Sticky) */}
                <div className="pt-8 pb-2">
                    <div className="container mx-auto px-4">
                        <SEO title="My Vault" description="Manage your reading progress and bookmarks." />
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-2">
                            <div>
                                <h1 className="text-4xl lg:text-5xl font-black mb-2 text-white drop-shadow-xl tracking-tight">My Reading Vault</h1>
                                <p className="text-slate-400 text-lg">Manage carefully, read relentlessly.</p>
                            </div>
                            
                            {/* Vault Stats */}
                            <div className="flex gap-4">
                                <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3">
                                    <div className="text-2xl font-black text-white">{vault.length}</div>
                                    <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Total Titles</div>
                                </div>
                                <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-2xl px-5 py-3">
                                    <div className="text-2xl font-black text-cyan-400">
                                        {vault.filter(m => m.status === 'Reading').length}
                                    </div>
                                    <div className="text-xs text-cyan-500/70 font-medium uppercase tracking-wider">Reading</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter Tabs (Sticky) */}
                <div className="sticky top-[72px] z-30 pt-4 pb-4 border-b border-white/5 bg-[#0B0C15]/80 backdrop-blur-xl">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-2">
                            {TABS.map(tab => {
                                const count = tab === 'All' ? vault.length : vault.filter(m => m.status === tab).length;
                                const isActive = activeTab === tab;
                                return (
                                    <button
                                        key={tab}
                                        onClick={() => handleTabChange(tab)}
                                        className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 border ${
                                            isActive 
                                            ? 'bg-white text-[#0B0C15] border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                                            : 'bg-slate-900 border-white/10 text-slate-400 hover:bg-slate-800 hover:text-white'
                                        }`}
                                    >
                                        {tab} <span className={`ml-1.5 px-2 py-0.5 rounded-full text-[10px] ${isActive ? 'bg-black/20 text-[#0B0C15]' : 'bg-white/10 text-slate-400'}`}>{count}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-8">
                    {vault.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center max-w-lg mx-auto">
                            <div className="w-24 h-24 mb-6 relative">
                                <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-xl animate-pulse" />
                                <div className="w-full h-full bg-slate-900 border border-white/10 rounded-3xl flex items-center justify-center shadow-2xl relative z-10">
                                    <FiBookOpen className="text-slate-500 text-3xl" />
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-3">Your Vault is Empty</h2>
                            <p className="text-slate-400 mb-8 text-base">You haven't bookmarked any manga yet. Start browsing to build your collection.</p>
                            <Link to="/browse" className="px-8 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform flex items-center gap-2">
                                <FiPlus /> Add Manga
                            </Link>
                        </div>
                    ) : filteredVault.length === 0 ? (
                        <div className="text-center py-20">
                            <h3 className="text-xl text-slate-400 font-bold mb-2">No {activeTab} manga found</h3>
                            <p className="text-slate-500">You don't have any series classified as '{activeTab}' at the moment.</p>
                        </div>
                    ) : isFiltering ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {Array.from({ length: Math.min(filteredVault.length || 4, 8) }).map((_, i) => <VaultSkeleton key={i} />)}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            <AnimatePresence>
                                {filteredVault.map(manga => (
                                    <LibraryCard
                                        key={manga.mal_id}
                                        manga={manga}
                                        updateStatus={updateStatus}
                                        updateProgress={updateProgress}
                                        removeFromVault={removeFromVault}
                                    />
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>
        </PageTransition>
    );
};

export default Vault;
