import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Button = ({ children, variant = 'primary', className, ...props }) => {
    const baseStyles = 'px-6 py-2.5 rounded-full font-bold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-cyan-500 hover:bg-cyan-400 text-slate-900 shadow-lg shadow-cyan-500/20',
        secondary: 'bg-slate-700 hover:bg-slate-600 text-white',
        glass: 'glass hover:bg-white/20 text-white',
        danger: 'bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30',
        outline: 'border border-cyan-500 text-cyan-400 hover:bg-cyan-500/10'
    };

    return (
        <button
            className={twMerge(baseStyles, variants[variant], className)}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
