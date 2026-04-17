import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getHistory, clearHistory } from '../../utils/readingHistory';
import { FiClock, FiTrash2 } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

const RecentlyViewed = () => {
    const [history, setHistory] = useState(getHistory);

    if (history.length === 0) return null;

    const handleClear = () => {
        clearHistory();
        setHistory([]);
    };

    return (
        <div className="overflow-hidden">
            <div className="container mx-auto px-4 pb-8">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
                        <FiClock className="text-cyan-400" />
                        Recently Viewed
                    </h2>
                    <button
                        onClick={handleClear}
                        className="flex items-center gap-1 text-xs text-slate-500 hover:text-red-400 transition-colors uppercase tracking-widest font-bold"
                    >
                        <FiTrash2 className="w-3 h-3" /> Clear
                    </button>
                </div>

                <div className="relative">
                    {/* Gradient boundaries — cards fade at these edges */}
                    <div className="absolute left-0 top-0 bottom-0 w-10 z-20 bg-gradient-to-r from-[#0B0C15] to-transparent pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-10 z-20 bg-gradient-to-l from-[#0B0C15] to-transparent pointer-events-none" />

                    <Swiper
                        spaceBetween={14}
                        slidesPerView={3.2}
                        breakpoints={{
                            480: { slidesPerView: 4.2 },
                            640: { slidesPerView: 5.2 },
                            768: { slidesPerView: 7.2 },
                            1024: { slidesPerView: 9.2 },
                        }}
                    >
                    {history.map((item, i) => (
                        <SwiperSlide key={item.mal_id}>
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="w-full"
                            >
                                <Link to={`/manga/${item.mal_id}`} className="block group">
                                    <div className="relative rounded-xl overflow-hidden aspect-[3/4] shadow-lg mb-2 border border-white/5">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            loading="lazy"
                                        />
                                        {/* Score badge */}
                                        {item.score && (
                                            <div className="absolute top-1.5 left-1.5 bg-black/70 backdrop-blur-sm text-yellow-400 text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                                                ★ {item.score}
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-[11px] text-slate-300 font-bold truncate group-hover:text-cyan-400 transition-colors">
                                        {item.title}
                                    </p>
                                </Link>
                            </motion.div>
                        </SwiperSlide>
                    ))}
                </Swiper>
                </div>
            </div>
        </div>
    );
};

export default RecentlyViewed;
