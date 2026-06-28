import type { Profile, Transaction, Totals } from "./types";

export type ExpenseMonthKey = `${number}-${string}`;

export function monthKey(year: number, monthIndex: number): ExpenseMonthKey {
  return `${year}-${String(monthIndex + 1).padStart(2, "0")}`;
}

export function parseMonthKey(key: ExpenseMonthKey): {
  year: number;
  month: number;
} {
  const [y, m] = key.split("-").map(Number);
  return { year: y, month: m - 1 };
}

export function formatMonthLabel(year: number, monthIndex: number): string {
  return new Date(year, monthIndex, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

/** Sum expense rows, optionally filtered to a calendar month or all time. */
export function sumExpenses(
  transactions: Transaction[],
  filter: "all" | { year: number; month: number },
): number {
  let total = 0;

  for (const t of transactions) {
    if (t.type !== "expenses") continue;
    const amount = Number(t.amount);

    if (filter === "all") {
      total += amount;
      continue;
    }

    const [y, m] = t.occurred_on.split("-").map(Number);
    if (y === filter.year && m - 1 === filter.month) {
      total += amount;
    }
  }

  return total;
}

/** Month picker options: current month, other months with expenses, and All. */
export function getExpenseMonthOptions(
  transactions: Transaction[],
  today: Date,
): { value: string; label: string }[] {
  const currentKey = monthKey(today.getFullYear(), today.getMonth());
  const monthsWithExpenses = new Set<string>();

  for (const t of transactions) {
    if (t.type !== "expenses") continue;
    const [y, m] = t.occurred_on.split("-");
    monthsWithExpenses.add(`${y}-${m}`);
  }

  const options: { value: string; label: string }[] = [
    {
      value: currentKey,
      label: formatMonthLabel(today.getFullYear(), today.getMonth()),
    },
  ];

  for (const key of [...monthsWithExpenses].sort((a, b) => b.localeCompare(a))) {
    if (key === currentKey) continue;
    const { year, month } = parseMonthKey(key as ExpenseMonthKey);
    options.push({ value: key, label: formatMonthLabel(year, month) });
  }

  options.push({ value: "all", label: "All" });

  return options;
}

// Computes the three summary cards from the starting points + transactions.
//
//   Balance  = starting_balance
//              + earnings
//              - expenses
//              - savings deposits        (money moved out of available cash)
//
//   Savings  = starting_savings
//              + all savings rows        (Deposit + Interest)
//
//   Expenses = sum of expense rows dated within the given month.
//
// Interest (a savings row) grows savings without reducing balance, since the
// bank pays it — only "Deposit" moves money from balance into savings.
export function computeTotals(
  profile: Profile,
  transactions: Transaction[],
  monthRef: Date,
): Totals {
  let balance = Number(profile.starting_balance);
  let savingsTotal = Number(profile.starting_savings);

  const refYear = monthRef.getFullYear();
  const refMonth = monthRef.getMonth();

  for (const t of transactions) {
    const amount = Number(t.amount);

    if (t.type === "earnings") {
      balance += amount;
    } else if (t.type === "expenses") {
      balance -= amount;
    } else if (t.type === "savings") {
      savingsTotal += amount;
      if (t.category === "Deposit") {
        balance -= amount;
      }
    }
  }

  const expensesThisMonth = sumExpenses(transactions, {
    year: refYear,
    month: refMonth,
  });

  return { balance, savingsTotal, expensesThisMonth };
}
