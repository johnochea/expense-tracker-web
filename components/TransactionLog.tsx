"use client";

import { useMemo, useState } from "react";
import { deleteTransaction } from "@/app/actions";
import {
  ALL_CATEGORIES,
  TRANSACTION_TYPES,
  formatAmount,
  formatDate,
} from "@/lib/constants";
import type { Transaction } from "@/lib/types";
import { HistoryIcon, TypeIcon, TrashIcon } from "./Icons";

export default function TransactionLog({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      if (typeFilter && t.type !== typeFilter) return false;
      if (categoryFilter && t.category !== categoryFilter) return false;
      return true;
    });
  }, [transactions, typeFilter, categoryFilter]);

  return (
    <div className="panel panel-log">
      <h2 className="panel-title">
        <HistoryIcon /> Transaction Log
      </h2>

      <div className="log-panel">
        <div className="filters">
          <span className="filters-label">Filter by:</span>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="">Type</option>
            {TRANSACTION_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">Category</option>
            {ALL_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {(typeFilter || categoryFilter) && (
            <button
              className="filters-clear"
              onClick={() => {
                setTypeFilter("");
                setCategoryFilter("");
              }}
            >
              Clear
            </button>
          )}
        </div>

        <div className="log-list">
          {filtered.length === 0 ? (
            <p className="log-empty">No transactions yet.</p>
          ) : (
            filtered.map((t) => <Row key={t.id} t={t} />)
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ t }: { t: Transaction }) {
  const isPositive = t.type === "earnings" || t.type === "savings";
  const sign = isPositive ? "+" : "-";

  return (
    <div className={`log-row log-${t.type}`}>
      <span className="log-icon">
        <TypeIcon type={t.type} size={26} />
      </span>
      <div className="log-main">
        <div className="log-category">{t.category}</div>
        <div className="log-date">{formatDate(t.occurred_on)}</div>
        {t.description ? <div className="log-description">{t.description}</div> : null}
      </div>
      <div className="log-amount">
        {sign} {formatAmount(Number(t.amount))}
      </div>
      <form action={deleteTransaction} className="log-delete">
        <input type="hidden" name="id" value={t.id} />
        <button type="submit" aria-label="Delete transaction" title="Delete">
          <TrashIcon />
        </button>
      </form>
    </div>
  );
}
