"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { CATEGORIES, type TransactionType } from "@/lib/constants";

export type ActionState = { error?: string } | null;

function isValidType(t: string): t is TransactionType {
  return t === "earnings" || t === "expenses" || t === "savings";
}

export async function addTransaction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in." };

  const type = String(formData.get("type") ?? "");
  const category = String(formData.get("category") ?? "");
  const amountRaw = String(formData.get("amount") ?? "");
  const description = String(formData.get("description") ?? "").trim();
  const occurredOn = String(formData.get("occurred_on") ?? "");

  if (!isValidType(type)) return { error: "Please choose a transaction type." };
  if (!CATEGORIES[type].includes(category))
    return { error: "Please choose a valid category." };

  const amount = Number(amountRaw);
  if (!Number.isFinite(amount) || amount <= 0)
    return { error: "Amount must be a positive number." };

  if (!occurredOn) return { error: "Please pick a date." };

  const { error } = await supabase.from("transactions").insert({
    user_id: user.id,
    type,
    category,
    amount,
    description: description || null,
    occurred_on: occurredOn,
  });

  if (error) return { error: error.message };

  revalidatePath("/");
  return null;
}

export async function deleteTransaction(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await supabase.from("transactions").delete().eq("id", id).eq("user_id", user.id);
  revalidatePath("/");
}

export async function updateStartingValues(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in." };

  const field = String(formData.get("field") ?? "");
  const valueRaw = String(formData.get("value") ?? "");
  const value = Number(valueRaw);

  if (field !== "starting_balance" && field !== "starting_savings")
    return { error: "Unknown field." };
  if (!Number.isFinite(value)) return { error: "Enter a valid number." };

  const { error } = await supabase
    .from("profiles")
    .update({ [field]: value, updated_at: new Date().toISOString() })
    .eq("id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/");
  return null;
}
