import React from 'react';
import { FiSearch } from 'react-icons/fi';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Input = ({ icon: Icon, className, containerClassName, ...props }) => {
    return (
        <div className={twMerge("relative w-full", containerClassName)}>
            <input
                className={twMerge(
                    "w-full bg-slate-800/50 glass border border-white/10 rounded-xl px-6 py-3 pl-12 text-base focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all text-white placeholder-slate-500",
                    className
                )}
                {...props}
            />
            {(Icon || FiSearch) && (
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                    {Icon ? <Icon /> : <FiSearch />}
                </div>
            )}
        </div>
    );
};

export default Input;
