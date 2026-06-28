// Transaction types and their allowed categories.
// Keep this in sync with the CHECK constraint in supabase/schema.sql.

export type TransactionType = "earnings" | "expenses" | "savings";

export const TRANSACTION_TYPES: { value: TransactionType; label: string }[] = [
  { value: "earnings", label: "Earnings" },
  { value: "expenses", label: "Expenses" },
  { value: "savings", label: "Savings" },
];

export const CATEGORIES: Record<TransactionType, string[]> = {
  expenses: [
    "Food",
    "Bills Payment",
    "Grocery",
    "Tuition",
    "Entertainment",
    "Transportation",
    "Travel",
    "Others",
  ],
  earnings: ["Salary", "Allowance", "Scholarship", "Business", "Others"],
  savings: ["Deposit", "Interest"],
};

export const ALL_CATEGORIES: string[] = Array.from(
  new Set(Object.values(CATEGORIES).flat()),
);

// Currency formatting with Philippine peso sign.
export function formatAmount(value: number): string {
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
  return `₱${formatted}`;
}

export function formatDate(iso: string): string {
  // iso is a YYYY-MM-DD date string; render as MM/DD/YYYY.
  const [y, m, d] = iso.split("-");
  return `${m}/${d}/${y}`;
}

export function formatLongDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
