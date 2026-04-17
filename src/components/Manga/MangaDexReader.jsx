import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiExternalLink, FiBook, FiAlertCircle } from 'react-icons/fi';

const MangaDexReader = ({ title }) => {
    const [chapters, setChapters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mdMangaId, setMdMangaId] = useState(null);

    useEffect(() => {
        const fetchMangaDex = async () => {
            setLoading(true);
            setError(null);
            try {
                // 1. Search Manga by Title
                const searchRes = await axios.get(`https://api.mangadex.org/manga`, {
                    params: {
                        title: title,
                        limit: 1,
                        'order[relevance]': 'desc'
                    }
                });

                if (searchRes.data.data.length === 0) {
                    setError('Manga not found on MangaDex.');
                    setLoading(false);
                    return;
                }

                const mangaId = searchRes.data.data[0].id;
                setMdMangaId(mangaId);

                // 2. Fetch Chapters (English)
                const feedRes = await axios.get(`https://api.mangadex.org/manga/${mangaId}/feed`, {
                    params: {
                        'translatedLanguage[]': 'en',
                        'order[chapter]': 'desc',
                        limit: 30
                    }
                });

                setChapters(feedRes.data.data);
            } catch (err) {
                console.error("MangaDex fetch error", err);
                setError('Failed to fetch chapters.');
            } finally {
                setLoading(false);
            }
        };

        if (title) {
            // Add a small delay so we don't spam MangaDex immediately on page load
            const timer = setTimeout(() => fetchMangaDex(), 1000);
            return () => clearTimeout(timer);
        }
    }, [title]);

    if (loading) return (
        <div className="mt-8">
            <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                <FiBook className="text-cyan-400 animate-pulse" />
                <div className="h-5 w-48 bg-slate-800 rounded-md animate-pulse" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-[58px] rounded-lg bg-slate-800/40 border border-white/5 relative overflow-hidden">
                        {/* Shimmer sweep effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full animate-shimmer" />
                        <div className="p-3">
                            <div className="h-4 w-20 bg-slate-700/50 rounded mb-2" />
                            <div className="h-2 w-32 bg-slate-700/30 rounded" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
    
    if (error) return (
        <div className="bg-slate-800/30 border border-red-500/10 p-4 rounded-xl flex items-center gap-3 text-slate-400 mt-8">
            <FiAlertCircle className="text-red-400 text-xl" />
            <p>{error}</p>
        </div>
    );

    return (
        <div className="glass p-6 rounded-xl border border-white/5 mt-8">
            <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center gap-2">
                    <FiBook className="text-cyan-400" /> Read on MangaDex
                </h3>
                {mdMangaId && (
                    <a href={`https://mangadex.org/title/${mdMangaId}`} target="_blank" rel="noopener noreferrer" className="text-xs font-bold uppercase tracking-wide bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500 hover:text-slate-900 px-3 py-1.5 rounded-full flex items-center gap-1 transition-all">
                        View Full Manga <FiExternalLink />
                    </a>
                )}
            </div>
            
            {chapters.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto custom-scrollbar pr-2">
                    {chapters.map(chapter => (
                        <a 
                            key={chapter.id}
                            href={`https://mangadex.org/chapter/${chapter.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-slate-900/50 hover:bg-cyan-500/10 border border-slate-700/50 hover:border-cyan-500/50 p-3 rounded-lg flex justify-between items-center group transition-all"
                        >
                            <div className="overflow-hidden pr-4">
                                <div className="font-bold text-slate-200 group-hover:text-cyan-400 transition-colors">
                                    Chapter {chapter.attributes.chapter || '?'}
                                </div>
                                {chapter.attributes.title && (
                                    <div className="text-xs text-slate-500 truncate mt-1">
                                        {chapter.attributes.title}
                                    </div>
                                )}
                            </div>
                            <FiExternalLink className="text-slate-600 group-hover:text-cyan-400 shrink-0" />
                        </a>
                    ))}
                </div>
            ) : (
                <p className="text-slate-500 italic">No English chapters found for this manga on MangaDex.</p>
            )}
        </div>
    );
};

export default MangaDexReader;
