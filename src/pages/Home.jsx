import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { fetchTopManga, fetchPopularManga, fetchFavoriteManga } from '../utils/queryFunctions';
import HeroSlider from '../components/Hero/HeroSlider';
import MangaCard from '../components/Manga/MangaCard';
import RecentlyViewed from '../components/Manga/RecentlyViewed';
import SkeletonCard from '../components/UI/SkeletonCard';
import SEO from '../components/Layout/SEO';
import PageTransition from '../components/Layout/PageTransition';

import { FiArrowRight, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';

const MangaSection = ({ title, data = [], isLoading, browsePath, id }) => (
    <div className="overflow-hidden">
        <div className="container mx-auto px-4 pt-6 pb-10">
            {/* Section Header */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-1 h-7 rounded-full bg-gradient-to-b from-cyan-400 to-blue-500" />
                    <h2 className="text-2xl font-bold text-white tracking-tight">{title}</h2>
                </div>
                <Link
                    to={browsePath}
                    className="group flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-cyan-400 transition-all uppercase tracking-widest"
                >
                    See All <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            {/* Swiper with nav buttons */}
            <div className="relative group/section">
                {/* Edge fade — purely cosmetic, sits above the already-clipped Swiper */}
                <div className="absolute left-0 inset-y-0 w-8 z-10 bg-gradient-to-r from-[#0B0C15] to-transparent pointer-events-none" />
                <div className="absolute right-0 inset-y-0 w-8 z-10 bg-gradient-to-l from-[#0B0C15] to-transparent pointer-events-none" />

                <Swiper
                    modules={[Navigation]}
                    navigation={{
                        nextEl: `.swiper-next-${id}`,
                        prevEl: `.swiper-prev-${id}`,
                    }}
                    spaceBetween={16}
                    slidesPerView={2.4}
                    breakpoints={{
                        480: { slidesPerView: 2.8 },
                        640: { slidesPerView: 3.4 },
                        768: { slidesPerView: 4.4 },
                        1024: { slidesPerView: 5.3 },
                    }}
                >
                    {isLoading ? (
                        [...Array(8)].map((_, i) => (
                            <SwiperSlide key={i}>
                                <SkeletonCard />
                            </SwiperSlide>
                        ))
                    ) : (
                        data.map(manga => (
                            <SwiperSlide key={manga.mal_id}>
                                <MangaCard manga={manga} />
                            </SwiperSlide>
                        ))
                    )}
                </Swiper>

                {/* Nav Buttons */}
                <button className={`swiper-prev-${id} absolute -left-1 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-slate-900/95 border border-white/10 text-white opacity-0 group-hover/section:opacity-100 transition-all duration-200 hidden md:flex items-center justify-center hover:bg-cyan-500 hover:text-slate-900 hover:border-cyan-500 shadow-2xl`}>
                    <FiChevronLeft size={18} />
                </button>
                <button className={`swiper-next-${id} absolute -right-1 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-slate-900/95 border border-white/10 text-white opacity-0 group-hover/section:opacity-100 transition-all duration-200 hidden md:flex items-center justify-center hover:bg-cyan-500 hover:text-slate-900 hover:border-cyan-500 shadow-2xl`}>
                    <FiChevronRight size={18} />
                </button>
            </div>
        </div>
    </div>
);

const Home = () => {
    const { data: topRated = [], isLoading: topLoading } = useQuery({
        queryKey: ['top-rated'],
        queryFn: fetchTopManga,
        staleTime: 10 * 60 * 1000,
    });

    const { data: popular = [], isLoading: popLoading } = useQuery({
        queryKey: ['popular-manga'],
        queryFn: fetchPopularManga,
        staleTime: 10 * 60 * 1000,
    });

    const { data: favorite = [], isLoading: favLoading } = useQuery({
        queryKey: ['favorite-manga'],
        queryFn: fetchFavoriteManga,
        staleTime: 10 * 60 * 1000,
    });

    return (
        <PageTransition>
            <div className="min-h-screen">
                <SEO title="Home" description="Discover trending manga and track your collection on ZenManga." />

                {/* Hero Section — key memaksa Swiper re-init saat data tiba */}
                <HeroSlider
                    key={`hero-${topRated.length}`}
                    trending={topRated}
                />

                {/* Recently Viewed */}
                <div className="pt-4">
                    <RecentlyViewed />
                </div>

                <div className="container mx-auto px-4">
                    <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-2" />
                </div>

                {/* Highest Rated */}
                <MangaSection
                    id="top-rated"
                    title="Highest Rated"
                    data={topRated}
                    isLoading={topLoading}
                    browsePath="/browse?order_by=score&sort=desc"
                />

                {/* Trending Now */}
                <MangaSection
                    id="trending"
                    title="Trending Now"
                    data={popular}
                    isLoading={popLoading}
                    browsePath="/browse?order_by=popularity&sort=asc"
                />

                {/* Community Choice */}
                <MangaSection
                    id="community-choice"
                    title="Community Choice"
                    data={favorite}
                    isLoading={favLoading}
                    browsePath="/browse?order_by=favorites&sort=desc"
                />

                <div className="pb-16" />
            </div>
        </PageTransition>
    );
};

export default Home;
