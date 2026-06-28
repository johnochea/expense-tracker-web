"use client";

import { formatLongDate } from "@/lib/constants";
import type { Profile, Totals, Transaction } from "@/lib/types";
import { CalendarIcon } from "./Icons";
import SummaryCards from "./SummaryCards";
import CreateTransactionForm from "./CreateTransactionForm";
import TransactionLog from "./TransactionLog";
import DashboardBottom from "./DashboardBottom";

export default function Dashboard({
  profile,
  transactions,
  totals,
  today,
  userEmail,
}: {
  profile: Profile;
  transactions: Transaction[];
  totals: Totals;
  today: string;
  userEmail: string;
}) {
  const todayDate = new Date(today);

  return (
    <div className="app-shell">
      <div className="window">
        <header className="titlebar">
          <div className="titlebar-brand">
            <span>The Council&apos;s Expense Tracker</span>
          </div>
          <div className="titlebar-actions">
            <span className="titlebar-user" title={userEmail}>
              {userEmail}
            </span>
            <form action="/auth/signout" method="post">
              <button className="signout-btn" type="submit">
                Sign out
              </button>
            </form>
          </div>
        </header>

        <div className="window-surface">
          <main className="window-body">
            <div className="date-line">
              <CalendarIcon /> {formatLongDate(todayDate)}
            </div>

            <div className="dashboard-grid">
              <SummaryCards
                totals={totals}
                transactions={transactions}
                today={today}
                startingBalance={Number(profile.starting_balance)}
                startingSavings={Number(profile.starting_savings)}
              />
              <DashboardBottom
                create={<CreateTransactionForm today={today} />}
                log={<TransactionLog transactions={transactions} />}
              />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
