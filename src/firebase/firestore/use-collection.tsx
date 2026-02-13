'use client';

import { useEffect, useState } from 'react';
import { db, DocumentData } from '@/lib/local-storage';

export type { DocumentData };

export function useCollection<T = DocumentData>(collectionName: string | null) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!collectionName) {
      setLoading(false);
      return;
    }

    // Initial load
    try {
      const items = db.getCollection(collectionName) as T[];
      setData(items);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load collection'));
      setLoading(false);
    }

    // Listen for storage events
    // Note: This custom event (dispatched in saveCollection) works within the same tab.
    // Native storage events only fire in other tabs/windows.
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === `nudgewealth_${collectionName}` && e.newValue) {
        try {
          const items = JSON.parse(e.newValue) as T[];
          setData(items);
        } catch (err) {
          console.error('Failed to parse storage update:', err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [collectionName]);

  return { data, loading, error };
}
