import React, { useState } from 'react';

const FallbackPlaceholder = () => (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 gap-2">
        {/* Manga book icon */}
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8 text-slate-600"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
        >
            <path strokeLinecap="round" strokeLinejoin="round"
                d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.966 8.966 0 00-6 2.292m0-14.25v14.25" />
        </svg>
        <span className="text-[10px] text-slate-600 font-medium tracking-wide">No Image</span>
    </div>
);

const OptimizedImage = ({ src, alt, className, placeholder, webpSrc }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [currentSrc, setCurrentSrc] = useState(src);

    const handleError = () => {
        // Try webp fallback before giving up
        if (webpSrc && currentSrc !== webpSrc) {
            setCurrentSrc(webpSrc);
        } else {
            setHasError(true);
            setIsLoaded(true);
        }
    };

    return (
        <div className="relative overflow-hidden w-full h-full bg-slate-900">
            {/* Blur-up placeholder while loading */}
            {placeholder && !hasError && !isLoaded && (
                <img
                    src={placeholder}
                    alt=""
                    aria-hidden="true"
                    className={`${className} absolute inset-0 w-full h-full object-cover blur-lg scale-110 opacity-60`}
                />
            )}

            {/* Skeleton pulse if no placeholder */}
            {!placeholder && !isLoaded && !hasError && (
                <div className="absolute inset-0 bg-slate-800/60 animate-pulse" />
            )}

            {/* Real image */}
            {!hasError && (
                <img
                    key={currentSrc}
                    src={currentSrc}
                    alt={alt}
                    loading="lazy"
                    onLoad={() => setIsLoaded(true)}
                    onError={handleError}
                    className={`${className} absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                />
            )}

            {/* Error fallback — prettier placeholder */}
            {hasError && <FallbackPlaceholder />}
        </div>
    );
};

export default OptimizedImage;
