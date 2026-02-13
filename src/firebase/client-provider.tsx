'use client';

import React from 'react';
import { FirebaseProvider } from './provider';
import { Toaster } from '@/components/ui/toaster';

export const FirebaseClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <FirebaseProvider>
      {children}
    </FirebaseProvider>
  );
};
