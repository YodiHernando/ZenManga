import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Bookmark } from 'lucide-react';
import { Tilt } from 'react-tilt';

const MangaCard = ({ manga }) => {
    // Determine status color
    const getStatusColor = (status) => {
        if (!status) return 'bg-slate-500/50 text-slate-200';
        if (status === 'Publishing') return 'bg-green-500/20 text-green-400 border-green-500/30';
        if (status === 'Finished') return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    };

    const defaultOptions = {
        reverse: false,
        max: 10,
        perspective: 1000,
        scale: 1.02,
        speed: 1000,
        transition: true,
        axis: null,
        reset: true,
        easing: "cubic-bezier(.03,.98,.52,.99)",
    };

    return (
        <Tilt options={defaultOptions} className="relative group rounded-xl overflow-hidden bg-[#1a1c29] border border-white/5 shadow-lg h-full">
            <Link
                to={`/manga/${manga.mal_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full"
            >
                {/* Image Container - Adjusted to 2:3 Aspect Ratio for better Manga fit */}
                <div className="relative aspect-[2/3] overflow-hidden">
                    <img
                        src={manga.images.jpg.large_image_url || manga.images.jpg.image_url}
                        alt={manga.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
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
                className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-cyan-500 text-white rounded-full backdrop-blur-md border border-white/10 transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110 z-20"
                title="Add to Vault"
                onClick={(e) => {
                    e.preventDefault(); // Prevent opening the link
                    e.stopPropagation();
                    console.log('Add to vault:', manga.mal_id);
                }}
            >
                <Bookmark className="w-5 h-5" />
            </button>
        </Tilt>
    );
};

export default MangaCard;
