import { useState, useEffect, useMemo } from 'react';

export function useDebouncedSearch<T>(
  items: T[],
  searchTerm: string,
  searchKeys: (keyof T)[],
  delay: number = 300
) {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, delay]);

  const filteredItems = useMemo(() => {
    if (!debouncedSearchTerm.trim()) return items;

    return items.filter((item) => {
      return searchKeys.some((key) => {
        const value = item[key];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
        }
        if (typeof value === 'number') {
          return value.toString().includes(debouncedSearchTerm);
        }
        return false;
      });
    });
  }, [items, debouncedSearchTerm, searchKeys]);

  return {
    filteredItems,
    debouncedSearchTerm,
    isSearching: searchTerm !== debouncedSearchTerm
  };
}