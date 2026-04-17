import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useSearchParams, useNavigationType } from 'react-router-dom';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { fetchMangaPage } from '../utils/queryFunctions';
import useDebounce from '../hooks/useDebounce';
import { motion } from 'framer-motion';
import MangaCard from '../components/Manga/MangaCard';
import FilterBar from '../components/Manga/FilterBar';
import SEO from '../components/Layout/SEO';
import PageTransition from '../components/Layout/PageTransition';
import SkeletonCard from '../components/UI/SkeletonCard';
import { FiSearch, FiArrowDown, FiRefreshCw } from 'react-icons/fi';

// Mood filters removed for a cleaner look

// ─── Scroll Position Persistence ─────────────────────────────────────────────
const SCROLL_KEY = 'zenmanga_browse_scroll';
const saveScroll = () => sessionStorage.setItem(SCROLL_KEY, String(window.scrollY));
const loadScroll = () => Number(sessionStorage.getItem(SCROLL_KEY) || 0);

// ─── Build URL params from filter object ─────────────────────────────────────
const buildParams = ({ q, type, status, genres, order_by, sort }) => {
    const p = {};
    if (q)        p.q        = q;
    if (type)     p.type     = type;
    if (status)   p.status   = status;
    if (genres)   p.genres   = String(genres);
    if (order_by) p.order_by = order_by;
    if (sort)     p.sort     = sort;
    return p;
};

const Browse = () => {
    const queryClient  = useQueryClient();
    const [searchParams, setSearchParams] = useSearchParams();
    const navigationType = useNavigationType();

    // ── URL is the single source of truth for filters ─────────────────────────
    const q        = searchParams.get('q')        || '';
    const type     = searchParams.get('type')     || '';
    const status   = searchParams.get('status')   || '';
    const order_by = searchParams.get('order_by') || 'members';
    const sort     = searchParams.get('sort')     || 'desc';
    const rawGenres= searchParams.get('genres')   || '';
    const genres   = rawGenres && !isNaN(rawGenres) ? Number(rawGenres) : rawGenres;

    const filters = { q, type, status, genres: String(genres), order_by, sort };

    // ── Local state only for the search input (for instant typing response) ────
    const [searchTerm, setSearchTerm] = useState(q);
    const debouncedSearch = useDebounce(searchTerm, 700);

    // Sync debounced input → URL
    useEffect(() => {
        if (debouncedSearch === q) return;
        setSearchParams(buildParams({ ...filters, q: debouncedSearch }), { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch]);

    // Sync URL q → local input (e.g. when navigated with ?q=... externally)
    useEffect(() => {
        setSearchTerm(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [q]);

    // Allow FilterBar to update multiple filter keys at once
    const handleSetFilters = (updater, clearAll = false) => {
        if (clearAll) {
            setSearchParams(buildParams(updater), { replace: true });
            return;
        }
        const next = typeof updater === 'function' ? updater(filters) : { ...filters, ...updater };
        setSearchParams(buildParams(next), { replace: true });
    };

    // ── Clear stale null data on mount, then force a fresh fetch ──────────────
    useEffect(() => {
        // Remove any cached manga data that might be null/stale from previous session
        queryClient.removeQueries({ queryKey: ['manga'], exact: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── React Query ────────────────────────────────────────────────────────────
    const {
        data,
        isLoading,
        isFetching,
        isError,
        error,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
        refetch,
    } = useInfiniteQuery({
        queryKey: ['manga', filters],
        queryFn: ({ pageParam }) => fetchMangaPage({ pageParam, filters }),
        initialPageParam: 1,
        getNextPageParam: (lastPage) =>
            lastPage?.pagination?.has_next_page
                ? lastPage.pagination.current_page + 1
                : undefined,
        staleTime: 30 * 1000,   // 30s — fresh enough, not forever
        retry: 2,
        retryDelay: (attempt) => 3000 * attempt,
    });

    const mangas    = data?.pages?.flatMap(page => page?.data ?? []) ?? [];
    const isInitial = isLoading || (isFetching && !data);

    // ── Scroll persistence ─────────────────────────────────────────────────────
    useLayoutEffect(() => {
        if (navigationType === 'POP') {
            const savedY = loadScroll();
            if (savedY > 0) requestAnimationFrame(() => window.scrollTo({ top: savedY, behavior: 'instant' }));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const timer = { id: null };
        const onScroll = () => { clearTimeout(timer.id); timer.id = setTimeout(saveScroll, 150); };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => { window.removeEventListener('scroll', onScroll); clearTimeout(timer.id); };
    }, []);

    return (
        <PageTransition>
            <div className="container mx-auto px-4 py-8">
                <SEO title="Browse Manga" description="Search and filter through thousands of manga titles." />
                <div className="flex flex-col mb-8 mt-2">
                    <h1 className="text-4xl lg:text-5xl font-black mb-2 text-white drop-shadow-xl tracking-tight">Browse Manga</h1>
                    <p className="text-slate-400 text-lg">Search, filter, and discover your next obsession.</p>
                </div>

                {/* Unified Command Center (Search & Filters) */}
                <FilterBar 
                    filters={filters} 
                    setFilters={handleSetFilters}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                />

                {/* Loading / fetching indicator */}
                {isFetching && !isFetchingNextPage && (
                    <div className="flex items-center gap-2 text-xs text-cyan-400 mb-4 animate-pulse">
                        <FiRefreshCw className="animate-spin" size={12} />
                        <span>Loading manga...</span>
                    </div>
                )}

                {/* Manga Grid */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
                    }}
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
                >
                    {isInitial ? (
                        Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)
                    ) : (
                        mangas.map((manga, index) => (
                            <MangaCard key={`${manga.mal_id}-${index}`} manga={manga} />
                        ))
                    )}
                </motion.div>

                {/* Load More Skeleton */}
                {isFetchingNextPage && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6">
                        {Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={`lm-${i}`} />)}
                    </div>
                )}

                {/* Error State */}
                {isError && (
                    <div className="text-center py-20">
                        <div className="text-5xl mb-4">⚠️</div>
                        <p className="text-slate-300 text-lg font-semibold mb-2">Gagal memuat manga</p>
                        <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">
                            {error?.response?.status === 429
                                ? 'Jikan API rate-limited (429). Tunggu beberapa detik lalu coba lagi.'
                                : error?.message || 'Terjadi kesalahan saat memuat data.'}
                        </p>
                        <button
                            onClick={() => refetch()}
                            className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-2.5 px-8 rounded-full transition-all hover:scale-105"
                        >
                            Coba Lagi
                        </button>
                    </div>
                )}

                {/* Empty State */}
                {!isInitial && !isError && mangas.length === 0 && (
                    <div className="text-center py-20 text-slate-500">
                        <p className="text-xl mb-4">No manga found.</p>
                        <button
                            onClick={() => refetch()}
                            className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center gap-1 mx-auto"
                        >
                            <FiRefreshCw /> Try again
                        </button>
                    </div>
                )}

                {/* Load More Button */}
                {!isInitial && !isError && hasNextPage && mangas.length > 0 && (
                    <div className="flex justify-center mt-12 mb-8">
                        <button
                            onClick={() => fetchNextPage()}
                            disabled={isFetchingNextPage}
                            className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-[#0B0C15] font-bold py-3 px-8 rounded-full flex items-center gap-2 transition-transform hover:scale-105 shadow-lg shadow-cyan-500/20"
                        >
                            <FiArrowDown /> Load More
                        </button>
                    </div>
                )}
            </div>
        </PageTransition>
    );
};

export default Browse;
