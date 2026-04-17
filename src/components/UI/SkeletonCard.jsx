import React from 'react';

const SkeletonCard = () => {
    return (
        <div className="rounded-xl overflow-hidden bg-[#1a1c29] border border-white/5 shadow-lg h-full animate-pulse">
            {/* Image Placeholder — matches aspect ratio of real cover */}
            <div className="relative aspect-[2/3] bg-slate-800/60">
                {/* Shimmer sweep */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
                {/* Fake score badge */}
                <div className="absolute top-2 left-2 h-5 w-10 rounded-md bg-slate-700/60" />
            </div>

            {/* Info Placeholder */}
            <div className="p-3 space-y-2">
                {/* Title */}
                <div className="h-3.5 bg-slate-800/60 rounded w-4/5" />
                {/* Genre badges */}
                <div className="flex gap-1.5">
                    <div className="h-3 bg-slate-800/60 rounded-full w-12" />
                    <div className="h-3 bg-slate-800/60 rounded-full w-14" />
                </div>
                {/* Type + Status row */}
                <div className="flex justify-between items-center pt-1">
                    <div className="h-2.5 bg-slate-800/60 rounded w-10" />
                    <div className="h-2.5 bg-slate-800/60 rounded-full w-14" />
                </div>
            </div>
        </div>
    );
};

export default SkeletonCard;
