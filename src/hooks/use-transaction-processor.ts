'use client';

import { useState } from 'react';
import { processTransaction } from '@/lib/transaction-engine';
import { Transaction } from '@/lib/mock-data';

/**
 * React hook for processing transactions
 * @returns Hook functions and state for transaction processing
 */
export function useTransactionProcessor() {
  const [processing, setProcessing] = useState(false);
  const [lastResult, setLastResult] = useState<Transaction | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submitTransaction = async (data: { category: string; amount: number; merchant: string }) => {
    setProcessing(true);
    setError(null);
    try {
      const txn: Transaction = {
        id: '', // will be assigned by processTransaction
        category: data.category,
        amount: data.amount,
        merchant: data.merchant,
        date: new Date().toISOString(),
        status: 'pending',
      };
      const result = await processTransaction(txn);
      setLastResult(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transaction failed');
      return null;
    } finally {
      setProcessing(false);
    }
  };

  return { submitTransaction, processing, lastResult, error };
}
