import React, { useEffect } from 'react';
import useMangaFetch from '../hooks/useMangaFetch';
import HeroSlider from '../components/Hero/HeroSlider';
import MangaCard from '../components/Manga/MangaCard';
import SEO from '../components/Layout/SEO';
import PageTransition from '../components/Layout/PageTransition';

const Home = () => {
    const { data: trending, loading, fetchManga } = useMangaFetch();

    useEffect(() => {
        fetchManga('/top/manga', { filter: 'bypopularity', limit: 10 });
    }, [fetchManga]);

    return (
        <PageTransition>
            <div className="min-h-screen">
                <SEO title="Home" description="Discover trending manga and track your collection on ZenManga." />
                {/* Hero Section */}
                <HeroSlider trending={trending} />

                {/* Content Sections */}
                <div id="trending-section" className="container mx-auto px-4 py-12">
                    <h2 className="text-3xl font-bold mb-8 text-gradient inline-block">Top Rated</h2>

                    {/* Placeholder Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {loading ? (
                            [...Array(10)].map((_, i) => (
                                <div key={i} className="aspect-[3/4] rounded-xl bg-slate-800 animate-pulse glass border-none" />
                            ))
                        ) : (
                            trending?.map(manga => (
                                <MangaCard key={manga.mal_id} manga={manga} />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default Home;
