import { useState, useEffect } from 'react';

/**
 * useDebounce hook — delays the update of a value until a set time has passed.
 * Useful for search inputs to prevent rapid-fire API calls.
 * 
 * @param {any} value - The value that should be debounced
 * @param {number} delay - The delay in milliseconds
 * @returns {any} - The debounced value
 */
export function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        // Update debounced value after the delay
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Cancel the timeout if value changes (also on unmount),
        // which prevents the debounced value from updating if typing continues.
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

export default useDebounce;
