/**
 * useReadingHistory
 * Auto-saves manga to "Recently Viewed" history in localStorage.
 * Max 20 entries, newest first.
 */

const HISTORY_KEY = 'zenmanga_history';
const MAX_HISTORY = 20;

export const saveToHistory = (manga) => {
    if (!manga?.mal_id) return;
    try {
        const history = getHistory();
        // Remove duplicate if exists
        const filtered = history.filter(item => item.mal_id !== manga.mal_id);
        // Add to front
        const updated = [
            {
                mal_id: manga.mal_id,
                title: manga.title,
                image: manga.images?.jpg?.large_image_url || manga.images?.jpg?.image_url,
                score: manga.score,
                type: manga.type,
                status: manga.status,
                genres: manga.genres?.slice(0, 2) || [],
                viewedAt: Date.now(),
            },
            ...filtered,
        ].slice(0, MAX_HISTORY);

        localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    } catch {
        // localStorage might be full or unavailable — silently ignore
    }
};

export const getHistory = () => {
    try {
        return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    } catch {
        return [];
    }
};

export const clearHistory = () => {
    localStorage.removeItem(HISTORY_KEY);
};
