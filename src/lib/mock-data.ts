
export interface Transaction {
  id: string;
  category: string;
  amount: number;
  merchant: string;
  date: string;
  status: 'completed' | 'pending' | 'blocked';
  redirectedAmount?: number;
  nudgeMessage?: string;
}

export interface SpendingRule {
  category: string;
  limit: number;
  current: number;
  timeLockEnabled: boolean;
  timeLockRange: [number, number]; // [startHour, endHour]
}

export type SpendingRuleWithId = SpendingRule & { id: string };

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1', category: 'Food Delivery', amount: 450, merchant: 'Swiggy', date: new Date(Date.now() - 1 * 86400000).toISOString(), status: 'completed' },
  { id: '2', category: 'Shopping', amount: 2500, merchant: 'Amazon', date: new Date(Date.now() - 2 * 86400000).toISOString(), status: 'completed' },
  { id: '3', category: 'Entertainment', amount: 999, merchant: 'Netflix', date: new Date(Date.now() - 3 * 86400000).toISOString(), status: 'completed' },
  { id: '4', category: 'Food Delivery', amount: 120, merchant: 'Zomato', date: new Date(Date.now() - 3 * 86400000).toISOString(), status: 'completed' },
  { id: '5', category: 'Transport', amount: 350, merchant: 'Uber', date: new Date(Date.now() - 4 * 86400000).toISOString(), status: 'completed' },
  { id: '6', category: 'Food Delivery', amount: 850, merchant: 'Zomato', date: new Date(Date.now() - 0 * 86400000).toISOString(), status: 'blocked', redirectedAmount: 850 },
  { id: '7', category: 'Shopping', amount: 4500, merchant: 'Myntra', date: new Date(Date.now() - 0 * 86400000).toISOString(), status: 'blocked', redirectedAmount: 2000 },
  { id: '8', category: 'Transport', amount: 150, merchant: 'Ola', date: new Date(Date.now() - 5 * 86400000).toISOString(), status: 'completed' },
  { id: '9', category: 'Food Delivery', amount: 300, merchant: 'Blinkit', date: new Date(Date.now() - 6 * 86400000).toISOString(), status: 'completed' },
  { id: '10', category: 'Entertainment', amount: 500, merchant: 'PVR Cinemas', date: new Date(Date.now() - 7 * 86400000).toISOString(), status: 'completed' },
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
