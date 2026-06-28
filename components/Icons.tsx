import type { TransactionType } from "@/lib/constants";

type IconProps = { className?: string; size?: number };

// Earnings — card with an up arrow (money in).
export function IncomeIcon({ className, size = 22 }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="20" height="13" rx="2.5" />
      <path d="M2 10h20" />
      <path d="M12 17.5V11.5M12 11.5l-2.2 2.2M12 11.5l2.2 2.2" />
    </svg>
  );
}

// Expenses — card with a down arrow (money out).
export function ExpenseIcon({ className, size = 22 }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="20" height="13" rx="2.5" />
      <path d="M2 10h20" />
      <path d="M12 11.5v6M12 17.5l-2.2-2.2M12 17.5l2.2-2.2" />
    </svg>
  );
}

// Savings — a bank / columns building.
export function BankIcon({ className, size = 22 }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5 12 4l9 5.5" />
      <path d="M5 9.5v8M9 9.5v8M15 9.5v8M19 9.5v8" />
      <path d="M3 20.5h18" />
    </svg>
  );
}

export function TypeIcon({ type, className, size }: { type: TransactionType } & IconProps) {
  if (type === "earnings") return <IncomeIcon className={className} size={size} />;
  if (type === "savings") return <BankIcon className={className} size={size} />;
  return <ExpenseIcon className={className} size={size} />;
}

export function CalendarIcon({ className, size = 20 }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4.5" width="18" height="16" rx="2.5" />
      <path d="M3 9h18M8 2.5v4M16 2.5v4" />
    </svg>
  );
}

export function PlusSquareIcon({ className, size = 20 }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  );
}

export function HistoryIcon({ className, size = 20 }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
      <path d="M3 4v4h4" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export function PencilIcon({ className, size = 16 }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

export function TrashIcon({ className, size = 16 }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13" />
    </svg>
  );
}

export function ChevronDownIcon({ className, size = 18 }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
