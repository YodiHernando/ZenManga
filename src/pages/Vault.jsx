import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiTrash2, FiBookOpen, FiPlus, FiMinus, FiCheck } from 'react-icons/fi';
import { Tilt } from 'react-tilt';
import SEO from '../components/Layout/SEO';
import PageTransition from '../components/Layout/PageTransition';

const Vault = () => {
    const [vault, setVault] = useState([]);

    useEffect(() => {
        const storedVault = JSON.parse(localStorage.getItem('zenManga_vault') || '[]');
        setVault(storedVault);
    }, []);

    const updateProgress = (id, delta) => {
        const newVault = vault.map(manga => {
            if (manga.mal_id === id) {
                const newProgress = Math.max(0, (manga.read_chapters || 0) + delta);
                return { ...manga, read_chapters: newProgress };
            }
            return manga;
        });
        setVault(newVault);
        localStorage.setItem('zenManga_vault', JSON.stringify(newVault));
    };

    const removeFromVault = (id) => {
        const newVault = vault.filter(manga => manga.mal_id !== id);
        setVault(newVault);
        localStorage.setItem('zenManga_vault', JSON.stringify(newVault));
    };

    const updateStatus = (id, newStatus) => {
        const newVault = vault.map(manga => {
            if (manga.mal_id === id) {
                return { ...manga, status: newStatus };
            }
            return manga;
        });
        setVault(newVault);
        localStorage.setItem('zenManga_vault', JSON.stringify(newVault));
    };

    const defaultTiltOptions = {
        reverse: false, max: 10, perspective: 1000, scale: 1.02, speed: 1000, transition: true, axis: null, reset: true, easing: "cubic-bezier(.03,.98,.52,.99)"
    };

    return (
        <PageTransition>
            <div className="container mx-auto px-4 py-8">
                <SEO title="My Vault" description="Manage your reading progress and bookmarks." />
                <h1 className="text-4xl font-bold mb-2 text-gradient inline-block">My Reading Vault</h1>
                <p className="text-slate-400 mb-8">Track your manga progress and collection.</p>

                {vault.length === 0 ? (
                    <div className="text-center py-24 glass rounded-3xl border border-white/5">
                        <FiBookOpen className="mx-auto text-6xl text-slate-600 mb-4" />
                        <h2 className="text-2xl font-bold text-slate-300 mb-2">Your vault is empty</h2>
                        <p className="text-slate-500 mb-8">Start exploring and bookmark manga to track them here.</p>
                        <Link to="/browse" className="px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold rounded-full transition-all shadow-lg shadow-cyan-500/20">
                            Browse Manga
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {vault.map(manga => (
                            <Tilt key={manga.mal_id} options={defaultTiltOptions} className="glass p-4 rounded-xl border border-white/5 flex gap-4 group relative overflow-hidden">
                                {/* Image */}
                                <Link to={`/manga/${manga.mal_id}`} className="w-24 h-36 flex-shrink-0 rounded-lg overflow-hidden shadow-lg">
                                    <img src={manga.image} alt={manga.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                </Link>

                                {/* Content */}
                                <div className="flex-1 flex flex-col justify-between z-10">
                                    <div>
                                        <Link to={`/manga/${manga.mal_id}`}>
                                            <h3 className="font-bold text-lg leading-tight mb-1 group-hover:text-cyan-400 transition-colors line-clamp-2">{manga.title}</h3>
                                        </Link>
                                        <select
                                            value={manga.status}
                                            onChange={(e) => updateStatus(manga.mal_id, e.target.value)}
                                            className="text-xs bg-slate-900/50 border border-white/10 rounded px-2 py-1 text-slate-400 focus:outline-none focus:border-cyan-500"
                                        >
                                            <option value="Plan to Read">Plan to Read</option>
                                            <option value="Reading">Reading</option>
                                            <option value="Completed">Completed</option>
                                            <option value="On Hold">On Hold</option>
                                            <option value="Dropped">Dropped</option>
                                        </select>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center justify-end gap-2 mt-4">
                                        <button
                                            onClick={() => removeFromVault(manga.mal_id)}
                                            className="px-3 py-1.5 text-xs text-red-400 hover:text-white hover:bg-red-500/20 rounded-lg transition-all border border-red-500/10 flex items-center gap-2"
                                        >
                                            <FiTrash2 /> Remove
                                        </button>
                                    </div>
                                </div>

                                {/* Decorative bg gradient */}
                                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-500/10 transition-colors" />
                            </Tilt>
                        ))}
                    </div>
                )}
            </div>
        </PageTransition>
    );
};

export default Vault;
