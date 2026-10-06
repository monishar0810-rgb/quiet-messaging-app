import { useState } from 'react';

/**
 * Custom hook to manage React state synchronized with localStorage.
 * Ensures data persistence across sessions for contacts, messages, and configurations.
 * 
 * @param key The localStorage key to bind to.
 * @param initialValue The default value if no value is found in localStorage.
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // Read state from localStorage on initialization
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`[Storage Hook] Error reading key "${key}":`, error);
      return initialValue;
    }
  });

  // Setter wrapper to update React state and local storage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`[Storage Hook] Error setting key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}
