'use client';

import { useEffect, useState } from 'react';
import { db, DocumentData } from '@/lib/local-storage';

export function useDoc<T = DocumentData>(
  collectionName: string | null,
  docId: string | null
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!collectionName || !docId) {
      setLoading(false);
      return;
    }

    // Initial load
    try {
      const doc = db.getDoc(collectionName, docId) as T | null;
      setData(doc);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load document'));
      setLoading(false);
    }

    // Listen for storage events (updates from other tabs/components)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === `nudgewealth_${collectionName}` && e.newValue) {
        try {
          const collection = JSON.parse(e.newValue);
          const doc = collection.find((item: any) => item.id === docId);
          setData(doc || null);
        } catch (err) {
          console.error('Failed to parse storage update:', err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [collectionName, docId]);

  return { data, loading, error };
}
