import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchMangaGenres } from '../../utils/queryFunctions';
import { FiSearch, FiFilter, FiX, FiChevronDown } from 'react-icons/fi';

const fallbackGenres = [];
const types = [{ id: '', label: 'All Types' }, { id: 'manga', label: 'Manga' }, { id: 'manhwa', label: 'Manhwa' }, { id: 'manhua', label: 'Manhua' }, { id: 'novel', label: 'Novel' }, { id: 'oneshot', label: 'One-shot' }];
const statuses = [{ id: '', label: 'All Status' }, { id: 'publishing', label: 'Publishing' }, { id: 'complete', label: 'Complete' }, { id: 'hiatus', label: 'Hiatus' }, { id: 'discontinued', label: 'Discontinued' }, { id: 'upcoming', label: 'Upcoming' }];
const orderBys = [
    { id: 'members-desc', label: 'Most Popular' },
    { id: 'score-desc', label: 'Highest Rated' },
    { id: 'favorites-desc', label: 'Most Favorited' },
    { id: 'start_date-desc', label: 'Newest' },
    { id: 'start_date-asc', label: 'Oldest' }
];

const FilterBar = ({ filters, setFilters, searchTerm, setSearchTerm }) => {
    const { data: genres = fallbackGenres } = useQuery({
        queryKey: ['manga-genres'],
        queryFn: fetchMangaGenres,
        staleTime: 60 * 60 * 1000,
        placeholderData: fallbackGenres,
    });

    const handleFilter = (key, value) => {
        if (key === 'sortCombo') {
            if (!value) {
                setFilters({ order_by: '', sort: '' });
                return;
            }
            const [order_by, sort] = value.split('-');
            setFilters({ order_by, sort });
            return;
        }
        setFilters({ [key]: value });
    };

    const clearAll = () => {
        setSearchTerm('');
        setFilters({ type: '', status: '', genres: '', order_by: 'members', sort: 'desc' }, true);
    };

    const hasActiveFilters = filters.type || filters.status || filters.genres || filters.order_by;

    // Helper to get genre name
    const activeGenreName = genres.find(g => String(g.mal_id) === String(filters.genres))?.name;

    return (
        <div className="w-full max-w-5xl mx-auto mb-10">
            {/* Command Center Panel */}
            <div className="bg-[#12131C]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-2 xl:p-3 shadow-2xl flex flex-col xl:flex-row gap-2 xl:gap-3 items-center relative z-20">
                
                {/* Search Bar - Takes most space */}
                <div className="relative w-full xl:flex-1 h-12 flex items-center bg-white/5 rounded-xl border border-white/5 focus-within:border-cyan-500/50 focus-within:bg-white/10 transition-all group shrink-0 xl:shrink min-w-[200px]">
                    <FiSearch className="absolute left-4 text-slate-400 group-focus-within:text-cyan-400 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search for manga, manhwa, authors..."
                        className="w-full h-full bg-transparent border-none text-white placeholder-slate-500 pl-11 pr-4 focus:outline-none focus:ring-0 text-[15px]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button onClick={() => setSearchTerm('')} className="absolute right-4 text-slate-500 hover:text-white">
                            <FiX size={16} />
                        </button>
                    )}
                </div>

                {/* Filters Row */}
                <div className="flex w-full xl:w-auto gap-2 xl:gap-3 overflow-x-auto custom-scrollbar pb-1 xl:pb-0">
                    
                    {/* Type Select */}
                    <div className="relative group min-w-[120px] h-12 shrink-0">
                        <select 
                            value={filters.type || ''} 
                            onChange={(e) => handleFilter('type', e.target.value)}
                            className="w-full h-full appearance-none bg-white/5 border border-white/5 hover:bg-white/10 rounded-xl px-4 pr-10 text-[14px] text-slate-300 focus:outline-none focus:border-cyan-500/50 cursor-pointer transition-all"
                        >
                            {types.map(t => <option key={t.id} value={t.id} className="bg-[#0B0C15]">{t.label}</option>)}
                        </select>
                        <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                    </div>

                    {/* Status Select */}
                    <div className="relative group min-w-[130px] h-12 shrink-0">
                        <select 
                            value={filters.status || ''} 
                            onChange={(e) => handleFilter('status', e.target.value)}
                            className="w-full h-full appearance-none bg-white/5 border border-white/5 hover:bg-white/10 rounded-xl px-4 pr-10 text-[14px] text-slate-300 focus:outline-none focus:border-cyan-500/50 cursor-pointer transition-all"
                        >
                            {statuses.map(s => <option key={s.id} value={s.id} className="bg-[#0B0C15]">{s.label}</option>)}
                        </select>
                        <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                    </div>

                    {/* Genre Select */}
                    <div className="relative group min-w-[140px] h-12 shrink-0">
                        <select 
                            value={filters.genres || ''} 
                            onChange={(e) => handleFilter('genres', e.target.value)}
                            className="w-full h-full appearance-none bg-white/5 border border-white/5 hover:bg-white/10 rounded-xl px-4 pr-10 text-[14px] text-slate-300 focus:outline-none focus:border-cyan-500/50 cursor-pointer transition-all"
                        >
                            <option value="" className="bg-[#0B0C15]">All Genres</option>
                            {genres.map(g => <option key={g.mal_id} value={g.mal_id} className="bg-[#0B0C15]">{g.name}</option>)}
                        </select>
                        <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                    </div>

                    {/* Sort Select */}
                    <div className="relative group min-w-[150px] h-12 shrink-0">
                        <select 
                            value={filters.order_by ? `${filters.order_by}-${filters.sort}` : 'members-desc'} 
                            onChange={(e) => handleFilter('sortCombo', e.target.value)}
                            className="w-full h-full appearance-none bg-cyan-500/10 border border-cyan-500/20 hover:bg-cyan-500/20 rounded-xl px-4 pr-10 text-[14px] text-cyan-400 font-medium focus:outline-none focus:border-cyan-500 cursor-pointer transition-all"
                        >
                            {orderBys.map(s => <option key={s.id} value={s.id} className="bg-[#0B0C15] text-slate-300">{s.label}</option>)}
                        </select>
                        <FiFilter className="absolute right-4 top-1/2 -translate-y-1/2 text-cyan-400 pointer-events-none" size={14} />
                    </div>

                </div>
            </div>

            {/* Active Filters / Chips */}
            {hasActiveFilters && (
                <div className="flex flex-wrap items-center gap-2 mt-4 px-2">
                    <span className="text-xs text-slate-500 font-medium uppercase tracking-wider mr-2">Active:</span>

                    {filters.type && (
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-slate-300">
                            <span className="capitalize">{filters.type}</span>
                            <button onClick={() => handleFilter('type', '')} className="hover:text-white"><FiX size={12}/></button>
                        </div>
                    )}
                    
                    {filters.status && (
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-slate-300">
                            <span className="capitalize">{filters.status}</span>
                            <button onClick={() => handleFilter('status', '')} className="hover:text-white"><FiX size={12}/></button>
                        </div>
                    )}

                    {filters.genres && activeGenreName && (
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-lg text-xs text-cyan-300">
                            <span>{activeGenreName}</span>
                            <button onClick={() => handleFilter('genres', '')} className="hover:text-cyan-100"><FiX size={12}/></button>
                        </div>
                    )}

                    <button 
                        onClick={clearAll}
                        className="ml-auto text-xs text-slate-400 hover:text-white underline decoration-slate-600 hover:decoration-white transition-all"
                    >
                        Clear All
                    </button>
                </div>
            )}
        </div>
    );
};

export default FilterBar;
