/**
 * Central API query functions — dipakai oleh React Query di seluruh app.
 * Semua fetch logic dikumpulkan di sini supaya mudah dikelola.
 */
import api from './api';

// ─── Browse / Manga List ───────────────────────────────────────────────────────

export const fetchMangaPage = async ({ pageParam = 1, filters = {} }) => {
    const cleanParams = Object.fromEntries(
        Object.entries({ ...filters, page: pageParam, limit: 20 })
            .filter(([_, v]) => v != null && v !== '')
    );
    const res = await api.get('/manga', { params: cleanParams });
    return res.data; // { data: [], pagination: {} }
};

// ─── Home ─────────────────────────────────────────────────────────────────────

export const fetchTopManga = async () => {
    const res = await api.get('/top/manga', { params: { limit: 10 } });
    return res.data.data;
};

export const fetchPopularManga = async () => {
    const res = await api.get('/top/manga', { params: { filter: 'bypopularity', limit: 10 } });
    return res.data.data;
};

export const fetchFavoriteManga = async () => {
    const res = await api.get('/top/manga', { params: { filter: 'favorite', limit: 10 } });
    return res.data.data;
};

// ─── Manga Detail ─────────────────────────────────────────────────────────────

export const fetchMangaDetail = async (id) => {
    const res = await api.get(`/manga/${id}`);
    return res.data.data;
};

export const fetchMangaCharacters = async (id) => {
    const res = await api.get(`/manga/${id}/characters`);
    return res.data.data;
};

export const fetchMangaRecommendations = async (id) => {
    const res = await api.get(`/manga/${id}/recommendations`);
    return res.data.data;
};

// ─── Genres ───────────────────────────────────────────────────────────────────

export const fetchMangaGenres = async () => {
    const res = await api.get('/genres/manga', { params: { filter: 'genres' } });
    return res.data.data.sort((a, b) => a.name.localeCompare(b.name));
};
