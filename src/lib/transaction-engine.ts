'use client';

import { db } from './local-storage';
import { Transaction, SpendingRuleWithId } from './mock-data';
import { personalizedSpendingNudges } from '@/ai/flows/personalized-spending-nudges';
import { intelligentMicroInvestmentRedirect } from '@/ai/flows/intelligent-micro-investment-redirect-flow';

/**
 * Calculate the total spending for a specific category from localStorage transactions
 */
export function calculateCategorySpending(category: string): number {
  const transactions = db.getCollection('transactions') as Transaction[];
  return transactions
    .filter((txn) => txn.category === category && txn.status === 'completed')
    .reduce((sum, txn) => sum + txn.amount, 0);
}

/**
 * Check if a transaction falls within the time lock window
 * @param rule The spending rule with time lock configuration
 * @param transactionDate The date of the transaction
 * @returns true if transaction is within the blocked time range
 */
export function checkTimeLock(rule: SpendingRuleWithId, transactionDate: Date): boolean {
  if (!rule.timeLockEnabled) {
    return false;
  }

  const hour = transactionDate.getHours();
  const [startHour, endHour] = rule.timeLockRange;

  // Handle overnight time ranges (e.g., 22:00 to 6:00)
  if (startHour > endHour) {
    return hour >= startHour || hour < endHour;
  }
  
  // Normal time range (e.g., 9:00 to 17:00)
  return hour >= startHour && hour < endHour;
}

/**
 * Update a rule's current spending value in localStorage
 */
function updateRuleSpending(ruleId: string, amount: number): void {
  db.updateDoc('rules', ruleId, { current: amount });
}

/**
 * Process a new transaction against spending rules
 * @param transaction The transaction to process
 * @returns The processed transaction with updated status and amounts
 */
export async function processTransaction(transaction: Transaction): Promise<Transaction> {
  const rules = db.getCollection('rules') as SpendingRuleWithId[];
  const rule = rules.find((r) => r.category === transaction.category);

  if (!rule) {
    // No rule for this category, allow the transaction
    const docId = db.addDoc('transactions', transaction);
    return { ...transaction, id: docId };
  }

  // Calculate current spending for this category
  const currentSpending = calculateCategorySpending(transaction.category);
  const projectedSpending = currentSpending + transaction.amount;
  const transactionDate = new Date(transaction.date);

  // Check time lock
  if (checkTimeLock(rule, transactionDate)) {
    transaction.status = 'blocked';
    transaction.redirectedAmount = transaction.amount;
    
    // Get investment recommendation for blocked amount
    try {
      const recommendation = await intelligentMicroInvestmentRedirect({
        excessAmount: transaction.amount,
        spendingCategory: transaction.category,
        userProfile: {
          riskTolerance: 'medium',
          financialGoals: ['Emergency Fund', 'Long-term Growth'],
        },
      });
      transaction.nudgeMessage = `Transaction blocked due to time lock. ${recommendation.recommendedAction}`;
    } catch (error) {
      console.error('Error getting investment recommendation:', error);
      transaction.nudgeMessage = `Transaction blocked due to time lock (${rule.timeLockRange[0]}:00 - ${rule.timeLockRange[1]}:00).`;
    }

    db.addDoc('transactions', transaction);
    return transaction;
  }

  // Check if approaching limit (>80%)
  const percentageUsed = (projectedSpending / rule.limit) * 100;
  
  if (percentageUsed > 100) {
    // Over limit - block and redirect
    transaction.status = 'blocked';
    const excessAmount = projectedSpending - rule.limit;
    transaction.redirectedAmount = excessAmount;

    try {
      const recommendation = await intelligentMicroInvestmentRedirect({
        excessAmount,
        spendingCategory: transaction.category,
        userProfile: {
          riskTolerance: 'medium',
          financialGoals: ['Emergency Fund', 'Long-term Growth'],
        },
      });
      transaction.nudgeMessage = `Spending limit exceeded. ${recommendation.recommendedAction}`;
    } catch (error) {
      console.error('Error getting investment recommendation:', error);
      transaction.nudgeMessage = `Spending limit exceeded by ₹${excessAmount.toFixed(2)}. Consider redirecting to savings.`;
    }

    db.addDoc('transactions', transaction);
    updateRuleSpending(rule.id, currentSpending);
    
    return transaction;
  } else if (percentageUsed > 80) {
    // Approaching limit - trigger nudge
    transaction.status = 'pending';

    try {
      const recentTransactions = db.getCollection('transactions') as Transaction[];
      const nudge = await personalizedSpendingNudges({
        transactionAmount: transaction.amount,
        category: transaction.category,
        currentSpending: currentSpending,
        limit: rule.limit,
        recentTransactions: recentTransactions
          .slice(-5)
          .map((t) => ({
            category: t.category,
            amount: t.amount,
            merchant: t.merchant,
          })),
      });
      transaction.nudgeMessage = nudge.nudgeMessage;
    } catch (error) {
      console.error('Error getting spending nudge:', error);
      transaction.nudgeMessage = `You're approaching your ${transaction.category} limit (${percentageUsed.toFixed(0)}% used).`;
    }

    db.addDoc('transactions', transaction);
    updateRuleSpending(rule.id, projectedSpending);
    
    return transaction;
  } else {
    // Within limit - allow transaction
    transaction.status = 'completed';
    db.addDoc('transactions', transaction);
    updateRuleSpending(rule.id, projectedSpending);
    
    return transaction;
  }
}

/**
 * Update all rules with current spending amounts from transactions
 */
export function updateRulesWithCurrentSpending(): void {
  const rules = db.getCollection('rules') as SpendingRuleWithId[];
  
  rules.forEach((rule) => {
    const currentSpending = calculateCategorySpending(rule.category);
    if (rule.current !== currentSpending) {
      updateRuleSpending(rule.id, currentSpending);
    }
  });
}
