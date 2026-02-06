import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Badge = ({ children, variant = 'default', className }) => {
    const variants = {
        default: 'bg-slate-800 text-slate-300 border border-white/5',
        success: 'bg-green-500/10 text-green-400 border border-green-500/30',
        warning: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30',
        info: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
    };

    return (
        <span className={twMerge("text-xs px-2 py-1 rounded-md", variants[variant], className)}>
            {children}
        </span>
    );
};

export default Badge;
