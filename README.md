# The Council's Expense Tracker

A personal expense tracker built with **Next.js (App Router)** and **Supabase**
(Postgres + Google authentication). Track **Earnings**, **Expenses**, and
**Savings**, with live summary cards for Total Balance, this month's Expenses,
and Current Savings.

---

## How the numbers work

You set a one-time **starting Balance** and **starting Savings** (the pencil
icons on those cards). Every transaction then adjusts them automatically:

| Card | Formula |
|------|---------|
| **Total Balance** | starting balance **+ earnings − expenses − savings deposits** |
| **Current Savings** | starting savings **+ all savings rows** (Deposit + Interest) |
| **Total Expenses** | sum of **this month's** expense rows (auto, not editable) |

> A savings **Deposit** moves money out of your balance into savings.
> Savings **Interest** grows savings *without* reducing your balance (the bank pays it).

**Categories**
- **Expenses:** Food · Bills Payment · Grocery · Tuition · Entertainment · Transportation · Travel · Others
- **Earnings:** Salary · Allowance · Scholarship · Business · Others
- **Savings:** Deposit · Interest

---

## 1. Prerequisites

- **Node.js 18+** (this repo was built with Node 20). If you use `nvm`: `nvm use 20`.
- A free [Supabase](https://supabase.com) account.
- A free [Vercel](https://vercel.com) account (for deploying).

## 2. Create the Supabase project

1. Go to <https://supabase.com/dashboard> → **New project**. Pick a name and a
   strong database password, and wait for it to provision.
2. Open **SQL Editor** → **New query**, paste the entire contents of
   [`supabase/schema.sql`](supabase/schema.sql), and click **Run**.
   This creates the `profiles` and `transactions` tables, row-level security
   policies (so each user only sees their own data), and a trigger that creates
   a profile automatically on signup.

## 3. Enable Google login

1. In **Google Cloud Console** (<https://console.cloud.google.com>):
   - Create / select a project → **APIs & Services → OAuth consent screen**
     (External, add your email as a test user).
   - **APIs & Services → Credentials → Create credentials → OAuth client ID →
     Web application**.
   - Under **Authorized redirect URIs**, add the callback shown in Supabase
     (next step): `https://<your-project-ref>.supabase.co/auth/v1/callback`.
   - Copy the **Client ID** and **Client secret**.
2. In **Supabase Dashboard → Authentication → Providers → Google**: enable it
   and paste the Client ID + secret. Save.
3. In **Supabase Dashboard → Authentication → URL Configuration**, set:
   - **Site URL:** `http://localhost:3000` (and later your Vercel URL).
   - **Redirect URLs:** add `http://localhost:3000/**` and your deployed
     `https://your-app.vercel.app/**`.

## 4. Configure environment variables

Copy the example file and fill in your project's values
(**Supabase Dashboard → Project Settings → API**):

```bash
cp .env.local.example .env.local
```

```
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-public-key>
```

## 5. Run locally

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. You'll be sent to `/login` → **Continue with
Google** → the dashboard.

## 6. Deploy to Vercel (free)

1. Push this repo to GitHub.
2. <https://vercel.com/new> → **Import** the repo.
3. Add the two environment variables (`NEXT_PUBLIC_SUPABASE_URL`,
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`) in the Vercel project settings.
4. Deploy. Then go back and add your `https://your-app.vercel.app/**` URL to the
   Supabase **Redirect URLs** and Google **Authorized redirect URIs** so login
   works in production.

---

## Project structure

```
app/
  page.tsx              Dashboard (server component: auth + data load)
  login/page.tsx        Google sign-in screen
  auth/callback/        OAuth code exchange
  auth/signout/         Sign-out route
  actions.ts            Server Actions: add/delete transaction, edit starting values
components/             Dashboard UI (cards, create form, transaction log, icons)
lib/
  supabase/             Browser + server + proxy Supabase clients
  constants.ts          Types, categories, formatters
  totals.ts             Summary-card math
supabase/schema.sql     Database schema + RLS + triggers
proxy.ts                Auth session refresh + route guarding (Next 16 "proxy")
```
