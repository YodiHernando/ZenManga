import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { saveToHistory } from '../utils/readingHistory';
import { motion, AnimatePresence } from 'framer-motion';
import { FiStar, FiUsers, FiBookOpen, FiClock, FiCheck, FiBookmark, FiArrowLeft, FiFileText, FiUsers as FiChars, FiBook, FiShare2 } from 'react-icons/fi';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';
import {
    fetchMangaDetail,
    fetchMangaCharacters,
    fetchMangaRecommendations,
} from '../utils/queryFunctions';
import MangaCard from '../components/Manga/MangaCard';
import MangaDexReader from '../components/Manga/MangaDexReader';
import ErrorBoundary from '../components/UI/ErrorBoundary';
import { useToast } from '../components/UI/Toast';
import SEO from '../components/Layout/SEO';
import PageTransition from '../components/Layout/PageTransition';
import { useVault } from '../hooks/useVault';

import 'swiper/css';
import 'swiper/css/free-mode';

const TABS = [
    { id: 'synopsis', label: 'Synopsis', icon: FiFileText },
    { id: 'characters', label: 'Characters', icon: FiChars },
    { id: 'read', label: 'Read', icon: FiBook },
];

const MangaDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { toggleVault: handleToggleVault, isInVault } = useVault();
    const isInVaultState = isInVault(parseInt(id));
    const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'synopsis');
    const toast = useToast();

    // ── React Query — 3 independent queries ───────────────────────────────────
    const { data: manga, isLoading } = useQuery({
        queryKey: ['manga', id],
        queryFn: () => fetchMangaDetail(id),
        staleTime: 5 * 60 * 1000,
    });

    const { data: characters = [], isLoading: charsLoading } = useQuery({
        queryKey: ['manga', id, 'characters'],
        queryFn: () => fetchMangaCharacters(id),
        enabled: !!manga,
        staleTime: 10 * 60 * 1000,
        retry: 1,
    });

    const { data: recommendations = [] } = useQuery({
        queryKey: ['manga', id, 'recommendations'],
        queryFn: () => fetchMangaRecommendations(id),
        enabled: !!manga,
        staleTime: 10 * 60 * 1000,
        retry: 1,
    });

    useEffect(() => {
        window.scrollTo(0, 0);
        // Reset tab dari URL param saat berpindah manga
        setActiveTab(searchParams.get('tab') || 'synopsis');
    }, [id]);

    // Auto-save to reading history when manga data loads
    useEffect(() => {
        if (manga) saveToHistory(manga);
    }, [manga]);

    const toggleVault = () => {
        if (manga) handleToggleVault(manga);
    };

    const handleShare = async () => {
        const url = window.location.href;
        const text = `Check out "${manga.title}" on ZenManga!`;
        if (navigator.share) {
            await navigator.share({ title: manga.title, text, url }).catch(() => { });
        } else {
            await navigator.clipboard.writeText(url);
            toast('Link copied to clipboard!', 'info', 2000);
        }
    };

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-400" />
        </div>
    );

    if (!manga) return <div className="text-center py-20 text-slate-400">Manga not found.</div>;

    return (
        <PageTransition>
            <div className="min-h-screen relative">
                <SEO title={manga.title} description={manga.synopsis?.slice(0, 150)} />

                {/* Backdrop Banner */}
                <div className="absolute top-0 left-0 w-full h-[500px] overflow-hidden -z-10">
                    <img src={manga.images?.jpg?.large_image_url} alt="" loading="lazy"
                        className="w-full h-full object-cover blur-3xl opacity-30" />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-slate-900/80 to-slate-900" />
                </div>

                <div className="container mx-auto px-4 py-8">
                    <Link to="/browse" className="inline-flex items-center gap-2 text-slate-400 hover:text-cyan-400 mb-6 transition-colors">
                        <FiArrowLeft /> Back to Browse
                    </Link>

                    {/* ── Header Info ──────────────────────────────────────── */}
                    <div className="flex flex-col md:flex-row gap-8 mb-8">
                        {/* Cover Image */}
                        <div className="w-full md:w-72 flex-shrink-0 mx-auto">
                            <div className="rounded-xl overflow-hidden shadow-2xl shadow-cyan-500/10 glass border-none p-2 rotate-1 hover:rotate-0 transition-transform duration-500">
                                <img src={manga.images?.jpg?.large_image_url} alt={manga.title} className="w-full rounded-lg" />
                            </div>
                            <button onClick={toggleVault}
                                className={`w-full mt-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${isInVaultState
                                    ? 'bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30'
                                    : 'bg-cyan-500 text-slate-900 hover:bg-cyan-400 shadow-lg shadow-cyan-500/20'}`}>
                                {isInVaultState ? <><FiCheck /> In Vault</> : <><FiBookmark /> Add to Vault</>}
                            </button>
                            <button onClick={handleShare}
                                className="w-full mt-2 py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-all glass border border-white/10 text-slate-400 hover:text-white hover:border-white/20 text-sm">
                                <FiShare2 /> Share
                            </button>
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                            {/* Genre badges — clickable, goes to Browse filtered */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                {manga.genres?.map(g => (
                                    <button
                                        key={g.mal_id}
                                        onClick={() => navigate(`/browse?genres=${g.mal_id}`)}
                                        className="text-xs px-2 py-1 rounded-md bg-slate-800 text-slate-300 border border-white/5 hover:border-cyan-500/50 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all cursor-pointer"
                                    >
                                        {g.name}
                                    </button>
                                ))}
                            </div>

                            <h1 className="text-3xl md:text-5xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 leading-tight">
                                {manga.title}
                            </h1>
                            <h2 className="text-lg text-slate-500 mb-6">{manga.title_japanese}</h2>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                                {[
                                    { icon: <FiStar className="text-yellow-400" />, value: manga.score || 'N/A', label: 'Score' },
                                    { icon: <FiUsers className="text-blue-400" />, value: `#${manga.popularity}`, label: 'Popularity' },
                                    { icon: <FiBookOpen className="text-green-400" />, value: manga.chapters || (manga.status === 'Publishing' ? 'Ongoing' : '?'), label: 'Chapters' },
                                    { icon: <FiClock className="text-purple-400" />, value: manga.status, label: 'Status' },
                                ].map(({ icon, value, label }) => (
                                    <div key={label} className="glass p-3 rounded-xl text-center">
                                        <div className="text-lg mx-auto mb-1 flex justify-center">{icon}</div>
                                        <div className="text-xl font-bold truncate">{value}</div>
                                        <div className="text-xs text-slate-400">{label}</div>
                                    </div>
                                ))}
                            </div>

                            {/* ── Tab Navigation ──────────────────────────── */}
                            <div className="flex gap-1 p-1 bg-slate-900/60 rounded-xl border border-white/5 mb-6 w-fit">
                                {TABS.map(tab => {
                                    const Icon = tab.icon;
                                    const isActive = activeTab === tab.id;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                                                    ? 'text-slate-900'
                                                    : 'text-slate-400 hover:text-white'
                                                }`}
                                        >
                                            {/* Active pill background */}
                                            {isActive && (
                                                <motion.div
                                                    layoutId="active-tab-pill"
                                                    className="absolute inset-0 bg-cyan-400 rounded-lg"
                                                    transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                                                />
                                            )}
                                            <span className="relative flex items-center gap-2">
                                                <Icon className="w-4 h-4" />
                                                {tab.label}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* ── Tab Content ─────────────────────────────── */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {/* SYNOPSIS TAB */}
                                    {activeTab === 'synopsis' && (
                                        <div className="glass p-6 rounded-xl">
                                            <p className="text-slate-300 leading-relaxed text-sm md:text-base">
                                                {manga.synopsis || 'No synopsis available.'}
                                            </p>
                                        </div>
                                    )}

                                    {/* CHARACTERS TAB */}
                                    {activeTab === 'characters' && (
                                        <div>
                                            {charsLoading ? (
                                                <div className="flex gap-3 overflow-hidden">
                                                    {[...Array(6)].map((_, i) => (
                                                        <div key={i} className="w-32 aspect-[3/4] rounded-xl bg-slate-800 animate-pulse shrink-0" />
                                                    ))}
                                                </div>
                                            ) : characters.length > 0 ? (
                                                <Swiper spaceBetween={12} slidesPerView="auto" freeMode modules={[FreeMode]} className="w-full">
                                                    {characters.map(char => (
                                                        <SwiperSlide key={char.character.mal_id} className="!w-28 md:!w-36">
                                                            <div className="rounded-xl overflow-hidden relative aspect-[3/4] group">
                                                                <img
                                                                    src={char.character.images?.jpg?.image_url}
                                                                    alt={char.character.name}
                                                                    loading="lazy"
                                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                                />
                                                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent flex items-end p-2">
                                                                    <p className="text-white text-xs font-bold truncate w-full">{char.character.name}</p>
                                                                </div>
                                                            </div>
                                                            <p className="text-slate-500 text-[10px] mt-1 truncate text-center">{char.role}</p>
                                                        </SwiperSlide>
                                                    ))}
                                                </Swiper>
                                            ) : (
                                                <p className="text-slate-600 italic">No characters found.</p>
                                            )}
                                        </div>
                                    )}

                                    {/* READ TAB */}
                                    {activeTab === 'read' && (
                                        <ErrorBoundary fallback={
                                            <div className="glass p-4 rounded-xl border border-red-500/20 text-slate-500 text-sm">
                                                Chapter reader unavailable right now.
                                            </div>
                                        }>
                                            <MangaDexReader title={manga.title} />
                                        </ErrorBoundary>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* ── Recommendations (always visible below) ───────────── */}
                    <div className="border-t border-white/5 pt-10">
                        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <span className="w-1 h-8 bg-purple-500 rounded-full block" /> You Might Also Like
                        </h3>
                        {recommendations.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                {recommendations.slice(0, 10).map(rec => (
                                    <MangaCard key={rec.entry.mal_id} manga={{ ...rec.entry, score: null }} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-slate-600 italic">No recommendations found.</p>
                        )}
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default MangaDetail;
