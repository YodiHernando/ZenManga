import axios from 'axios';

const api = axios.create({
    baseURL: 'https://api.jikan.moe/v4',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Simple request interceptor to log requests (optional)
api.interceptors.request.use((config) => {
    console.log(`[API] ${config.method.toUpperCase()} ${config.url}`);
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response interceptor for error handling
api.interceptors.response.use((response) => {
    return response;
}, (error) => {
    if (error.response && error.response.status === 429) {
        console.warn('[API] Rate limit exceeded. Please wait a moment.');
        // TODO: Implement retry logic or global notification
    }
    return Promise.reject(error);
});

api.isCancel = axios.isCancel;

export default api;
