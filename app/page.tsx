import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { computeTotals } from "@/lib/totals";
import type { Profile, Transaction } from "@/lib/types";
import Dashboard from "@/components/Dashboard";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Load (or lazily create) the profile holding the editable starting points.
  let { data: profile } = await supabase
    .from("profiles")
    .select("id, starting_balance, starting_savings")
    .eq("id", user.id)
    .single();

  if (!profile) {
    const { data: created } = await supabase
      .from("profiles")
      .insert({ id: user.id })
      .select("id, starting_balance, starting_savings")
      .single();
    profile = created ?? {
      id: user.id,
      starting_balance: 0,
      starting_savings: 0,
    };
  }

  const { data: transactions } = await supabase
    .from("transactions")
    .select("*")
    .order("occurred_on", { ascending: false })
    .order("created_at", { ascending: false });

  const txns = (transactions ?? []) as Transaction[];
  const now = new Date();
  const totals = computeTotals(profile as Profile, txns, now);

  return (
    <Dashboard
      profile={profile as Profile}
      transactions={txns}
      totals={totals}
      today={now.toISOString()}
      userEmail={user.email ?? ""}
    />
  );
}
