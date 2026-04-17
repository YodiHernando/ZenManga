import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Autoplay, Pagination, Navigation } from 'swiper/modules';
import { Link } from 'react-router-dom';
import { FiStar, FiInfo, FiPlay, FiChevronRight, FiChevronLeft } from 'react-icons/fi';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const HeroSlider = ({ trending }) => {
    // Filter manga yang punya gambar valid saja
    const topMangas = trending
        ?.filter(m => m?.images?.jpg?.large_image_url || m?.images?.webp?.large_image_url)
        ?.slice(0, 5) || [];

    if (!trending || trending.length === 0) return (
        <section className="relative w-full min-h-[85vh] flex items-center bg-[#0B0C15] overflow-hidden pt-20">
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-12 animate-pulse">
                {/* Poster Skeleton */}
                <div className="w-[280px] md:w-[350px] lg:w-[400px] aspect-[3/4.2] bg-slate-800/40 rounded-[2rem] flex-shrink-0" />
                {/* Content Skeleton */}
                <div className="flex-1 space-y-6">
                    <div className="h-8 w-32 bg-slate-800/40 rounded-full" />
                    <div className="h-16 md:h-24 w-3/4 bg-slate-800/40 rounded-2xl" />
                    <div className="h-20 w-full bg-slate-800/40 rounded-xl" />
                    <div className="flex gap-4">
                        <div className="h-14 w-40 bg-slate-800/40 rounded-2xl" />
                        <div className="h-14 w-40 bg-slate-800/40 rounded-2xl" />
                    </div>
                </div>
            </div>
        </section>
    );

    return (
        <section className="relative w-full min-h-[85vh] flex items-start bg-[#0B0C15] overflow-hidden pt-16 md:pt-20">

            {/* Abstract Background Elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px]" />
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03]" /> {/* Optional Texture */}
            </div>

            <div className="container mx-auto px-4 relative z-10 h-full">
                <Swiper
                    modules={[EffectFade, Autoplay, Pagination, Navigation]}
                    effect="fade"
                    fadeEffect={{ crossFade: true }}
                    speed={700}
                    loop={true}
                    autoplay={{
                        delay: 6000,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true
                    }}
                    pagination={{
                        clickable: true,
                        renderBullet: function (index, className) {
                            return '<span class="' + className + ' !w-3 !h-3 !bg-slate-600 !opacity-50 hover:!opacity-100 transition-all"></span>';
                        }
                    }}
                    navigation={{
                        nextEl: '.swiper-button-next-custom',
                        prevEl: '.swiper-button-prev-custom',
                    }}
                    className="w-full py-4"
                >
                    {topMangas.map((manga, index) => (
                        <SwiperSlide key={manga.mal_id} className="w-full">
                            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 lg:gap-24 py-8">

                                {/* 1. The Poster (Left Side) */}
                                <div className="relative w-[280px] md:w-[350px] lg:w-[400px] flex-shrink-0 group perspective-1000">
                                    <div className="relative rounded-[2rem] overflow-hidden shadow-[0_0_50px_-12px_rgba(6,182,212,0.25)] border-2 border-white/5 bg-slate-900 aspect-[3/4.2] transform transition-transform duration-700 hover:rotate-y-6 hover:scale-105">
                                        <img
                                            src={manga.images?.jpg?.large_image_url || manga.images?.webp?.large_image_url}
                                            alt={manga.title}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                // Fallback ke webp lalu ke image_url biasa
                                                const webp = manga.images?.webp?.large_image_url;
                                                const fallback = manga.images?.jpg?.image_url;
                                                if (e.target.src !== webp && webp) {
                                                    e.target.src = webp;
                                                } else if (e.target.src !== fallback && fallback) {
                                                    e.target.src = fallback;
                                                }
                                            }}
                                        />
                                        {/* Shine Effect */}
                                        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                                    </div>

                                    {/* Back Glow */}
                                    <div className="absolute inset-0 -z-10 bg-cyan-500/20 blur-3xl transform scale-90 translate-y-10 rounded-full" />
                                </div>

                                {/* 2. The Details (Right Side) */}
                                <div className="flex-1 max-w-2xl text-center md:text-left z-20">
                                    <div className="space-y-6">
                                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 animate-fade-in-up">
                                            <span className="px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                                                #{index + 1} Highest Rated
                                            </span>
                                            <span className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-bold">
                                                <FiStar className="fill-yellow-400" /> {manga.score}
                                            </span>
                                            <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-bold">
                                                {manga.type}
                                            </span>
                                        </div>

                                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] tracking-tight drop-shadow-2xl">
                                            {manga.title}
                                        </h1>

                                        <p className="text-slate-400 text-lg leading-relaxed line-clamp-3 md:line-clamp-4 max-w-xl mx-auto md:mx-0">
                                            {manga.synopsis}
                                        </p>

                                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-4">
                                            <Link
                                                to={`/manga/${manga.mal_id}?tab=read`}
                                                className="px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-[#0B0C15] font-bold text-lg rounded-2xl transition-all hover:scale-105 hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.4)] flex items-center gap-2"
                                            >
                                                <FiPlay className="fill-current" /> Read Now
                                            </Link>
                                            <Link
                                                to={`/manga/${manga.mal_id}`}
                                                className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-lg rounded-2xl transition-all hover:scale-105 flex items-center gap-2"
                                            >
                                                <FiInfo /> Details
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Custom Navigation Buttons */}
                <div className="absolute bottom-12 right-8 z-30 flex gap-2">
                    <button className="swiper-button-prev-custom p-4 rounded-full bg-white/5 hover:bg-cyan-500 hover:text-[#0B0C15] border border-white/10 text-white transition-all">
                        <FiChevronLeft size={24} />
                    </button>
                    <button className="swiper-button-next-custom p-4 rounded-full bg-white/5 hover:bg-cyan-500 hover:text-[#0B0C15] border border-white/10 text-white transition-all">
                        <FiChevronRight size={24} />
                    </button>
                </div>
            </div>

            {/* Bottom gradient fade — transisi mulus ke section bawah */}
            <div className="absolute bottom-0 left-0 right-0 h-40 z-20 bg-gradient-to-t from-[#0B0C15] via-[#0B0C15]/60 to-transparent pointer-events-none" />

            <style>{`
                .swiper-button-next-custom.swiper-button-disabled,
                .swiper-button-prev-custom.swiper-button-disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                .perspective-1000 {
                    perspective: 1000px;
                }
                .rotate-y-6 {
                    transform: rotateY(15deg) rotateX(5deg);
                }
            `}</style>
        </section>
    );
};

export default HeroSlider;
