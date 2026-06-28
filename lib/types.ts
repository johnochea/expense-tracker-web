import type { TransactionType } from "./constants";

export interface Transaction {
  id: string;
  user_id: string;
  type: TransactionType;
  category: string;
  amount: number;
  description: string | null;
  occurred_on: string; // YYYY-MM-DD
  created_at: string;
}

export interface Profile {
  id: string;
  starting_balance: number;
  starting_savings: number;
}

export interface Totals {
  balance: number;
  savingsTotal: number;
  expensesThisMonth: number;
}
