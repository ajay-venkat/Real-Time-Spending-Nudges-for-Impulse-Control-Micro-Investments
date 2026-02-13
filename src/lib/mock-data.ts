
export interface Transaction {
  id: string;
  category: string;
  amount: number;
  merchant: string;
  date: string;
  status: 'completed' | 'pending' | 'blocked';
}

export interface SpendingRule {
  category: string;
  limit: number;
  current: number;
  timeLockEnabled: boolean;
  timeLockRange: [number, number]; // [startHour, endHour]
}

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1', category: 'Food Delivery', amount: 450, merchant: 'Swiggy', date: '2025-02-13T10:00:00.000Z', status: 'completed' },
  { id: '2', category: 'Shopping', amount: 2500, merchant: 'Amazon', date: '2025-02-12T15:30:00.000Z', status: 'completed' },
  { id: '3', category: 'Entertainment', amount: 999, merchant: 'Netflix', date: '2025-02-11T20:15:00.000Z', status: 'completed' },
  { id: '4', category: 'Food Delivery', amount: 120, merchant: 'Zomato', date: '2025-02-11T12:00:00.000Z', status: 'completed' },
  { id: '5', category: 'Transport', amount: 350, merchant: 'Uber', date: '2025-02-10T09:45:00.000Z', status: 'completed' },
  { id: '6', category: 'Food Delivery', amount: 850, merchant: 'Zomato', date: '2025-02-14T23:30:00.000Z', status: 'blocked' },
  { id: '7', category: 'Shopping', amount: 4500, merchant: 'Myntra', date: '2025-02-14T22:15:00.000Z', status: 'blocked' },
  { id: '8', category: 'Transport', amount: 150, merchant: 'Ola', date: '2025-02-09T08:00:00.000Z', status: 'completed' },
  { id: '9', category: 'Food Delivery', amount: 300, merchant: 'Blinkit', date: '2025-02-08T18:00:00.000Z', status: 'completed' },
  { id: '10', category: 'Entertainment', amount: 500, merchant: 'PVR Cinemas', date: '2025-02-07T14:00:00.000Z', status: 'completed' },
];

export const MOCK_RULES: SpendingRule[] = [
  { category: 'Food Delivery', limit: 2000, current: 570, timeLockEnabled: true, timeLockRange: [22, 6] },
  { category: 'Shopping', limit: 5000, current: 2500, timeLockEnabled: false, timeLockRange: [0, 0] },
  { category: 'Entertainment', limit: 1500, current: 999, timeLockEnabled: false, timeLockRange: [0, 0] },
];

export const MOCK_INVESTMENT_OPTIONS = [
  { name: 'Nifty 50 Index Fund', type: 'Investment', riskLevel: 'Medium' as const, expectedReturn: '12-15%', description: 'Low-cost tracker for India\'s top 50 companies.' },
  { name: 'Liquid Savings Pot', type: 'Savings', riskLevel: 'Very Low' as const, expectedReturn: '5.5%', description: 'Highly liquid savings for emergency use.' },
  { name: 'Digital Gold', type: 'Investment', riskLevel: 'Medium' as const, expectedReturn: '9-11%', description: 'Physical gold-backed digital investment.' },
];
