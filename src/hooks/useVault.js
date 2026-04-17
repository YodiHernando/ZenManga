import { useState, useEffect, useCallback } from 'react';
import { useToast } from '../components/UI/Toast';

const VAULT_KEY = 'zenManga_vault';
const VAULT_EVENT = 'zenvault-update';

/**
 * useVault — Custom Hook untuk mengelola data Manga favorit (Vault/Penyimpanan).
 * Menggunakan Custom Events untuk sinkronisasi antar komponen tanpa library tambahan.
 */
export const useVault = () => {
    const [vault, setVault] = useState([]);
    const toast = useToast();

    // Fungsi helper untuk mengambil data terbaru
    const getStoredVault = () => JSON.parse(localStorage.getItem(VAULT_KEY) || '[]');

    // Inisialisasi & Sinkronisasi
    useEffect(() => {
        setVault(getStoredVault());

        const handleUpdate = () => {
            setVault(getStoredVault());
        };

        // Dengerin perubahan dari hook di komponen lain
        window.addEventListener(VAULT_EVENT, handleUpdate);
        // Dengerin perubahan dari tab lain (standar browser)
        window.addEventListener('storage', handleUpdate);

        return () => {
            window.removeEventListener(VAULT_EVENT, handleUpdate);
            window.removeEventListener('storage', handleUpdate);
        };
    }, []);

    // Helper: Broadcast perubahan ke komponen lain di tab yang sama
    const broadcastUpdate = useCallback(() => {
        window.dispatchEvent(new CustomEvent(VAULT_EVENT));
    }, []);

    const toggleVault = useCallback((manga) => {
        const currentVault = getStoredVault();
        const exists = currentVault.some(item => item.mal_id === manga.mal_id);
        
        let newVault;
        if (exists) {
            newVault = currentVault.filter(item => item.mal_id !== manga.mal_id);
            toast(`Removed "${manga.title}" from Vault`, 'error', 2500);
        } else {
            newVault = [...currentVault, {
                mal_id: manga.mal_id,
                title: manga.title,
                image: manga.images?.jpg?.image_url || manga.images?.jpg?.large_image_url || manga.image,
                total_chapters: manga.chapters || 0,
                read_chapters: 0,
                status: 'Plan to Read'
            }];
            toast(`Added "${manga.title}" to Vault!`, 'success', 2500);
        }

        localStorage.setItem(VAULT_KEY, JSON.stringify(newVault));
        setVault(newVault);
        broadcastUpdate();
    }, [toast, broadcastUpdate]);

    const removeFromVault = useCallback((id, title) => {
        const currentVault = getStoredVault();
        const newVault = currentVault.filter(item => item.mal_id !== id);
        
        localStorage.setItem(VAULT_KEY, JSON.stringify(newVault));
        setVault(newVault);
        broadcastUpdate();
        
        if (title) toast(`Removed "${title}" from Vault`, 'error', 2500);
    }, [toast, broadcastUpdate]);

    const updateProgress = useCallback((id, delta) => {
        const currentVault = getStoredVault();
        const newVault = currentVault.map(manga => {
            if (manga.mal_id === id) {
                const newProgress = Math.max(0, (manga.read_chapters || 0) + delta);
                return { ...manga, read_chapters: newProgress };
            }
            return manga;
        });
        
        localStorage.setItem(VAULT_KEY, JSON.stringify(newVault));
        setVault(newVault);
        broadcastUpdate();
    }, [broadcastUpdate]);

    const updateStatus = useCallback((id, newStatus) => {
        const currentVault = getStoredVault();
        const newVault = currentVault.map(manga => {
            if (manga.mal_id === id) {
                return { ...manga, status: newStatus };
            }
            return manga;
        });
        
        localStorage.setItem(VAULT_KEY, JSON.stringify(newVault));
        setVault(newVault);
        broadcastUpdate();
    }, [broadcastUpdate]);

    const isInVault = useCallback((id) => {
        return vault.some(item => item.mal_id === id);
    }, [vault]);

    return {
        vault,
        toggleVault,
        removeFromVault,
        updateProgress,
        updateStatus,
        isInVault
    };
};