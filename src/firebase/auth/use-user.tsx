'use client';

import { useEffect, useState } from 'react';

// Mock user interface matching Firebase User structure
export interface User {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL?: string | null;
}

const DEMO_USER: User = {
  uid: 'demo-user-001',
  displayName: 'Demo User',
  email: 'demo@nudgewealth.com',
  photoURL: null,
};

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get or create demo user in localStorage
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('nudgewealth_user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          // If parse fails, use demo user
          localStorage.setItem('nudgewealth_user', JSON.stringify(DEMO_USER));
          setUser(DEMO_USER);
        }
      } else {
        // First time - seed demo user
        localStorage.setItem('nudgewealth_user', JSON.stringify(DEMO_USER));
        setUser(DEMO_USER);
      }
    }
    setLoading(false);
  }, []);

  return { user, loading };
}
