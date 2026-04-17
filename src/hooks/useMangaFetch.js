import { useState, useCallback, useRef } from 'react';
import api from '../utils/api';

// ─── Cache Helpers ────────────────────────────────────────────────────────────
// In-memory cache (fast, lives for the app session)
const memoryCache = new Map();

const SESSION_CACHE_PREFIX = 'zenmanga_cache_';
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

/** Write to both memory and sessionStorage */
const writeCache = (key, value) => {
    const entry = { value, ts: Date.now() };
    memoryCache.set(key, entry);
    try {
        sessionStorage.setItem(SESSION_CACHE_PREFIX + key, JSON.stringify(entry));
    } catch (_) { /* sessionStorage full or unavailable — fail silently */ }
};

/** Read from memory first, then sessionStorage. Returns null if stale/missing. */
const readCache = (key) => {
    // 1. Memory hit (fastest)
    if (memoryCache.has(key)) {
        const { value, ts } = memoryCache.get(key);
        if (Date.now() - ts < CACHE_TTL_MS) return value;
        memoryCache.delete(key);
    }
    // 2. sessionStorage hit (survives page refresh within the same tab)
    try {
        const raw = sessionStorage.getItem(SESSION_CACHE_PREFIX + key);
        if (raw) {
            const { value, ts } = JSON.parse(raw);
            if (Date.now() - ts < CACHE_TTL_MS) {
                // Warm memory cache
                memoryCache.set(key, { value, ts });
                return value;
            }
            sessionStorage.removeItem(SESSION_CACHE_PREFIX + key);
        }
    } catch (_) { /* parse error — ignore */ }
    return null;
};
// ─────────────────────────────────────────────────────────────────────────────

const useMangaFetch = (initialData = [], initialPagination = null) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(initialData);
    const [pagination, setPagination] = useState(initialPagination);
    const abortControllerRef = useRef(null);

    const fetchManga = useCallback(async (endpoint, params = {}, append = false) => {
        // Cancel previous request if still in flight
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();

        setLoading(true);
        setError(null);

        try {
            // Strip empty/null params so Jikan doesn't get stray ?type=&status=
            const cleanParams = Object.fromEntries(
                Object.entries(params).filter(([_, v]) => v != null && v !== '')
            );

            const cacheKey = `${endpoint}?${new URLSearchParams(cleanParams).toString()}`;

            // ── Cache read (skip for "load more" appends) ──────────────────
            if (!append) {
                const cached = readCache(cacheKey);
                if (cached) {
                    setData(cached.data);
                    setPagination(cached.pagination);
                    setLoading(false);
                    return cached;
                }
            }

            const response = await api.get(endpoint, {
                params: cleanParams,
                signal: abortControllerRef.current.signal,
            });

            const responseData = response.data.data;
            const responsePagination = response.data.pagination;

            // ── Cache write ────────────────────────────────────────────────
            if (!append) {
                writeCache(cacheKey, { data: responseData, pagination: responsePagination });
            }

            setData(prev => append ? [...prev, ...responseData] : responseData);
            setPagination(responsePagination);
            return response.data;

        } catch (err) {
            if (api.isCancel(err)) return; // Silently ignore cancelled requests
            setError(err.response?.data?.message || err.message || 'An error occurred');
            console.error('[useMangaFetch]', err);
        } finally {
            setLoading(false);
        }
    }, []);

    return { loading, error, data, pagination, fetchManga, setData, setPagination };
};

export default useMangaFetch;
