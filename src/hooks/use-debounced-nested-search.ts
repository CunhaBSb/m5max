import { useState, useEffect, useMemo } from 'react';

export function useDebouncedNestedSearch<T>(
  items: T[],
  searchTerm: string,
  searchFunction: (item: T, term: string) => boolean,
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

    return items.filter((item) => searchFunction(item, debouncedSearchTerm.toLowerCase()));
  }, [items, debouncedSearchTerm, searchFunction]);

  return {
    filteredItems,
    debouncedSearchTerm,
    isSearching: searchTerm !== debouncedSearchTerm
  };
}