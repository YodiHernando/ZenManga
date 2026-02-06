import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import useMangaFetch from '../hooks/useMangaFetch';
import MangaCard from '../components/Manga/MangaCard';
import FilterBar from '../components/Manga/FilterBar';
import SEO from '../components/Layout/SEO';
import PageTransition from '../components/Layout/PageTransition';
import { FiSearch, FiLoader, FiArrowDown } from 'react-icons/fi';
import SkeletonCard from '../components/UI/SkeletonCard';

const Browse = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialQuery = searchParams.get('q') || '';

    const [filters, setFilters] = useState({
        q: initialQuery,
        type: '',
        status: '',
        genres: ''
    });

    const [page, setPage] = useState(1);
    const { data: mangas, loading, pagination, fetchManga, setData } = useMangaFetch();

    // Data Fetching (Debounced)
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchManga('/manga', {
                q: filters.q,
                type: filters.type,
                status: filters.status,
                page: 1,
                limit: 20
            });
            setPage(1);
        }, 500);

        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters.q, filters.type, filters.status, filters.genres]);

    // Handle Load More
    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchManga('/manga', {
            q: filters.q,
            type: filters.type,
            status: filters.status,
            genres: filters.genres,
            page: nextPage,
            limit: 20
        }, true); // append = true
    };

    // Update URL params
    useEffect(() => {
        const params = {};
        if (filters.q) params.q = filters.q;
        setSearchParams(params);
    }, [filters.q, setSearchParams]);

    return (
        <PageTransition>
            <div className="container mx-auto px-4 py-8">
                <SEO title="Browse Manga" description="Search and filter through thousands of manga titles." />
                <h1 className="text-4xl font-bold mb-8 text-gradient inline-block">Browse Manga</h1>

                {/* Search & Filters */}
                <div className="mb-8 relative">
                    <input
                        type="text"
                        placeholder="Search for a manga..."
                        className="w-full bg-[#0B0C15] glass-card border border-white/10 rounded-xl px-6 py-4 pl-14 text-lg focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all text-white placeholder-slate-500"
                        value={filters.q}
                        onChange={(e) => setFilters(prev => ({ ...prev, q: e.target.value }))}
                    />
                    <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
                </div>

                <FilterBar filters={filters} setFilters={setFilters} />

                {/* Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {/* Show Skeletons if loading AND it's a new fetch (page 1) */}
                    {loading && page === 1 ? (
                        Array.from({ length: 10 }).map((_, index) => (
                            <SkeletonCard key={`skeleton-${index}`} />
                        ))
                    ) : (
                        mangas?.map((manga, index) => (
                            <MangaCard key={`${manga.mal_id}-${index}`} manga={manga} />
                        ))
                    )}
                </div>

                {/* Loading State for "Load More" */}
                {loading && page > 1 && (
                    <div className="flex justify-center py-10 w-full col-span-full">
                        <FiLoader className="text-4xl text-cyan-400 animate-spin" />
                    </div>
                )}

                {/* Empty State */}
                {!loading && mangas?.length === 0 && (
                    <div className="text-center py-20 text-slate-500">
                        <p className="text-xl">No manga found matching your criteria.</p>
                    </div>
                )}

                {/* Load More Button */}
                {!loading && pagination?.has_next_page && mangas?.length > 0 && (
                    <div className="flex justify-center mt-12 mb-8">
                        <button
                            onClick={handleLoadMore}
                            className="bg-cyan-500 hover:bg-cyan-400 text-[#0B0C15] font-bold py-3 px-8 rounded-full flex items-center gap-2 transition-transform hover:scale-105 shadow-lg shadow-cyan-500/20"
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
