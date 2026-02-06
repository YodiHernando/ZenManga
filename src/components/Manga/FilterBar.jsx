import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const FilterBar = ({ filters, setFilters }) => {
    const types = ['All', 'Manga', 'Manhwa', 'Manhua', 'Novel', 'One-shot'];
    const statuses = ['All', 'Publishing', 'Complete', 'Hiatus', 'Discontinued'];
    const [genres, setGenres] = useState([]);
    const [loadingGenres, setLoadingGenres] = useState(true);

    const fallbackGenres = [
        { mal_id: 1, name: 'Action' },
        { mal_id: 2, name: 'Adventure' },
        { mal_id: 4, name: 'Comedy' },
        { mal_id: 8, name: 'Drama' },
        { mal_id: 10, name: 'Fantasy' },
        { mal_id: 14, name: 'Horror' },
        { mal_id: 7, name: 'Mystery' },
        { mal_id: 22, name: 'Romance' },
        { mal_id: 24, name: 'Sci-Fi' },
        { mal_id: 36, name: 'Slice of Life' },
        { mal_id: 30, name: 'Sports' },
        { mal_id: 37, name: 'Supernatural' }
    ];

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                // Fetch standard genres
                const response = await api.get('/genres/manga?filter=genres');
                // Sort alphabetically
                const sortedGenres = response.data.data.sort((a, b) => a.name.localeCompare(b.name));
                setGenres(sortedGenres);
            } catch (error) {
                console.warn("Failed to fetch genres, using fallback:", error);
                setGenres(fallbackGenres);
            } finally {
                setLoadingGenres(false);
            }
        };

        fetchGenres();
    }, []);

    const handleFilterChange = (key, value) => {
        let finalValue = value;
        if (value === 'All') finalValue = '';
        else if (key === 'type' && value === 'One-shot') finalValue = 'oneshot';
        else if (key === 'genres') finalValue = value; // Keep ID as is (number or string)
        else if (typeof value === 'string') finalValue = value.toLowerCase();

        setFilters(prev => ({ ...prev, [key]: finalValue }));
    };

    return (
        <div className="flex flex-col md:flex-row gap-4 mb-8 glass p-4 rounded-xl border border-white/5">
            {/* Type Filter */}
            <div className="flex-1">
                <label className="block text-slate-400 text-xs mb-1 uppercase tracking-wider">Type</label>
                <div className="flex flex-wrap gap-2">
                    {types.map(type => (
                        <button
                            key={type}
                            onClick={() => handleFilterChange('type', type)}
                            className={`px-3 py-1 text-xs rounded-full border transition-all ${(filters.type === type.toLowerCase() || (filters.type === '' && type === 'All'))
                                ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                                : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'
                                }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {/* Genres Filter */}
            <div className="flex-1">
                <label className="block text-slate-400 text-xs mb-1 uppercase tracking-wider">Genres</label>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto custom-scrollbar">
                    {loadingGenres ? (
                        <div className="text-xs text-slate-500 animate-pulse">Loading genres...</div>
                    ) : (
                        genres.map(genre => (
                            <button
                                key={genre.mal_id}
                                onClick={() => handleFilterChange('genres', filters.genres === genre.mal_id ? '' : genre.mal_id)}
                                className={`px-3 py-1 text-xs rounded-full border transition-all ${(filters.genres === genre.mal_id)
                                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'
                                    }`}
                            >
                                {genre.name}
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Status Filter */}
            <div className="flex-1">
                <label className="block text-slate-400 text-xs mb-1 uppercase tracking-wider">Status</label>
                <div className="flex flex-wrap gap-2">
                    {statuses.map(status => (
                        <button
                            key={status}
                            onClick={() => handleFilterChange('status', status)}
                            className={`px-3 py-1 text-xs rounded-full border transition-all ${(filters.status === status.toLowerCase() || (filters.status === '' && status === 'All'))
                                ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                                : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Reset Button */}
            <div className="flex items-end">
                <button
                    onClick={() => setFilters({ type: '', status: '', q: '', genres: '' })}
                    className="text-xs text-red-400 hover:text-red-300 underline"
                >
                    Reset Filters
                </button>
            </div>
        </div>
    );
};

export default FilterBar;
