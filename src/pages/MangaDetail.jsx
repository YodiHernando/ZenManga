import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiStar, FiUsers, FiBookOpen, FiClock, FiCheck, FiBookmark, FiArrowLeft } from 'react-icons/fi';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Pagination } from 'swiper/modules';
import api from '../utils/api';
import MangaCard from '../components/Manga/MangaCard';
import SEO from '../components/Layout/SEO';
import PageTransition from '../components/Layout/PageTransition';
import 'swiper/css';
import 'swiper/css/free-mode';

const MangaDetail = () => {
    const { id } = useParams();
    const [manga, setManga] = useState(null);
    const [characters, setCharacters] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isInVault, setIsInVault] = useState(false);

    // Initial Vault Check
    useEffect(() => {
        const vault = JSON.parse(localStorage.getItem('zenManga_vault') || '[]');
        setIsInVault(vault.some(item => item.mal_id === parseInt(id)));
    }, [id]);

    const toggleVault = () => {
        const vault = JSON.parse(localStorage.getItem('zenManga_vault') || '[]');
        if (isInVault) {
            const newVault = vault.filter(item => item.mal_id !== parseInt(id));
            localStorage.setItem('zenManga_vault', JSON.stringify(newVault));
            setIsInVault(false);
        } else {
            if (manga) {
                vault.push({
                    mal_id: manga.mal_id,
                    title: manga.title,
                    image: manga.images.jpg.image_url,
                    total_chapters: manga.chapters,
                    read_chapters: 0,
                    status: 'Plan to Read'
                });
                localStorage.setItem('zenManga_vault', JSON.stringify(vault));
                setIsInVault(true);
            }
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setManga(null);
            try {
                // Fetch Details
                const detailRes = await api.get(`/manga/${id}`);
                setManga(detailRes.data.data);

                // Chain requests to avoid rate limits
                setTimeout(async () => {
                    try {
                        const charRes = await api.get(`/manga/${id}/characters`);
                        setCharacters(charRes.data.data);
                    } catch (e) { console.error("Char fetch failed", e); }
                }, 1000);

                setTimeout(async () => {
                    try {
                        const recRes = await api.get(`/manga/${id}/recommendations`);
                        setRecommendations(recRes.data.data);
                    } catch (e) { console.error("Rec fetch failed", e); }
                }, 2000);

            } catch (error) {
                console.error("Failed to fetch manga details", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchData();
        window.scrollTo(0, 0);
    }, [id]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-400"></div>
        </div>
    );

    if (!manga) return <div className="text-center py-20">Manga not found.</div>;

    return (
        <PageTransition>
            <div className="min-h-screen relative">
                <SEO title={manga.title} description={manga.synopsis?.slice(0, 150)} />
                {/* Backdrop Banner */}
                <div className="absolute top-0 left-0 w-full h-[500px] overflow-hidden -z-10">
                    <img src={manga.images.jpg.large_image_url} alt="" className="w-full h-full object-cover blur-3xl opacity-30" />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-slate-900/80 to-slate-900" />
                </div>

                <div className="container mx-auto px-4 py-8">
                    <Link to="/browse" className="inline-flex items-center gap-2 text-slate-400 hover:text-cyan-400 mb-6 transition-colors">
                        <FiArrowLeft /> Back to Browse
                    </Link>

                    {/* Header Info */}
                    <div className="flex flex-col md:flex-row gap-8 mb-12">
                        {/* Cover Image */}
                        <div className="w-full md:w-80 flex-shrink-0 mx-auto">
                            <div className="rounded-xl overflow-hidden shadow-2xl shadow-cyan-500/10 glass border-none p-2 rotate-1 hover:rotate-0 transition-transform duration-500">
                                <img src={manga.images.jpg.large_image_url} alt={manga.title} className="w-full rounded-lg" />
                            </div>
                            <button
                                onClick={toggleVault}
                                className={`w-full mt-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${isInVault
                                    ? 'bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30'
                                    : 'bg-cyan-500 text-slate-900 hover:bg-cyan-400 shadow-lg shadow-cyan-500/20'
                                    }`}
                            >
                                {isInVault ? <><FiCheck /> In Vault</> : <><FiBookmark /> Add to Vault</>}
                            </button>
                        </div>

                        {/* Details */}
                        <div className="flex-1">
                            <div className="flex flex-wrap gap-2 mb-4">
                                {manga.genres.map(g => (
                                    <span key={g.mal_id} className="text-xs px-2 py-1 rounded-md bg-slate-800 text-slate-300 border border-white/5">{g.name}</span>
                                ))}
                            </div>

                            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 leading-tight">
                                {manga.title}
                            </h1>
                            <h2 className="text-xl text-slate-500 mb-6">{manga.title_japanese}</h2>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                <div className="glass p-4 rounded-xl text-center">
                                    <FiStar className="mx-auto mb-1 text-yellow-400 text-xl" />
                                    <div className="text-2xl font-bold">{manga.score || 'N/A'}</div>
                                    <div className="text-xs text-slate-400">Score</div>
                                </div>
                                <div className="glass p-4 rounded-xl text-center">
                                    <FiUsers className="mx-auto mb-1 text-blue-400 text-xl" />
                                    <div className="text-2xl font-bold">#{manga.popularity}</div>
                                    <div className="text-xs text-slate-400">Popularity</div>
                                </div>
                                <div className="glass p-4 rounded-xl text-center">
                                    <FiBookOpen className="mx-auto mb-1 text-green-400 text-xl" />
                                    <div className="text-2xl font-bold">{manga.chapters || (manga.status === 'Publishing' ? <span className="text-lg">Ongoing</span> : '?')}</div>
                                    <div className="text-xs text-slate-400">Chapters</div>
                                </div>
                                <div className="glass p-4 rounded-xl text-center">
                                    <FiClock className="mx-auto mb-1 text-purple-400 text-xl" />
                                    <div className="text-sm font-bold mt-1.5">{manga.status}</div>
                                    <div className="text-xs text-slate-400 mt-1">Status</div>
                                </div>
                            </div>

                            <div className="glass p-6 rounded-xl">
                                <h3 className="text-lg font-bold mb-3 text-cyan-400">Synopsis</h3>
                                <p className="text-slate-300 leading-relaxed text-sm md:text-base scrollbar-thin max-h-60 overflow-y-auto pr-2">
                                    {manga.synopsis || 'No synopsis available.'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Characters Carousel */}
                    <div className="mb-12">
                        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <span className="w-1 h-8 bg-cyan-500 rounded-full block" /> Characters
                        </h3>
                        {characters.length > 0 ? (
                            <Swiper
                                slidesOffsetBefore={0}
                                spaceBetween={15}
                                slidesPerView={'auto'}
                                freeMode={true}
                                modules={[FreeMode]}
                                className="w-full"
                            >
                                {characters.map(char => (
                                    <SwiperSlide key={char.character.mal_id} className="!w-32 md:!w-40">
                                        <div className="rounded-xl overflow-hidden relative aspect-[3/4] group">
                                            <img src={char.character.images.jpg.image_url} alt={char.character.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent flex items-end p-2">
                                                <p className="text-white text-xs font-bold truncate w-full">{char.character.name}</p>
                                            </div>
                                        </div>
                                        <p className="text-slate-500 text-[10px] mt-1 truncate">{char.role}</p>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        ) : (
                            <p className="text-slate-600 italic">No characters found.</p>
                        )}
                    </div>

                    {/* Recommendations */}
                    <div>
                        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <span className="w-1 h-8 bg-purple-500 rounded-full block" /> You Might Also Like
                        </h3>
                        {recommendations.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                {recommendations.slice(0, 10).map(rec => (
                                    <MangaCard key={rec.entry.mal_id} manga={{ ...rec.entry, score: null }} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-slate-600 italic">No recommendations found.</p>
                        )}
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default MangaDetail;
