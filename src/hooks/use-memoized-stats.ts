import { useMemo } from 'react';

export function useMemoizedStats<T>(
  items: T[],
  calculations: Record<string, (items: T[]) => number>
) {
  return useMemo(() => {
    const stats: Record<string, number> = {};
    
    Object.entries(calculations).forEach(([key, calcFunction]) => {
      stats[key] = calcFunction(items);
    });
    
    return stats;
  }, [items, calculations]);
}