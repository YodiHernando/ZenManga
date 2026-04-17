import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['ZenManga.jpg', 'favicon.ico'],
            manifest: {
                name: 'ZenManga',
                short_name: 'ZenManga',
                description: 'Discover, browse, and track your manga collection.',
                theme_color: '#0B0C15',
                background_color: '#0B0C15',
                display: 'standalone',
                orientation: 'portrait',
                start_url: '/',
                icons: [
                    {
                        src: '/ZenManga.jpg',
                        sizes: '192x192',
                        type: 'image/jpeg',
                    },
                    {
                        src: '/ZenManga.jpg',
                        sizes: '512x512',
                        type: 'image/jpeg',
                    },
                    {
                        src: '/ZenManga.jpg',
                        sizes: '512x512',
                        type: 'image/jpeg',
                        purpose: 'maskable',
                    },
                ],
            },
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,jpg,png,svg,woff2}'],
                runtimeCaching: [
                    {
                        // Cache Jikan API responses
                        urlPattern: /^https:\/\/api\.jikan\.moe\/.*/i,
                        handler: 'NetworkFirst',
                        options: {
                            cacheName: 'jikan-api-cache',
                            expiration: {
                                maxEntries: 100,
                                maxAgeSeconds: 60 * 60, // 1 hour
                            },
                        },
                    },
                    {
                        // Cache manga cover images
                        urlPattern: /^https:\/\/cdn\.myanimelist\.net\/.*/i,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'manga-images-cache',
                            expiration: {
                                maxEntries: 200,
                                maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
                            },
                        },
                    },
                ],
            },
        }),
    ],
});
