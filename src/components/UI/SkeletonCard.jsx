import React from 'react';

const SkeletonCard = () => {
    return (
        <div className="rounded-xl overflow-hidden bg-[#1a1c29] border border-white/5 shadow-lg h-full animate-pulse">
            {/* Image Placeholder */}
            <div className="relative aspect-[2/3] bg-slate-800/50">
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent shimmer" />
            </div>

            {/* Info Placeholder */}
            <div className="p-4 space-y-3">
                {/* Title */}
                <div className="h-4 bg-slate-800/50 rounded w-3/4" />
                {/* Meta */}
                <div className="flex justify-between items-center pt-2">
                    <div className="h-3 bg-slate-800/50 rounded w-16" />
                    <div className="h-3 bg-slate-800/50 rounded w-12" />
                </div>
            </div>
        </div>
    );
};

export default SkeletonCard;
