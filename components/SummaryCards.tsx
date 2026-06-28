"use client";

import { useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { updateStartingValues } from "@/app/actions";
import { formatAmount } from "@/lib/constants";
import {
  getExpenseMonthOptions,
  monthKey,
  parseMonthKey,
  sumExpenses,
  type ExpenseMonthKey,
} from "@/lib/totals";
import type { Totals, Transaction } from "@/lib/types";
import { IncomeIcon, ExpenseIcon, BankIcon, PencilIcon } from "./Icons";

export default function SummaryCards({
  totals,
  transactions,
  today,
  startingBalance,
  startingSavings,
}: {
  totals: Totals;
  transactions: Transaction[];
  today: string;
  startingBalance: number;
  startingSavings: number;
}) {
  const todayDate = useMemo(() => new Date(today), [today]);
  const currentMonthKey = monthKey(
    todayDate.getFullYear(),
    todayDate.getMonth(),
  );
  const [expenseFilter, setExpenseFilter] = useState<ExpenseMonthKey | "all">(
    currentMonthKey,
  );

  const monthOptions = useMemo(
    () => getExpenseMonthOptions(transactions, todayDate),
    [transactions, todayDate],
  );

  const expenseTotal = useMemo(() => {
    if (expenseFilter === "all") {
      return sumExpenses(transactions, "all");
    }
    const { year, month } = parseMonthKey(expenseFilter);
    return sumExpenses(transactions, { year, month });
  }, [transactions, expenseFilter]);

  return (
    <section className="cards">
      <EditableCard
        variant="balance"
        title="Total Balance"
        icon={<IncomeIcon />}
        displayValue={totals.balance}
        field="starting_balance"
        currentStart={startingBalance}
        hint="Starting balance (transactions adjust it automatically)"
      />

      <div className="card card-expenses">
        <div className="card-head">
          <span className="card-title">
            <ExpenseIcon size={20} /> Total Expenses
          </span>
          <select
            className="card-month-select"
            value={expenseFilter}
            onChange={(e) =>
              setExpenseFilter(e.target.value as ExpenseMonthKey | "all")
            }
            aria-label="Filter expenses by month"
          >
            {monthOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div className="card-value value-expenses">
          {formatAmount(expenseTotal)}
        </div>
      </div>

      <EditableCard
        variant="savings"
        title="Current Savings"
        icon={<BankIcon />}
        displayValue={totals.savingsTotal}
        field="starting_savings"
        currentStart={startingSavings}
        hint="Starting savings (savings transactions add to it)"
      />
    </section>
  );
}

function EditableCard({
  variant,
  title,
  icon,
  displayValue,
  field,
  currentStart,
  hint,
}: {
  variant: "balance" | "savings";
  title: string;
  icon: React.ReactNode;
  displayValue: number;
  field: "starting_balance" | "starting_savings";
  currentStart: number;
  hint: string;
}) {
  const [editing, setEditing] = useState(false);

  return (
    <div className={`card card-${variant}`}>
      <div className="card-head">
        <span className="card-title">
          {icon} {title}
        </span>
        <button
          className="icon-btn"
          aria-label={`Edit ${title}`}
          onClick={() => setEditing((v) => !v)}
        >
          <PencilIcon />
        </button>
      </div>

      {editing ? (
        <form
          action={async (formData) => {
            await updateStartingValues(null, formData);
            setEditing(false);
          }}
          className="card-edit"
        >
          <input type="hidden" name="field" value={field} />
          <label className="card-edit-label">{hint}</label>
          <div className="card-edit-row">
            <input
              type="number"
              name="value"
              step="0.01"
              defaultValue={currentStart}
              className="card-edit-input"
              autoFocus
            />
            <SaveButton />
          </div>
        </form>
      ) : (
        <div className={`card-value value-${variant === "balance" ? "earnings" : "savings"}`}>
          {formatAmount(displayValue)}
        </div>
      )}
    </div>
  );
}

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="card-edit-save" disabled={pending}>
      {pending ? "…" : "Save"}
    </button>
  );
}
