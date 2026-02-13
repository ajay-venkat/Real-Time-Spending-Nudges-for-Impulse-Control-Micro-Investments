'use client';

import { MOCK_TRANSACTIONS, MOCK_RULES, MOCK_INVESTMENT_OPTIONS } from './mock-data';

const KEY_PREFIX = 'nudgewealth_';

export type DocumentData = Record<string, any>;

export class LocalDatabase {
  private static instance: LocalDatabase;

  private constructor() {
    // Auto-seed data on first initialization
    if (typeof window !== 'undefined') {
      this.seedDataIfEmpty();
    }
  }

  static getInstance(): LocalDatabase {
    if (!LocalDatabase.instance) {
      LocalDatabase.instance = new LocalDatabase();
    }
    return LocalDatabase.instance;
  }

  private seedDataIfEmpty(): void {
    // Seed transactions
    if (!this.hasCollection('transactions')) {
      localStorage.setItem(
        `${KEY_PREFIX}transactions`,
        JSON.stringify(MOCK_TRANSACTIONS)
      );
    }

    // Seed rules
    if (!this.hasCollection('rules')) {
      const rulesWithIds = MOCK_RULES.map((rule, index) => ({
        ...rule,
        id: `rule-${index + 1}`,
      }));
      localStorage.setItem(
        `${KEY_PREFIX}rules`,
        JSON.stringify(rulesWithIds)
      );
    }

    // Seed investment options
    if (!this.hasCollection('investment_options')) {
      const optionsWithIds = MOCK_INVESTMENT_OPTIONS.map((option, index) => ({
        ...option,
        id: `investment-${index + 1}`,
      }));
      localStorage.setItem(
        `${KEY_PREFIX}investment_options`,
        JSON.stringify(optionsWithIds)
      );
    }
  }

  private hasCollection(collectionName: string): boolean {
    if (typeof window === 'undefined') return false;
    const key = `${KEY_PREFIX}${collectionName}`;
    return localStorage.getItem(key) !== null;
  }

  getCollection(collectionName: string): DocumentData[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const key = `${KEY_PREFIX}${collectionName}`;
      const data = localStorage.getItem(key);
      if (data) {
        return JSON.parse(data);
      }
    } catch (error) {
      console.error(`Error reading collection ${collectionName}:`, error);
    }
    return [];
  }

  getDoc(collectionName: string, docId: string): DocumentData | null {
    const collection = this.getCollection(collectionName);
    return collection.find((doc: any) => doc.id === docId) || null;
  }

  addDoc(collectionName: string, data: DocumentData): string {
    const docId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const doc = { ...data, id: docId, createdAt: new Date().toISOString() };
    
    const collection = this.getCollection(collectionName);
    collection.push(doc);
    this.saveCollection(collectionName, collection);
    
    return docId;
  }

  updateDoc(collectionName: string, docId: string, data: Partial<DocumentData>): void {
    const collection = this.getCollection(collectionName);
    const index = collection.findIndex((doc: any) => doc.id === docId);
    
    if (index !== -1) {
      collection[index] = {
        ...collection[index],
        ...data,
        updatedAt: new Date().toISOString(),
      };
      this.saveCollection(collectionName, collection);
    }
  }

  deleteDoc(collectionName: string, docId: string): void {
    const collection = this.getCollection(collectionName);
    const filtered = collection.filter((doc: any) => doc.id !== docId);
    this.saveCollection(collectionName, filtered);
  }

  queryDocs(
    collectionName: string,
    filterFn: (doc: DocumentData) => boolean
  ): DocumentData[] {
    const collection = this.getCollection(collectionName);
    return collection.filter(filterFn);
  }

  private saveCollection(collectionName: string, data: DocumentData[]): void {
    if (typeof window === 'undefined') return;
    
    try {
      const key = `${KEY_PREFIX}${collectionName}`;
      const value = JSON.stringify(data);
      localStorage.setItem(key, value);
      
      // Trigger storage event to notify components in the same and other tabs
      window.dispatchEvent(new StorageEvent('storage', {
        key,
        newValue: value,
        url: window.location.href,
        storageArea: localStorage,
      }));
    } catch (error) {
      console.error(`Error saving collection ${collectionName}:`, error);
    }
  }

  clearAll(): void {
    if (typeof window === 'undefined') return;
    
    try {
      // Iterate backwards to avoid index shifting during removal
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key?.startsWith(KEY_PREFIX)) {
          localStorage.removeItem(key);
        }
      }
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  }
}

export const db = LocalDatabase.getInstance();