'use server';

import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

export function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export type DocumentData = Record<string, any>;

export class LocalDatabase {
  private static instance: LocalDatabase;

  private constructor() {
    ensureDataDir();
  }

  static getInstance(): LocalDatabase {
    if (!LocalDatabase.instance) {
      LocalDatabase.instance = new LocalDatabase();
    }
    return LocalDatabase.instance;
  }

  getCollection(collectionName: string): DocumentData[] {
    const filePath = path.join(DATA_DIR, `${collectionName}.json`);
    try {
      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf-8');
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
    const filePath = path.join(DATA_DIR, `${collectionName}.json`);
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(`Error saving collection ${collectionName}:`, error);
    }
  }

  clearAll(): void {
    try {
      const files = fs.readdirSync(DATA_DIR);
      files.forEach((file) => {
        if (file.endsWith('.json')) {
          fs.unlinkSync(path.join(DATA_DIR, file));
        }
      });
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  }
}

export const db = LocalDatabase.getInstance();