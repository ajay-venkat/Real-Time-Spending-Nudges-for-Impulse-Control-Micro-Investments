'use client';

// No-op initialization - Firebase replaced with localStorage
export function initializeFirebase() {
  return { app: null, firestore: null, auth: null };
}

export * from './provider';
export * from './auth/use-user';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
