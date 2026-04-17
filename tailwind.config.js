/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                zen: {
                    900: '#0F172A', // Dark background
                    800: '#1E293B', // Card background
                    400: '#38BDF8', // Cyan accent
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            keyframes: {
                shimmer: {
                    '100%': { transform: 'translateX(100%)' },
                }
            },
            animation: {
                shimmer: 'shimmer 1.5s infinite',
            }
        },
    },
    plugins: [],
}
