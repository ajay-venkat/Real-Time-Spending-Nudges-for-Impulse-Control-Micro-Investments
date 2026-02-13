'use client';

import { db } from './local-storage';
import { Transaction } from './mock-data';

/**
 * Get the start of today
 */
function getStartOfDay(): Date {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

/**
 * Get the start of the current week (Sunday)
 */
function getStartOfWeek(): Date {
  const date = new Date();
  const day = date.getDay();
  const diff = date.getDate() - day;
  date.setDate(diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

/**
 * Get the start of the current month
 */
function getStartOfMonth(): Date {
  const date = new Date();
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
  return date;
}

/**
 * Calculate monthly spending for a category (or all categories if not specified)
 * @param category Optional category to filter by
 * @returns Total spending amount
 */
export function getMonthlySpending(category?: string): number {
  const transactions = db.getCollection('transactions') as Transaction[];
  const startOfMonth = getStartOfMonth();

  return transactions
    .filter((txn) => {
      if (txn.status !== 'completed') return false;
      const txnDate = new Date(txn.date);
      if (txnDate < startOfMonth) return false;
      if (category && txn.category !== category) return false;
      return true;
    })
    .reduce((sum, txn) => sum + txn.amount, 0);
}

/**
 * Calculate weekly spending for a category (or all categories if not specified)
 * @param category Optional category to filter by
 * @returns Total spending amount
 */
export function getWeeklySpending(category?: string): number {
  const transactions = db.getCollection('transactions') as Transaction[];
  const startOfWeek = getStartOfWeek();

  return transactions
    .filter((txn) => {
      if (txn.status !== 'completed') return false;
      const txnDate = new Date(txn.date);
      if (txnDate < startOfWeek) return false;
      if (category && txn.category !== category) return false;
      return true;
    })
    .reduce((sum, txn) => sum + txn.amount, 0);
}

/**
 * Calculate daily spending for a category (or all categories if not specified)
 * @param category Optional category to filter by
 * @returns Total spending amount
 */
export function getDailySpending(category?: string): number {
  const transactions = db.getCollection('transactions') as Transaction[];
  const startOfDay = getStartOfDay();

  return transactions
    .filter((txn) => {
      if (txn.status !== 'completed') return false;
      const txnDate = new Date(txn.date);
      if (txnDate < startOfDay) return false;
      if (category && txn.category !== category) return false;
      return true;
    })
    .reduce((sum, txn) => sum + txn.amount, 0);
}

/**
 * Get spending trend over a number of days for chart data
 * @param days Number of days to include in the trend
 * @returns Array of daily spending and savings data
 */
export function getSpendingTrend(days: number): Array<{ date: string; spending: number; saved: number }> {
  const transactions = db.getCollection('transactions') as Transaction[];
  const result: Array<{ date: string; spending: number; saved: number }> = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const dayTransactions = transactions.filter((txn) => {
      const txnDate = new Date(txn.date);
      return txnDate >= date && txnDate <= endOfDay;
    });

    const spending = dayTransactions
      .filter((txn) => txn.status === 'completed')
      .reduce((sum, txn) => sum + txn.amount, 0);

    const saved = dayTransactions
      .filter((txn) => txn.status === 'blocked' && txn.redirectedAmount)
      .reduce((sum, txn) => sum + (txn.redirectedAmount || 0), 0);

    result.push({
      date: date.toISOString().split('T')[0],
      spending,
      saved,
    });
  }

  return result;
}

/**
 * Get spending breakdown by category with percentages
 * @returns Array of category spending data with percentages
 */
export function getCategoryBreakdown(): Array<{ category: string; amount: number; percentage: number }> {
  const transactions = db.getCollection('transactions') as Transaction[];
  
  // Only consider completed transactions
  const completedTransactions = transactions.filter((txn) => txn.status === 'completed');

  // Calculate total spending
  const totalSpending = completedTransactions.reduce((sum, txn) => sum + txn.amount, 0);

  // Group by category
  const categoryMap = new Map<string, number>();
  completedTransactions.forEach((txn) => {
    const current = categoryMap.get(txn.category) || 0;
    categoryMap.set(txn.category, current + txn.amount);
  });

  // Convert to array with percentages
  const result = Array.from(categoryMap.entries()).map(([category, amount]) => ({
    category,
    amount,
    percentage: totalSpending > 0 ? (amount / totalSpending) * 100 : 0,
  }));

  // Sort by amount descending
  result.sort((a, b) => b.amount - a.amount);

  return result;
}
