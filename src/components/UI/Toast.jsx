import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiX, FiInfo, FiAlertTriangle } from 'react-icons/fi';

const ToastContext = createContext(null);

const ICONS = {
    success: <FiCheck className="w-4 h-4" />,
    error:   <FiX className="w-4 h-4" />,
    info:    <FiInfo className="w-4 h-4" />,
    warning: <FiAlertTriangle className="w-4 h-4" />,
};

const COLORS = {
    success: 'bg-green-500/20 border-green-500/40 text-green-300',
    error:   'bg-red-500/20 border-red-500/40 text-red-300',
    info:    'bg-cyan-500/20 border-cyan-500/40 text-cyan-300',
    warning: 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300',
};

const ICON_BG = {
    success: 'bg-green-500/30 text-green-400',
    error:   'bg-red-500/30 text-red-400',
    info:    'bg-cyan-500/30 text-cyan-400',
    warning: 'bg-yellow-500/30 text-yellow-400',
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const toast = useCallback((message, type = 'success', duration = 3000) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, duration);
    }, []);

    const dismiss = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={toast}>
            {children}
            {/* Toast Container */}
            <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
                <AnimatePresence>
                    {toasts.map(t => (
                        <motion.div
                            key={t.id}
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.9 }}
                            transition={{ type: 'spring', bounce: 0.3, duration: 0.4 }}
                            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl shadow-2xl min-w-[240px] max-w-xs ${COLORS[t.type]}`}
                        >
                            <span className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${ICON_BG[t.type]}`}>
                                {ICONS[t.type]}
                            </span>
                            <span className="text-sm font-medium flex-1">{t.message}</span>
                            <button
                                onClick={() => dismiss(t.id)}
                                className="text-current opacity-50 hover:opacity-100 transition-opacity shrink-0"
                            >
                                <FiX className="w-4 h-4" />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};

/** Hook — use anywhere: const toast = useToast(); toast('message', 'success') */
export const useToast = () => {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
    return ctx;
};
