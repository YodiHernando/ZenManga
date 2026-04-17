import axios from 'axios';

const api = axios.create({
    baseURL: 'https://api.jikan.moe/v4',
    timeout: 15000,
    headers: { 'Content-Type': 'application/json' },
});

// ── Request Throttler yang TAHAN BANTING TERHADAP HMR (Vite) ──────────
// Simpan queue di global window object agar tidak tereset/orphaned 
// saat Vite me-reload file ini secara hot (HMR).
const MIN_INTERVAL_MS = 350; // Jikan API: max 3 req/sec

const throttle = () => {
    // Inisialisasi global state jika belum ada
    window.__jikanLastReq = window.__jikanLastReq || 0;
    window.__jikanQueue = window.__jikanQueue || Promise.resolve();

    // Tambahkan request baru ke dalam queue global
    window.__jikanQueue = window.__jikanQueue
        .catch(() => {}) // Recovery jika queue sebelumnya fail
        .then(() => new Promise(resolve => {
            const wait = MIN_INTERVAL_MS - (Date.now() - window.__jikanLastReq);
            if (wait > 0) {
                setTimeout(() => {
                    window.__jikanLastReq = Date.now();
                    resolve();
                }, wait);
            } else {
                window.__jikanLastReq = Date.now();
                resolve();
            }
        }));

    return window.__jikanQueue;
};

// Pasang interceptor
api.interceptors.request.use(async config => {
    await throttle();
    return config;
}, error => Promise.reject(error));

api.isCancel = axios.isCancel;

export default api;
