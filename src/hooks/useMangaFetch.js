import { useState, useCallback, useRef, useEffect } from 'react';
import api from '../utils/api';

const useMangaFetch = (initialData = [], initialPagination = null) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(initialData);
    const [pagination, setPagination] = useState(initialPagination);
    const abortControllerRef = useRef(null);

    const fetchManga = useCallback(async (endpoint, params = {}, append = false) => {
        // Cancel previous request if exists
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();

        setLoading(true);
        setError(null);

        try {
            // Filter out empty params to avoid sending empty query strings (e.g. type=)
            const cleanParams = Object.fromEntries(
                Object.entries(params).filter(([_, v]) => v != null && v !== '')
            );

            const response = await api.get(endpoint, {
                params: cleanParams,
                signal: abortControllerRef.current.signal
            });

            setData(prev => append ? [...prev, ...response.data.data] : response.data.data);
            setPagination(response.data.pagination);
            return response.data;
        } catch (err) {
            if (api.isCancel(err)) return; // Ignore cancelled requests
            setError(err.response?.data?.message || err.message || 'An error occurred');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    return { loading, error, data, pagination, fetchManga, setData, setPagination };
};

export default useMangaFetch;
