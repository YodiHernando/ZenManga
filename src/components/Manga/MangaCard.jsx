import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Bookmark, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import OptimizedImage from '../UI/OptimizedImage';
import { useToast } from '../UI/Toast';
import { useVault } from '../../hooks/useVault';

const MangaCard = ({ manga }) => {
    const { toggleVault, isInVault } = useVault();
    const inVault = isInVault(manga.mal_id);

    const handleVaultToggle = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleVault({
            mal_id: manga.mal_id,
            title: manga.title,
            images: manga.images,
            chapters: manga.chapters,
        });
    };

    // Determine status color
    const getStatusColor = (status) => {
        if (!status) return 'bg-slate-500/50 text-slate-200';
        if (status === 'Publishing') return 'bg-green-500/20 text-green-400 border-green-500/30';
        if (status === 'Finished') return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    };

    // Animation variants for staggered entrance
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    };

    return (
        <motion.div
            variants={cardVariants}
            className="relative group rounded-xl overflow-hidden bg-[#1a1c29] border border-white/5 shadow-lg h-full"
            whileHover={{ scale: 1.03, rotateY: 3, rotateX: -2 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={{ transformPerspective: 1000 }}
        >
            <Link
                to={`/manga/${manga.mal_id}`}
                className="block h-full"
            >
                {/* Image Container - Adjusted to 2:3 Aspect Ratio for better Manga fit */}
                <div className="relative aspect-[2/3] overflow-hidden">
                    <OptimizedImage
                        src={manga.images?.jpg?.large_image_url || manga.images?.jpg?.image_url}
                        placeholder={manga.images?.jpg?.small_image_url}
                        webpSrc={manga.images?.webp?.large_image_url || manga.images?.webp?.image_url}
                        alt={manga.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Score Badge */}
                    {manga.score && (
                        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-bold text-yellow-400 border border-yellow-500/20 z-10">
                            <Star className="w-3 h-3 fill-yellow-400" />
                            {manga.score}
                        </div>
                    )}

                    {/* Gradient Overlay for Text Readability */}
                    <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#0B0C15] via-[#0B0C15]/80 to-transparent opacity-90 transition-opacity duration-300 pointer-events-none" />
                </div>

                {/* Info Section - Pushed to bottom */}
                <div className="absolute bottom-0 left-0 w-full p-4 pointer-events-none">
                    <h3 className="text-white font-bold truncate text-lg leading-tight group-hover:text-cyan-400 transition-colors">
                        {manga.title}
                    </h3>

                    {/* Genre badges — max 2 */}
                    {manga.genres?.length > 0 && (
                        <div className="flex gap-1 mt-1.5 flex-wrap">
                            {manga.genres.slice(0, 2).map(g => (
                                <span key={g.mal_id} className="text-[9px] px-1.5 py-0.5 rounded bg-black/50 backdrop-blur-sm text-slate-300 border border-white/10 font-medium">
                                    {g.name}
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="flex justify-between items-center mt-2">
                        <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">
                            {manga.type || 'Manga'}
                        </span>

                        {manga.status && manga.status !== 'Unknown' && (
                            <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${getStatusColor(manga.status)}`}>
                                {manga.status}
                            </span>
                        )}
                    </div>
                </div>
            </Link>

            {/* Vault Button - Discrete Floating Action */}
            <button
                className={`absolute top-2 right-2 p-2 rounded-full backdrop-blur-md border transition-all duration-300 z-20 hover:scale-110 ${
                    inVault 
                    ? 'bg-cyan-500/80 text-white border-cyan-400/50 shadow-[0_0_10px_rgba(6,182,212,0.5)] opacity-100' 
                    : 'bg-black/50 text-white border-white/10 opacity-0 group-hover:opacity-100 hover:bg-cyan-500/80'
                }`}
                title={inVault ? "Remove from Vault" : "Add to Vault"}
                onClick={handleVaultToggle}
            >
                {inVault ? <Check className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
            </button>
        </motion.div>
    );
};

export default MangaCard;
