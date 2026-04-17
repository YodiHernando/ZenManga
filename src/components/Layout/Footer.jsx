import React from 'react';
import { FiGithub, FiTwitter, FiInstagram, FiHeart } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="relative bg-[#0B0C15] pt-20 pb-10 border-t border-white/5 overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="container mx-auto px-4 z-10 relative">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <Link to="/" className="text-2xl font-bold mb-4 inline-block tracking-tight">
                            <span className="text-white">Zen</span>
                            <span className="text-cyan-500">Manga</span>
                        </Link>
                        <p className="text-slate-400 leading-relaxed max-w-sm">
                            Your minimalist, futuristic gateway to the world of manga.
                            Built for speed, aesthetics, and the ultimate reading tracking experience.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-bold text-white mb-6">Explore</h4>
                        <ul className="space-y-4 text-slate-400">
                            <li><Link to="/" className="hover:text-cyan-400 transition-colors">Trending Now</Link></li>
                            <li><Link to="/browse" className="hover:text-cyan-400 transition-colors">Browse All</Link></li>
                            <li><Link to="/vault" className="hover:text-cyan-400 transition-colors">My Vault</Link></li>
                        </ul>
                    </div>

                    {/* Socials */}
                    <div>
                        <h4 className="font-bold text-white mb-6">Connect</h4>
                        <div className="flex gap-4">
                            <a href="#" className="p-3 glass rounded-full hover:bg-white/10 transition-all text-slate-300 hover:text-cyan-400">
                                <FiGithub size={20} />
                            </a>
                            <a href="#" className="p-3 glass rounded-full hover:bg-white/10 transition-all text-slate-300 hover:text-cyan-400">
                                <FiTwitter size={20} />
                            </a>
                            <a href="#" className="p-3 glass rounded-full hover:bg-white/10 transition-all text-slate-300 hover:text-cyan-400">
                                <FiInstagram size={20} />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 text-center text-slate-500 text-sm flex flex-col md:flex-row justify-between items-center gap-4">
                    <p>&copy; {new Date().getFullYear()} <span className="font-bold tracking-tight"><span className="text-white">Zen</span><span className="text-cyan-500">Manga</span></span>. All rights reserved.</p>
                    <div className="flex items-center gap-2 bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
                        <span>Made by <span className="text-cyan-400 font-bold hover:text-cyan-300 transition-colors cursor-default">Antigravity</span></span>
                        <span className="text-slate-700">|</span>
                        <span>Data by Jikan API</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
