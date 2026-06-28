"use client";

import { useActionState, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useFormStatus } from "react-dom";
import { addTransaction, type ActionState } from "@/app/actions";
import {
  CATEGORIES,
  TRANSACTION_TYPES,
  type TransactionType,
} from "@/lib/constants";
import { PlusSquareIcon, ChevronDownIcon } from "./Icons";

const MOBILE_QUERY = "(max-width: 900px)";

function useIsMobile() {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(MOBILE_QUERY);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(MOBILE_QUERY).matches,
    () => false,
  );
}

export default function CreateTransactionForm({ today }: { today: string }) {
  const [state, formAction] = useActionState<ActionState, FormData>(
    addTransaction,
    null,
  );
  const [type, setType] = useState<TransactionType | "">("");
  const [expanded, setExpanded] = useState(false);
  const isMobile = useIsMobile();
  const formRef = useRef<HTMLFormElement>(null);
  const todayDate = today.slice(0, 10); // YYYY-MM-DD

  const showForm = !isMobile || expanded;

  // Reset the form after a successful submit (action returns null on success).
  const submitted = useRef(false);
  useEffect(() => {
    if (submitted.current && state === null) {
      formRef.current?.reset();
      setType("");
      if (isMobile) setExpanded(false);
    }
    submitted.current = false;
  });

  const categories = type ? CATEGORIES[type] : [];

  const form = (
    <form
      id="create-transaction-form"
      ref={formRef}
      action={(fd) => {
        submitted.current = true;
        formAction(fd);
      }}
      className="create-form"
    >
      <label className="field">
        <span>Transaction type</span>
        <select
          name="type"
          value={type}
          onChange={(e) => setType(e.target.value as TransactionType)}
          required
        >
          <option value="" disabled>
            Select type
          </option>
          {TRANSACTION_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        <span>Category</span>
        <select name="category" required disabled={!type} defaultValue="">
          <option value="" disabled>
            {type ? "Select category" : "Pick a type first"}
          </option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        <span>Amount</span>
        <input
          type="number"
          name="amount"
          step="0.01"
          min="0"
          placeholder="0.00"
          required
        />
      </label>

      <label className="field">
        <span>Description</span>
        <textarea
          name="description"
          placeholder="Enter description"
          maxLength={200}
          rows={2}
        />
      </label>

      <label className="field">
        <span>Date</span>
        <input type="date" name="occurred_on" defaultValue={todayDate} required />
      </label>

      {state?.error && <p className="form-error">{state.error}</p>}

      <SubmitButton />
    </form>
  );

  return (
    <div className="panel panel-create">
      {isMobile ? (
        <>
          <div className="panel-create-header">
            <button
              type="button"
              className="panel-create-toggle"
              aria-expanded={expanded}
              aria-controls="create-transaction-form"
              onClick={() => setExpanded((open) => !open)}
            >
              <PlusSquareIcon />
              <span>Create Transaction</span>
              <ChevronDownIcon
                className={`panel-create-chevron${expanded ? " is-open" : ""}`}
              />
            </button>
          </div>
          {showForm && form}
        </>
      ) : (
        <>
          <h2 className="panel-title">
            <PlusSquareIcon /> Create Transaction
          </h2>
          {form}
        </>
      )}
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="submit-btn" disabled={pending}>
      {pending ? "Adding…" : "Add transaction"}
    </button>
  );
}
